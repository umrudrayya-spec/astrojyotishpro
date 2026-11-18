/** User-selectable calculation conventions. Every chart stores the settings it was computed with. */

export type AyanamshaId =
  | "lahiri"
  | "true_chitra"
  | "kp_old"
  | "raman"
  | "fagan_bradley"
  | "yukteshwar"
  | "true_pushya"
  | "jn_bhasin"
  | "surya_siddhanta"
  | "tropical";

/** Swiss Ephemeris SE_SIDM_* constants. `null` means tropical zodiac (no ayanamsha). */
export const AYANAMSHAS: Record<AyanamshaId, { sidm: number | null; te: string; en: string }> = {
  lahiri: { sidm: 1, te: "లాహిరి (చిత్రపక్ష)", en: "Lahiri (Chitrapaksha)" },
  true_chitra: { sidm: 27, te: "నిజ చిత్రపక్ష", en: "True Chitrapaksha" },
  kp_old: { sidm: 5, te: "కృష్ణమూర్తి (KP)", en: "Krishnamurti (KP)" },
  raman: { sidm: 3, te: "బి.వి. రామన్", en: "B.V. Raman" },
  fagan_bradley: { sidm: 0, te: "ఫాగన్-బ్రాడ్లీ", en: "Fagan-Bradley" },
  yukteshwar: { sidm: 7, te: "శ్రీ యుక్తేశ్వర్", en: "Sri Yukteshwar" },
  true_pushya: { sidm: 29, te: "పుష్యపక్ష", en: "True Pushya Paksha" },
  jn_bhasin: { sidm: 8, te: "జె.ఎన్. భసిన్", en: "J.N. Bhasin" },
  surya_siddhanta: { sidm: 21, te: "సూర్య సిద్ధాంతం", en: "Surya Siddhanta" },
  tropical: { sidm: null, te: "సాయన (ట్రాపికల్)", en: "Tropical (Sayana)" },
};

export type NodeType = "true" | "mean";
export type HouseSystemId = "whole_sign" | "equal" | "placidus" | "sripati";
export type ChartStyle = "south" | "north";
/** Rahu/Ketu aspects are disputed between schools; expose both conventions. */
export type NodeAspectConvention = "seventh_only" | "fifth_seventh_ninth";

export interface CalcSettings {
  ayanamsha: AyanamshaId;
  nodeType: NodeType;
  houseSystem: HouseSystemId;
  nodeAspects: NodeAspectConvention;
}

export const DEFAULT_SETTINGS: CalcSettings = {
  ayanamsha: "lahiri",
  nodeType: "true",
  houseSystem: "whole_sign",
  nodeAspects: "seventh_only",
};

export const HOUSE_SYSTEMS: Record<HouseSystemId, { te: string; en: string }> = {
  whole_sign: { te: "రాశి భావ (సంపూర్ణ రాశి)", en: "Whole sign" },
  equal: { te: "సమ భావ (లగ్నం నుండి)", en: "Equal from Lagna" },
  placidus: { te: "ప్లాసిడస్", en: "Placidus" },
  sripati: { te: "శ్రీపతి", en: "Sripati (Porphyry)" },
};

export function isAyanamshaId(v: string): v is AyanamshaId {
  return v in AYANAMSHAS;
}
export function isHouseSystemId(v: string): v is HouseSystemId {
  return v in HOUSE_SYSTEMS;
}
