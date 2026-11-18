import { describe, expect, it } from "vitest";
import { NAKSHATRA_SPAN } from "./parashari";
import {
  GANA_OF_NAKSHATRA,
  NADI_OF_NAKSHATRA,
  YONI_MATRIX,
  ashtakoota,
  bhakootScore,
  maitriScore,
  taraHalf,
  vashyaScore,
} from "./matching";

/** Moon longitude in the middle of nakshatra n that also lies in the given sign, when possible. */
const mid = (n: number) => n * NAKSHATRA_SPAN + NAKSHATRA_SPAN / 2;

describe("Ashtakoota tables", () => {
  it("yoni matrix is symmetric with exactly 7 enemy pairs (score 0)", () => {
    let zeros = 0;
    for (let i = 0; i < 14; i++)
      for (let j = 0; j < 14; j++) {
        expect(YONI_MATRIX[i]![j]).toBe(YONI_MATRIX[j]![i]);
        if (i < j && YONI_MATRIX[i]![j] === 0) zeros++;
      }
    expect(zeros).toBe(7);
  });
  it("each gana and nadi has 9 nakshatras; Ashwini Deva/Adi, Krittika Rakshasa/Antya, Revati Deva/Antya", () => {
    for (const g of ["deva", "manushya", "rakshasa"]) expect(GANA_OF_NAKSHATRA.filter((x) => x === g)).toHaveLength(9);
    for (const n of ["adi", "madhya", "antya"]) expect(NADI_OF_NAKSHATRA.filter((x) => x === n)).toHaveLength(9);
    expect([GANA_OF_NAKSHATRA[0], NADI_OF_NAKSHATRA[0]]).toEqual(["deva", "adi"]);
    expect([GANA_OF_NAKSHATRA[2], NADI_OF_NAKSHATRA[2]]).toEqual(["rakshasa", "antya"]);
    expect([GANA_OF_NAKSHATRA[26], NADI_OF_NAKSHATRA[26]]).toEqual(["deva", "antya"]);
  });
});

describe("Ashtakoota scoring rules", () => {
  it("Bhakoot: 6/8, 2/12, 5/9 = 0; 1/7, 3/11, 4/10, same sign = 7", () => {
    expect(bhakootScore(0, 5)).toBe(0); // Aries–Virgo 6/8
    expect(bhakootScore(0, 1)).toBe(0); // 2/12
    expect(bhakootScore(0, 4)).toBe(0); // 5/9
    expect(bhakootScore(0, 6)).toBe(7);
    expect(bhakootScore(0, 2)).toBe(7);
    expect(bhakootScore(0, 3)).toBe(7);
    expect(bhakootScore(4, 4)).toBe(7);
  });
  it("Tara: counts 3, 5, 7 (and 12, 14, 16 …) are inauspicious", () => {
    expect(taraHalf(0, 2)).toBe(0); // 3rd
    expect(taraHalf(0, 4)).toBe(0); // 5th
    expect(taraHalf(0, 6)).toBe(0); // 7th
    expect(taraHalf(0, 11)).toBe(0); // 12th → 3
    expect(taraHalf(0, 1)).toBe(1.5);
    expect(taraHalf(0, 8)).toBe(1.5); // 9th
  });
  it("Graha Maitri: same lord 5; Sun–Moon friends 5; Sun–Saturn enemies 0; Moon–Mars neutral/friend 4", () => {
    expect(maitriScore("mars", "mars")).toBe(5);
    expect(maitriScore("sun", "moon")).toBe(5);
    expect(maitriScore("sun", "saturn")).toBe(0);
    expect(maitriScore("moon", "mars")).toBe(4);
    expect(maitriScore("moon", "mercury")).toBe(1); // Moon→Mercury friend, Mercury→Moon enemy
  });
  it("Vashya: same sign 2; Aries–Leo one-way 1; Gemini–Virgo mutual 2; Aries–Taurus 0", () => {
    expect(vashyaScore(3, 3)).toBe(2);
    expect(vashyaScore(0, 4)).toBe(1);
    expect(vashyaScore(2, 5)).toBe(2);
    expect(vashyaScore(0, 1)).toBe(0);
  });
  it("same nakshatra: Nadi dosha (0/8), full Tara, Yoni, Gana, Bhakoot → 28/36", () => {
    const r = ashtakoota(mid(0), mid(0)); // both Ashwini, Aries
    expect(r.nadiDosha).toBe(true);
    expect(r.total).toBe(1 + 2 + 3 + 4 + 5 + 6 + 7 + 0);
    expect(r.band).toBe("good");
  });
});
