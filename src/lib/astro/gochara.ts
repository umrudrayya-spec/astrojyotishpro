/**
 * Gochara (transits): sign ingresses, Sade Sati and Saturn's 4th/8th (Dhaiya) from the natal Moon.
 * Pure: the longitude function is injected (ephemeris.ts → grahaLongitudeAt).
 */
import type { GrahaId } from "./constants";

export interface Ingress {
  jd: number;
  fromSign: number;
  toSign: number;
}

/** All sign changes of a body between startJd and endJd (retrograde re-entries included). */
export function signIngresses(lonAt: (jd: number) => number, startJd: number, endJd: number, stepDays = 5): Ingress[] {
  const sign = (jd: number) => Math.floor((((lonAt(jd) % 360) + 360) % 360) / 30);
  const out: Ingress[] = [];
  let a = startJd;
  let sa = sign(a);
  for (let t = startJd + stepDays; t <= endJd + stepDays; t += stepDays) {
    const tt = Math.min(t, endJd);
    const st = sign(tt);
    if (st !== sa) {
      let lo = a;
      let hi = tt;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (sign(mid) === sa) lo = mid;
        else hi = mid;
      }
      out.push({ jd: hi, fromSign: sa, toSign: st });
      sa = st;
    }
    a = tt;
    if (tt >= endJd) break;
  }
  return out;
}

export type SaturnPhase = "sade_rising" | "sade_peak" | "sade_setting" | "kantaka" | "ashtama";

/** Phase of Saturn by its house from the natal Moon sign, or null. */
export function saturnPhase(moonSign: number, saturnSign: number): SaturnPhase | null {
  const h = ((saturnSign - moonSign + 12) % 12) + 1;
  return h === 12 ? "sade_rising" : h === 1 ? "sade_peak" : h === 2 ? "sade_setting" : h === 4 ? "kantaka" : h === 8 ? "ashtama" : null;
}

export interface PhaseSpan {
  phase: SaturnPhase;
  start: number;
  end: number;
}

/** Saturn phases between startJd and endJd from its sign at startJd and its ingresses. */
export function saturnPhases(moonSign: number, saturnSignAtStart: number, ingresses: Ingress[], startJd: number, endJd: number): PhaseSpan[] {
  const spans: PhaseSpan[] = [];
  let cur = saturnSignAtStart;
  let from = startJd;
  const close = (to: number) => {
    const ph = saturnPhase(moonSign, cur);
    if (ph) spans.push({ phase: ph, start: from, end: to });
  };
  for (const ing of ingresses) {
    close(ing.jd);
    cur = ing.toSign;
    from = ing.jd;
  }
  close(endJd);
  return spans;
}

/**
 * Merge 12th→1st→2nd spans into whole Sade Sati periods. Retrograde dips back to the 11th or on to the
 * 3rd leave short gaps; gaps under `maxGapDays` (default 900 ≈ 2.5 y) belong to the same Sade Sati.
 */
export function sadeSatiPeriods(spans: PhaseSpan[], maxGapDays = 900): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = [];
  for (const s of spans) {
    if (!s.phase.startsWith("sade")) continue;
    const last = out[out.length - 1];
    if (last && s.start - last.end < maxGapDays) last.end = s.end;
    else out.push({ start: s.start, end: s.end });
  }
  return out;
}

export const TRANSIT_GRAHAS: Exclude<GrahaId, "ketu" | "uranus" | "neptune" | "pluto">[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "rahu",
];
