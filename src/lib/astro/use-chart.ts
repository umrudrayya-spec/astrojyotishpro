import { useEffect, useMemo, useState } from "react";
import wasmUrl from "@swisseph/browser/dist/swisseph.wasm?url";
import { computeRawChart, initEphemeris, type RawChart } from "./ephemeris";
import { analyseChart, type ParashariChart } from "./parashari";
import type { CalcSettings } from "./settings";

type Eph = Awaited<ReturnType<typeof initEphemeris>>;

/** Load the Swiss Ephemeris WASM in the browser (once per page). */
export function useEphemeris(loadSwissFiles = false) {
  const [eph, setEph] = useState<Eph | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    initEphemeris(wasmUrl, loadSwissFiles)
      .then((e) => alive && setEph(e))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      alive = false;
    };
  }, [loadSwissFiles]);
  return { eph, error };
}

export function useChart(
  input: { utc: Date; latitude: number; longitude: number } | null,
  settings: CalcSettings,
): { raw: RawChart | null; chart: ParashariChart | null; error: string | null } {
  const { eph, error } = useEphemeris();
  const key = input ? `${input.utc.getTime()}|${input.latitude}|${input.longitude}` : "";
  return useMemo(() => {
    if (!eph || !input) return { raw: null, chart: null, error };
    try {
      const raw = computeRawChart(eph, input.utc, input.latitude, input.longitude, settings);
      return { raw, chart: analyseChart(raw, settings.nodeAspects), error: null };
    } catch (e) {
      return { raw: null, chart: null, error: e instanceof Error ? e.message : String(e) };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eph, key, settings.ayanamsha, settings.nodeType, settings.houseSystem, settings.nodeAspects, error]);
}
