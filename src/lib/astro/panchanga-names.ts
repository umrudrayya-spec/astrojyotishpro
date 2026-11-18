/** Classical Panchanga / Jaimini / Yogini names in Telugu and English (same role as the tables in constants.ts). */
import type { ChoghadiyaId, KaranaId } from "./panchanga";
import type { KarakaId } from "./jaimini";
import type { YoginiId } from "./yogini";

type TE = { te: string; en: string };

const T15: [string, string][] = [
  ["పాడ్యమి", "Pratipada"],
  ["విదియ", "Dwitiya"],
  ["తదియ", "Tritiya"],
  ["చవితి", "Chaturthi"],
  ["పంచమి", "Panchami"],
  ["షష్ఠి", "Shashthi"],
  ["సప్తమి", "Saptami"],
  ["అష్టమి", "Ashtami"],
  ["నవమి", "Navami"],
  ["దశమి", "Dashami"],
  ["ఏకాదశి", "Ekadashi"],
  ["ద్వాదశి", "Dwadashi"],
  ["త్రయోదశి", "Trayodashi"],
  ["చతుర్దశి", "Chaturdashi"],
];
export const TITHIS: TE[] = [
  ...T15.map(([te, en]) => ({ te, en })),
  { te: "పౌర్ణమి", en: "Purnima" },
  ...T15.map(([te, en]) => ({ te, en })),
  { te: "అమావాస్య", en: "Amavasya" },
];

export const YOGAS: TE[] = [
  ["విష్కంభ", "Vishkambha"],
  ["ప్రీతి", "Priti"],
  ["ఆయుష్మాన్", "Ayushman"],
  ["సౌభాగ్య", "Saubhagya"],
  ["శోభన", "Shobhana"],
  ["అతిగండ", "Atiganda"],
  ["సుకర్మ", "Sukarma"],
  ["ధృతి", "Dhriti"],
  ["శూల", "Shula"],
  ["గండ", "Ganda"],
  ["వృద్ధి", "Vriddhi"],
  ["ధ్రువ", "Dhruva"],
  ["వ్యాఘాత", "Vyaghata"],
  ["హర్షణ", "Harshana"],
  ["వజ్ర", "Vajra"],
  ["సిద్ధి", "Siddhi"],
  ["వ్యతీపాత", "Vyatipata"],
  ["వరీయాన్", "Variyan"],
  ["పరిఘ", "Parigha"],
  ["శివ", "Shiva"],
  ["సిద్ధ", "Siddha"],
  ["సాధ్య", "Sadhya"],
  ["శుభ", "Shubha"],
  ["శుక్ల", "Shukla"],
  ["బ్రహ్మ", "Brahma"],
  ["ఐంద్ర", "Indra"],
  ["వైధృతి", "Vaidhriti"],
].map(([te, en]) => ({ te: te!, en: en! }));

export const KARANA_NAMES: Record<KaranaId, TE> = {
  bava: { te: "బవ", en: "Bava" },
  balava: { te: "బాలవ", en: "Balava" },
  kaulava: { te: "కౌలవ", en: "Kaulava" },
  taitila: { te: "తైతిల", en: "Taitila" },
  garaja: { te: "గరజ", en: "Garaja" },
  vanija: { te: "వణిజ", en: "Vanija" },
  vishti: { te: "విష్టి (భద్ర)", en: "Vishti (Bhadra)" },
  shakuni: { te: "శకుని", en: "Shakuni" },
  chatushpada: { te: "చతుష్పాద", en: "Chatushpada" },
  naga: { te: "నాగ", en: "Naga" },
  kimstughna: { te: "కింస్తుఘ్న", en: "Kimstughna" },
};

export const WEEKDAYS: TE[] = [
  { te: "ఆదివారం", en: "Sunday" },
  { te: "సోమవారం", en: "Monday" },
  { te: "మంగళవారం", en: "Tuesday" },
  { te: "బుధవారం", en: "Wednesday" },
  { te: "గురువారం", en: "Thursday" },
  { te: "శుక్రవారం", en: "Friday" },
  { te: "శనివారం", en: "Saturday" },
];

