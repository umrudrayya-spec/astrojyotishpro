import { GRAHA_NAMES, NAKSHATRAS, RASHIS, type GrahaId } from "./constants";
import type { Dignity } from "./parashari";
import type { DictKey, Lang } from "@/lib/i18n";

export const grahaName = (g: GrahaId, lang: Lang) => GRAHA_NAMES[g][lang];
export const grahaAbbr = (g: GrahaId, lang: Lang) => (lang === "te" ? GRAHA_NAMES[g].abbrTe : GRAHA_NAMES[g].abbrEn);
export const rashiName = (s: number, lang: Lang) => RASHIS[s]![lang];
export const nakshatraName = (n: number, lang: Lang) => NAKSHATRAS[n]![lang];

export const DIGNITY_KEYS: Record<Dignity, DictKey> = {
  exalted: "dExalted",
  debilitated: "dDebilitated",
  moolatrikona: "dMoolatrikona",
  own: "dOwn",
  great_friend: "dGreatFriend",
  friend: "dFriend",
  neutral: "dNeutral",
  enemy: "dEnemy",
  great_enemy: "dGreatEnemy",
  unclassified: "dUnclassified",
};

export const DIGNITY_TONE: Record<Dignity, string> = {
  exalted: "bg-success/15 text-success border-success/30",
  moolatrikona: "bg-success/10 text-success border-success/25",
  own: "bg-gold/20 text-gold-foreground border-gold/40",
  great_friend: "bg-secondary text-secondary-foreground border-border",
  friend: "bg-secondary text-secondary-foreground border-border",
  neutral: "bg-muted text-muted-foreground border-border",
  enemy: "bg-destructive/10 text-destructive border-destructive/25",
  great_enemy: "bg-destructive/15 text-destructive border-destructive/30",
  debilitated: "bg-destructive/15 text-destructive border-destructive/30",
  unclassified: "bg-muted text-muted-foreground border-border",
};
