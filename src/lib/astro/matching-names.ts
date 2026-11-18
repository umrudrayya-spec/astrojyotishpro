/** Telugu / English labels for Ashtakoota matching. */
import type { Gana, KootaId, Nadi, YoniAnimal } from "./matching";

type L = { te: string; en: string };

export const KOOTA_NAMES: Record<KootaId, L> = {
  varna: { te: "వర్ణ", en: "Varna" },
  vashya: { te: "వశ్య", en: "Vashya" },
  tara: { te: "తార", en: "Tara" },
  yoni: { te: "యోని", en: "Yoni" },
  maitri: { te: "గ్రహ మైత్రి", en: "Graha Maitri" },
  gana: { te: "గణ", en: "Gana" },
  bhakoot: { te: "భకూట (రాశి)", en: "Bhakoot" },
  nadi: { te: "నాడి", en: "Nadi" },
};

export const VARNA_LABELS: Record<string, L> = {
  brahmin: { te: "బ్రాహ్మణ", en: "Brahmin" },
  kshatriya: { te: "క్షత్రియ", en: "Kshatriya" },
  vaishya: { te: "వైశ్య", en: "Vaishya" },
  shudra: { te: "శూద్ర", en: "Shudra" },
};

export const YONI_LABELS: Record<YoniAnimal, L> = {
  horse: { te: "అశ్వ", en: "Horse" },
  elephant: { te: "గజ", en: "Elephant" },
  sheep: { te: "మేష", en: "Sheep" },
  serpent: { te: "సర్ప", en: "Serpent" },
  dog: { te: "శ్వాన", en: "Dog" },
  cat: { te: "మార్జాల", en: "Cat" },
  rat: { te: "మూషిక", en: "Rat" },
  cow: { te: "గో", en: "Cow" },
  buffalo: { te: "మహిష", en: "Buffalo" },
  tiger: { te: "వ్యాఘ్ర", en: "Tiger" },
  deer: { te: "మృగ", en: "Deer" },
  monkey: { te: "వానర", en: "Monkey" },
  mongoose: { te: "నకుల", en: "Mongoose" },
  lion: { te: "సింహ", en: "Lion" },
};

export const GANA_LABELS: Record<Gana, L> = {
  deva: { te: "దేవ", en: "Deva" },
  manushya: { te: "మనుష్య", en: "Manushya" },
  rakshasa: { te: "రాక్షస", en: "Rakshasa" },
};

export const NADI_LABELS: Record<Nadi, L> = {
  adi: { te: "ఆది", en: "Adi" },
  madhya: { te: "మధ్య", en: "Madhya" },
  antya: { te: "అంత్య", en: "Antya" },
};