export const CHOGHADIYA_NAMES: Record<ChoghadiyaId, TE> = {
  udveg: { te: "ఉద్వేగ", en: "Udveg" },
  char: { te: "చర", en: "Char" },
  labh: { te: "లాభ", en: "Labh" },
  amrit: { te: "అమృత", en: "Amrit" },
  kaal: { te: "కాల", en: "Kaal" },
  shubh: { te: "శుభ", en: "Shubh" },
  rog: { te: "రోగ", en: "Rog" },
};

export const KARAKA_NAMES: Record<KarakaId, TE> = {
  AK: { te: "ఆత్మకారక", en: "Atmakaraka" },
  AmK: { te: "అమాత్యకారక", en: "Amatyakaraka" },
  BK: { te: "భ్రాతృకారక", en: "Bhratrikaraka" },
  MK: { te: "మాతృకారక", en: "Matrikaraka" },
  PiK: { te: "పితృకారక", en: "Pitrikaraka" },
  PK: { te: "పుత్రకారక", en: "Putrakaraka" },
  GK: { te: "జ్ఞాతికారక", en: "Gnatikaraka" },
  DK: { te: "దారకారక", en: "Darakaraka" },
};

export const YOGINI_NAMES: Record<YoginiId, TE> = {
  mangala: { te: "మంగళ", en: "Mangala" },
  pingala: { te: "పింగళ", en: "Pingala" },
  dhanya: { te: "ధాన్య", en: "Dhanya" },
  bhramari: { te: "భ్రామరి", en: "Bhramari" },
  bhadrika: { te: "భద్రిక", en: "Bhadrika" },
  ulka: { te: "ఉల్క", en: "Ulka" },
  siddha: { te: "సిద్ధ", en: "Siddha" },
  sankata: { te: "సంకట", en: "Sankata" },
};

import type { YogaId } from "./yogas";

export const YOGA_NAMES: Record<YogaId, TE> = {
  ruchaka: { te: "రుచక యోగం", en: "Ruchaka yoga" },
  bhadra: { te: "భద్ర యోగం", en: "Bhadra yoga" },
  hamsa: { te: "హంస యోగం", en: "Hamsa yoga" },
  malavya: { te: "మాలవ్య యోగం", en: "Malavya yoga" },
  shasha: { te: "శశ యోగం", en: "Shasha yoga" },
  gajakesari: { te: "గజకేసరి యోగం", en: "Gajakesari yoga" },
  budhaditya: { te: "బుధాదిత్య యోగం", en: "Budhaditya yoga" },
  chandra_mangala: { te: "చంద్ర-మంగళ యోగం", en: "Chandra-Mangala yoga" },
  sunapha: { te: "సునఫా యోగం", en: "Sunapha yoga" },
  anapha: { te: "అనఫా యోగం", en: "Anapha yoga" },
  durudhura: { te: "దురుధరా యోగం", en: "Durudhura yoga" },
  kemadruma: { te: "కేమద్రుమ యోగం", en: "Kemadruma yoga" },
  adhi: { te: "అధి యోగం", en: "Adhi yoga" },
  raja: { te: "రాజ యోగం", en: "Raja yoga" },
  dhana: { te: "ధన యోగం", en: "Dhana yoga" },
  harsha: { te: "హర్ష (విపరీత రాజ) యోగం", en: "Harsha (Viparita Raja) yoga" },
  sarala: { te: "సరళ (విపరీత రాజ) యోగం", en: "Sarala (Viparita Raja) yoga" },
  vimala: { te: "విమల (విపరీత రాజ) యోగం", en: "Vimala (Viparita Raja) yoga" },
  neecha_bhanga: { te: "నీచ భంగ రాజ యోగం", en: "Neecha Bhanga Raja yoga" },
  kuja_dosha: { te: "కుజ దోషం", en: "Kuja dosha" },
  kala_sarpa: { te: "కాల సర్ప దోషం", en: "Kala Sarpa dosha" },
  grahana: { te: "గ్రహణ దోషం", en: "Grahana dosha" },
  guru_chandala: { te: "గురు చండాల యోగం", en: "Guru Chandala yoga" },
};
