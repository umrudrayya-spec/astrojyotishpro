import { describe, expect, it } from "vitest";
import {
  compoundRelation,
  dignityOf,
  isCombust,
  nakshatraOf,
  signOf,
  temporaryRelation,
  aspectedHouseOffsets,
} from "./parashari";

describe("Rashi and Nakshatra boundaries", () => {
  it("29.999° is Aries, 30° is Taurus", () => {
    expect(signOf(29.999)).toBe(0);
    expect(signOf(30)).toBe(1);
    expect(signOf(359.99)).toBe(11);
  });
  it("0° is Ashwini pada 1 (lord Ketu)", () => {
    expect(nakshatraOf(0)).toMatchObject({ index: 0, pada: 1, lord: "ketu" });
  });
  it("13°20' starts Bharani pada 1 (lord Venus)", () => {
    expect(nakshatraOf(13 + 20 / 60 + 1e-9)).toMatchObject({ index: 1, pada: 1, lord: "venus" });
  });
  it("3°20' starts Ashwini pada 2", () => {
    expect(nakshatraOf(10 / 3 + 1e-9).pada).toBe(2);
  });
  it("359.9° is Revati pada 4 (lord Mercury)", () => {
    expect(nakshatraOf(359.9)).toMatchObject({ index: 26, pada: 4, lord: "mercury" });
  });
});

describe("Dignity (BPHS)", () => {
  it("Sun in Aries is exalted, in Libra debilitated", () => {
    expect(dignityOf("sun", 10, {})).toBe("exalted");
    expect(dignityOf("sun", 190, {})).toBe("debilitated");
  });
  it("Sun at Leo 15° is moolatrikona, at Leo 25° own sign", () => {
    expect(dignityOf("sun", 135, {})).toBe("moolatrikona");
    expect(dignityOf("sun", 145, {})).toBe("own");
  });
  it("Moon at Taurus 2° is exalted (exaltation sign takes priority)", () => {
    expect(dignityOf("moon", 32, {})).toBe("exalted");
  });
  it("Rahu has no classical dignity assigned", () => {
    expect(dignityOf("rahu", 40, {})).toBe("unclassified");
  });
  it("compound: natural friend + temporary friend = great friend", () => {
    expect(compoundRelation("friend", "friend")).toBe("great_friend");
    expect(compoundRelation("enemy", "enemy")).toBe("great_enemy");
    expect(compoundRelation("neutral", "enemy")).toBe("enemy");
  });
  it("temporary friends sit in 2,3,4,10,11,12 from each other", () => {
    expect(temporaryRelation(0, 1)).toBe("friend");
    expect(temporaryRelation(0, 4)).toBe("enemy");
    expect(temporaryRelation(0, 11)).toBe("friend");
    expect(temporaryRelation(0, 0)).toBe("enemy");
  });
});

describe("Combustion", () => {
  it("Venus 9° from Sun is combust when direct, not when retrograde (8° orb)", () => {
    expect(isCombust("venus", 109, 100, false)).toBe(true);
    expect(isCombust("venus", 109, 100, true)).toBe(false);
  });
  it("handles wrap-around at 0° Aries", () => {
    expect(isCombust("saturn", 355, 5, false)).toBe(true);
  });
  it("nodes are never combust", () => {
    expect(isCombust("rahu", 100, 100, true)).toBe(false);
  });
});

describe("Graha Drishti", () => {
  it("Mars aspects 4th, 7th, 8th; Jupiter 5th, 7th, 9th; Saturn 3rd, 7th, 10th", () => {
    expect(aspectedHouseOffsets("mars", "seventh_only").sort()).toEqual([4, 7, 8]);
    expect(aspectedHouseOffsets("jupiter", "seventh_only").sort()).toEqual([5, 7, 9]);
    expect(aspectedHouseOffsets("saturn", "seventh_only").sort((a, b) => a - b)).toEqual([3, 7, 10]);
  });
  it("node aspects follow the chosen convention", () => {
    expect(aspectedHouseOffsets("rahu", "seventh_only")).toEqual([7]);
    expect(aspectedHouseOffsets("rahu", "fifth_seventh_ninth")).toEqual([5, 7, 9]);
  });
});
