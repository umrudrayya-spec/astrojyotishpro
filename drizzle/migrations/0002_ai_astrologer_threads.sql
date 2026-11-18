CREATE TABLE public.ai_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  profile_id uuid REFERENCES public.birth_profiles(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_threads TO authenticated;
GRANT ALL ON public.ai_threads TO service_role;
ALTER TABLE public.ai_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own threads" ON public.ai_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own threads" ON public.ai_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own threads" ON public.ai_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own threads" ON public.ai_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX ai_threads_user_updated_idx ON public.ai_threads (user_id, updated_at DESC);

CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.ai_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  model text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON public.ai_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add messages to own threads" ON public.ai_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.ai_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Users delete own messages" ON public.ai_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX ai_messages_thread_created_idx ON public.ai_messages (thread_id, created_at);
CREATE INDEX ai_messages_user_created_idx ON public.ai_messages (user_id, created_at DESC);