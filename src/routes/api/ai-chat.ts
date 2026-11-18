import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { GatewayError, PaymentRequiredError, RateLimitError, streamChatCompletion } from "@lovable.dev/ai-gateway";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { AI_MODEL, systemPrompt } from "@/lib/ai/astrologer-prompt";
import {
  MAX_CONTEXT_CHARS,
  MAX_MESSAGE_CHARS,
  RATE_LIMIT_PER_DAY,
  RATE_LIMIT_PER_MINUTE,
  type ChatStreamEvent,
} from "@/lib/ai/chat-protocol";

const Body = z.object({
  threadId: z.string().uuid(),
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  lang: z.enum(["te", "en"]),
  context: z.string().max(MAX_CONTEXT_CHARS).nullable(),
});

const line = (e: ChatStreamEvent) => JSON.stringify(e) + "\n";
const single = (e: ChatStreamEvent, status: number) =>
  new Response(line(e), { status, headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!url || !key || token.split(".").length !== 3) return single({ t: "error", code: "unauthorized" }, 401);

        const supabase = createClient<Database>(url, key, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          global: {
            headers: { Authorization: `Bearer ${token}` },
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });
        const { data: claims, error: authError } = await supabase.auth.getClaims(token);
        const userId = claims?.claims?.sub;
        if (authError || !userId) return single({ t: "error", code: "unauthorized" }, 401);

        let body: z.infer<typeof Body>;
        try {
          body = Body.parse(await request.json());
        } catch {
          return single({ t: "error", code: "bad_request" }, 400);
        }

        // Ownership is enforced by RLS: another user's thread is simply not found.
        const { data: thread } = await supabase.from("ai_threads").select("id, title").eq("id", body.threadId).maybeSingle();
        if (!thread) return single({ t: "error", code: "bad_request" }, 404);

        const since = (ms: number) => new Date(Date.now() - ms).toISOString();
        const [perMin, perDay] = await Promise.all([
          supabase.from("ai_messages").select("id", { count: "exact", head: true }).eq("role", "user").gte("created_at", since(60_000)),
          supabase.from("ai_messages").select("id", { count: "exact", head: true }).eq("role", "user").gte("created_at", since(86_400_000)),
        ]);
        if ((perMin.count ?? 0) >= RATE_LIMIT_PER_MINUTE || (perDay.count ?? 0) >= RATE_LIMIT_PER_DAY)
          return single({ t: "error", code: "rate_limit" }, 429);

        const { data: history, error: histError } = await supabase
          .from("ai_messages")
          .select("role, content")
          .eq("thread_id", body.threadId)
          .order("created_at", { ascending: false })
          .limit(20);
        if (histError) return single({ t: "error", code: "save_failed" }, 500);

        const { error: insertError } = await supabase
          .from("ai_messages")
          .insert({ thread_id: body.threadId, user_id: userId, role: "user", content: body.message });
        if (insertError) {
          console.error("ai-chat: saving user message failed", insertError);
          return single({ t: "error", code: "save_failed" }, 500);
        }
        if (!thread.title) {
          await supabase.from("ai_threads").update({ title: body.message.slice(0, 80) }).eq("id", body.threadId);
        }

        const messages = [
          { role: "system" as const, content: systemPrompt(body.lang, body.context) },
          ...(history ?? []).reverse().map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user" as const, content: body.message },
        ];

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const enc = new TextEncoder();
            const send = (e: ChatStreamEvent) => controller.enqueue(enc.encode(line(e)));
            let text = "";
            let inputTokens: number | null = null;
            let outputTokens: number | null = null;
            try {
              const events = await streamChatCompletion({ model: AI_MODEL, messages }, { signal: request.signal });
              for await (const ev of events) {
                if (!("choices" in ev)) continue;
                const delta = ev.choices[0]?.delta?.content;
                if (typeof delta === "string" && delta) {
                  text += delta;
                  send({ t: "delta", v: delta });
                }
                if (ev.usage) {
                  inputTokens = ev.usage.prompt_tokens ?? null;
                  outputTokens = ev.usage.completion_tokens ?? null;
                }
              }
            } catch (e) {
              if (e instanceof GatewayError) console.error("ai-chat gateway error", e.toJSON());
              else console.error("ai-chat failed", e);
              send({
                t: "error",
                code: e instanceof RateLimitError ? "rate_limit" : e instanceof PaymentRequiredError ? "credits" : "ai_failed",
              });
              controller.close();
              return;
            }
            const { data: saved, error: saveError } = await supabase
              .from("ai_messages")
              .insert({
                thread_id: body.threadId,
                user_id: userId,
                role: "assistant",
                content: text,
                model: AI_MODEL,
                input_tokens: inputTokens,
                output_tokens: outputTokens,
              })
              .select("id")
              .single();
            await supabase.from("ai_threads").update({ updated_at: new Date().toISOString() }).eq("id", body.threadId);
            if (saveError) {
              console.error("ai-chat: saving answer failed", saveError);
              send({ t: "error", code: "save_failed" });
            } else send({ t: "done", messageId: saved.id });
            controller.close();
          },
        });
        return new Response(stream, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });
      },
    },
  },
});
