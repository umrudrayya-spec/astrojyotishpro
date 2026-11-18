/**
 * Ashtakoota (Guna Milan, 36 points) marriage matching from the two Moons.
 * Input: sidereal Moon longitudes calculated by the ephemeris layer. Pure table arithmetic.
 *
 * Where schools differ the choice is documented:
 * - Vashya: sign-to-sign vashya list (Muhurta Chintamani). Same sign or mutual vashya = 2,
 *   one-way = 1, none = 0.
 * - Gana: same gana 6, Deva–Manushya 5, Deva–Rakshasa 1, Manushya–Rakshasa 0 (symmetric).
 * - Yoni: standard 14-animal matrix (7 enemy pairs score 0).
 * Dosha cancellations (Nadi / Bhakoot parihara) are not applied to the score.
 */
import { NATURAL_RELATIONS, RASHIS, type SaptaGraha } from "./constants";
import { NAKSHATRA_SPAN } from "./parashari";

export type KootaId = "varna" | "vashya" | "tara" | "yoni" | "maitri" | "gana" | "bhakoot" | "nadi";
export const KOOTA_MAX: Record<KootaId, number> = { varna: 1, vashya: 2, tara: 3, yoni: 4, maitri: 5, gana: 6, bhakoot: 7, nadi: 8 };
export const KOOTA_ORDER: KootaId[] = ["varna", "vashya", "tara", "yoni", "maitri", "gana", "bhakoot", "nadi"];

/** Varna rank per sign: 3 Brahmin (water), 2 Kshatriya (fire), 1 Vaishya (earth), 0 Shudra (air). */
export const VARNA_OF_SIGN = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3];
export const VARNA_NAMES = ["shudra", "vaishya", "kshatriya", "brahmin"] as const;

/** Signs that are vashya to each sign (Muhurta Chintamani). */
export const VASHYA_SIGNS: number[][] = [
  [4, 7], // Aries: Leo, Scorpio
  [3, 6], // Taurus: Cancer, Libra
  [5], // Gemini: Virgo
  [7, 8], // Cancer: Scorpio, Sagittarius
  [6], // Leo: Libra
  [11, 2], // Virgo: Pisces, Gemini
  [9, 5], // Libra: Capricorn, Virgo
  [3], // Scorpio: Cancer
  [11], // Sagittarius: Pisces
  [0, 10], // Capricorn: Aries, Aquarius
  [0], // Aquarius: Aries
  [9], // Pisces: Capricorn
];

export const YONI_ANIMALS = [
  "horse", "elephant", "sheep", "serpent", "dog", "cat", "rat", "cow", "buffalo", "tiger", "deer", "monkey", "mongoose", "lion",
] as const;
export type YoniAnimal = (typeof YONI_ANIMALS)[number];
/** Animal index per nakshatra (Ashwini … Revati). */
export const YONI_OF_NAKSHATRA = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
/** Yoni compatibility matrix in YONI_ANIMALS order. */
export const YONI_MATRIX = [
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1],
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2],
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1],
  [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1],
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
  [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4],
];

export type Gana = "deva" | "manushya" | "rakshasa";
const G: Record<string, Gana> = { D: "deva", M: "manushya", R: "rakshasa" };
export const GANA_OF_NAKSHATRA: Gana[] = "DMRMDMDDRRMMDRDRDRRMMDRRMMD".split("").map((c) => G[c]!);

export type Nadi = "adi" | "madhya" | "antya";
const NADI_CYCLE: Nadi[] = ["adi", "madhya", "antya", "antya", "madhya", "adi"];
export const NADI_OF_NAKSHATRA: Nadi[] = Array.from({ length: 27 }, (_, i) => NADI_CYCLE[i % 6]!);

export interface MoonData {
  sign: number;
  nakshatra: number;
}
export const moonData = (moonLongitude: number): MoonData => ({
  sign: Math.floor(moonLongitude / 30) % 12,
  nakshatra: Math.min(26, Math.floor(moonLongitude / NAKSHATRA_SPAN)),
});

export interface KootaResult {
  id: KootaId;
  score: number;
  max: number;
  boy: string;
  girl: string;
}

const relScore = (a: SaptaGraha, b: SaptaGraha) => NATURAL_RELATIONS[a][b];

export function vashyaScore(boySign: number, girlSign: number): number {
  if (boySign === girlSign) return 2;
  const bg = VASHYA_SIGNS[boySign]!.includes(girlSign);
  const gb = VASHYA_SIGNS[girlSign]!.includes(boySign);
  return bg && gb ? 2 : bg || gb ? 1 : 0;
}

