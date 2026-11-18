import { describe, expect, it } from "vitest";
import { ashtakavarga, BAV_TOTALS, trikonaShodhana, type AvReference } from "./ashtakavarga";
import { SAPTA_GRAHAS } from "./constants";

const chart: Record<AvReference, number> = { sun: 10, moon: 1, mars: 9, mercury: 10, jupiter: 6, venus: 10, saturn: 10, lagna: 2 };

describe("Ashtakavarga", () => {
  it("each BAV has its classical total and SAV totals 337, for any chart", () => {
    for (const c of [chart, { sun: 0, moon: 0, mars: 0, mercury: 0, jupiter: 0, venus: 0, saturn: 0, lagna: 0 }]) {
      const r = ashtakavarga(c);
      for (const g of SAPTA_GRAHAS) expect(r.bav[g].reduce((a, b) => a + b, 0)).toBe(BAV_TOTALS[g]);
      expect(r.sav.reduce((a, b) => a + b, 0)).toBe(337);
      expect(Math.max(...SAPTA_GRAHAS.flatMap((g) => r.bav[g]))).toBeLessThanOrEqual(8);
    }
  });

  it("Sun BAV: Sun's own sign gets a bindu from Sun (1st), Mars and Saturn when conjunct", () => {
    const r = ashtakavarga({ sun: 0, moon: 0, mars: 0, mercury: 0, jupiter: 0, venus: 0, saturn: 0, lagna: 0 });
    // All references in Aries: Aries (house 1) gets bindus from Sun, Mars, Saturn only.
    expect(r.contributions.sun[0]).toEqual(["sun", "mars", "saturn"]);
  });

  it("Trikona Shodhana: zero keeps the group, equal values clear it, else subtract the minimum", () => {
    //          Ar Ta Ge Cn Le Vi Li Sc Sg Cp Aq Pi
    const row = [4, 3, 5, 2, 6, 3, 5, 2, 4, 3, 0, 2];
    expect(trikonaShodhana(row)).toEqual([0, 0, 5, 0, 2, 0, 5, 0, 0, 0, 0, 0]);
  });
});
