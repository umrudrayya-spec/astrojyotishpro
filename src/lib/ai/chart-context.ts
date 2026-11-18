/**
 * Builds the factual chart context the AI astrologer receives. Every value comes from the
 * calculation engines (Swiss Ephemeris → Parashari, Vimshottari, yoga rules); the AI only interprets.
 */
import { GRAHA_NAMES, NAKSHATRAS, RASHIS, OUTER_PLANETS } from "@/lib/astro/constants";
import { currentPeriods, vimshottari } from "@/lib/astro/dasha";
import type { RawChart } from "@/lib/astro/ephemeris";
import { formatDms, type ParashariChart } from "@/lib/astro/parashari";
import { AYANAMSHAS, HOUSE_SYSTEMS } from "@/lib/astro/settings";
import { detectYogas } from "@/lib/astro/yogas";

export interface ContextProfile {
  name: string;
  birth_date: string;
  birth_time: string | null;
  time_known: boolean;
  place_name: string;
  timezone: string;
}

const sign = (s: number) => RASHIS[s]!.en;
const graha = (g: keyof typeof GRAHA_NAMES) => GRAHA_NAMES[g].en;
const day = (d: Date) => d.toISOString().slice(0, 10);

export function buildChartContext(profile: ContextProfile, raw: RawChart, chart: ParashariChart, utc: Date, now = new Date()): string {
  const s = raw.meta.settings;
  const lines: string[] = [];
  lines.push(`PROFILE: ${profile.name}; born ${profile.birth_date} ${profile.time_known ? (profile.birth_time ?? "").slice(0, 5) : "(birth time UNKNOWN — noon used; Lagna, houses, dasha start dates are uncertain)"} at ${profile.place_name} (${profile.timezone}).`);
  lines.push(`CALCULATION: ${raw.meta.engine} ${raw.meta.engineVersion}; ayanamsha ${AYANAMSHAS[s.ayanamsha].en} = ${formatDms(raw.ayanamshaDegrees, false)}; ${s.nodeType} node; houses ${HOUSE_SYSTEMS[s.houseSystem].en}; algorithm ${raw.meta.algorithmVersion}.`);
  const l = chart.lagna;
  lines.push(`LAGNA: ${sign(l.sign)} ${formatDms(l.degreeInSign)}, nakshatra ${NAKSHATRAS[l.nakshatra]!.en} pada ${l.pada}, lagna lord ${graha(l.lord)}.`);
  lines.push("PLANETS (sidereal; house = whole-sign from Lagna):");
  for (const p of chart.planets) {
    if (OUTER_PLANETS.includes(p.id)) continue;
    const flags = [p.retrograde && p.id !== "rahu" && p.id !== "ketu" ? "retrograde" : "", p.combust ? "combust" : ""].filter(Boolean).join(", ");
    lines.push(
      `- ${graha(p.id)}: ${sign(p.sign)} ${formatDms(p.degreeInSign)}, house ${p.house}, ${NAKSHATRAS[p.nakshatra]!.en} pada ${p.pada}, dignity ${p.dignity}${p.ownedHouses.length ? `, lord of houses ${p.ownedHouses.join("/")}` : ""}${flags ? `, ${flags}` : ""}.`,
    );
  }
  const moon = chart.planets.find((p) => p.id === "moon")!;
  const v = vimshottari(moon.longitude, utc);
  const cur = currentPeriods(v, now, 3);
  lines.push(`VIMSHOTTARI: birth nakshatra ${NAKSHATRAS[v.birthNakshatra]!.en} (lord ${graha(v.birthLord)}), balance at birth ${v.balanceYears.toFixed(2)} years (365.25-day years).`);
  lines.push(`CURRENT DASHA on ${day(now)}: ${cur.map((p) => `${["Mahadasha", "Antardasha", "Pratyantardasha"][p.level - 1]} ${graha(p.lord)} ${day(p.start)} → ${day(p.end)}`).join("; ")}.`);
  lines.push(`MAHADASHA SEQUENCE: ${v.mahadashas.map((m) => `${graha(m.lord)} ${day(m.start)}→${day(m.end)}`).join("; ")}.`);
  const yogas = detectYogas(chart, { timeKnown: profile.time_known, kujaIncludesSecond: true }).filter((y) => y.status !== "not_formed");
  lines.push(
    `YOGAS/DOSHAS detected by the rule engine (status in brackets): ${yogas.length ? yogas.map((y) => `${y.id} [${y.status}]${y.planets.length ? ` (${y.planets.map(graha).join(", ")})` : ""}`).join("; ") : "none"}.`,
  );
  return lines.join("\n");
}
