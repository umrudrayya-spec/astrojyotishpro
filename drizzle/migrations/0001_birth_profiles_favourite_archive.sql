ALTER TABLE public.birth_profiles
  ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz NULL;
CREATE INDEX IF NOT EXISTS birth_profiles_user_fav_idx ON public.birth_profiles (user_id, is_favorite);