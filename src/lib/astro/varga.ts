/**
 * Divisional chart (Varga) engine.
 * Each varga uses its own traditional sign-assignment rule (BPHS ch. 6 for the Shodashavarga;
 * later standard conventions for D5, D6, D8, D11) — never one generic multiplication formula.
 */
import { signOf, degreeInSign } from "./parashari";

export type VargaId =
  | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8" | "D9" | "D10" | "D11" | "D12"
  | "D16" | "D20" | "D24" | "D27" | "D30" | "D40" | "D45" | "D60";

type Modality = "movable" | "fixed" | "dual";
const modality = (sign: number): Modality => (["movable", "fixed", "dual"] as const)[sign % 3]!;
/** Aries (index 0) is an odd sign. */
const isOdd = (sign: number) => sign % 2 === 0;
const from = (start: number, n: number) => (((start + n) % 12) + 12) % 12;

interface VargaRule {
  id: VargaId;
  division: number;
  te: string;
  en: string;
  area: { te: string; en: string };
  source: "BPHS" | "later";
  method: { te: string; en: string };
  /** Returns the varga sign and the part index for a sidereal longitude. */
  assign: (sign: number, deg: number) => { sign: number; part: number; partStart: number; partSize: number };
}

/** Helper for equal divisions where the first part starts at `start(sign)` and counts forward. */
const equal = (n: number, start: (sign: number) => number) => (sign: number, deg: number) => {
  const size = 30 / n;
  const part = Math.min(n - 1, Math.floor(deg / size));
  return { sign: from(start(sign), part), part, partStart: part * size, partSize: size };
};

const byModality = (m: number, f: number, d: number) => (sign: number) =>
  ({ movable: m, fixed: f, dual: d })[modality(sign)];

