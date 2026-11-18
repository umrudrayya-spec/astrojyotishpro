/**
 * Panchanga: Tithi, Vara, Nakshatra, Yoga, Karana, sunrise/sunset and the day divisions
 * (Rahu Kalam, Yamagandam, Gulika Kalam, Abhijit, Choghadiya, Hora).
 * Pure: astronomy is injected (Sun/Moon longitudes and Sun altitude from ephemeris.ts).
 */
import type { GrahaId } from "./constants";
import { NAKSHATRA_SPAN } from "./parashari";

export interface PanchangaAstro {
  /** Sidereal longitudes of Sun and Moon at jdUt. */
  sunMoon: (jdUt: number) => { sun: number; moon: number };
  /** Geometric altitude of the Sun's centre (degrees) at jdUt. */
  sunAltitude: (jdUt: number) => number;
}

/**
 * Sunrise definitions differ. "upper_limb_refraction" (−0.833°) matches modern almanacs;
 * "centre_no_refraction" (0°) follows the Surya Siddhanta-style geometric rising of the disc centre.
 */
export type SunriseConvention = "upper_limb_refraction" | "centre_no_refraction";
export const SUNRISE_ALTITUDE: Record<SunriseConvention, number> = {
  upper_limb_refraction: -0.8333,
  centre_no_refraction: 0,
};

const norm = (x: number) => ((x % 360) + 360) % 360;

export const tithiIndex = (sun: number, moon: number) => Math.floor(norm(moon - sun) / 12); // 0–29
export const nakshatraIndex = (moon: number) => Math.floor(norm(moon) / NAKSHATRA_SPAN); // 0–26
export const yogaIndex = (sun: number, moon: number) => Math.floor(norm(sun + moon) / NAKSHATRA_SPAN); // 0–26
export const karanaHalfIndex = (sun: number, moon: number) => Math.floor(norm(moon - sun) / 6); // 0–59

export const MOVABLE_KARANAS = ["bava", "balava", "kaulava", "taitila", "garaja", "vanija", "vishti"] as const;
export type KaranaId = (typeof MOVABLE_KARANAS)[number] | "kimstughna" | "shakuni" | "chatushpada" | "naga";

/** Karana from half-tithi index: 0 Kimstughna, 1–56 the seven movable in turn, 57 Shakuni, 58 Chatushpada, 59 Naga. */
export function karanaOf(half: number): KaranaId {
  if (half === 0) return "kimstughna";
  if (half >= 57) return (["shakuni", "chatushpada", "naga"] as const)[half - 57]!;
  return MOVABLE_KARANAS[(half - 1) % 7]!;
}

/** Weekday lords Sunday→Saturday. */
export const VARA_LORDS: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
/** Chaldean (descending speed) order used for Hora. */
const CHALDEAN: GrahaId[] = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];

/** 1-based eighth of the daytime for each weekday (Sun..Sat). */
export const RAHU_KALAM_PART = [8, 2, 7, 5, 6, 4, 3];
export const YAMAGANDAM_PART = [5, 4, 3, 2, 1, 7, 6];
export const GULIKA_PART = [7, 6, 5, 4, 3, 2, 1];

export const CHOGHADIYA = ["udveg", "char", "labh", "amrit", "kaal", "shubh", "rog"] as const;
export type ChoghadiyaId = (typeof CHOGHADIYA)[number];
const CHOG_DAY_START: ChoghadiyaId[] = ["udveg", "amrit", "rog", "labh", "shubh", "char", "kaal"];
const CHOG_NIGHT_ORDER: ChoghadiyaId[] = ["shubh", "amrit", "char", "rog", "kaal", "labh", "udveg"];
const CHOG_NIGHT_START: ChoghadiyaId[] = ["shubh", "char", "kaal", "udveg", "amrit", "rog", "labh"];
export const CHOGHADIYA_QUALITY: Record<ChoghadiyaId, "good" | "neutral" | "bad"> = {
  amrit: "good",
  shubh: "good",
  labh: "good",
  char: "neutral",
  udveg: "bad",
  kaal: "bad",
  rog: "bad",
};

