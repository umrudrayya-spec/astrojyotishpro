import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CopyIcon, DownloadIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AstrologerMark } from "@/components/ai/AstrologerMark";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { buildChartContext } from "@/lib/ai/chart-context";
import type { ChatStreamEvent } from "@/lib/ai/chat-protocol";
import { MAX_MESSAGE_CHARS } from "@/lib/ai/chat-protocol";
import { aiThreadQuery, deleteThread, threadToMarkdown } from "@/lib/ai/threads";
import { localToUtc, parseDateTime } from "@/lib/astro/time";
import { isAyanamshaId, isHouseSystemId, type CalcSettings } from "@/lib/astro/settings";
import { useChart } from "@/lib/astro/use-chart";
import { birthProfileQuery, userProfileQuery } from "@/lib/birth-profiles";
import { useI18n, type DictKey } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ai/$threadId")({
  loader: async ({ context, params }) => {
    const [{ thread }] = await Promise.all([
      context.queryClient.ensureQueryData(aiThreadQuery(params.threadId)),
      context.queryClient.ensureQueryData(userProfileQuery()),
    ]);
    if (thread?.profile_id) await context.queryClient.ensureQueryData(birthProfileQuery(thread.profile_id));
  },
  component: ThreadPage,
});

type Status = "ready" | "submitted" | "streaming" | "error";
interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ERROR_KEYS: Record<Extract<ChatStreamEvent, { t: "error" }>["code"], DictKey> = {
  rate_limit: "aiErrRate",
  credits: "aiErrCredits",
  unauthorized: "aiErrAuth",
  bad_request: "aiErrFailed",
  ai_failed: "aiErrFailed",
  save_failed: "aiErrSave",
};

function ThreadPage() {
  const { threadId } = Route.useParams();
  const { data } = useSuspenseQuery(aiThreadQuery(threadId));
  const { t } = useI18n();
  if (!data.thread) return <p className="rounded-2xl border bg-card p-5 shadow-card">{t("aiNotFound")}</p>;
  return data.thread.profile_id ? (
    <ProfileChat key={threadId} threadId={threadId} profileId={data.thread.profile_id} />
  ) : (
    <ChatWindow key={threadId} threadId={threadId} context={null} contextLabel={null} />
  );
}

function ProfileChat({ threadId, profileId }: { threadId: string; profileId: string }) {
  const { data: profile } = useSuspenseQuery(birthProfileQuery(profileId));
  const { data: me } = useSuspenseQuery(userProfileQuery());
  const settings = useMemo<CalcSettings>(
    () => ({
      ayanamsha: me && isAyanamshaId(me.default_ayanamsha) ? me.default_ayanamsha : "lahiri",
      nodeType: me?.default_node_type === "mean" ? "mean" : "true",
      houseSystem: me && isHouseSystemId(me.default_house_system) ? me.default_house_system : "whole_sign",
      nodeAspects: "seventh_only",
    }),
    [me],
  );
  const utc = useMemo(
    () =>
      profile
        ? localToUtc(parseDateTime(profile.birth_date, profile.time_known ? profile.birth_time : "12:00:00"), profile.utc_offset_minutes)
        : null,
    [profile],
  );
  const input = useMemo(() => (profile && utc ? { utc, latitude: profile.latitude, longitude: profile.longitude } : null), [profile, utc]);
  const { raw, chart } = useChart(input, settings);
  const context = useMemo(() => (profile && raw && chart && utc ? buildChartContext(profile, raw, chart, utc) : null), [profile, raw, chart, utc]);
  // Profile was deleted: continue as a general conversation.
  if (!profile) return <ChatWindow threadId={threadId} context={null} contextLabel={null} />;
  return <ChatWindow threadId={threadId} context={context} contextLabel={`${profile.name} · ${profile.birth_date}`} waitForContext />;
}

