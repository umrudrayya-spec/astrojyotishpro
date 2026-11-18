/**
 * Further Parashari house/planet rules: dispositors, natural and functional nature,
 * Maraka, Badhaka and Arudha Padas. Pure rules on calculated signs.
 */
import { RASHIS, SAPTA_GRAHAS, type GrahaId, type SaptaGraha } from "./constants";
import { signOf } from "./parashari";

const houseFrom = (fromSign: number, sign: number) => ((sign - fromSign + 12) % 12) + 1;
const signAt = (fromSign: number, house: number) => (fromSign + house - 1) % 12;

/** Houses (from Lagna, whole sign) owned by each of the seven planets. */
export function ownedHouses(lagnaSign: number): Record<SaptaGraha, number[]> {
  const out = Object.fromEntries(SAPTA_GRAHAS.map((g) => [g, [] as number[]])) as Record<SaptaGraha, number[]>;
  RASHIS.forEach((r, i) => out[r.lord].push(houseFrom(lagnaSign, i)));
  for (const g of SAPTA_GRAHAS) out[g].sort((a, b) => a - b);
  return out;
}

export type FunctionalNature = "yogakaraka" | "benefic" | "mixed" | "neutral" | "malefic";

/**
 * Functional nature for the Lagna (BPHS ch. 34, summarised rule set v1):
 * - Lagna lord: benefic. Lord of a Kendra (4, 7, 10) and a Trikona (5, 9): Yogakaraka.
 * - Trikona (5, 9) lord: benefic; mixed if it also owns 3, 6, 8 or 11.
 * - Lord of 3, 6, 8 or 11 (without Lagna/Trikona): malefic.
 * - Lords of Kendras only, or of 2/12: neutral (Kendradhipati / association-dependent).
 */
export function functionalNature(lagnaSign: number): Record<SaptaGraha, { nature: FunctionalNature; houses: number[] }> {
  const owned = ownedHouses(lagnaSign);
  const result = {} as Record<SaptaGraha, { nature: FunctionalNature; houses: number[] }>;
  for (const g of SAPTA_GRAHAS) {
    const h = owned[g];
    const has = (...xs: number[]) => xs.some((x) => h.includes(x));
    let nature: FunctionalNature;
    if (has(1)) nature = "benefic";
    else if (has(4, 7, 10) && has(5, 9)) nature = "yogakaraka";
    else if (has(5, 9)) nature = has(3, 6, 8, 11) ? "mixed" : "benefic";
    else if (has(3, 6, 8, 11)) nature = "malefic";
    else nature = "neutral";
    result[g] = { nature, houses: h };
  }
  return result;
}

export type NaturalNature = "benefic" | "malefic";

/**
 * Natural (Naisargika) nature. Jupiter, Venus: benefic. Sun, Mars, Saturn, Rahu, Ketu: malefic.
 * Moon: benefic in Shukla Paksha (0–180° ahead of the Sun), malefic in Krishna Paksha.
 * Mercury: benefic unless sharing a sign with a natural malefic.
 */
export function naturalNature(
  planet: GrahaId,
  longitudes: Partial<Record<GrahaId, number>>,
): NaturalNature | null {
  if (planet === "jupiter" || planet === "venus") return "benefic";
  if (["sun", "mars", "saturn", "rahu", "ketu"].includes(planet)) return "malefic";
  if (planet === "moon") {
    const el = (((longitudes.moon ?? 0) - (longitudes.sun ?? 0)) % 360 + 360) % 360;
    return el < 180 ? "benefic" : "malefic";
  }
  if (planet === "mercury") {
    const s = signOf(longitudes.mercury ?? 0);
    const withMalefic = (["sun", "mars", "saturn", "rahu", "ketu"] as GrahaId[]).some(
      (m) => longitudes[m] !== undefined && signOf(longitudes[m]!) === s,
    );
    return withMalefic ? "malefic" : "benefic";
  }
  return null; // Uranus/Neptune/Pluto are not classified in Jyotisha.
}

/** Dispositor chain: follow sign lords until a planet in its own sign or a repeat. */
export function dispositorChain(planet: GrahaId, signs: Partial<Record<GrahaId, number>>): GrahaId[] {
  const chain: GrahaId[] = [planet];
  let cur: GrahaId = planet;
  for (let i = 0; i < 9; i++) {
    const s = signs[cur];
    if (s === undefined) break;
    const lord = RASHIS[s]!.lord;
    if (lord === cur || chain.includes(lord)) {
      if (lord !== cur) chain.push(lord);
      break;
    }
    chain.push(lord);
    cur = lord;
  }
  return chain;
}

/** Final dispositor: a planet in its own sign that rules every chain; null if chains end in a loop. */
export function finalDispositor(signs: Partial<Record<GrahaId, number>>): SaptaGraha | null {
  let found: SaptaGraha | null = null;
  for (const g of SAPTA_GRAHAS) {
    const chain = dispositorChain(g, signs);
    const last = chain[chain.length - 1] as SaptaGraha;
    const inOwn = signs[last] !== undefined && RASHIS[signs[last]!]!.lord === last;
    if (!inOwn) return null;
    if (found && found !== last) return null;
    found = last;
  }
  return found;
}

/** Maraka lords: lords of the 2nd and 7th houses. */
export function marakaLords(lagnaSign: number): { house: number; lord: SaptaGraha }[] {
  return [2, 7].map((house) => ({ house, lord: RASHIS[signAt(lagnaSign, house)]!.lord }));
}

/** Badhaka: movable Lagna → 11th, fixed → 9th, dual → 7th house and its lord. */
export function badhaka(lagnaSign: number): { house: number; sign: number; lord: SaptaGraha } {
  const house = [11, 9, 7][lagnaSign % 3]!;
  const sign = signAt(lagnaSign, house);
  return { house, sign, lord: RASHIS[sign]!.lord };
}

/**
 * Arudha Pada of a house (BPHS ch. 29): count from the house to its lord, then the same
 * count again from the lord. If the result falls in the 1st or 7th from the house, take the
 * 10th from the result. Scorpio and Aquarius use their classical lords (Mars, Saturn).
 */
export function arudhaPada(houseSign: number, signs: Partial<Record<GrahaId, number>>): number {
  const lord = RASHIS[houseSign]!.lord;
  const lordSign = signs[lord]!;
  const n = houseFrom(houseSign, lordSign);
  let pada = signAt(lordSign, n);
  const rel = houseFrom(houseSign, pada);
  if (rel === 1 || rel === 7) pada = signAt(pada, 10);
  return pada;
}

/** All twelve Arudha Padas (A1 = Arudha Lagna … A12 = Upapada). Index 0 = A1. */
export function arudhaPadas(lagnaSign: number, signs: Partial<Record<GrahaId, number>>): number[] {
  return Array.from({ length: 12 }, (_, i) => arudhaPada(signAt(lagnaSign, i + 1), signs));
}
