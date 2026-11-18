/**
 * Core Parashari analysis derived purely from calculated longitudes.
 * No interpretation text is generated here — only verifiable classical rules.
 */
import {
  COMBUSTION_ORBS,
  DUSTHANA,
  EXALTATION,
  KENDRA,
  MOOLATRIKONA,
  NAKSHATRA_LORD_SEQUENCE,
  NATURAL_RELATIONS,
  RASHIS,
  SAPTA_GRAHAS,
  SPECIAL_ASPECTS,
  TRIKONA,
  UPACHAYA,
  type GrahaId,
  type Relation,
  type SaptaGraha,
} from "./constants";
import type { BodyPosition, RawChart } from "./ephemeris";
import type { NodeAspectConvention } from "./settings";

export const NAKSHATRA_SPAN = 360 / 27; // 13°20'
export const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3°20'

export function signOf(longitude: number): number {
  return Math.floor((((longitude % 360) + 360) % 360) / 30);
}
export function degreeInSign(longitude: number): number {
  return (((longitude % 360) + 360) % 360) % 30;
}

export function nakshatraOf(longitude: number) {
  const lon = ((longitude % 360) + 360) % 360;
  const index = Math.floor(lon / NAKSHATRA_SPAN);
  const pada = Math.floor((lon - index * NAKSHATRA_SPAN) / PADA_SPAN) + 1;
  const lord = NAKSHATRA_LORD_SEQUENCE[index % 9]!;
  const traversed = (lon - index * NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  return { index, pada, lord, traversed };
}

/** Format a longitude as D°M'S" within its sign. */
export function formatDms(deg: number, withinSign = true): string {
  const v = withinSign ? degreeInSign(deg) : deg;
  const total = Math.round(v * 3600);
  const d = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″`;
}

export type Dignity =
  | "exalted"
  | "debilitated"
  | "moolatrikona"
  | "own"
  | "great_friend"
  | "friend"
  | "neutral"
  | "enemy"
  | "great_enemy"
  | "unclassified";

const isSapta = (g: GrahaId): g is SaptaGraha => (SAPTA_GRAHAS as GrahaId[]).includes(g);

/** Tatkalika (temporary) relation: planets in 2,3,4,10,11,12 from each other are friends. */
export function temporaryRelation(fromSign: number, toSign: number): "friend" | "enemy" {
  const h = ((toSign - fromSign + 12) % 12) + 1;
  return [2, 3, 4, 10, 11, 12].includes(h) ? "friend" : "enemy";
}

/** Panchadha (compound) relationship = natural + temporary (BPHS ch. 3). */
export function compoundRelation(natural: Relation, temporary: "friend" | "enemy") {
  if (natural === "friend") return temporary === "friend" ? "great_friend" : "neutral";
  if (natural === "enemy") return temporary === "friend" ? "neutral" : "great_enemy";
  return temporary === "friend" ? "friend" : "enemy";
}

export function dignityOf(planet: GrahaId, longitude: number, signsByPlanet: Partial<Record<GrahaId, number>>): Dignity {
  if (!isSapta(planet)) return "unclassified";
  const sign = signOf(longitude);
  const deg = degreeInSign(longitude);
  if (EXALTATION[planet].sign === sign) return "exalted";
  if ((EXALTATION[planet].sign + 6) % 12 === sign) return "debilitated";
  const mt = MOOLATRIKONA[planet];
  if (mt.sign === sign && deg >= mt.from && deg < mt.to) return "moolatrikona";
  const lord = RASHIS[sign]!.lord;
  if (lord === planet) return "own";
  const natural = NATURAL_RELATIONS[planet][lord] as Relation;
  const lordSign = signsByPlanet[lord];
  if (lordSign === undefined) return natural;
  return compoundRelation(natural, temporaryRelation(sign, lordSign));
}

export function isCombust(planet: GrahaId, lon: number, sunLon: number, retrograde: boolean): boolean {
  if (!isSapta(planet) || planet === "sun") return false;
  const orb = COMBUSTION_ORBS[planet];
  if (!orb) return false;
  const diff = Math.abs(((lon - sunLon + 540) % 360) - 180);
  return diff <= (retrograde ? orb.retro : orb.direct);
}

export function aspectedHouseOffsets(planet: GrahaId, nodeConvention: NodeAspectConvention): number[] {
  if ((planet === "rahu" || planet === "ketu") && nodeConvention === "fifth_seventh_ninth") return [5, 7, 9];
  return [7, ...(SPECIAL_ASPECTS[planet] ?? [])];
}

export interface PlanetAnalysis extends BodyPosition {
  sign: number;
  degreeInSign: number;
  house: number; // whole-sign house from Lagna
  nakshatra: number;
  pada: number;
  nakshatraLord: GrahaId;
  retrograde: boolean;
  combust: boolean;
  dignity: Dignity;
  signLord: SaptaGraha;
  ownedHouses: number[];
  aspectsHouses: number[];
}

export interface HouseAnalysis {
  house: number;
  sign: number;
  lord: SaptaGraha;
  cusp: number;
  occupants: GrahaId[];
  aspectedBy: GrahaId[];
  categories: ("kendra" | "trikona" | "dusthana" | "upachaya")[];
}

export interface ParashariChart {
  lagna: { longitude: number; sign: number; degreeInSign: number; nakshatra: number; pada: number; nakshatraLord: GrahaId; lord: SaptaGraha };
  planets: PlanetAnalysis[];
  houses: HouseAnalysis[];
  conjunctions: { sign: number; planets: GrahaId[] }[];
  parivartana: { a: SaptaGraha; b: SaptaGraha; signA: number; signB: number }[];
}

export function analyseChart(raw: RawChart, nodeConvention: NodeAspectConvention): ParashariChart {
  const lagnaSign = signOf(raw.ascendant);
  const houseOf = (sign: number) => ((sign - lagnaSign + 12) % 12) + 1;
  const signs: Partial<Record<GrahaId, number>> = {};
  for (const b of raw.bodies) signs[b.id] = signOf(b.longitude);
  const sun = raw.bodies.find((b) => b.id === "sun")!;

  const planets: PlanetAnalysis[] = raw.bodies.map((b) => {
    const sign = signOf(b.longitude);
    const nk = nakshatraOf(b.longitude);
    const retrograde = b.id === "rahu" || b.id === "ketu" ? true : b.speed < 0;
    const house = houseOf(sign);
    const ownedHouses = isSapta(b.id)
      ? RASHIS.map((r, i) => (r.lord === b.id ? houseOf(i) : 0)).filter((h) => h > 0).sort((a, c) => a - c)
      : [];
    const aspectsHouses = aspectedHouseOffsets(b.id, nodeConvention)
      .sort((x, y) => x - y)
      .map((off) => ((house - 1 + off - 1) % 12) + 1);
    return {
      ...b,
      sign,
      degreeInSign: degreeInSign(b.longitude),
      house,
      nakshatra: nk.index,
      pada: nk.pada,
      nakshatraLord: nk.lord,
      retrograde,
      combust: isCombust(b.id, b.longitude, sun.longitude, retrograde),
      dignity: dignityOf(b.id, b.longitude, signs),
      signLord: RASHIS[sign]!.lord,
      ownedHouses,
      aspectsHouses,
    };
  });

  const navagraha = planets.filter((p) => !["uranus", "neptune", "pluto"].includes(p.id));
  const houses: HouseAnalysis[] = Array.from({ length: 12 }, (_, i) => {
    const sign = (lagnaSign + i) % 12;
    const house = i + 1;
    const categories: HouseAnalysis["categories"] = [];
    if (KENDRA.includes(house)) categories.push("kendra");
    if (TRIKONA.includes(house)) categories.push("trikona");
    if (DUSTHANA.includes(house)) categories.push("dusthana");
    if (UPACHAYA.includes(house)) categories.push("upachaya");
    return {
      house,
      sign,
      lord: RASHIS[sign]!.lord,
      cusp: raw.cusps[i]!,
      occupants: navagraha.filter((p) => p.house === house).map((p) => p.id),
      aspectedBy: navagraha.filter((p) => p.aspectsHouses.includes(house)).map((p) => p.id),
      categories,
    };
  });

  const bySign = new Map<number, GrahaId[]>();
  for (const p of navagraha) bySign.set(p.sign, [...(bySign.get(p.sign) ?? []), p.id]);
  const conjunctions = [...bySign.entries()]
    .filter(([, ps]) => ps.length > 1)
    .map(([sign, ps]) => ({ sign, planets: ps }));

  const parivartana: ParashariChart["parivartana"] = [];
  for (let i = 0; i < SAPTA_GRAHAS.length; i++) {
    for (let j = i + 1; j < SAPTA_GRAHAS.length; j++) {
      const a = SAPTA_GRAHAS[i]!;
      const b = SAPTA_GRAHAS[j]!;
      const sa = signs[a]!;
      const sb = signs[b]!;
      if (RASHIS[sa]!.lord === b && RASHIS[sb]!.lord === a) parivartana.push({ a, b, signA: sa, signB: sb });
    }
  }

  const lnk = nakshatraOf(raw.ascendant);
  return {
    lagna: {
      longitude: raw.ascendant,
      sign: lagnaSign,
      degreeInSign: degreeInSign(raw.ascendant),
      nakshatra: lnk.index,
      pada: lnk.pada,
      nakshatraLord: lnk.lord,
      lord: RASHIS[lagnaSign]!.lord,
    },
    planets,
    houses,
    conjunctions,
    parivartana,
  };
}
