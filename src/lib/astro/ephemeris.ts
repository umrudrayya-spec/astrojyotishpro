/**
 * Astronomical engine: thin, deterministic wrapper around Swiss Ephemeris (WASM build).
 * All planetary positions in the app come from here — never from AI or hardcoded values.
 */
import type { SwissEphemeris as SweType } from "@swisseph/browser";
import type { GrahaId } from "./constants";
import { AYANAMSHAS, type CalcSettings, type HouseSystemId } from "./settings";

export type EphemerisSource = "moshier" | "swiss_files";

export interface BodyPosition {
  id: GrahaId;
  /** Ecliptic longitude in the selected zodiac (sidereal unless ayanamsha = tropical), 0–360. */
  longitude: number;
  latitude: number;
  /** Degrees per day; negative = retrograde. */
  speed: number;
  distanceAu: number;
  declination: number;
}

export interface RawChart {
  jdUt: number;
  ayanamshaDegrees: number;
  ascendant: number;
  mc: number;
  /** 12 house cusps (index 0 = house 1) in the selected zodiac, for the selected house system. */
  cusps: number[];
  bodies: BodyPosition[];
  meta: {
    engine: string;
    engineVersion: string;
    ephemeris: EphemerisSource;
    settings: CalcSettings;
    algorithmVersion: string;
    computedAt: string;
  };
}

export const ALGORITHM_VERSION = "astro-core-1.3.0";

const PLANET_CODES: Record<Exclude<GrahaId, "rahu" | "ketu">, number> = {
  sun: 0,
  moon: 1,
  mercury: 2,
  venus: 3,
  mars: 4,
  jupiter: 5,
  saturn: 6,
  uranus: 7,
  neptune: 8,
  pluto: 9,
};
const MEAN_NODE = 10;
const TRUE_NODE = 11;

const FLAG_MOSHIER = 4;
const FLAG_SWISS = 2;
const FLAG_SPEED = 256;
const FLAG_EQUATORIAL = 2048;
const FLAG_SIDEREAL = 65536;

const HOUSE_CODES: Record<Exclude<HouseSystemId, "whole_sign">, string> = {
  equal: "A",
  placidus: "P",
  sripati: "O",
};

export const norm360 = (x: number) => ((x % 360) + 360) % 360;

let instance: Promise<{ swe: SweType; source: EphemerisSource }> | null = null;

/**
 * Initialise Swiss Ephemeris once per page. `wasmUrl` must point at swisseph.wasm.
 * When `loadSwissFiles` is true, the official .se1 data files are downloaded for maximum
 * precision; on failure the built-in Moshier ephemeris is used and recorded in metadata.
 */
export function initEphemeris(wasmUrl: string, loadSwissFiles = false) {
  if (!instance) {
    instance = (async () => {
      const mod = await import("@swisseph/browser");
      const swe = new mod.SwissEphemeris();
      await swe.init(wasmUrl);
      let source: EphemerisSource = "moshier";
      if (loadSwissFiles) {
        try {
          await swe.loadStandardEphemeris();
          source = "swiss_files";
        } catch (e) {
          console.warn("Swiss Ephemeris data files unavailable; using built-in Moshier", e);
        }
      }
      return { swe, source };
    })();
    instance.catch(() => {
      instance = null;
    });
  }
  return instance;
}

