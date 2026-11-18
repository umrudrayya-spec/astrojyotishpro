/**
 * Ashtakavarga (BPHS ch. 66–67): Bhinnashtakavarga (BAV) of the seven grahas, Sarvashtakavarga (SAV)
 * and Trikona Shodhana. Inputs are signs only (0 = Aries).
 * Ekadhipatya Shodhana and Shodhya Pinda are not implemented yet.
 */
import type { SaptaGraha } from "./constants";
import { SAPTA_GRAHAS } from "./constants";

export type AvReference = SaptaGraha | "lagna";
export const AV_REFERENCES: AvReference[] = [...SAPTA_GRAHAS, "lagna"];

/** Benefic houses (1-based, counted from each reference) contributing a bindu to each graha's BAV. */
export const BAV_RULES: Record<SaptaGraha, Record<AvReference, number[]>> = {
  sun: {
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [3, 5, 6, 9, 10, 11, 12],
    jupiter: [5, 6, 9, 11],
    venus: [6, 7, 12],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [3, 4, 6, 10, 11, 12],
  },
  moon: {
    sun: [3, 6, 7, 8, 10, 11],
    moon: [1, 3, 6, 7, 10, 11],
    mars: [2, 3, 5, 6, 9, 10, 11],
    mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    jupiter: [1, 4, 7, 8, 10, 11, 12],
    venus: [3, 4, 5, 7, 9, 10, 11],
    saturn: [3, 5, 6, 11],
    lagna: [3, 6, 10, 11],
  },
  mars: {
    sun: [3, 5, 6, 10, 11],
    moon: [3, 6, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [3, 5, 6, 11],
    jupiter: [6, 10, 11, 12],
    venus: [6, 8, 11, 12],
    saturn: [1, 4, 7, 8, 9, 10, 11],
    lagna: [1, 3, 6, 10, 11],
  },
  mercury: {
    sun: [5, 6, 9, 11, 12],
    moon: [2, 4, 6, 8, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    jupiter: [6, 8, 11, 12],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  jupiter: {
    sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    moon: [2, 5, 7, 9, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    venus: [2, 5, 6, 9, 10, 11],
    saturn: [3, 5, 6, 12],
    lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  venus: {
    sun: [8, 11, 12],
    moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    mars: [3, 5, 6, 9, 11, 12],
    mercury: [3, 5, 6, 9, 11],
    jupiter: [5, 8, 9, 10, 11],
    venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    saturn: [3, 4, 5, 8, 9, 10, 11],
    lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  saturn: {
    sun: [1, 2, 4, 7, 8, 10, 11],
    moon: [3, 6, 11],
    mars: [3, 5, 6, 10, 11, 12],
    mercury: [6, 8, 9, 10, 11, 12],
    jupiter: [5, 6, 11, 12],
    venus: [6, 11, 12],
    saturn: [3, 5, 6, 11],
    lagna: [1, 3, 4, 6, 10, 11],
  },
};

/** Classical BAV totals (independent of the chart). */
export const BAV_TOTALS: Record<SaptaGraha, number> = {
  sun: 48,
  moon: 49,
  mars: 39,
  mercury: 54,
  jupiter: 56,
  venus: 52,
  saturn: 39,
};

export interface AshtakavargaResult {
  /** bav[graha][sign] = bindus 0–8 */
  bav: Record<SaptaGraha, number[]>;
  /** contributions[graha][sign] = references that gave a bindu there */
  contributions: Record<SaptaGraha, AvReference[][]>;
  sav: number[];
}

export function ashtakavarga(signs: Record<AvReference, number>): AshtakavargaResult {
  const bav = {} as AshtakavargaResult["bav"];
  const contributions = {} as AshtakavargaResult["contributions"];
  for (const g of SAPTA_GRAHAS) {
    const row = Array<number>(12).fill(0);
    const who: AvReference[][] = Array.from({ length: 12 }, () => []);
    for (const ref of AV_REFERENCES) {
      for (const h of BAV_RULES[g][ref]) {
        const s = (signs[ref] + h - 1) % 12;
        row[s]! += 1;
        who[s]!.push(ref);
      }
    }
    bav[g] = row;
    contributions[g] = who;
  }
  const sav = Array.from({ length: 12 }, (_, s) => SAPTA_GRAHAS.reduce((a, g) => a + bav[g][s]!, 0));
  return { bav, contributions, sav };
}

/**
 * Trikona Shodhana: for each fire/earth/air/water trine (signs s, s+4, s+8):
 * if any is 0 → unchanged; if all three are equal → all become 0; otherwise subtract the minimum.
 */
export function trikonaShodhana(row: number[]): number[] {
  const out = [...row];
  for (let s = 0; s < 4; s++) {
    const idx = [s, s + 4, s + 8];
    const vals = idx.map((i) => row[i]!);
    if (vals.some((v) => v === 0)) continue;
    if (vals.every((v) => v === vals[0])) {
      for (const i of idx) out[i] = 0;
      continue;
    }
    const min = Math.min(...vals);
    for (const i of idx) out[i] = row[i]! - min;
  }
  return out;
}
