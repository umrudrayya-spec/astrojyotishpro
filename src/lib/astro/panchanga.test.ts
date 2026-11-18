// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { dateFromJd, initEphemeris, jdFromDate, sunAltitude, sunMoonAt } from "./ephemeris";
import { choghadiyaSequence, computePanchanga, horaLords, karanaOf, type PanchangaAstro } from "./panchanga";

const wasmPath = path.resolve(__dirname, "../../../node_modules/@swisseph/browser/dist/swisseph.wasm");
beforeAll(() => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const s = String(input);
    if (s.endsWith(".wasm")) return new Response(readFileSync(s), { headers: { "content-type": "application/wasm" } });
    return realFetch(input, init);
  }) as typeof fetch;
});

const IST = 330;
const istHm = (jd: number) => {
  const d = new Date(dateFromJd(jd).getTime() + IST * 60000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

describe("Panchanga rules", () => {
  it("karana cycle: 0 Kimstughna, 1 Bava, 8 Bava again, 57–59 fixed", () => {
    expect(karanaOf(0)).toBe("kimstughna");
    expect(karanaOf(1)).toBe("bava");
    expect(karanaOf(8)).toBe("bava");
    expect(karanaOf(7)).toBe("vishti");
    expect([karanaOf(57), karanaOf(58), karanaOf(59)]).toEqual(["shakuni", "chatushpada", "naga"]);
  });
  it("Sunday choghadiya starts Udveg by day and Shubh by night; 8th repeats the 1st", () => {
    const d = choghadiyaSequence(0, false);
    expect(d[0]).toBe("udveg");
    expect(d[7]).toBe(d[0]);
    expect(choghadiyaSequence(0, true)[0]).toBe("shubh");
    expect(choghadiyaSequence(1, false)[0]).toBe("amrit");
  });
  it("first hora is the weekday lord; Sunday's 2nd hora is Venus", () => {
    expect(horaLords(0).slice(0, 3)).toEqual(["sun", "venus", "mercury"]);
    expect(horaLords(6)[0]).toBe("saturn");
  });
});

describe("Panchanga with Swiss Ephemeris", () => {
  it("Ugadi 2024-04-09, Hyderabad: Shukla Pratipada and Revati at sunrise, sunrise ≈ 06:05 IST, Tuesday Rahu Kalam ≈ 15:15", async () => {
    const eph = await initEphemeris(wasmPath);
    const astro: PanchangaAstro = {
      sunMoon: (jd) => sunMoonAt(eph, jd, "lahiri"),
      sunAltitude: (jd) => sunAltitude(eph, jd, 17.385, 78.4867),
    };
    const midnight = jdFromDate(new Date(Date.UTC(2024, 3, 9) - IST * 60000));
    const p = computePanchanga(astro, midnight, 2);
    expect(p.sunrise).not.toBeNull();
    const rise = istHm(p.sunrise!);
    expect(rise).toBeGreaterThanOrEqual(6 * 60);
    expect(rise).toBeLessThanOrEqual(6 * 60 + 10);
    expect(p.tithi.index).toBe(0);
    expect(p.paksha).toBe("shukla");
    expect(p.nakshatra.index).toBe(26);
    const rk = istHm(p.rahuKalam!.start);
    expect(rk).toBeGreaterThan(15 * 60);
    expect(rk).toBeLessThan(15 * 60 + 30);
    expect(p.horas).toHaveLength(24);
    expect(p.horas[0]!.lord).toBe("mars");
    expect(p.tithi.endsAt).toBeGreaterThan(p.sunrise!);
  });
});