export function computeRawChart(
  eph: { swe: SweType; source: EphemerisSource },
  utc: Date,
  latitude: number,
  longitude: number,
  settings: CalcSettings,
): RawChart {
  const { swe, source } = eph;
  const baseFlag = source === "swiss_files" ? FLAG_SWISS : FLAG_MOSHIER;
  const ayan = AYANAMSHAS[settings.ayanamsha];
  const sidereal = ayan.sidm !== null;

  const hours =
    utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600 + utc.getUTCMilliseconds() / 3_600_000;
  const jdUt = swe.julianDay(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), hours);

  let ayanamshaDegrees = 0;
  if (sidereal) {
    swe.setSiderealMode(ayan.sidm as number);
    ayanamshaDegrees = swe.getAyanamsaExUt(jdUt, baseFlag);
  }
  const posFlag = baseFlag | FLAG_SPEED | (sidereal ? FLAG_SIDEREAL : 0);

  const bodies: BodyPosition[] = [];
  const calc = (id: GrahaId, code: number) => {
    const p = swe.calculatePosition(jdUt, code, posFlag);
    const eq = swe.calculatePosition(jdUt, code, baseFlag | FLAG_EQUATORIAL);
    bodies.push({
      id,
      longitude: norm360(p.longitude),
      latitude: p.latitude,
      speed: p.longitudeSpeed,
      distanceAu: p.distance,
      declination: eq.latitude,
    });
  };
  for (const [id, code] of Object.entries(PLANET_CODES) as [GrahaId, number][]) calc(id, code);
  calc("rahu", settings.nodeType === "true" ? TRUE_NODE : MEAN_NODE);
  const rahu = bodies[bodies.length - 1]!;
  bodies.push({
    id: "ketu",
    longitude: norm360(rahu.longitude + 180),
    latitude: -rahu.latitude,
    speed: rahu.speed,
    distanceAu: rahu.distanceAu,
    declination: -rahu.declination,
  });

  // Houses are computed tropically then shifted by the ayanamsha.
  const h = swe.calculateHouses(
    jdUt,
    latitude,
    longitude,
    (settings.houseSystem === "whole_sign" ? "P" : HOUSE_CODES[settings.houseSystem]) as never,
  );
  const ascendant = norm360(h.ascendant - ayanamshaDegrees);
  const mc = norm360(h.mc - ayanamshaDegrees);
  let cusps: number[];
  if (settings.houseSystem === "whole_sign") {
    const lagnaSign = Math.floor(ascendant / 30);
    cusps = Array.from({ length: 12 }, (_, i) => ((lagnaSign + i) % 12) * 30);
  } else {
    cusps = h.cusps.slice(1, 13).map((c) => norm360(c - ayanamshaDegrees));
  }

  return {
    jdUt,
    ayanamshaDegrees,
    ascendant,
    mc,
    cusps,
    bodies,
    meta: {
      engine: "Swiss Ephemeris (WASM)",
      engineVersion: swe.version(),
      ephemeris: source,
      settings,
      algorithmVersion: ALGORITHM_VERSION,
      computedAt: new Date().toISOString(),
    },
  };
}

// ---------------------------------------------------------------------------
// Lightweight helpers for time-series work (Panchanga, transits). Same engine, same flags.

const DAY_MS = 86_400_000;
export const jdFromDate = (d: Date) => d.getTime() / DAY_MS + 2440587.5;
export const dateFromJd = (jd: number) => new Date(Math.round((jd - 2440587.5) * DAY_MS));

/** Sidereal (or tropical, if the ayanamsha is "tropical") longitudes of the Sun and Moon at jdUt. */
export function sunMoonAt(
  eph: { swe: SweType; source: EphemerisSource },
  jdUt: number,
  ayanamsha: CalcSettings["ayanamsha"],
): { sun: number; moon: number; ayanamsha: number } {
  const { swe, source } = eph;
  const baseFlag = source === "swiss_files" ? FLAG_SWISS : FLAG_MOSHIER;
  const ayan = AYANAMSHAS[ayanamsha];
  const sidereal = ayan.sidm !== null;
  if (sidereal) swe.setSiderealMode(ayan.sidm as number);
  const flag = baseFlag | (sidereal ? FLAG_SIDEREAL : 0);
  return {
    sun: norm360(swe.calculatePosition(jdUt, 0, flag).longitude),
    moon: norm360(swe.calculatePosition(jdUt, 1, flag).longitude),
    ayanamsha: sidereal ? swe.getAyanamsaExUt(jdUt, baseFlag) : 0,
  };
}

/** Sidereal longitude of any graha at jdUt (used for transits). */
export function grahaLongitudeAt(
  eph: { swe: SweType; source: EphemerisSource },
  jdUt: number,
  id: Exclude<GrahaId, "ketu">,
  settings: Pick<CalcSettings, "ayanamsha" | "nodeType">,
): { longitude: number; speed: number } {
  const { swe, source } = eph;
  const baseFlag = source === "swiss_files" ? FLAG_SWISS : FLAG_MOSHIER;
  const ayan = AYANAMSHAS[settings.ayanamsha];
  const sidereal = ayan.sidm !== null;
  if (sidereal) swe.setSiderealMode(ayan.sidm as number);
  const code = id === "rahu" ? (settings.nodeType === "true" ? TRUE_NODE : MEAN_NODE) : PLANET_CODES[id];
  const p = swe.calculatePosition(jdUt, code, baseFlag | FLAG_SPEED | (sidereal ? FLAG_SIDEREAL : 0));
  return { longitude: norm360(p.longitude), speed: p.longitudeSpeed };
}

/** Geometric altitude (degrees, no refraction) of the Sun's centre at jdUt for a place. */
export function sunAltitude(eph: { swe: SweType; source: EphemerisSource }, jdUt: number, latitude: number, longitude: number): number {
  const { swe, source } = eph;
  const baseFlag = source === "swiss_files" ? FLAG_SWISS : FLAG_MOSHIER;
  const eq = swe.calculatePosition(jdUt, 0, baseFlag | FLAG_EQUATORIAL);
  const rad = Math.PI / 180;
  const lst = norm360(swe.siderealTime(jdUt) * 15 + longitude);
  const H = (lst - eq.longitude) * rad;
  const phi = latitude * rad;
  const dec = eq.latitude * rad;
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) / rad;
}
