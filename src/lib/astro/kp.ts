/**
 * Krishnamurti Paddhati (KP) engine. Pure arithmetic on sidereal longitudes and Placidus cusps
 * supplied by the ephemeris layer — never invents positions.
 *
 * - Each nakshatra (13°20′) is split into 9 subs proportional to Vimshottari years, starting from
 *   the nakshatra lord; each sub is split again the same way (sub-sub), starting from the sub lord.
 * - Subs that cross a sign boundary are split there, giving the classical 249-division table.
 * - Significators per house use the standard 4-level scheme:
 *   L1 planets in the star of occupants, L2 occupants, L3 planets in the star of the cusp's sign lord,
 *   L4 the sign lord itself.
 */
import { NAKSHATRA_LORD_SEQUENCE, NAVAGRAHAS, RASHIS, type GrahaId } from "./constants";
import { VIMSHOTTARI_TOTAL, VIMSHOTTARI_YEARS } from "./dasha";
import { norm360 } from "./ephemeris";
import { NAKSHATRA_SPAN } from "./parashari";

export interface KpLords {
  sign: number;
  signLord: GrahaId;
  nakshatra: number;
  starLord: GrahaId;
  subLord: GrahaId;
  subSubLord: GrahaId;
}

const EPS = 1e-9;

/** Split a span into 9 Vimshottari parts starting from `startLord`; returns the part containing `offset`. */
function splitVimshottari(span: number, startLord: GrahaId, offset: number) {
  const start = NAKSHATRA_LORD_SEQUENCE.indexOf(startLord);
  let acc = 0;
  for (let i = 0; i < 9; i++) {
    const lord = NAKSHATRA_LORD_SEQUENCE[(start + i) % 9]!;
    const len = (span * VIMSHOTTARI_YEARS[lord]!) / VIMSHOTTARI_TOTAL;
    if (offset < acc + len - EPS || i === 8) return { lord, from: acc, len };
    acc += len;
  }
  throw new Error("unreachable");
}

export function kpLords(longitude: number): KpLords {
  const lon = norm360(longitude);
  const sign = Math.floor(lon / 30);
  const nakshatra = Math.min(26, Math.floor((lon + EPS) / NAKSHATRA_SPAN));
  const starLord = NAKSHATRA_LORD_SEQUENCE[nakshatra % 9]!;
  const inNak = lon - nakshatra * NAKSHATRA_SPAN;
  const sub = splitVimshottari(NAKSHATRA_SPAN, starLord, inNak);
  const subSub = splitVimshottari(sub.len, sub.lord, inNak - sub.from);
  return { sign, signLord: RASHIS[sign]!.lord, nakshatra, starLord, subLord: sub.lord, subSubLord: subSub.lord };
}

export interface KpSubDivision {
  index: number; // 1–249
  from: number;
  to: number;
  signLord: GrahaId;
  starLord: GrahaId;
  subLord: GrahaId;
}

/** The classical 249 sub divisions of the zodiac (used e.g. for KP horary numbers 1–249). */
export function kpSubTable(): KpSubDivision[] {
  const out: KpSubDivision[] = [];
  for (let n = 0; n < 27; n++) {
    const starLord = NAKSHATRA_LORD_SEQUENCE[n % 9]!;
    const start = NAKSHATRA_LORD_SEQUENCE.indexOf(starLord);
    let cursor = n * NAKSHATRA_SPAN;
    for (let i = 0; i < 9; i++) {
      const subLord = NAKSHATRA_LORD_SEQUENCE[(start + i) % 9]!;
      const end = cursor + (NAKSHATRA_SPAN * VIMSHOTTARI_YEARS[subLord]!) / VIMSHOTTARI_TOTAL;
      const boundary = (Math.floor(cursor / 30 + EPS) + 1) * 30;
      const pieces = boundary < end - EPS && boundary > cursor + EPS ? [[cursor, boundary], [boundary, end]] : [[cursor, end]];
      for (const [a, b] of pieces) {
        const sign = Math.floor((a! + EPS) / 30) % 12;
        out.push({ index: out.length + 1, from: a!, to: b!, signLord: RASHIS[sign]!.lord, starLord, subLord });
      }
      cursor = end;
    }
  }
  return out;
}

/** House (1–12) containing a longitude, given 12 cusp longitudes (cusp n begins house n). */
export function houseOfLongitude(longitude: number, cusps: number[]): number {
  const lon = norm360(longitude);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i]!;
    const b = cusps[(i + 1) % 12]!;
    const span = norm360(b - a);
    if (norm360(lon - a) < span) return i + 1;
  }
  return 1;
}

export interface KpPlanetRow extends KpLords {
  planet: GrahaId;
  longitude: number;
  house: number;
}
export interface KpCuspRow extends KpLords {
  house: number;
  longitude: number;
}
export interface KpSignificators {
  house: number;
  /** L1: planets in the star of occupants. */
  l1: GrahaId[];
  /** L2: occupants. */
  l2: GrahaId[];
  /** L3: planets in the star of the cusp sign lord. */
  l3: GrahaId[];
  /** L4: cusp sign lord. */
  l4: GrahaId[];
}

export interface KpAnalysis {
  planets: KpPlanetRow[];
  cusps: KpCuspRow[];
  significators: KpSignificators[];
  /** For each planet, the houses it signifies (union over all 4 levels), ascending. */
  planetHouses: Record<GrahaId, number[]>;
}

export function analyseKp(longitudes: Partial<Record<GrahaId, number>>, cusps: number[]): KpAnalysis {
  const grahas = NAVAGRAHAS.filter((g) => longitudes[g] !== undefined);
  const planets: KpPlanetRow[] = grahas.map((g) => ({
    planet: g,
    longitude: longitudes[g]!,
    house: houseOfLongitude(longitudes[g]!, cusps),
    ...kpLords(longitudes[g]!),
  }));
  const cuspRows: KpCuspRow[] = cusps.map((c, i) => ({ house: i + 1, longitude: c, ...kpLords(c) }));
  const inStarOf = (lords: GrahaId[]) => planets.filter((p) => lords.includes(p.starLord)).map((p) => p.planet);
  const significators: KpSignificators[] = cuspRows.map((c) => {
    const occupants = planets.filter((p) => p.house === c.house).map((p) => p.planet);
    return {
      house: c.house,
      l1: inStarOf(occupants),
      l2: occupants,
      l3: inStarOf([c.signLord]),
      l4: [c.signLord],
    };
  });
  const planetHouses = Object.fromEntries(grahas.map((g) => [g, [] as number[]])) as Record<GrahaId, number[]>;
  for (const s of significators)
    for (const g of new Set([...s.l1, ...s.l2, ...s.l3, ...s.l4])) if (planetHouses[g] && !planetHouses[g].includes(s.house)) planetHouses[g].push(s.house);
  for (const g of grahas) planetHouses[g].sort((a, b) => a - b);
  return { planets, cusps: cuspRows, significators, planetHouses };
}
