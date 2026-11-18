/** Place search via the Open-Meteo geocoding API (free, no key). Returns IANA time zones. */
export interface Place {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export async function searchPlaces(query: string, lang: "te" | "en"): Promise<Place[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const json = (await res.json()) as { results?: Place[] };
  return (json.results ?? []).filter((p) => !!p.timezone);
}

export function placeLabel(p: Place) {
  return [p.name, p.admin1, p.country].filter(Boolean).join(", ");
}