export const VARGAS: VargaRule[] = [
  {
    id: "D1", division: 1, te: "రాశి", en: "Rashi", source: "BPHS",
    area: { te: "సమగ్ర జీవితం", en: "Overall life" },
    method: { te: "గ్రహం ఉన్న రాశే.", en: "The sign the planet occupies." },
    assign: (sign) => ({ sign, part: 0, partStart: 0, partSize: 30 }),
  },
  {
    id: "D2", division: 2, te: "హోర", en: "Hora", source: "BPHS",
    area: { te: "ధనం", en: "Wealth" },
    method: {
      te: "బేసి రాశిలో 0–15° సూర్య హోర (సింహం), 15–30° చంద్ర హోర (కర్కాటకం); సరి రాశిలో వ్యతిరేకం.",
      en: "Odd sign: 0–15° Sun's hora (Leo), 15–30° Moon's hora (Cancer); even sign: reversed.",
    },
    assign: (sign, deg) => {
      const part = deg < 15 ? 0 : 1;
      const sunFirst = isOdd(sign);
      const s = (part === 0) === sunFirst ? 4 : 3;
      return { sign: s, part, partStart: part * 15, partSize: 15 };
    },
  },
  {
    id: "D3", division: 3, te: "ద్రేక్కాణం", en: "Drekkana", source: "BPHS",
    area: { te: "తోబుట్టువులు, ధైర్యం", en: "Siblings and courage" },
    method: { te: "10° భాగాలు: అదే రాశి, 5వ రాశి, 9వ రాశి (పరాశర).", en: "10° parts: same sign, 5th, 9th from it (Parashara)." },
    assign: (sign, deg) => {
      const part = Math.min(2, Math.floor(deg / 10));
      return { sign: from(sign, [0, 4, 8][part]!), part, partStart: part * 10, partSize: 10 };
    },
  },
  {
    id: "D4", division: 4, te: "చతుర్థాంశ", en: "Chaturthamsha", source: "BPHS",
    area: { te: "ఆస్తి, భాగ్యం", en: "Property and fortune" },
    method: { te: "7°30′ భాగాలు: అదే రాశి, 4వ, 7వ, 10వ రాశులు.", en: "7°30′ parts: same sign, 4th, 7th, 10th from it." },
    assign: (sign, deg) => {
      const part = Math.min(3, Math.floor(deg / 7.5));
      return { sign: from(sign, part * 3), part, partStart: part * 7.5, partSize: 7.5 };
    },
  },
  {
    id: "D5", division: 5, te: "పంచాంశ", en: "Panchamsha", source: "later",
    area: { te: "పూర్వ పుణ్యం, కీర్తి", en: "Merit and fame" },
    method: {
      te: "6° భాగాలు. బేసి రాశి: మేష, కుంభ, ధను, మిథున, తుల; సరి రాశి: వృషభ, కన్య, మీన, మకర, వృశ్చిక (షోడశవర్గలో లేదు — తర్వాతి సంప్రదాయం).",
      en: "6° parts. Odd signs: Aries, Aquarius, Sagittarius, Gemini, Libra; even signs: Taurus, Virgo, Pisces, Capricorn, Scorpio (not in BPHS Shodashavarga — later convention).",
    },
    assign: (sign, deg) => {
      const part = Math.min(4, Math.floor(deg / 6));
      const seq = isOdd(sign) ? [0, 10, 8, 2, 6] : [1, 5, 11, 9, 7];
      return { sign: seq[part]!, part, partStart: part * 6, partSize: 6 };
    },
  },
  {
    id: "D6", division: 6, te: "షష్ఠాంశ", en: "Shashthamsha", source: "later",
    area: { te: "ఆరోగ్యం, శత్రువులు", en: "Health and adversaries" },
    method: { te: "5° భాగాలు; బేసి రాశి మేషం నుండి, సరి రాశి తుల నుండి (తర్వాతి సంప్రదాయం).", en: "5° parts; odd signs count from Aries, even signs from Libra (later convention)." },
    assign: equal(6, (s) => (isOdd(s) ? 0 : 6)),
  },
  {
    id: "D7", division: 7, te: "సప్తాంశ", en: "Saptamsha", source: "BPHS",
    area: { te: "సంతానం", en: "Children" },
    method: { te: "4°17′ భాగాలు; బేసి రాశి అదే రాశి నుండి, సరి రాశి 7వ రాశి నుండి.", en: "4°17′ parts; odd signs from the same sign, even signs from the 7th." },
    assign: equal(7, (s) => (isOdd(s) ? s : from(s, 6))),
  },
  {
    id: "D8", division: 8, te: "అష్టాంశ", en: "Ashtamsha", source: "later",
    area: { te: "ఆయుష్షు, ఆకస్మిక సంఘటనలు", en: "Longevity and sudden events" },
    method: { te: "3°45′ భాగాలు; చర రాశి మేషం, స్థిర రాశి ధనుస్సు, ద్విస్వభావ రాశి సింహం నుండి (తర్వాతి సంప్రదాయం).", en: "3°45′ parts; movable signs from Aries, fixed from Sagittarius, dual from Leo (later convention)." },
    assign: equal(8, byModality(0, 8, 4)),
  },
  {
    id: "D9", division: 9, te: "నవాంశ", en: "Navamsha", source: "BPHS",
    area: { te: "ధర్మం, వివాహం", en: "Dharma and marriage" },
    method: { te: "3°20′ భాగాలు; చర రాశి అదే రాశి, స్థిర రాశి 9వ, ద్విస్వభావ రాశి 5వ రాశి నుండి.", en: "3°20′ parts; movable signs from the same sign, fixed from the 9th, dual from the 5th." },
    assign: equal(9, (s) => from(s, ({ movable: 0, fixed: 8, dual: 4 } as const)[modality(s)])),
  },
  {
    id: "D10", division: 10, te: "దశాంశ", en: "Dashamsha", source: "BPHS",
    area: { te: "వృత్తి", en: "Profession" },
    method: { te: "3° భాగాలు; బేసి రాశి అదే రాశి నుండి, సరి రాశి 9వ రాశి నుండి.", en: "3° parts; odd signs from the same sign, even signs from the 9th." },
    assign: equal(10, (s) => (isOdd(s) ? s : from(s, 8))),
  },
  {
    id: "D11", division: 11, te: "రుద్రాంశ", en: "Rudramsha", source: "later",
    area: { te: "లాభాలు, ప్రమాదాలు", en: "Gains and dangers" },
    method: { te: "2°43′ భాగాలు; మేషం నుండి నిరంతర చక్ర గణన (ఏకాదశాంశ సంప్రదాయం; ఇతర పద్ధతులు కూడా ఉన్నాయి).", en: "2°43′ parts; continuous cyclic count from Aries (Ekadashamsha convention; other methods exist)." },
    assign: (sign, deg) => {
      const size = 30 / 11;
      const part = Math.min(10, Math.floor(deg / size));
      return { sign: (sign * 11 + part) % 12, part, partStart: part * size, partSize: size };
    },
  },
  {
    id: "D12", division: 12, te: "ద్వాదశాంశ", en: "Dwadashamsha", source: "BPHS",
    area: { te: "తల్లిదండ్రులు, వంశం", en: "Parents and lineage" },
    method: { te: "2°30′ భాగాలు; అదే రాశి నుండి.", en: "2°30′ parts; counted from the same sign." },
    assign: equal(12, (s) => s),
  },
  {
    id: "D16", division: 16, te: "షోడశాంశ", en: "Shodashamsha", source: "BPHS",
    area: { te: "వాహనాలు, సుఖాలు", en: "Vehicles and comforts" },
    method: { te: "1°52′30″ భాగాలు; చర రాశి మేషం, స్థిర రాశి సింహం, ద్విస్వభావ రాశి ధనుస్సు నుండి.", en: "1°52′30″ parts; movable from Aries, fixed from Leo, dual from Sagittarius." },
    assign: equal(16, byModality(0, 4, 8)),
  },
  {
    id: "D20", division: 20, te: "వింశాంశ", en: "Vimshamsha", source: "BPHS",
    area: { te: "ఉపాసన, ఆధ్యాత్మికత", en: "Spiritual practice" },
    method: { te: "1°30′ భాగాలు; చర రాశి మేషం, స్థిర రాశి ధనుస్సు, ద్విస్వభావ రాశి సింహం నుండి.", en: "1°30′ parts; movable from Aries, fixed from Sagittarius, dual from Leo." },
    assign: equal(20, byModality(0, 8, 4)),
  },
  {
    id: "D24", division: 24, te: "చతుర్వింశాంశ", en: "Chaturvimshamsha", source: "BPHS",
    area: { te: "విద్య", en: "Education" },
    method: { te: "1°15′ భాగాలు; బేసి రాశి సింహం నుండి, సరి రాశి కర్కాటకం నుండి.", en: "1°15′ parts; odd signs from Leo, even signs from Cancer." },
    assign: equal(24, (s) => (isOdd(s) ? 4 : 3)),
  },
  {
    id: "D27", division: 27, te: "సప్తవింశాంశ (భాంశ)", en: "Saptavimshamsha (Bhamsha)", source: "BPHS",
    area: { te: "బలాలు, బలహీనతలు", en: "Strengths and weaknesses" },
    method: { te: "1°6′40″ భాగాలు; అగ్ని రాశి మేషం, భూ రాశి కర్కాటకం, వాయు రాశి తుల, జల రాశి మకరం నుండి.", en: "1°6′40″ parts; fire signs from Aries, earth from Cancer, air from Libra, water from Capricorn." },
    assign: equal(27, (s) => [0, 3, 6, 9][s % 4]!),
  },
  {
    id: "D30", division: 30, te: "త్రింశాంశ", en: "Trimshamsha", source: "BPHS",
    area: { te: "కష్టాలు, దోషాలు", en: "Misfortunes and difficulties" },
    method: {
      te: "అసమ భాగాలు. బేసి: 0–5 కుజ (మేష), 5–10 శని (కుంభ), 10–18 గురు (ధను), 18–25 బుధ (మిథున), 25–30 శుక్ర (తుల). సరి: 0–5 శుక్ర (వృషభ), 5–12 బుధ (కన్య), 12–20 గురు (మీన), 20–25 శని (మకర), 25–30 కుజ (వృశ్చిక).",
      en: "Unequal parts. Odd: 0–5 Mars (Aries), 5–10 Saturn (Aquarius), 10–18 Jupiter (Sagittarius), 18–25 Mercury (Gemini), 25–30 Venus (Libra). Even: 0–5 Venus (Taurus), 5–12 Mercury (Virgo), 12–20 Jupiter (Pisces), 20–25 Saturn (Capricorn), 25–30 Mars (Scorpio).",
    },
    assign: (sign, deg) => {
      const odd = isOdd(sign);
      const bounds = odd ? [0, 5, 10, 18, 25, 30] : [0, 5, 12, 20, 25, 30];
      const signs = odd ? [0, 10, 8, 2, 6] : [1, 5, 11, 9, 7];
      let part = 0;
      while (part < 4 && deg >= bounds[part + 1]!) part++;
      return { sign: signs[part]!, part, partStart: bounds[part]!, partSize: bounds[part + 1]! - bounds[part]! };
    },
  },
  {
    id: "D40", division: 40, te: "ఖవేదాంశ", en: "Khavedamsha", source: "BPHS",
    area: { te: "మాతృ వంశ సూచనలు", en: "Maternal lineage indicators" },
    method: { te: "45′ భాగాలు; బేసి రాశి మేషం నుండి, సరి రాశి తుల నుండి.", en: "45′ parts; odd signs from Aries, even signs from Libra." },
    assign: equal(40, (s) => (isOdd(s) ? 0 : 6)),
  },
  {
    id: "D45", division: 45, te: "అక్షవేదాంశ", en: "Akshavedamsha", source: "BPHS",
    area: { te: "పితృ వంశ సూచనలు", en: "Paternal lineage indicators" },
    method: { te: "40′ భాగాలు; చర రాశి మేషం, స్థిర రాశి సింహం, ద్విస్వభావ రాశి ధనుస్సు నుండి.", en: "40′ parts; movable from Aries, fixed from Leo, dual from Sagittarius." },
    assign: equal(45, byModality(0, 4, 8)),
  },
  {
    id: "D60", division: 60, te: "షష్ట్యంశ", en: "Shashtiamsha", source: "BPHS",
    area: { te: "లోతైన కర్మ సూచనలు", en: "Deep karmic indicators" },
    method: { te: "30′ భాగాలు; అదే రాశి నుండి లెక్కింపు (పరాశర).", en: "30′ parts; counted from the same sign (Parashara)." },
    assign: equal(60, (s) => s),
  },
];

export const VARGA_BY_ID = Object.fromEntries(VARGAS.map((v) => [v.id, v])) as Record<VargaId, VargaRule>;

export interface VargaPosition {
  sign: number;
  /** Position scaled within the varga sign (0–30), as used by most software for varga degrees. */
  degree: number;
  /** Original D1 longitude, preserved. */
  sourceLongitude: number;
  part: number;
}

export function vargaPosition(id: VargaId, longitude: number): VargaPosition {
  const sign = signOf(longitude);
  const deg = degreeInSign(longitude);
  const r = VARGA_BY_ID[id].assign(sign, deg);
  const degree = id === "D1" ? deg : ((deg - r.partStart) / r.partSize) * 30;
  return { sign: r.sign, degree: Math.min(29.999999, Math.max(0, degree)), sourceLongitude: longitude, part: r.part };
}

export const vargaSign = (id: VargaId, longitude: number) => vargaPosition(id, longitude).sign;

/** Vargottama: the same sign in D1 and D9. */
export const isVargottama = (longitude: number) => signOf(longitude) === vargaSign("D9", longitude);
