/**
 * Jaimini (Upadesha Sutras as presented in BPHS ch. 32): Chara Karakas, Karakamsha,
 * Rashi Drishti and Argala. Consumes longitudes / signs only.
 */
import type { GrahaId } from "./constants";
import { SAPTA_GRAHAS } from "./constants";
import { degreeInSign, signOf } from "./parashari";
import { vargaSign } from "./varga";

/** Schools differ: 7 karakas (Sun–Saturn) or 8 (adds Rahu, counted backwards in its sign). */
export type KarakaScheme = "seven" | "eight";

export const KARAKAS_7 = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"] as const;
export const KARAKAS_8 = ["AK", "AmK", "BK", "MK", "PiK", "PK", "GK", "DK"] as const;
export type KarakaId = (typeof KARAKAS_8)[number];

export interface KarakaRow {
  karaka: KarakaId;
  planet: GrahaId;
  /** Degree used for ranking (Rahu: 30 − degree). */
  effectiveDegree: number;
  /** True when this planet's degree is within 1′ of the next one (ranking is uncertain). */
  nearTie: boolean;
}

export function charaKarakas(longitudes: Partial<Record<GrahaId, number>>, scheme: KarakaScheme): KarakaRow[] {
  const ids: GrahaId[] = scheme === "eight" ? [...SAPTA_GRAHAS, "rahu"] : [...SAPTA_GRAHAS];
  const ranked = ids
    .map((id) => {
      const d = degreeInSign(longitudes[id]!);
      return { planet: id, effectiveDegree: id === "rahu" ? 30 - d : d };
    })
    .sort((a, b) => b.effectiveDegree - a.effectiveDegree);
  const names = scheme === "eight" ? KARAKAS_8 : KARAKAS_7;
  return ranked.map((r, i) => {
    const prev = ranked[i - 1];
    const next = ranked[i + 1];
    const close = (o?: { effectiveDegree: number }) => !!o && Math.abs(o.effectiveDegree - r.effectiveDegree) < 1 / 60;
    return { karaka: names[i]!, planet: r.planet, effectiveDegree: r.effectiveDegree, nearTie: close(prev) || close(next) };
  });
}

/** Karakamsha = Navamsha sign of the Atmakaraka. */
export function karakamsha(atmakarakaLongitude: number): number {
  return vargaSign("D9", atmakarakaLongitude);
}

export type Modality = "movable" | "fixed" | "dual";
export const modality = (sign: number): Modality => (["movable", "fixed", "dual"] as const)[sign % 3]!;

/**
 * Rashi Drishti: movable signs aspect fixed signs except the adjacent one; fixed aspect movable
 * except the adjacent one; dual signs aspect the other dual signs.
 */
export function rashiAspects(sign: number): number[] {
  const m = modality(sign);
  const out: number[] = [];
  for (let s = 0; s < 12; s++) {
    if (s === sign) continue;
    const ms = modality(s);
    if (m === "dual") {
      if (ms === "dual") out.push(s);
    } else if ((m === "movable" && ms === "fixed") || (m === "fixed" && ms === "movable")) {
      const adjacent = (s + 1) % 12 === sign || (sign + 1) % 12 === s;
      if (!adjacent) out.push(s);
    }
  }
  return out;
}

export interface ArgalaRow {
  /** House from the reference (2, 4, 11 primary; 5 secondary). */
  from: 2 | 4 | 11 | 5;
  /** Obstructing house (12, 10, 3, 9). */
  obstruction: 12 | 10 | 3 | 9;
  planets: GrahaId[];
  obstructors: GrahaId[];
  status: "none" | "argala" | "obstructed";
}

const ARGALA_PAIRS: [ArgalaRow["from"], ArgalaRow["obstruction"]][] = [
  [2, 12],
  [4, 10],
  [11, 3],
  [5, 9],
];

/**
 * Argala on a sign. An argala stands when the argala house holds more planets than its obstruction house
 * (BPHS 31: the obstruction must be stronger to cancel; here strength = number of planets, the common rule).
 * Counting is always zodiacal; the Ketu-reverse variant is not applied.
 */
export function argala(refSign: number, planetSigns: Partial<Record<GrahaId, number>>): ArgalaRow[] {
  const inHouse = (h: number) =>
    (Object.entries(planetSigns) as [GrahaId, number][])
      .filter(([, s]) => s === (refSign + h - 1) % 12)
      .map(([g]) => g);
  return ARGALA_PAIRS.map(([from, obstruction]) => {
    const planets = inHouse(from);
    const obstructors = inHouse(obstruction);
    const status: ArgalaRow["status"] =
      planets.length === 0 ? "none" : obstructors.length >= planets.length ? "obstructed" : "argala";
    return { from, obstruction, planets, obstructors, status };
  });
}

export { signOf };
