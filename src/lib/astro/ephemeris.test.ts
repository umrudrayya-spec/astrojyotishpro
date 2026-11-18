// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { computeRawChart, initEphemeris } from "./ephemeris";
import { analyseChart } from "./parashari";
import { DEFAULT_SETTINGS } from "./settings";

const wasmPath = path.resolve(__dirname, "../../../node_modules/@swisseph/browser/dist/swisseph.wasm");

beforeAll(() => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const s = String(input);
    if (s.endsWith(".wasm")) {
      return new Response(readFileSync(s), { headers: { "content-type": "application/wasm" } });
    }
    return realFetch(input, init);
  }) as typeof fetch;
});

const J2000 = new Date("2000-01-01T12:00:00Z");

describe("Swiss Ephemeris engine", () => {
  it("Lahiri ayanamsha at J2000 is 23°51′ (23.85–23.86°)", async () => {
    const eph = await initEphemeris(wasmPath);
    const raw = computeRawChart(eph, J2000, 17.385, 78.4867, DEFAULT_SETTINGS);
    expect(raw.ayanamshaDegrees).toBeGreaterThan(23.85);
    expect(raw.ayanamshaDegrees).toBeLessThan(23.86);
  });

  it("tropical Sun at J2000 is 280.37° (±0.02)", async () => {
    const eph = await initEphemeris(wasmPath);
    const raw = computeRawChart(eph, J2000, 0, 0, { ...DEFAULT_SETTINGS, ayanamsha: "tropical" });
    const sun = raw.bodies.find((b) => b.id === "sun")!;
    expect(Math.abs(sun.longitude - 280.37)).toBeLessThan(0.02);
  });

  it("sidereal = tropical − ayanamsha for every graha", async () => {
    const eph = await initEphemeris(wasmPath);
    const trop = computeRawChart(eph, J2000, 17.385, 78.4867, { ...DEFAULT_SETTINGS, ayanamsha: "tropical" });
    const sid = computeRawChart(eph, J2000, 17.385, 78.4867, DEFAULT_SETTINGS);
    for (const b of sid.bodies) {
      const t = trop.bodies.find((x) => x.id === b.id)!;
      const diff = (((t.longitude - sid.ayanamshaDegrees - b.longitude) % 360) + 540) % 360 - 180;
      expect(Math.abs(diff)).toBeLessThan(1e-6);
    }
  });

  it("Ketu is exactly opposite Rahu and both are treated as retrograde", async () => {
    const eph = await initEphemeris(wasmPath);
    const raw = computeRawChart(eph, J2000, 17.385, 78.4867, DEFAULT_SETTINGS);
    const rahu = raw.bodies.find((b) => b.id === "rahu")!;
    const ketu = raw.bodies.find((b) => b.id === "ketu")!;
    expect(Math.abs(((ketu.longitude - rahu.longitude + 360) % 360) - 180)).toBeLessThan(1e-9);
    const chart = analyseChart(raw, "seventh_only");
    expect(chart.planets.find((p) => p.id === "rahu")!.retrograde).toBe(true);
  });

  it("whole-sign houses start at 0° of the Lagna sign", async () => {
    const eph = await initEphemeris(wasmPath);
    const raw = computeRawChart(eph, J2000, 17.385, 78.4867, DEFAULT_SETTINGS);
    expect(raw.cusps[0]).toBe(Math.floor(raw.ascendant / 30) * 30);
    expect(raw.cusps).toHaveLength(12);
  });

  it("records reproducibility metadata", async () => {
    const eph = await initEphemeris(wasmPath);
    const raw = computeRawChart(eph, J2000, 17.385, 78.4867, DEFAULT_SETTINGS);
    expect(raw.meta.engineVersion).toMatch(/^2\./);
    expect(raw.meta.ephemeris).toBe("moshier");
    expect(raw.meta.settings.ayanamsha).toBe("lahiri");
  });
});
