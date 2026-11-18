import { describe, expect, it } from "vitest";
import type { GrahaId } from "./constants";
import type { RawChart } from "./ephemeris";
import { analyseChart } from "./parashari";
import { DEFAULT_SETTINGS } from "./settings";
import { detectYogas, type YogaId, type YogaOptions } from "./yogas";

/** Build a chart from sign + degree per graha (Lagna at `asc`). Speeds positive unless listed. */
function chartOf(asc: number, pos: Partial<Record<GrahaId, number>>) {
  const base: Record<string, number> = { sun: 100, moon: 200, mars: 300, mercury: 110, jupiter: 50, venus: 130, saturn: 250, uranus: 0, neptune: 0, pluto: 0, rahu: 10, ...pos };
  const bodies = Object.entries(base).map(([id, longitude]) => ({ id: id as GrahaId, longitude, latitude: 0, speed: 1, distanceAu: 1, declination: 0 }));
  bodies.push({ id: "ketu", longitude: (base["rahu"]! + 180) % 360, latitude: 0, speed: -0.05, distanceAu: 1, declination: 0 });
  const raw: RawChart = {
    jdUt: 0,
    ayanamshaDegrees: 0,
    ascendant: asc,
    mc: 0,
    cusps: Array.from({ length: 12 }, (_, i) => i * 30),
    bodies,
    meta: { engine: "", engineVersion: "", ephemeris: "moshier", settings: DEFAULT_SETTINGS, algorithmVersion: "", computedAt: "" },
  };
  return analyseChart(raw, "seventh_only");
}

const opts: YogaOptions = { timeKnown: true, kujaIncludesSecond: true };
const find = (rs: ReturnType<typeof detectYogas>, id: YogaId) => rs.filter((r) => r.id === id);

describe("Yoga engine", () => {
  it("Hamsa: Jupiter in Cancer (exalted) in the 10th from Libra Lagna → confirmed", () => {
    const r = detectYogas(chartOf(185, { jupiter: 95, sun: 20 }), opts);
    expect(find(r, "hamsa")[0]!.status).toBe("confirmed");
  });

  it("Hamsa becomes insufficient data when birth time is unknown", () => {
    const r = detectYogas(chartOf(185, { jupiter: 95, sun: 20 }), { ...opts, timeKnown: false });
    expect(find(r, "hamsa")[0]!.status).toBe("insufficient_data");
  });

  it("Gajakesari: Jupiter 4th from Moon → confirmed; debilitated Jupiter → weakened", () => {
    expect(find(detectYogas(chartOf(0, { moon: 5, jupiter: 95, sun: 200 }), opts), "gajakesari")[0]!.status).toBe("confirmed");
    expect(find(detectYogas(chartOf(0, { moon: 185, jupiter: 275, sun: 100 }), opts), "gajakesari")[0]!.status).toBe("weakened");
  });

  it("Kemadruma is cancelled when a planet is in a kendra from the Moon", () => {
    // Moon in Aries; nothing in Taurus or Pisces; Jupiter in Cancer (4th from Moon).
    const r = detectYogas(chartOf(0, { moon: 5, sun: 65, mercury: 70, venus: 75, mars: 160, jupiter: 95, saturn: 220, rahu: 130 }), opts);
    expect(find(r, "kemadruma")[0]!.status).toBe("cancelled");
  });

  it("Kuja dosha from Lagna with Mars in the 8th; Mars in own sign (Aries) cancels it", () => {
    const lagnaRow = (asc: number, mars: number) => find(detectYogas(chartOf(asc, { mars }), opts), "kuja_dosha").find((x) => x.reference === "lagna")!;
    expect(lagnaRow(185, 35).status).toBe("confirmed"); // Libra Lagna, Mars in Taurus = 8th
    expect(lagnaRow(185, 5).status).toBe("cancelled"); // Mars in Aries = 7th from Libra, own sign
  });

  it("Kuja dosha 2nd-house rule follows the setting", () => {
    const row = (inc: boolean) =>
      find(detectYogas(chartOf(0, { mars: 40 }), { ...opts, kujaIncludesSecond: inc }), "kuja_dosha").find((x) => x.reference === "lagna")!;
    expect(row(true).status).toBe("confirmed");
    expect(row(false).status).toBe("not_formed");
  });

  it("Kala Sarpa: all seven between Rahu and Ketu → confirmed", () => {
    const r = detectYogas(chartOf(0, { rahu: 0, sun: 10, moon: 20, mars: 30, mercury: 40, jupiter: 50, venus: 60, saturn: 170 }), opts);
    expect(find(r, "kala_sarpa")[0]!.status).toBe("confirmed");
    const r2 = detectYogas(chartOf(0, { rahu: 0, sun: 10, moon: 200, mars: 30, mercury: 40, jupiter: 50, venus: 60, saturn: 170 }), opts);
    expect(find(r2, "kala_sarpa")[0]!.status).toBe("not_formed");
  });

  it("Raja yoga: 9th lord and 10th lord conjunct (Aries Lagna: Jupiter + Saturn)", () => {
    const r = detectYogas(chartOf(0, { jupiter: 95 + 30, saturn: 120 + 10 }), opts);
    expect(find(r, "raja").some((x) => x.status !== "not_formed" && x.planets.includes("jupiter") && x.planets.includes("saturn"))).toBe(true);
  });

  it("Neecha Bhanga: debilitated Mars in Cancer with Moon (dispositor) in a kendra from Lagna", () => {
    const r = detectYogas(chartOf(0, { mars: 100, moon: 280 }), opts);
    const nb = find(r, "neecha_bhanga").find((x) => x.planets[0] === "mars")!;
    expect(nb.status).toBe("confirmed");
  });
});
