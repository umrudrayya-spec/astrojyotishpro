import { describe, expect, it } from "vitest";
import { currentPeriods, subPeriods, vimshottari, splitYears } from "./dasha";

const birth = new Date("2000-01-01T00:00:00Z");
const YEAR = 365.25 * 86_400_000;

describe("Vimshottari birth balance", () => {
  it("Moon at 0° Ashwini: full 7-year Ketu balance", () => {
    const r = vimshottari(0, birth);
    expect(r.birthLord).toBe("ketu");
    expect(r.balanceYears).toBeCloseTo(7, 9);
    expect(r.mahadashas[0]!.start.getTime()).toBe(birth.getTime());
  });
  it("Moon halfway through Bharani: 10 years of Venus remain", () => {
    const r = vimshottari(13 + 20 / 60 + 20 / 3 / 1, birth); // 13°20' + 6°40'
    expect(r.birthLord).toBe("venus");
    expect(r.balanceYears).toBeCloseTo(10, 9);
    expect(r.mahadashas[0]!.end.getTime() - birth.getTime()).toBeCloseTo(10 * YEAR, -3);
  });
  it("Mahadasha order follows Vimshottari sequence and sums to 120 years", () => {
    const r = vimshottari(0, birth);
    expect(r.mahadashas.map((m) => m.lord)).toEqual(["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"]);
    expect(r.mahadashas.reduce((s, m) => s + m.years, 0)).toBe(120);
  });
});

describe("Sub-periods", () => {
  it("Ketu–Ketu Antardasha lasts 7×7/120 years and the 9 parts fill the Mahadasha", () => {
    const md = vimshottari(0, birth).mahadashas[0]!;
    const ads = subPeriods(md);
    expect(ads[0]!.lord).toBe("ketu");
    expect(ads[0]!.years).toBeCloseTo((7 * 7) / 120, 12);
    expect(ads[1]!.lord).toBe("venus");
    expect(ads.reduce((s, a) => s + a.years, 0)).toBeCloseTo(7, 9);
    expect(ads[8]!.end.getTime()).toBe(md.end.getTime());
  });
  it("goes down to Prana (level 5) and no further", () => {
    const md = vimshottari(0, birth).mahadashas[0]!;
    const l5 = subPeriods(subPeriods(subPeriods(subPeriods(md)[0]!)[0]!)[0]!)[0]!;
    expect(l5.level).toBe(5);
    expect(subPeriods(l5)).toEqual([]);
  });
  it("finds the running periods on a date", () => {
    const r = vimshottari(0, birth);
    const cur = currentPeriods(r, new Date("2010-06-01T00:00:00Z"), 2);
    expect(cur[0]!.lord).toBe("venus");
    expect(cur[1]!.level).toBe(2);
  });
  it("splitYears formats durations", () => {
    expect(splitYears(7)).toEqual({ y: 7, m: 0, d: 0 });
    expect(splitYears(0.5)).toEqual({ y: 0, m: 6, d: 0 });
  });
});