function ChatWindow({
  threadId,
  context,
  contextLabel,
  waitForContext = false,
}: {
  threadId: string;
  context: string | null;
  contextLabel: string | null;
  waitForContext?: boolean;
}) {
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(aiThreadQuery(threadId));
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    data.messages.map((m) => ({ id: m.id, role: m.role === "user" ? "user" : "assistant", content: m.content })),
  );
  const [status, setStatus] = useState<Status>("ready");
  const [draft, setDraft] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const preparing = waitForContext && context === null;

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || status === "submitted" || status === "streaming" || preparing) return;
      const userMsg: ChatMsg = { id: `local-${Date.now()}`, role: "user", content: message };
      const asstId = `local-a-${Date.now()}`;
      setMessages((m) => [...m, userMsg]);
      setDraft("");
      setStatus("submitted");
      const ac = new AbortController();
      abortRef.current = ac;
      let got = false;
      const fail = (key: DictKey) => {
        toast.error(t(key));
        setStatus("error");
        if (!got) {
          // Nothing was answered: put the question back so it is not lost.
          setMessages((m) => m.filter((x) => x.id !== userMsg.id));
          setDraft(message);
        }
      };
      try {
        const { data: s } = await supabase.auth.getSession();
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          signal: ac.signal,
          headers: { "content-type": "application/json", authorization: `Bearer ${s.session?.access_token ?? ""}` },
          body: JSON.stringify({ threadId, message, lang, context }),
        });
        if (!res.body) return fail("aiErrFailed");
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let errorCode: Extract<ChatStreamEvent, { t: "error" }>["code"] | null = null;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const ln = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!ln) continue;
            const ev = JSON.parse(ln) as ChatStreamEvent;
            if (ev.t === "delta") {
              if (!got) {
                got = true;
                setStatus("streaming");
                setMessages((m) => [...m, { id: asstId, role: "assistant", content: ev.v }]);
              } else setMessages((m) => m.map((x) => (x.id === asstId ? { ...x, content: x.content + ev.v } : x)));
            } else if (ev.t === "error") errorCode = ev.code;
          }
        }
        if (errorCode) return fail(ERROR_KEYS[errorCode]);
        setStatus("ready");
      } catch (e) {
        if (ac.signal.aborted) setStatus("ready");
        else {
          console.error(e);
          fail("aiErrFailed");
        }
      } finally {
        abortRef.current = null;
        void qc.invalidateQueries({ queryKey: ["ai_threads"] });
      }
    },
    [status, preparing, threadId, lang, context, qc, t],
  );

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("aiCopied"));
  };
  const exportMd = () => {
    const title = data.thread?.title || t("aiUntitled");
    const blob = new Blob([threadToMarkdown(title, messages)], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `astrojyotish-ai-${threadId.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const remove = async () => {
    if (!window.confirm(t("aiDeleteConfirm"))) return;
    try {
      await deleteThread(threadId);
      await qc.invalidateQueries({ queryKey: ["ai_threads"] });
      await navigate({ to: "/ai" });
    } catch (e) {
      console.error(e);
      toast.error(t("aiErrSave"));
    }
  };

  const suggestions: DictKey[] = ["aiSuggest1", "aiSuggest2", "aiSuggest3", "aiSuggest4"];

  return (
    <section className="flex h-[calc(100vh-12rem)] min-h-[32rem] flex-col rounded-2xl border bg-card shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 text-sm">
        <span className="truncate text-muted-foreground">
          {contextLabel ? (
            <>
              {t("aiChartFor")}: <span className="font-medium text-foreground">{contextLabel}</span>
            </>
          ) : (
            t("aiNoChartNote")
          )}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={exportMd} disabled={messages.length === 0}>
            <DownloadIcon className="size-4" /> {t("aiExport")}
          </Button>
          <Button variant="ghost" size="sm" onClick={remove} className="text-destructive">
            <Trash2 className="size-4" /> {t("aiDelete")}
          </Button>
        </div>
      </header>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState icon={<AstrologerMark className="size-12 text-primary" />} title={t("aiTitle")} description={t("aiDisclaimer")}>
              <div className="flex flex-col items-center gap-3">
                <AstrologerMark className="size-12 text-primary" />
                <p className="max-w-md text-sm text-muted-foreground">{t("aiDisclaimer")}</p>
                {contextLabel && (
                  <div className="flex max-w-xl flex-wrap justify-center gap-2">
                    {suggestions.map((k) => (
                      <Button key={k} variant="outline" size="sm" disabled={preparing} onClick={() => void send(t(k))}>
                        {t(k)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                  {m.role === "assistant" ? <MessageResponse>{m.content}</MessageResponse> : <p className="whitespace-pre-wrap">{m.content}</p>}
                </MessageContent>
                {m.role === "assistant" && (
                  <MessageActions>
                    <MessageAction tooltip={t("aiCopy")} label={t("aiCopy")} onClick={() => void copy(m.content)}>
                      <CopyIcon className="size-3.5" />
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>{t("aiThinking")}</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        {preparing && <p className="mb-2 text-xs text-muted-foreground">{t("aiPreparing")}</p>}
        <PromptInput onSubmit={(msg) => void send(msg.text)}>
          <PromptInputTextarea
            ref={textareaRef}
            value={draft}
            maxLength={MAX_MESSAGE_CHARS}
            onChange={(e) => setDraft(e.currentTarget.value)}
            placeholder={t("aiPlaceholder")}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status === "error" ? "ready" : status}
              disabled={preparing || (!draft.trim() && status === "ready") || (!draft.trim() && status === "error")}
              onStop={() => abortRef.current?.abort()}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </section>
  );
}