export function choghadiyaSequence(weekday: number, night: boolean): ChoghadiyaId[] {
  if (!night) {
    const start = CHOGHADIYA.indexOf(CHOG_DAY_START[weekday]!);
    return Array.from({ length: 8 }, (_, i) => CHOGHADIYA[(start + i) % 7]!);
  }
  const start = CHOG_NIGHT_ORDER.indexOf(CHOG_NIGHT_START[weekday]!);
  return Array.from({ length: 8 }, (_, i) => CHOG_NIGHT_ORDER[(start + i) % 7]!);
}

/** 24 hora lords from sunrise: first = weekday lord, then Chaldean order. */
export function horaLords(weekday: number): GrahaId[] {
  const start = CHALDEAN.indexOf(VARA_LORDS[weekday]!);
  return Array.from({ length: 24 }, (_, i) => CHALDEAN[(start + i) % 7]!);
}

/** First time after `fromJd` when altitude crosses h0 upward (rise) or downward (set), within `hours`. */
export function findSunEvent(astro: PanchangaAstro, fromJd: number, h0: number, kind: "rise" | "set", hours = 26): number | null {
  const step = 10 / 1440;
  let a = fromJd;
  let fa = astro.sunAltitude(a) - h0;
  for (let t = fromJd + step; t <= fromJd + hours / 24; t += step) {
    const ft = astro.sunAltitude(t) - h0;
    const crossed = kind === "rise" ? fa < 0 && ft >= 0 : fa > 0 && ft <= 0;
    if (crossed) {
      let lo = a;
      let hi = t;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        const fm = astro.sunAltitude(mid) - h0;
        if ((kind === "rise" ? fm < 0 : fm > 0)) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }
    a = t;
    fa = ft;
  }
  return null;
}

/** First time after `fromJd` when `index(jd)` differs from its value at fromJd (bisection to ~1 s). */
export function findNextChange(index: (jd: number) => number, fromJd: number, maxDays = 3, stepHours = 1): number | null {
  const start = index(fromJd);
  const step = stepHours / 24;
  let a = fromJd;
  for (let t = fromJd + step; t <= fromJd + maxDays; t += step) {
    if (index(t) !== start) {
      let lo = a;
      let hi = t;
      for (let i = 0; i < 25; i++) {
        const mid = (lo + hi) / 2;
        if (index(mid) === start) lo = mid;
        else hi = mid;
      }
      return hi;
    }
    a = t;
  }
  return null;
}

export interface Span {
  start: number;
  end: number;
}

export interface ElementAt {
  index: number;
  /** End (JD UT) of this element, null if not found within the search window. */
  endsAt: number | null;
  next: number;
}

export interface Panchanga {
  sunrise: number | null;
  sunset: number | null;
  nextSunrise: number | null;
  /** 0 = Sunday. Vara runs from sunrise to sunrise. */
  weekday: number;
  tithi: ElementAt;
  paksha: "shukla" | "krishna";
  nakshatra: ElementAt & { pada: number };
  yoga: ElementAt;
  karana: { id: KaranaId; half: number; endsAt: number | null; next: KaranaId };
  sunLongitude: number;
  moonLongitude: number;
  rahuKalam: Span | null;
  yamagandam: Span | null;
  gulikaKalam: Span | null;
  abhijit: Span | null;
  choghadiya: { day: (Span & { id: ChoghadiyaId })[]; night: (Span & { id: ChoghadiyaId })[] };
  horas: (Span & { lord: GrahaId })[];
}

function element(index: (jd: number) => number, at: number, n: number): ElementAt {
  const i = index(at);
  return { index: i, endsAt: findNextChange(index, at), next: (i + 1) % n };
}

