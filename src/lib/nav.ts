import {
  BookOpen,
  Bot,
  Briefcase,
  Calculator,
  CalendarDays,
  CircleDot,
  Clock,
  Compass,
  FileText,
  FlaskConical,
  GraduationCap,
  Grid3x3,
  Hash,
  HeartHandshake,
  HeartPulse,
  Home,
  Landmark,
  LayoutDashboard,
  Library,
  Moon,
  Orbit,
  Plane,
  Scale,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  Timer,
  TrendingUp,
  Users,
  Wallet,
  Waypoints,
  Baby,
  HelpCircle,
  Layers,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { DictKey } from "@/lib/i18n";

/** Routes that exist today. A section with `to` is a real link; one without is shown as "coming". */
export type NavPath = "/dashboard" | "/profiles" | "/chart" | "/panchanga" | "/settings";

export interface NavItem {
  id: string;
  label: DictKey;
  icon: LucideIcon;
  to?: NavPath;
  /** Extra words matched by global search (both languages). */
  keywords?: string;
}

export interface NavGroup {
  id: string;
  label: DictKey;
  items: NavItem[];
}

/** Spec v3 §2.1 — the 40 primary sections, grouped into expandable categories, plus Birth profiles. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "charts",
    label: "grpCharts",
    items: [
      { id: "dashboard", label: "navDashboard", icon: LayoutDashboard, to: "/dashboard", keywords: "home" },
      { id: "profiles", label: "navProfiles", icon: Users, to: "/profiles", keywords: "people family clients" },
      { id: "chart", label: "navChart", icon: CircleDot, to: "/chart", keywords: "kundali rashi d1 lagna" },
      { id: "analysis", label: "secAnalysis", icon: Sparkles },
      { id: "calculators", label: "secCalculators", icon: Calculator },
    ],
  },
  {
    id: "basics",
    label: "grpBasics",
    items: [
      { id: "grahas", label: "secGrahas", icon: Sun },
      { id: "rashis", label: "secRashis", icon: Orbit },
      { id: "bhavas", label: "secBhavas", icon: Home },
      { id: "nakshatras", label: "secNakshatras", icon: Star },
    ],
  },
  {
    id: "techniques",
    label: "grpTechniques",
    items: [
      { id: "vargas", label: "secVargas", icon: Grid3x3, to: "/chart", keywords: "navamsha d9 d10 varga" },
      { id: "strength", label: "secStrength", icon: Scale, keywords: "shadbala" },
      { id: "yogas", label: "secYogas", icon: Sparkles, to: "/chart", keywords: "raja gajakesari hamsa neecha bhanga" },
      { id: "doshas", label: "secDoshas", icon: ShieldAlert, to: "/chart", keywords: "kuja manglik kala sarpa kemadruma" },
      { id: "dashas", label: "secDashas", icon: Timer, to: "/chart", keywords: "vimshottari yogini mahadasha antardasha" },
      { id: "gochar", label: "secGochar", icon: TrendingUp, to: "/chart", keywords: "transit sade sati elinati shani ashtama" },
      { id: "ashtakavarga", label: "secAshtakavarga", icon: Layers, to: "/chart", keywords: "bav sav bindu" },
    ],
  },
  {
    id: "schools",
    label: "grpSchools",
    items: [
      { id: "parashari", label: "secParashari", icon: Compass, to: "/chart", keywords: "drishti aspects maraka badhaka arudha" },
      { id: "jaimini", label: "secJaimini", icon: Waypoints, to: "/chart", keywords: "karaka chara atmakaraka argala" },
      { id: "kp", label: "secKp", icon: Hash, keywords: "krishnamurti sub lord" },
    ],
  },
  {
    id: "life",
    label: "grpLife",
    items: [
      { id: "marriage", label: "secMarriage", icon: HeartHandshake },
      { id: "career", label: "secCareer", icon: Briefcase },
      { id: "wealth", label: "secWealth", icon: Wallet },
      { id: "health", label: "secHealth", icon: HeartPulse },
      { id: "education", label: "secEducation", icon: Baby },
      { id: "property", label: "secProperty", icon: Plane },
      { id: "spiritual", label: "secSpiritual", icon: Moon },
    ],
  },
  {
    id: "timing",
    label: "grpTiming",
    items: [
      { id: "panchanga", label: "secPanchanga", icon: CalendarDays, to: "/panchanga", keywords: "tithi rahu kalam choghadiya hora sunrise" },
      { id: "muhurta", label: "secMuhurta", icon: Clock },
      { id: "prashna", label: "secPrashna", icon: HelpCircle, keywords: "horary" },
      { id: "rectification", label: "secRectification", icon: Timer },
      { id: "compatibility", label: "secCompatibility", icon: Users, keywords: "matching ashtakoota guna" },
      { id: "numerology", label: "secNumerology", icon: Hash },
      { id: "western", label: "secWestern", icon: Globe },
    ],
  },
  {
    id: "ai",
    label: "grpAi",
    items: [
      { id: "ai", label: "secAi", icon: Bot, keywords: "gemini chat" },
      { id: "reports", label: "secReports", icon: FileText, keywords: "pdf" },
    ],
  },
  {
    id: "knowledge",
    label: "grpKnowledge",
    items: [
      { id: "encyclopedia", label: "secEncyclopedia", icon: BookOpen },
      { id: "sanatana", label: "secSanatana", icon: Landmark },
      { id: "learning", label: "secLearning", icon: GraduationCap },
      { id: "research", label: "secResearch", icon: FlaskConical },
      { id: "reference", label: "secReference", icon: Library },
    ],
  },
  {
    id: "account",
    label: "grpAccount",
    items: [{ id: "settings", label: "secSettings", icon: Settings, to: "/settings", keywords: "ayanamsha language theme" }],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** Spec sections (40) — everything except the extra Birth profiles entry. */
export const SPEC_SECTION_COUNT = NAV_ITEMS.filter((i) => i.id !== "profiles").length;

/** Group + item whose route best matches a pathname (first item that owns the path). */
export function findNavForPath(pathname: string): { group: NavGroup; item: NavItem } | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.to && (path === item.to || path.startsWith(`${item.to}/`))) return { group, item };
    }
  }
  return null;
}

