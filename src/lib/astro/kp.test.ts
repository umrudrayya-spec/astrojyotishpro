import { describe, expect, it } from "vitest";
import { analyseKp, houseOfLongitude, kpLords, kpSubTable } from "./kp";

const dms = (d: number, m: number, s = 0) => d + m / 60 + s / 3600;

describe("KP sub lords", () => {
  it("0°00′30″ Aries = Mars / Ketu star / Ketu sub", () => {
    expect(kpLords(dms(0, 0, 30))).toMatchObject({ signLord: "mars", starLord: "ketu", subLord: "ketu", subSubLord: "ketu" });
  });
  it("Ketu sub of Ashwini ends at 0°46′40″; Venus sub follows", () => {
    expect(kpLords(dms(0, 46, 30)).subLord).toBe("ketu");
    expect(kpLords(dms(0, 46, 50)).subLord).toBe("venus");
  });
  it("Aries 3°00′–3°40′ is the Ketu-star Sun sub", () => {
    expect(kpLords(dms(3, 20)).subLord).toBe("sun");
    expect(kpLords(dms(3, 41)).subLord).toBe("moon");
  });
  it("Bharani (13°20′ Aries) starts with the Venus sub; Taurus 0° is Sun star", () => {
    expect(kpLords(dms(13, 21))).toMatchObject({ starLord: "venus", subLord: "venus" });
    expect(kpLords(30.01)).toMatchObject({ signLord: "venus", starLord: "sun" });
  });
  it("sub-sub inside the Venus sub of Ashwini starts with Venus", () => {
    expect(kpLords(dms(0, 47)).subSubLord).toBe("venus");
  });
  it("the zodiac has exactly 249 sub divisions covering 0–360°", () => {
    const t = kpSubTable();
    expect(t).toHaveLength(249);
    expect(t[0]!.from).toBe(0);
    expect(t[248]!.to).toBeCloseTo(360, 9);
    for (let i = 1; i < t.length; i++) expect(t[i]!.from).toBeCloseTo(t[i - 1]!.to, 9);
  });
});

describe("KP houses and significators", () => {
  const cusps = Array.from({ length: 12 }, (_, i) => (10 + i * 30) % 360);
  it("places a longitude between cusps (wrapping at 360°)", () => {
    expect(houseOfLongitude(15, cusps)).toBe(1);
    expect(houseOfLongitude(5, cusps)).toBe(12);
    expect(houseOfLongitude(345, cusps)).toBe(12);
  });
  it("builds 4-level significators", () => {
    // Sun 15° (house 1, Bharani → Venus star); Venus 36° (house 1, Krittika → Sun star);
    // Saturn 75° (house 3, Ardra → Rahu star). Cusp 1 = 10° Aries → sign lord Mars; cusp 3 = 70° Gemini → Mercury.
    const k = analyseKp({ sun: 15, venus: 36, saturn: 75 }, cusps);
    const h1 = k.significators[0]!;
    expect(h1.l2).toEqual(["sun", "venus"]);
    expect(h1.l1).toEqual(["sun", "venus"]);
    expect(h1.l4).toEqual(["mars"]);
    expect(h1.l3).toEqual([]);
    expect(k.significators[2]!.l2).toEqual(["saturn"]);
    expect(k.significators[2]!.l4).toEqual(["mercury"]);
    // Venus owns Taurus (cusp 2) and Libra (cusp 7); it is in the Sun star, and the Sun rules cusp 5 (Leo).
    expect(k.planetHouses.venus).toEqual([1, 2, 5, 7]);
  });
});