/** Tara from one nakshatra to another: 1.5 unless the count falls on Vipat (3), Pratyak (5) or Naidhana (7). */
export function taraHalf(from: number, to: number): number {
  const r = ((((to - from + 27) % 27) + 1) % 9) || 9;
  return [3, 5, 7].includes(r) ? 0 : 1.5;
}

export function maitriScore(boyLord: SaptaGraha, girlLord: SaptaGraha): number {
  if (boyLord === girlLord) return 5;
  const a = relScore(boyLord, girlLord);
  const b = relScore(girlLord, boyLord);
  const key = [a, b].sort().join("-");
  const table: Record<string, number> = {
    "friend-friend": 5,
    "friend-neutral": 4,
    "neutral-neutral": 3,
    "enemy-friend": 1,
    "enemy-neutral": 0.5,
    "enemy-enemy": 0,
  };
  return table[key]!;
}

export function ganaScore(a: Gana, b: Gana): number {
  if (a === b) return 6;
  const k = [a, b].sort().join("-");
  return k === "deva-manushya" ? 5 : k === "deva-rakshasa" ? 1 : 0;
}

/** Bhakoot: 2/12, 5/9 and 6/8 sign relationships score 0; all others 7. */
export function bhakootScore(boySign: number, girlSign: number): number {
  const d = ((boySign - girlSign + 12) % 12) + 1; // girl → boy count
  return [2, 12, 5, 9, 6, 8].includes(d) ? 0 : 7;
}

export interface MatchResult {
  kootas: KootaResult[];
  total: number;
  max: 36;
  nadiDosha: boolean;
  bhakootDosha: boolean;
  /** Conventional band: <18 not recommended, 18–24 average, 25–32 good, ≥33 excellent. */
  band: "low" | "average" | "good" | "excellent";
}

export function ashtakoota(boyMoon: number, girlMoon: number): MatchResult {
  const b = moonData(boyMoon);
  const g = moonData(girlMoon);
  const bLord = RASHIS[b.sign]!.lord;
  const gLord = RASHIS[g.sign]!.lord;
  const rows: KootaResult[] = [
    { id: "varna", score: VARNA_OF_SIGN[b.sign]! >= VARNA_OF_SIGN[g.sign]! ? 1 : 0, boy: VARNA_NAMES[VARNA_OF_SIGN[b.sign]!]!, girl: VARNA_NAMES[VARNA_OF_SIGN[g.sign]!]! },
    { id: "vashya", score: vashyaScore(b.sign, g.sign), boy: String(b.sign), girl: String(g.sign) },
    { id: "tara", score: taraHalf(g.nakshatra, b.nakshatra) + taraHalf(b.nakshatra, g.nakshatra), boy: String(b.nakshatra), girl: String(g.nakshatra) },
    { id: "yoni", score: YONI_MATRIX[YONI_OF_NAKSHATRA[b.nakshatra]!]![YONI_OF_NAKSHATRA[g.nakshatra]!]!, boy: YONI_ANIMALS[YONI_OF_NAKSHATRA[b.nakshatra]!]!, girl: YONI_ANIMALS[YONI_OF_NAKSHATRA[g.nakshatra]!]! },
    { id: "maitri", score: maitriScore(bLord, gLord), boy: bLord, girl: gLord },
    { id: "gana", score: ganaScore(GANA_OF_NAKSHATRA[b.nakshatra]!, GANA_OF_NAKSHATRA[g.nakshatra]!), boy: GANA_OF_NAKSHATRA[b.nakshatra]!, girl: GANA_OF_NAKSHATRA[g.nakshatra]! },
    { id: "bhakoot", score: bhakootScore(b.sign, g.sign), boy: String(b.sign), girl: String(g.sign) },
    { id: "nadi", score: NADI_OF_NAKSHATRA[b.nakshatra] === NADI_OF_NAKSHATRA[g.nakshatra] ? 0 : 8, boy: NADI_OF_NAKSHATRA[b.nakshatra]!, girl: NADI_OF_NAKSHATRA[g.nakshatra]! },
  ].map((r) => ({ ...r, id: r.id as KootaId, max: KOOTA_MAX[r.id as KootaId] }));
  const total = rows.reduce((s, r) => s + r.score, 0);
  return {
    kootas: rows,
    total,
    max: 36,
    nadiDosha: rows[7]!.score === 0,
    bhakootDosha: rows[6]!.score === 0,
    band: total < 18 ? "low" : total < 25 ? "average" : total < 33 ? "good" : "excellent",
  };
}
