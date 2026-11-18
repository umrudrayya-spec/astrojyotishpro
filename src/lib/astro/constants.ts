/**
 * Classical Jyotisha reference tables (Parashari, per Brihat Parashara Hora Shastra conventions).
 * Pure data — no calculations live here.
 */

export type GrahaId =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu"
  | "uranus"
  | "neptune"
  | "pluto";

/** The seven visible grahas that own signs and carry classical dignities. */
export type SaptaGraha = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

export const SAPTA_GRAHAS: SaptaGraha[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

export const NAVAGRAHAS: GrahaId[] = [...SAPTA_GRAHAS, "rahu", "ketu"];
export const OUTER_PLANETS: GrahaId[] = ["uranus", "neptune", "pluto"];
export const ALL_GRAHAS: GrahaId[] = [...NAVAGRAHAS, ...OUTER_PLANETS];

export const GRAHA_NAMES: Record<GrahaId, { te: string; en: string; sa: string; abbrTe: string; abbrEn: string }> = {
  sun: { te: "సూర్యుడు", en: "Sun", sa: "Surya", abbrTe: "సూ", abbrEn: "Su" },
  moon: { te: "చంద్రుడు", en: "Moon", sa: "Chandra", abbrTe: "చం", abbrEn: "Mo" },
  mars: { te: "కుజుడు", en: "Mars", sa: "Mangala", abbrTe: "కు", abbrEn: "Ma" },
  mercury: { te: "బుధుడు", en: "Mercury", sa: "Budha", abbrTe: "బు", abbrEn: "Me" },
  jupiter: { te: "గురుడు", en: "Jupiter", sa: "Guru", abbrTe: "గు", abbrEn: "Ju" },
  venus: { te: "శుక్రుడు", en: "Venus", sa: "Shukra", abbrTe: "శు", abbrEn: "Ve" },
  saturn: { te: "శని", en: "Saturn", sa: "Shani", abbrTe: "శ", abbrEn: "Sa" },
  rahu: { te: "రాహువు", en: "Rahu", sa: "Rahu", abbrTe: "రా", abbrEn: "Ra" },
  ketu: { te: "కేతువు", en: "Ketu", sa: "Ketu", abbrTe: "కే", abbrEn: "Ke" },
  uranus: { te: "యురేనస్", en: "Uranus", sa: "Uranus", abbrTe: "యు", abbrEn: "Ur" },
  neptune: { te: "నెప్ట్యూన్", en: "Neptune", sa: "Neptune", abbrTe: "నె", abbrEn: "Ne" },
  pluto: { te: "ప్లూటో", en: "Pluto", sa: "Pluto", abbrTe: "ప్లూ", abbrEn: "Pl" },
};

export const RASHIS: { te: string; en: string; sa: string; lord: SaptaGraha }[] = [
  { te: "మేషం", en: "Aries", sa: "Mesha", lord: "mars" },
  { te: "వృషభం", en: "Taurus", sa: "Vrishabha", lord: "venus" },
  { te: "మిథునం", en: "Gemini", sa: "Mithuna", lord: "mercury" },
  { te: "కర్కాటకం", en: "Cancer", sa: "Karka", lord: "moon" },
  { te: "సింహం", en: "Leo", sa: "Simha", lord: "sun" },
  { te: "కన్య", en: "Virgo", sa: "Kanya", lord: "mercury" },
  { te: "తుల", en: "Libra", sa: "Tula", lord: "venus" },
  { te: "వృశ్చికం", en: "Scorpio", sa: "Vrishchika", lord: "mars" },
  { te: "ధనుస్సు", en: "Sagittarius", sa: "Dhanu", lord: "jupiter" },
  { te: "మకరం", en: "Capricorn", sa: "Makara", lord: "saturn" },
  { te: "కుంభం", en: "Aquarius", sa: "Kumbha", lord: "saturn" },
  { te: "మీనం", en: "Pisces", sa: "Meena", lord: "jupiter" },
];

/** Vimshottari sequence of nakshatra lords, repeating every 9 nakshatras starting at Ashwini. */
export const NAKSHATRA_LORD_SEQUENCE: GrahaId[] = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
];