/**
 * Panchanga for a civil date at a place. `localMidnightJd` = JD (UT) of 00:00 local time on that date;
 * `weekdayOfDate` = 0–6 for that civil date. Elements are taken at sunrise (or local midnight if the Sun does not rise).
 */
export function computePanchanga(
  astro: PanchangaAstro,
  localMidnightJd: number,
  weekdayOfDate: number,
  convention: SunriseConvention = "upper_limb_refraction",
): Panchanga {
  const h0 = SUNRISE_ALTITUDE[convention];
  const sunrise = findSunEvent(astro, localMidnightJd, h0, "rise", 24);
  const sunset = sunrise !== null ? findSunEvent(astro, sunrise, h0, "set", 24) : null;
  const nextSunrise = sunset !== null ? findSunEvent(astro, sunset, h0, "rise", 24) : null;
  const at = sunrise ?? localMidnightJd;
  const { sun, moon } = astro.sunMoon(at);

  const ti = (jd: number) => {
    const p = astro.sunMoon(jd);
    return tithiIndex(p.sun, p.moon);
  };
  const na = (jd: number) => nakshatraIndex(astro.sunMoon(jd).moon);
  const yo = (jd: number) => {
    const p = astro.sunMoon(jd);
    return yogaIndex(p.sun, p.moon);
  };
  const ka = (jd: number) => {
    const p = astro.sunMoon(jd);
    return karanaHalfIndex(p.sun, p.moon);
  };

  const tithi = element(ti, at, 30);
  const nak = element(na, at, 27);
  const pada = Math.floor((norm(moon) % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
  const yoga = element(yo, at, 27);
  const half = ka(at);
  const karanaEnd = findNextChange(ka, at, 2, 0.5);

  const weekday = weekdayOfDate;
  const dayParts = (n: number): Span[] | null =>
    sunrise !== null && sunset !== null
      ? Array.from({ length: n }, (_, i) => ({
          start: sunrise + ((sunset - sunrise) * i) / n,
          end: sunrise + ((sunset - sunrise) * (i + 1)) / n,
        }))
      : null;
  const nightParts = (n: number): Span[] | null =>
    sunset !== null && nextSunrise !== null
      ? Array.from({ length: n }, (_, i) => ({
          start: sunset + ((nextSunrise - sunset) * i) / n,
          end: sunset + ((nextSunrise - sunset) * (i + 1)) / n,
        }))
      : null;
  const eighths = dayParts(8);
  const pick = (table: number[]) => (eighths ? eighths[table[weekday]! - 1]! : null);
  const muhurtas = dayParts(15);
  const dayChog = choghadiyaSequence(weekday, false);
  const nightChog = choghadiyaSequence(weekday, true);
  const nightEighths = nightParts(8);
  const hl = horaLords(weekday);
  const dayH = dayParts(12) ?? [];
  const nightH = nightParts(12) ?? [];

  return {
    sunrise,
    sunset,
    nextSunrise,
    weekday,
    tithi,
    paksha: tithi.index < 15 ? "shukla" : "krishna",
    nakshatra: { ...nak, pada },
    yoga,
    karana: { id: karanaOf(half), half, endsAt: karanaEnd, next: karanaOf((half + 1) % 60) },
    sunLongitude: sun,
    moonLongitude: moon,
    rahuKalam: pick(RAHU_KALAM_PART),
    yamagandam: pick(YAMAGANDAM_PART),
    gulikaKalam: pick(GULIKA_PART),
    abhijit: muhurtas ? muhurtas[7]! : null,
    choghadiya: {
      day: (eighths ?? []).map((s, i) => ({ ...s, id: dayChog[i]! })),
      night: (nightEighths ?? []).map((s, i) => ({ ...s, id: nightChog[i]! })),
    },
    horas: [...dayH, ...nightH].map((s, i) => ({ ...s, lord: hl[i]! })),
  };
}
