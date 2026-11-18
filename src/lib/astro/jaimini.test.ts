import { describe, expect, it } from "vitest";
import { argala, charaKarakas, karakamsha, rashiAspects } from "./jaimini";

const lons = { sun: 29, moon: 60 + 5, mars: 120 + 17, mercury: 210 + 22, jupiter: 300 + 1, venus: 15, saturn: 90 + 25, rahu: 240 + 3 };

describe("Jaimini", () => {
  it("7-karaka scheme ranks Sun–Saturn by degree in sign", () => {
    expect(charaKarakas(lons, "seven").map((k) => `${k.karaka}:${k.planet}`)).toEqual([
      "AK:sun",
      "AmK:saturn",
      "BK:mercury",
      "MK:mars",
      "PK:venus",
      "GK:moon",
      "DK:jupiter",
    ]);
  });

  it("8-karaka scheme counts Rahu backwards (30 − 3° = 27°)", () => {
    const r = charaKarakas(lons, "eight");
    expect(r[1]).toMatchObject({ karaka: "AmK", planet: "rahu" });
    expect(r[1]!.effectiveDegree).toBeCloseTo(27);
    expect(r).toHaveLength(8);
  });

  it("flags karakas within 1′ of each other", () => {
    const r = charaKarakas({ ...lons, moon: 60 + 29 + 0.5 / 60 }, "seven");
    expect(r[0]!.nearTie && r[1]!.nearTie).toBe(true);
  });

  it("Karakamsha is the Navamsha sign of the Atmakaraka (Aries 29° → Sagittarius)", () => {
    expect(karakamsha(29)).toBe(8);
  });

  it("Rashi drishti: Aries→Leo,Scorpio,Aquarius; Taurus→Cancer,Libra,Capricorn; Gemini→Virgo,Sagittarius,Pisces", () => {
    expect(rashiAspects(0)).toEqual([4, 7, 10]);
    expect(rashiAspects(1)).toEqual([3, 6, 9]);
    expect(rashiAspects(2)).toEqual([5, 8, 11]);
  });

  it("Argala holds when the argala house has more planets than its obstruction", () => {
    const r = argala(0, { jupiter: 1, venus: 1, saturn: 11, mars: 3, moon: 9 });
    expect(r.find((a) => a.from === 2)!.status).toBe("argala"); // 2 in 2nd vs 1 in 12th
    expect(r.find((a) => a.from === 4)!.status).toBe("obstructed"); // 1 vs 1: equal obstruction cancels
    expect(r.find((a) => a.from === 11)!.status).toBe("none");
  });
});
