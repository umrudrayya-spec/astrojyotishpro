import { describe, expect, it } from "vitest";
import { YOGINIS, yoginiDasha, yoginiIndexForNakshatra, yoginiSubPeriods } from "./yogini";
import { NAKSHATRA_SPAN } from "./parashari";

describe("Yogini dasha", () => {
  it("Ardra starts Mangala, Ashwini starts Bhramari, Pushya starts Dhanya", () => {
    expect(YOGINIS[yoginiIndexForNakshatra(5)]!.id).toBe("mangala");
    expect(YOGINIS[yoginiIndexForNakshatra(0)]!.id).toBe("bhramari");
    expect(YOGINIS[yoginiIndexForNakshatra(7)]!.id).toBe("dhanya");
  });

  it("years total 36 and balance is the untraversed share of the first Yogini", () => {
    expect(YOGINIS.reduce((a, y) => a + y.years, 0)).toBe(36);
    // Moon at the midpoint of Ashwini → half of Bhramari's 4 years remain.
    const r = yoginiDasha(NAKSHATRA_SPAN / 2, new Date("2000-01-01T00:00:00Z"));
    expect(r.balanceYears).toBeCloseTo(2);
    expect(r.periods[0]!.yogini).toBe("bhramari");
    expect(r.periods[1]!.yogini).toBe("bhadrika");
  });

  it("antardashas start with the Mahadasha Yogini and fill it exactly", () => {
    const md = yoginiDasha(100, new Date("1990-05-05T00:00:00Z")).periods[2]!;
    const subs = yoginiSubPeriods(md);
    expect(subs[0]!.yogini).toBe(md.yogini);
    expect(subs.at(-1)!.end.getTime()).toBeCloseTo(md.end.getTime(), -1);
  });
});
