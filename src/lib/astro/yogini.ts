/**
 * Yogini Dasha (36-year cycle). Starting Yogini = (Janma nakshatra number + 3) mod 8 (0 → 8),
 * so Ardra starts Mangala and Ashwini starts Bhramari. Balance = untraversed part of the nakshatra.
 */
import type { GrahaId } from "./constants";
import { NAKSHATRA_SPAN } from "./parashari";
import { DASHA_YEAR_DAYS, type DashaYearConvention } from "./dasha";

export const YOGINIS = [
  { id: "mangala", lord: "moon", years: 1 },
  { id: "pingala", lord: "sun", years: 2 },
  { id: "dhanya", lord: "jupiter", years: 3 },
  { id: "bhramari", lord: "mars", years: 4 },
  { id: "bhadrika", lord: "mercury", years: 5 },
  { id: "ulka", lord: "saturn", years: 6 },
  { id: "siddha", lord: "venus", years: 7 },
  { id: "sankata", lord: "rahu", years: 8 },
] as const satisfies readonly { id: string; lord: GrahaId; years: number }[];

export type YoginiId = (typeof YOGINIS)[number]["id"];
export const YOGINI_CYCLE = 36;

export interface YoginiPeriod {
  yogini: YoginiId;
  lord: GrahaId;
  years: number;
  start: Date;
  end: Date;
  level: 1 | 2;
}

const DAY = 86_400_000;

/** Index (0–7) of the Yogini ruling the given nakshatra (0 = Ashwini). */
export function yoginiIndexForNakshatra(nakshatra: number): number {
  const n = ((nakshatra + 1 + 3) % 8 || 8) - 1;
  return n;
}

export function yoginiDasha(
  moonLongitude: number,
  birth: Date,
  convention: DashaYearConvention = "julian",
  spanYears = 120,
): { balanceYears: number; periods: YoginiPeriod[] } {
  const nak = Math.floor(moonLongitude / NAKSHATRA_SPAN);
  const fractionLeft = 1 - (moonLongitude - nak * NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  const startIdx = yoginiIndexForNakshatra(nak);
  const yearMs = DASHA_YEAR_DAYS[convention] * DAY;
  const first = YOGINIS[startIdx]!;
  const balanceYears = first.years * fractionLeft;
  const elapsed = first.years - balanceYears;
  const periods: YoginiPeriod[] = [];
  // The first period starts before birth by the elapsed portion.
  let cursor = birth.getTime() - elapsed * yearMs;
  const limit = birth.getTime() + spanYears * yearMs;
  for (let i = 0; cursor < limit; i++) {
    const y = YOGINIS[(startIdx + i) % 8]!;
    const end = cursor + y.years * yearMs;
    periods.push({ yogini: y.id, lord: y.lord, years: y.years, start: new Date(cursor), end: new Date(end), level: 1 });
    cursor = end;
  }
  return { balanceYears, periods };
}

/** Antardashas: start with the Mahadasha Yogini, durations proportional (Y × y / 36 years). */
export function yoginiSubPeriods(parent: YoginiPeriod): YoginiPeriod[] {
  const startIdx = YOGINIS.findIndex((y) => y.id === parent.yogini);
  const total = parent.end.getTime() - parent.start.getTime();
  let cursor = parent.start.getTime();
  return Array.from({ length: 8 }, (_, i) => {
    const y = YOGINIS[(startIdx + i) % 8]!;
    const dur = (total * y.years) / YOGINI_CYCLE;
    const p: YoginiPeriod = {
      yogini: y.id,
      lord: y.lord,
      years: (parent.years * y.years) / YOGINI_CYCLE,
      start: new Date(cursor),
      end: new Date(cursor + dur),
      level: 2,
    };
    cursor += dur;
    return p;
  });
}
