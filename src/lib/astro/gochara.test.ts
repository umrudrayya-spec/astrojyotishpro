// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { dateFromJd, grahaLongitudeAt, initEphemeris, jdFromDate } from "./ephemeris";
import { sadeSatiPeriods, saturnPhase, saturnPhases, signIngresses } from "./gochara";

const wasmPath = path.resolve(__dirname, "../../../node_modules/@swisseph/browser/dist/swisseph.wasm");
beforeAll(() => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const s = String(input);
    if (s.endsWith(".wasm")) return new Response(readFileSync(s), { headers: { "content-type": "application/wasm" } });
    return realFetch(input, init);
  }) as typeof fetch;
});

describe("Gochara", () => {
  it("phase by Saturn's house from the Moon", () => {
    expect(saturnPhase(0, 11)).toBe("sade_rising");
    expect(saturnPhase(0, 0)).toBe("sade_peak");
    expect(saturnPhase(0, 1)).toBe("sade_setting");
    expect(saturnPhase(0, 3)).toBe("kantaka");
    expect(saturnPhase(0, 7)).toBe("ashtama");
    expect(saturnPhase(0, 5)).toBeNull();
  });

  it("Saturn (Lahiri) entered sidereal Aquarius on 2023-01-17 and Pisces on 2025-03-29", async () => {
    const eph = await initEphemeris(wasmPath);
    const lon = (jd: number) => grahaLongitudeAt(eph, jd, "saturn", { ayanamsha: "lahiri", nodeType: "true" }).longitude;
    const ing = signIngresses(lon, jdFromDate(new Date("2022-06-01")), jdFromDate(new Date("2025-12-31")));
    const toAq = ing.filter((i) => i.toSign === 10).map((i) => dateFromJd(i.jd).toISOString().slice(0, 10));
    const toPi = ing.find((i) => i.toSign === 11)!;
    expect(toAq.at(-1)).toBe("2023-01-17");
    expect(dateFromJd(toPi.jd).toISOString().slice(0, 10)).toBe("2025-03-29");
  });

  it("Sade Sati for a Capricorn Moon covers 2020–2025 (Saturn in Sagittarius→Capricorn→Aquarius)", async () => {
    const eph = await initEphemeris(wasmPath);
    const lon = (jd: number) => grahaLongitudeAt(eph, jd, "saturn", { ayanamsha: "lahiri", nodeType: "true" }).longitude;
    const start = jdFromDate(new Date("2015-01-01"));
    const end = jdFromDate(new Date("2030-01-01"));
    const ing = signIngresses(lon, start, end);
    const spans = saturnPhases(9, Math.floor(lon(start) / 30), ing, start, end);
    const periods = sadeSatiPeriods(spans);
    const covers = (d: string) => periods.some((p) => p.start <= jdFromDate(new Date(d)) && jdFromDate(new Date(d)) <= p.end);
    expect(covers("2021-06-01")).toBe(true);
    expect(covers("2024-06-01")).toBe(true);
    expect(covers("2026-06-01")).toBe(false);
    expect(periods).toHaveLength(1); // retrograde back-and-forth stays one Sade Sati
  });
});
