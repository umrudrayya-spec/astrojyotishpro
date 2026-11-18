/**
 * Vimshottari Dasha engine (BPHS ch. 46). Dates are pure arithmetic on the Moon's
 * calculated sidereal longitude — interpretation lives elsewhere.
 */
import { NAKSHATRA_LORD_SEQUENCE, type GrahaId } from "./constants";
import { nakshatraOf } from "./parashari";

export const VIMSHOTTARI_YEARS: Record<string, number> = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};
export const VIMSHOTTARI_TOTAL = 120;

/** Length of one dasha year in days — schools differ, so this is a user setting. */
export type DashaYearConvention = "julian" | "tropical" | "savana";
export const DASHA_YEAR_DAYS: Record<DashaYearConvention, number> = {
  julian: 365.25,
  tropical: 365.242199,
  savana: 360,
};

export const DASHA_LEVELS = ["mahadasha", "antardasha", "pratyantardasha", "sookshma", "prana"] as const;
export type DashaLevel = (typeof DASHA_LEVELS)[number];

export interface DashaPeriod {
  lord: GrahaId;
  /** Lords from Mahadasha down to this level. */
  path: GrahaId[];
  level: number; // 1 = Mahadasha … 5 = Prana
  start: Date;
  end: Date;
  years: number;
}

const DAY_MS = 86_400_000;

function sequenceFrom(lord: GrahaId): GrahaId[] {
  const i = NAKSHATRA_LORD_SEQUENCE.indexOf(lord);
  return Array.from({ length: 9 }, (_, k) => NAKSHATRA_LORD_SEQUENCE[(i + k) % 9]!);
}

export interface VimshottariResult {
  convention: DashaYearConvention;
  moonLongitude: number;
  birthNakshatra: number;
  birthLord: GrahaId;
  /** Fraction of the birth nakshatra already traversed by the Moon (0–1). */
  traversed: number;
  /** Remaining years of the first Mahadasha at birth. */
  balanceYears: number;
  mahadashas: DashaPeriod[];
}

/** Mahadashas for 120 years from the (virtual) start of the birth Mahadasha. */
export function vimshottari(moonLongitude: number, birth: Date, convention: DashaYearConvention = "julian"): VimshottariResult {
  const nk = nakshatraOf(moonLongitude);
  const yearMs = DASHA_YEAR_DAYS[convention] * DAY_MS;
  const firstYears = VIMSHOTTARI_YEARS[nk.lord]!;
  const balanceYears = firstYears * (1 - nk.traversed);
  // The first Mahadasha began before birth by the elapsed portion.
  let cursor = birth.getTime() - firstYears * nk.traversed * yearMs;
  const mahadashas = sequenceFrom(nk.lord).map((lord) => {
    const years = VIMSHOTTARI_YEARS[lord]!;
    const start = new Date(cursor);
    cursor += years * yearMs;
    return { lord, path: [lord], level: 1, start, end: new Date(cursor), years };
  });
  return {
    convention,
    moonLongitude,
    birthNakshatra: nk.index,
    birthLord: nk.lord,
    traversed: nk.traversed,
    balanceYears,
    mahadashas,
  };
}

/** The nine sub-periods of a period; each sub-lord gets parent × (its years / 120). */
export function subPeriods(parent: DashaPeriod, convention: DashaYearConvention = "julian"): DashaPeriod[] {
  if (parent.level >= DASHA_LEVELS.length) return [];
  const yearMs = DASHA_YEAR_DAYS[convention] * DAY_MS;
  let cursor = parent.start.getTime();
  return sequenceFrom(parent.lord).map((lord, i, arr) => {
    const years = (parent.years * VIMSHOTTARI_YEARS[lord]!) / VIMSHOTTARI_TOTAL;
    const start = new Date(cursor);
    cursor += years * yearMs;
    // Snap the final child to the parent end to avoid floating drift.
    const end = i === arr.length - 1 ? parent.end : new Date(cursor);
    return { lord, path: [...parent.path, lord], level: parent.level + 1, start, end, years };
  });
}

/** Running periods at `at`, from Mahadasha down to `depth` levels. */
export function currentPeriods(result: VimshottariResult, at: Date, depth = 5): DashaPeriod[] {
  const out: DashaPeriod[] = [];
  let list = result.mahadashas;
  for (let level = 1; level <= depth; level++) {
    const p = list.find((x) => x.start.getTime() <= at.getTime() && at.getTime() < x.end.getTime());
    if (!p) break;
    out.push(p);
    list = subPeriods(p, result.convention);
  }
  return out;
}

/** Express a span of years as whole years, months (1/12 year) and days of the chosen convention. */
export function splitYears(years: number, convention: DashaYearConvention = "julian") {
  const y = Math.floor(years + 1e-9);
  const monthsFloat = (years - y) * 12;
  const m = Math.floor(monthsFloat + 1e-9);
  const d = Math.round((monthsFloat - m) * (DASHA_YEAR_DAYS[convention] / 12));
  return { y, m, d };
}
