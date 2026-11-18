
CREATE TYPE public.app_role AS ENUM ('admin', 'astrologer', 'user');

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  preferred_language text NOT NULL DEFAULT 'te',
  default_ayanamsha text NOT NULL DEFAULT 'lahiri',
  default_node_type text NOT NULL DEFAULT 'true',
  default_house_system text NOT NULL DEFAULT 'whole_sign',
  default_chart_style text NOT NULL DEFAULT 'south',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- New user -> profile + default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Birth profiles
CREATE TABLE public.birth_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  gender text,
  relation text NOT NULL DEFAULT 'self',
  birth_date date NOT NULL,
  birth_time time,
  time_known boolean NOT NULL DEFAULT true,
  place_name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  timezone text NOT NULL,
  utc_offset_minutes integer NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT birth_profiles_lat CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT birth_profiles_lon CHECK (longitude BETWEEN -180 AND 180),
  CONSTRAINT birth_profiles_name_len CHECK (char_length(name) BETWEEN 1 AND 120)
);
CREATE INDEX birth_profiles_user_idx ON public.birth_profiles(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.birth_profiles TO authenticated;
GRANT ALL ON public.birth_profiles TO service_role;
ALTER TABLE public.birth_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own birth profiles" ON public.birth_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own birth profiles" ON public.birth_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own birth profiles" ON public.birth_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own birth profiles" ON public.birth_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER birth_profiles_updated_at BEFORE UPDATE ON public.birth_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