export const NAKSHATRAS: { te: string; en: string }[] = [
  { te: "అశ్విని", en: "Ashwini" },
  { te: "భరణి", en: "Bharani" },
  { te: "కృత్తిక", en: "Krittika" },
  { te: "రోహిణి", en: "Rohini" },
  { te: "మృగశిర", en: "Mrigashira" },
  { te: "ఆర్ద్ర", en: "Ardra" },
  { te: "పునర్వసు", en: "Punarvasu" },
  { te: "పుష్యమి", en: "Pushya" },
  { te: "ఆశ్లేష", en: "Ashlesha" },
  { te: "మఘ", en: "Magha" },
  { te: "పుబ్బ", en: "Purva Phalguni" },
  { te: "ఉత్తర", en: "Uttara Phalguni" },
  { te: "హస్త", en: "Hasta" },
  { te: "చిత్త", en: "Chitra" },
  { te: "స్వాతి", en: "Swati" },
  { te: "విశాఖ", en: "Vishakha" },
  { te: "అనూరాధ", en: "Anuradha" },
  { te: "జ్యేష్ఠ", en: "Jyeshtha" },
  { te: "మూల", en: "Mula" },
  { te: "పూర్వాషాఢ", en: "Purva Ashadha" },
  { te: "ఉత్తరాషాఢ", en: "Uttara Ashadha" },
  { te: "శ్రవణం", en: "Shravana" },
  { te: "ధనిష్ఠ", en: "Dhanishta" },
  { te: "శతభిషం", en: "Shatabhisha" },
  { te: "పూర్వాభాద్ర", en: "Purva Bhadrapada" },
  { te: "ఉత్తరాభాద్ర", en: "Uttara Bhadrapada" },
  { te: "రేవతి", en: "Revati" },
];

/** Exaltation sign index and exact degree of deep exaltation (BPHS ch. 3). */
export const EXALTATION: Record<SaptaGraha, { sign: number; degree: number }> = {
  sun: { sign: 0, degree: 10 },
  moon: { sign: 1, degree: 3 },
  mars: { sign: 9, degree: 28 },
  mercury: { sign: 5, degree: 15 },
  jupiter: { sign: 3, degree: 5 },
  venus: { sign: 11, degree: 27 },
  saturn: { sign: 6, degree: 20 },
};

/** Moolatrikona sign and degree range [from, to) (BPHS ch. 3). */
export const MOOLATRIKONA: Record<SaptaGraha, { sign: number; from: number; to: number }> = {
  sun: { sign: 4, from: 0, to: 20 },
  moon: { sign: 1, from: 3, to: 30 },
  mars: { sign: 0, from: 0, to: 12 },
  mercury: { sign: 5, from: 15, to: 20 },
  jupiter: { sign: 8, from: 0, to: 10 },
  venus: { sign: 6, from: 0, to: 15 },
  saturn: { sign: 10, from: 0, to: 20 },
};

export type Relation = "friend" | "neutral" | "enemy";

/** Naisargika (natural) relationships, BPHS ch. 3. Row = planet, column = other planet. */
export const NATURAL_RELATIONS: Record<SaptaGraha, Record<SaptaGraha, Relation | "self">> = {
  sun: { sun: "self", moon: "friend", mars: "friend", mercury: "neutral", jupiter: "friend", venus: "enemy", saturn: "enemy" },
  moon: { sun: "friend", moon: "self", mars: "neutral", mercury: "friend", jupiter: "neutral", venus: "neutral", saturn: "neutral" },
  mars: { sun: "friend", moon: "friend", mars: "self", mercury: "enemy", jupiter: "friend", venus: "neutral", saturn: "neutral" },
  mercury: { sun: "friend", moon: "enemy", mars: "neutral", mercury: "self", jupiter: "neutral", venus: "friend", saturn: "neutral" },
  jupiter: { sun: "friend", moon: "friend", mars: "friend", mercury: "enemy", jupiter: "self", venus: "enemy", saturn: "neutral" },
  venus: { sun: "enemy", moon: "enemy", mars: "neutral", mercury: "friend", jupiter: "neutral", venus: "self", saturn: "friend" },
  saturn: { sun: "enemy", moon: "enemy", mars: "enemy", mercury: "friend", jupiter: "neutral", venus: "friend", saturn: "self" },
};

/**
 * Combustion (asta) orbs in degrees from the Sun, per Surya Siddhanta as commonly applied.
 * Mercury and Venus use a smaller orb when retrograde.
 */
export const COMBUSTION_ORBS: Partial<Record<SaptaGraha, { direct: number; retro: number }>> = {
  moon: { direct: 12, retro: 12 },
  mars: { direct: 17, retro: 17 },
  mercury: { direct: 14, retro: 12 },
  jupiter: { direct: 11, retro: 11 },
  venus: { direct: 10, retro: 8 },
  saturn: { direct: 15, retro: 15 },
};

/** Special Graha Drishti (house counts, inclusive) in addition to the universal 7th aspect. */
export const SPECIAL_ASPECTS: Partial<Record<GrahaId, number[]>> = {
  mars: [4, 8],
  jupiter: [5, 9],
  saturn: [3, 10],
};

export const KENDRA = [1, 4, 7, 10];
export const TRIKONA = [1, 5, 9];
export const DUSTHANA = [6, 8, 12];
export const UPACHAYA = [3, 6, 10, 11];
