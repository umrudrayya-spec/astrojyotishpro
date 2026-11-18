import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type BirthProfile = Database["public"]["Tables"]["birth_profiles"]["Row"];
export type BirthProfileInsert = Database["public"]["Tables"]["birth_profiles"]["Insert"];
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

export { RELATIONS, birthProfileSchema, type BirthProfileForm } from "@/lib/birth-profiles-schema";
import { birthProfileSchema, RELATIONS, type BirthProfileForm } from "@/lib/birth-profiles-schema";

export const birthProfilesQuery = () =>
  queryOptions({
    queryKey: ["birth_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("birth_profiles")
        .select("*")
        .order("is_favorite", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const birthProfileQuery = (id: string) =>
  queryOptions({
    queryKey: ["birth_profiles", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("birth_profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const userProfileQuery = () =>
  queryOptions({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export async function saveBirthProfile(form: BirthProfileForm, id?: string) {
  const parsed = birthProfileSchema.parse(form);
  if (id) {
    const { data, error } = await supabase.from("birth_profiles").update(parsed).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("birth_profiles")
    .insert({ ...parsed, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setProfileFavorite(id: string, isFavorite: boolean) {
  const { error } = await supabase.from("birth_profiles").update({ is_favorite: isFavorite }).eq("id", id);
  if (error) throw error;
}

export async function setProfileArchived(id: string, archived: boolean) {
  const { error } = await supabase
    .from("birth_profiles")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

/** Case-insensitive match on name, place and notes. */
export function matchesProfile(p: Pick<BirthProfile, "name" | "place_name" | "notes">, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [p.name, p.place_name, p.notes ?? ""].some((f) => f.toLowerCase().includes(needle));
}

export async function deleteBirthProfile(id: string) {
  const { error } = await supabase.from("birth_profiles").delete().eq("id", id);
  if (error) throw error;
}

export function toForm(p: BirthProfile): BirthProfileForm {
  return {
    name: p.name,
    gender: (p.gender as BirthProfileForm["gender"]) ?? null,
    relation: (RELATIONS as readonly string[]).includes(p.relation) ? (p.relation as BirthProfileForm["relation"]) : "other",
    birth_date: p.birth_date,
    birth_time: p.birth_time,
    time_known: p.time_known,
    place_name: p.place_name,
    latitude: p.latitude,
    longitude: p.longitude,
    timezone: p.timezone,
    utc_offset_minutes: p.utc_offset_minutes,
    notes: p.notes,
  };
}

/** Export file format — versioned so future imports can migrate. */
export function exportProfiles(list: BirthProfile[]) {
  return JSON.stringify({ format: "jyotisha-darpanam/birth-profiles", version: 1, profiles: list.map(toForm) }, null, 2);
}

export function parseImport(text: string): BirthProfileForm[] {
  const json = JSON.parse(text) as { format?: string; profiles?: unknown[] };
  if (json.format !== "jyotisha-darpanam/birth-profiles" || !Array.isArray(json.profiles)) {
    throw new Error("Unsupported file");
  }
  return json.profiles.map((p) => birthProfileSchema.parse(p));
}
