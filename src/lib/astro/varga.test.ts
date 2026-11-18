import { describe, expect, it } from "vitest";
import { VARGAS, isVargottama, vargaPosition, vargaSign } from "./varga";

const L = (sign: number, deg: number) => sign * 30 + deg;
const [ARI, TAU, GEM, CAN, LEO, VIR, LIB, SCO, SAG, CAP, AQU, PIS] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

describe("Varga library", () => {
  it("covers all 20 requested divisions", () => {
    expect(VARGAS.map((v) => v.division)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24, 27, 30, 40, 45, 60]);
  });
});

describe("D9 Navamsha", () => {
  it("movable from same, fixed from 9th, dual from 5th", () => {
    expect(vargaSign("D9", L(ARI, 1))).toBe(ARI);
    expect(vargaSign("D9", L(TAU, 1))).toBe(CAP);
    expect(vargaSign("D9", L(GEM, 1))).toBe(LIB);
    expect(vargaSign("D9", L(CAN, 1))).toBe(CAN);
    expect(vargaSign("D9", L(LEO, 29.9))).toBe(SAG);
  });
  it("boundary 3°20' moves to the next navamsha", () => {
    expect(vargaSign("D9", L(ARI, 10 / 3 - 1e-7))).toBe(ARI);
    expect(vargaSign("D9", L(ARI, 10 / 3 + 1e-7))).toBe(TAU);
  });
  it("vargottama when D1 sign = D9 sign", () => {
    expect(isVargottama(L(ARI, 1))).toBe(true);
    expect(isVargottama(L(ARI, 5))).toBe(false);
    expect(isVargottama(L(PIS, 29))).toBe(true);
  });
});

describe("Other vargas (traditional rules)", () => {
  it("D2 Hora: odd 0-15 Leo, even 0-15 Cancer", () => {
    expect(vargaSign("D2", L(ARI, 10))).toBe(LEO);
    expect(vargaSign("D2", L(ARI, 20))).toBe(CAN);
    expect(vargaSign("D2", L(TAU, 10))).toBe(CAN);
    expect(vargaSign("D2", L(TAU, 20))).toBe(LEO);
  });
  it("D3 Drekkana: same, 5th, 9th", () => {
    expect(vargaSign("D3", L(ARI, 5))).toBe(ARI);
    expect(vargaSign("D3", L(ARI, 15))).toBe(LEO);
    expect(vargaSign("D3", L(ARI, 25))).toBe(SAG);
  });
  it("D4: same, 4th, 7th, 10th", () => {
    expect(vargaSign("D4", L(TAU, 25))).toBe(AQU);
  });
  it("D7: even signs start from 7th", () => {
    expect(vargaSign("D7", L(ARI, 0.5))).toBe(ARI);
    expect(vargaSign("D7", L(TAU, 0.5))).toBe(SCO);
  });
  it("D10: even signs start from 9th", () => {
    expect(vargaSign("D10", L(ARI, 0.5))).toBe(ARI);
    expect(vargaSign("D10", L(TAU, 0.5))).toBe(CAP);
  });
  it("D12 counts from the sign itself", () => {
    expect(vargaSign("D12", L(VIR, 29.9))).toBe(LEO);
  });
  it("D16: movable Aries, fixed Leo, dual Sagittarius", () => {
    expect(vargaSign("D16", L(CAN, 0.1))).toBe(ARI);
    expect(vargaSign("D16", L(TAU, 0.1))).toBe(LEO);
    expect(vargaSign("D16", L(PIS, 0.1))).toBe(SAG);
  });
  it("D20: movable Aries, fixed Sagittarius, dual Leo", () => {
    expect(vargaSign("D20", L(SCO, 0.1))).toBe(SAG);
    expect(vargaSign("D20", L(VIR, 0.1))).toBe(LEO);
  });
  it("D24: odd Leo, even Cancer", () => {
    expect(vargaSign("D24", L(ARI, 0.1))).toBe(LEO);
    expect(vargaSign("D24", L(TAU, 0.1))).toBe(CAN);
  });
  it("D27: fire Aries, earth Cancer, air Libra, water Capricorn", () => {
    expect(vargaSign("D27", L(LEO, 0.1))).toBe(ARI);
    expect(vargaSign("D27", L(VIR, 0.1))).toBe(CAN);
    expect(vargaSign("D27", L(AQU, 0.1))).toBe(LIB);
    expect(vargaSign("D27", L(SCO, 0.1))).toBe(CAP);
  });
  it("D30 Trimshamsha unequal parts", () => {
    expect(vargaSign("D30", L(ARI, 3))).toBe(ARI);
    expect(vargaSign("D30", L(ARI, 7))).toBe(AQU);
    expect(vargaSign("D30", L(ARI, 12))).toBe(SAG);
    expect(vargaSign("D30", L(ARI, 20))).toBe(GEM);
    expect(vargaSign("D30", L(ARI, 27))).toBe(LIB);
    expect(vargaSign("D30", L(TAU, 3))).toBe(TAU);
    expect(vargaSign("D30", L(TAU, 11))).toBe(VIR);
    expect(vargaSign("D30", L(TAU, 15))).toBe(PIS);
    expect(vargaSign("D30", L(TAU, 22))).toBe(CAP);
    expect(vargaSign("D30", L(TAU, 27))).toBe(SCO);
  });
  it("D40: odd Aries, even Libra", () => {
    expect(vargaSign("D40", L(GEM, 0.1))).toBe(ARI);
    expect(vargaSign("D40", L(CAN, 0.1))).toBe(LIB);
  });
  it("D45: movable Aries, fixed Leo, dual Sagittarius", () => {
    expect(vargaSign("D45", L(AQU, 0.1))).toBe(LEO);
  });
  it("D60 counts from the same sign by 30' parts", () => {
    expect(vargaSign("D60", L(ARI, 0.4))).toBe(ARI);
    expect(vargaSign("D60", L(ARI, 0.6))).toBe(TAU);
    expect(vargaSign("D60", L(CAP, 29.9))).toBe(SAG);
  });
  it("varga degree is scaled within the part and the D1 longitude is preserved", () => {
    const p = vargaPosition("D9", L(ARI, 5));
    expect(p.sourceLongitude).toBe(5);
    expect(p.degree).toBeCloseTo(15, 6);
  });
});
