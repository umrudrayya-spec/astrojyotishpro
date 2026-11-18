import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AiThread = Database["public"]["Tables"]["ai_threads"]["Row"];
export type AiMessage = Database["public"]["Tables"]["ai_messages"]["Row"];

export const aiThreadsQuery = () =>
  queryOptions({
    queryKey: ["ai_threads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ai_threads").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const aiThreadQuery = (id: string) =>
  queryOptions({
    queryKey: ["ai_threads", id],
    queryFn: async () => {
      const [t, m] = await Promise.all([
        supabase.from("ai_threads").select("*").eq("id", id).maybeSingle(),
        supabase.from("ai_messages").select("*").eq("thread_id", id).order("created_at", { ascending: true }),
      ]);
      if (t.error) throw t.error;
      if (m.error) throw m.error;
      return { thread: t.data, messages: m.data };
    },
  });

export async function createThread(profileId: string | null): Promise<string> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase.from("ai_threads").insert({ user_id: u.user.id, profile_id: profileId }).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function deleteThread(id: string) {
  const { error } = await supabase.from("ai_threads").delete().eq("id", id);
  if (error) throw error;
}

export function threadToMarkdown(title: string, messages: { role: string; content: string }[]) {
  return [`# ${title}`, "", ...messages.map((m) => `## ${m.role === "user" ? "Question" : "AstroJyotish AI"}\n\n${m.content}\n`)].join("\n");
}
