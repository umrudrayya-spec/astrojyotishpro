import { describe, expect, it } from "vitest";
import { arudhaPada, badhaka, dispositorChain, functionalNature, marakaLords, naturalNature } from "./bhava";

describe("Functional nature (BPHS ch. 34 rule set)", () => {
  it("Saturn is Yogakaraka for Taurus Lagna, Mars for Cancer and Leo", () => {
    expect(functionalNature(1).saturn.nature).toBe("yogakaraka");
    expect(functionalNature(3).mars.nature).toBe("yogakaraka");
    expect(functionalNature(4).mars.nature).toBe("yogakaraka");
  });
  it("Lagna lord stays benefic even when it owns the 8th (Mars for Aries)", () => {
    expect(functionalNature(0).mars).toEqual({ nature: "benefic", houses: [1, 8] });
  });
  it("Mercury owning 3 and 6 is malefic for Aries", () => {
    expect(functionalNature(0).mercury.nature).toBe("malefic");
  });
  it("Jupiter owning 9 and 12 is benefic for Aries", () => {
    expect(functionalNature(0).jupiter.nature).toBe("benefic");
  });
});

describe("Maraka and Badhaka", () => {
  it("Aries Lagna: Marakas are Venus (2nd and 7th)", () => {
    expect(marakaLords(0).map((m) => m.lord)).toEqual(["venus", "venus"]);
  });
  it("movable → 11th, fixed → 9th, dual → 7th", () => {
    expect(badhaka(0)).toMatchObject({ house: 11, lord: "saturn" });
    expect(badhaka(1)).toMatchObject({ house: 9, lord: "saturn" });
    expect(badhaka(2)).toMatchObject({ house: 7, lord: "jupiter" });
  });
});

describe("Arudha Lagna", () => {
  it("Aries Lagna, Mars in Taurus → Gemini", () => {
    expect(arudhaPada(0, { mars: 1 })).toBe(2);
  });
  it("exception: result in 7th from Lagna moves 10th from it (Mars in Cancer → Cancer)", () => {
    expect(arudhaPada(0, { mars: 3 })).toBe(3);
  });
  it("exception: lord in Lagna gives 10th from Lagna", () => {
    expect(arudhaPada(0, { mars: 0 })).toBe(9);
  });
});

describe("Natural nature and dispositors", () => {
  it("Moon waxing is benefic, waning malefic", () => {
    expect(naturalNature("moon", { sun: 0, moon: 90 })).toBe("benefic");
    expect(naturalNature("moon", { sun: 0, moon: 270 })).toBe("malefic");
  });
  it("Mercury with Saturn is malefic, alone benefic", () => {
    expect(naturalNature("mercury", { mercury: 10, saturn: 20 })).toBe("malefic");
    expect(naturalNature("mercury", { mercury: 10, saturn: 200 })).toBe("benefic");
  });
  it("dispositor chain stops at a planet in its own sign", () => {
    // Sun in Taurus → Venus in Libra (own)
    expect(dispositorChain("sun", { sun: 1, venus: 6 })).toEqual(["sun", "venus"]);
  });
});
