import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "te" | "en";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "te", label: "తెలుగు" },
  { id: "en", label: "English" },
];

const STORAGE_KEY = "jyotish.lang";

const dict = {
  appName: { te: "జ్యోతిష దర్పణం", en: "Jyotisha Darpanam" },
  tagline: {
    te: "నిజమైన ఖగోళ గణనలపై ఆధారపడిన వైదిక జ్యోతిష వేదిక",
    en: "A Vedic astrology platform built on real astronomical calculation",
  },
  heroTitle: { te: "మీ జాతకం, ఖచ్చితమైన గణనతో", en: "Your horoscope, precisely calculated" },
  heroBody: {
    te: "స్విస్ ఎఫెమెరిస్ ఆధారంగా గ్రహ స్థితులు, లగ్నం, నక్షత్రం, పాదం, గ్రహ బలాలు — ప్రతి విలువ ఎలా లెక్కించబడిందో స్పష్టంగా చూపిస్తాము.",
    en: "Planetary positions, Lagna, Nakshatra, Pada and dignities from Swiss Ephemeris — with every value showing exactly how it was calculated.",
  },
  getStarted: { te: "ప్రారంభించండి", en: "Get started" },
  openDashboard: { te: "డాష్‌బోర్డ్ తెరవండి", en: "Open dashboard" },
  signIn: { te: "ప్రవేశించండి", en: "Sign in" },
  signUp: { te: "ఖాతా సృష్టించండి", en: "Create account" },
  signOut: { te: "నిష్క్రమించు", en: "Sign out" },
  email: { te: "ఈమెయిల్", en: "Email" },
  password: { te: "పాస్‌వర్డ్", en: "Password" },
  fullName: { te: "పూర్తి పేరు", en: "Full name" },
  forgotPassword: { te: "పాస్‌వర్డ్ మర్చిపోయారా?", en: "Forgot password?" },
  sendResetLink: { te: "రీసెట్ లింక్ పంపండి", en: "Send reset link" },
  resetSent: { te: "రీసెట్ లింక్ మీ ఈమెయిల్‌కు పంపబడింది.", en: "A reset link has been sent to your email." },
  newPassword: { te: "కొత్త పాస్‌వర్డ్", en: "New password" },
  updatePassword: { te: "పాస్‌వర్డ్ మార్చండి", en: "Update password" },
  passwordUpdated: { te: "పాస్‌వర్డ్ మార్చబడింది.", en: "Password updated." },
  checkEmail: {
    te: "ఖాతా ధృవీకరణ కోసం మీ ఈమెయిల్ చూడండి.",
    en: "Check your email to confirm your account.",
  },
  or: { te: "లేదా", en: "or" },
  continueWithGoogle: { te: "Google తో కొనసాగండి", en: "Continue with Google" },
  continueWithLovable: { te: "Lovable తో కొనసాగండి", en: "Continue with Lovable" },
  haveAccount: { te: "ఇప్పటికే ఖాతా ఉందా?", en: "Already have an account?" },
  noAccount: { te: "ఖాతా లేదా?", en: "No account yet?" },
  backToSignIn: { te: "ప్రవేశానికి తిరిగి", en: "Back to sign in" },

  navDashboard: { te: "ముఖ్య పేజీ", en: "Dashboard" },
  navProfiles: { te: "జాతక వివరాలు", en: "Birth profiles" },
  navChart: { te: "జన్మ కుండలి", en: "Birth chart" },
  navSettings: { te: "అమరికలు", en: "Settings" },
  comingNext: { te: "తదుపరి దశలలో", en: "Coming in next phases" },

  welcome: { te: "నమస్కారం", en: "Namaskaram" },
  todaySky: { te: "ప్రస్తుత గ్రహ స్థితి", en: "Planets right now" },
  todaySkyNote: {
    te: "ఈ క్షణం గ్రహాల నిరయన స్థానాలు (భూకేంద్రిత).",
    en: "Sidereal geocentric positions at this moment.",
  },
  yourProfiles: { te: "మీ జాతకాలు", en: "Your birth profiles" },
  noProfiles: { te: "ఇంకా జాతకాలు లేవు. మొదటి జాతకాన్ని జోడించండి.", en: "No birth profiles yet. Add your first one." },
  addProfile: { te: "జాతకం జోడించు", en: "Add profile" },
  editProfile: { te: "జాతకం మార్చు", en: "Edit profile" },
  duplicate: { te: "నకలు", en: "Duplicate" },
  delete: { te: "తొలగించు", en: "Delete" },
  edit: { te: "మార్చు", en: "Edit" },
  save: { te: "భద్రపరచు", en: "Save" },
  saving: { te: "భద్రపరుస్తోంది…", en: "Saving…" },
  cancel: { te: "రద్దు", en: "Cancel" },
  confirmDelete: { te: "ఈ జాతకాన్ని శాశ్వతంగా తొలగించాలా?", en: "Permanently delete this birth profile?" },
  viewChart: { te: "కుండలి చూడండి", en: "View chart" },
  saved: { te: "భద్రపరచబడింది", en: "Saved" },
  deleted: { te: "తొలగించబడింది", en: "Deleted" },
  somethingWrong: { te: "ఏదో పొరపాటు జరిగింది", en: "Something went wrong" },
  exportJson: { te: "ఎగుమతి (JSON)", en: "Export (JSON)" },
  importJson: { te: "దిగుమతి (JSON)", en: "Import (JSON)" },
  imported: { te: "దిగుమతి పూర్తయింది", en: "Import complete" },

  name: { te: "పేరు", en: "Name" },
  gender: { te: "లింగం", en: "Gender" },
  male: { te: "పురుషుడు", en: "Male" },
  female: { te: "స్త్రీ", en: "Female" },
  other: { te: "ఇతర", en: "Other" },
  relation: { te: "సంబంధం", en: "Relation" },
  relSelf: { te: "స్వయం", en: "Self" },
  relSpouse: { te: "జీవిత భాగస్వామి", en: "Spouse" },
  relChild: { te: "సంతానం", en: "Child" },
  relParent: { te: "తల్లి/తండ్రి", en: "Parent" },
  relSibling: { te: "తోబుట్టువు", en: "Sibling" },
  relFriend: { te: "స్నేహితులు", en: "Friend" },
  relClient: { te: "క్లయింట్", en: "Client" },
  birthDate: { te: "జన్మ తేదీ", en: "Date of birth" },
  birthTime: { te: "జన్మ సమయం", en: "Time of birth" },
  timeUnknown: { te: "జన్మ సమయం తెలియదు", en: "Birth time unknown" },
  timeUnknownNote: {
    te: "సమయం తెలియకపోతే మధ్యాహ్నం 12:00 తీసుకుంటాము; లగ్నం, భావాలు నమ్మదగినవి కావు.",
    en: "Without a birth time we use 12:00 noon; Lagna and houses are not reliable.",
  },
  birthPlace: { te: "జన్మ స్థలం", en: "Place of birth" },
  searchPlace: { te: "ఊరు పేరు వెతకండి…", en: "Search a town or city…" },
  latitude: { te: "అక్షాంశం", en: "Latitude" },
  longitude: { te: "రేఖాంశం", en: "Longitude" },
  timezone: { te: "కాల మండలం", en: "Time zone" },
  utcOffset: { te: "UTC వ్యత్యాసం", en: "UTC offset" },
  utcOffsetAuto: {
    te: "జన్మ తేదీ నాటి చారిత్రక కాల మండల నియమాల ప్రకారం స్వయంచాలకంగా లెక్కించబడింది.",
    en: "Calculated automatically from the historical time-zone rules for the birth date.",
  },
  notes: { te: "గమనికలు", en: "Notes" },
  required: { te: "తప్పనిసరి", en: "Required" },
  pickPlace: { te: "జాబితా నుండి స్థలాన్ని ఎంచుకోండి", en: "Pick a place from the list" },

  chartTitle: { te: "జన్మ కుండలి (రాశి చక్రం D1)", en: "Birth chart (Rashi D1)" },
  southIndian: { te: "దక్షిణ భారత", en: "South Indian" },
  northIndian: { te: "ఉత్తర భారత", en: "North Indian" },
  ayanamsha: { te: "అయనాంశ", en: "Ayanamsha" },
  nodeType: { te: "రాహు/కేతు గణన", en: "Rahu/Ketu node" },
  trueNode: { te: "నిజ (True)", en: "True node" },
  meanNode: { te: "మధ్యమ (Mean)", en: "Mean node" },
  houseSystem: { te: "భావ పద్ధతి", en: "House system" },
  nodeAspects: { te: "రాహు/కేతు దృష్టి", en: "Rahu/Ketu aspects" },
  nodeAspects7: { te: "7వ దృష్టి మాత్రమే", en: "7th only" },
  nodeAspects579: { te: "5, 7, 9 దృష్టులు", en: "5th, 7th, 9th" },
  showOuter: { te: "యురేనస్/నెప్ట్యూన్/ప్లూటో చూపు", en: "Show Uranus/Neptune/Pluto" },
  calculating: { te: "గణిస్తోంది…", en: "Calculating…" },
  lagna: { te: "లగ్నం", en: "Lagna" },
  lagnaAbbr: { te: "ల", en: "As" },
  planet: { te: "గ్రహం", en: "Planet" },
  sign: { te: "రాశి", en: "Sign" },
  degree: { te: "అంశ", en: "Degree" },
  nakshatra: { te: "నక్షత్రం", en: "Nakshatra" },
  pada: { te: "పాదం", en: "Pada" },
  nakLord: { te: "నక్షత్రాధిపతి", en: "Star lord" },
  house: { te: "భావం", en: "House" },
  dignity: { te: "స్థితి బలం", en: "Dignity" },
  status: { te: "స్థితి", en: "Status" },
  speed: { te: "వేగం (°/రోజు)", en: "Speed (°/day)" },
  latitudeShort: { te: "శరం", en: "Latitude" },
  declination: { te: "క్రాంతి", en: "Declination" },
  retro: { te: "వక్రి", en: "Retrograde" },
  retroAbbr: { te: "వ", en: "R" },
  combust: { te: "అస్తంగత", en: "Combust" },
  combustAbbr: { te: "అ", en: "C" },
  planetTable: { te: "గ్రహ స్థితి పట్టిక", en: "Planetary positions" },
  houseTable: { te: "భావ పట్టిక", en: "Houses (Bhavas)" },
  lord: { te: "అధిపతి", en: "Lord" },
  occupants: { te: "స్థిత గ్రహాలు", en: "Occupants" },
  aspectedBy: { te: "దృష్టి గ్రహాలు", en: "Aspected by" },
  cusp: { te: "భావ మధ్యం/ఆరంభం", en: "Cusp" },
  owns: { te: "ఆధిపత్య భావాలు", en: "Lord of houses" },
  aspects: { te: "దృష్టి భావాలు", en: "Aspects houses" },
  combinations: { te: "గ్రహ సంయోగాలు & పరివర్తన", en: "Conjunctions & exchanges" },
  conjunctionIn: { te: "లో సంయోగం", en: "conjunction in" },
  parivartana: { te: "పరివర్తన", en: "Parivartana (exchange)" },
  none: { te: "ఏవీ లేవు", en: "None" },
  calcDetails: { te: "గణన వివరాలు", en: "Calculation details" },
  engine: { te: "గణన యంత్రం", en: "Engine" },
  ephemeris: { te: "ఎఫెమెరిస్", en: "Ephemeris" },
  moshier: { te: "మోషియర్ (అంతర్నిర్మిత)", en: "Moshier (built-in)" },
  swissFiles: { te: "స్విస్ ఎఫెమెరిస్ ఫైళ్లు", en: "Swiss Ephemeris files" },
  julianDay: { te: "జూలియన్ దినం (UT)", en: "Julian day (UT)" },
  utcTime: { te: "UTC సమయం", en: "UTC time" },
  algorithm: { te: "అల్గోరిథం వెర్షన్", en: "Algorithm version" },
  uncertaintyTitle: { te: "అనిశ్చితి", en: "Uncertainty" },
  lagnaUncertain: {
    te: "జన్మ సమయం తెలియనందున లగ్నం, భావాలు, దృష్టి భావాలు నమ్మదగినవి కావు. గ్రహ రాశులు (చంద్రుడు తప్ప) సాధారణంగా సరైనవే.",
    en: "Birth time is unknown, so Lagna, houses and aspected houses are not reliable. Planet signs (except the Moon) are usually still correct.",
  },
  selectProfile: { te: "జాతకాన్ని ఎంచుకోండి", en: "Select a profile" },
  chartSettings: { te: "గణన అమరికలు", en: "Calculation settings" },
  precision: { te: "ఖచ్చితత్వం", en: "Precision" },
  loadSwissFiles: {
    te: "స్విస్ ఎఫెమెరిస్ డేటా ఫైళ్లను వాడు (~2MB డౌన్‌లోడ్)",
    en: "Use Swiss Ephemeris data files (~2MB download)",
  },

  settingsTitle: { te: "అమరికలు", en: "Settings" },
  language: { te: "భాష", en: "Language" },
  displayName: { te: "ప్రదర్శన పేరు", en: "Display name" },
  defaultsTitle: { te: "డిఫాల్ట్ గణన పద్ధతులు", en: "Default calculation conventions" },
  defaultChartStyle: { te: "డిఫాల్ట్ కుండలి శైలి", en: "Default chart style" },
  theme: { te: "రంగు ధీమ్", en: "Theme" },
  light: { te: "లేత", en: "Light" },
  dark: { te: "ముదురు", en: "Dark" },

  dExalted: { te: "ఉచ్ఛ", en: "Exalted" },
  dDebilitated: { te: "నీచ", en: "Debilitated" },
  dMoolatrikona: { te: "మూలత్రికోణం", en: "Moolatrikona" },
  dOwn: { te: "స్వక్షేత్రం", en: "Own sign" },
  dGreatFriend: { te: "అధిమిత్ర", en: "Great friend" },
  dFriend: { te: "మిత్ర", en: "Friendly" },
  dNeutral: { te: "సమ", en: "Neutral" },
  dEnemy: { te: "శత్రు", en: "Enemy" },
  dGreatEnemy: { te: "అధిశత్రు", en: "Great enemy" },
  dUnclassified: { te: "—", en: "—" },
  kendra: { te: "కేంద్రం", en: "Kendra" },
  trikona: { te: "త్రికోణం", en: "Trikona" },
  dusthana: { te: "దుస్థానం", en: "Dusthana" },
  upachaya: { te: "ఉపచయం", en: "Upachaya" },
  notFound: { te: "జాతకం కనుగొనబడలేదు", en: "Profile not found" },
} as const satisfies Record<string, Record<Lang, string>>;

export type DictKey = keyof typeof dict;

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("te");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "te" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: (k) => dict[k][lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Pick the localized field from a {te,en} record. */
export function pick(rec: { te: string; en: string }, lang: Lang) {
  return rec[lang];
}
