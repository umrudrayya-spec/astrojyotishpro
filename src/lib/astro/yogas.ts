/**
 * Rule-based Yoga & Dosha engine (spec v3 §12–13). Consumes a ParashariChart only.
 * Every result carries a status, the chart factors that produced it, and the source tradition.
 */
import { RASHIS, SAPTA_GRAHAS, EXALTATION, type GrahaId, type SaptaGraha } from "./constants";
import type { ParashariChart, PlanetAnalysis } from "./parashari";

export type YogaStatus = "confirmed" | "weakened" | "cancelled" | "conditional" | "not_formed" | "insufficient_data";
export type YogaKind = "yoga" | "dosha";
export type YogaSource = "bphs" | "phaladeepika" | "later";

export type YogaId =
  | "ruchaka"
  | "bhadra"
  | "hamsa"
  | "malavya"
  | "shasha"
  | "gajakesari"
  | "budhaditya"
  | "chandra_mangala"
  | "sunapha"
  | "anapha"
  | "durudhura"
  | "kemadruma"
  | "adhi"
  | "raja"
  | "dhana"
  | "harsha"
  | "sarala"
  | "vimala"
  | "neecha_bhanga"
  | "kuja_dosha"
  | "kala_sarpa"
  | "grahana"
  | "guru_chandala";

export interface YogaResult {
  id: YogaId;
  kind: YogaKind;
  status: YogaStatus;
  /** Planets involved. */
  planets: GrahaId[];
  /** Houses (from Lagna unless `reference` says otherwise). */
  houses: number[];
  reference: "lagna" | "moon" | "venus" | "none";
  /** Short machine-readable reasons, rendered via i18n in the UI. */
  reasons: string[];
  source: YogaSource;
  lagnaDependent: boolean;
}

export interface YogaOptions {
  timeKnown: boolean;
  /** Kuja dosha houses: many South Indian texts include the 2nd; others do not. */
  kujaIncludesSecond: boolean;
}

const KENDRAS = [1, 4, 7, 10];
const TRIKONAS = [1, 5, 9];
const DUSTHANAS = [6, 8, 12];
const FIVE: SaptaGraha[] = ["mars", "mercury", "jupiter", "venus", "saturn"];
const houseFrom = (fromSign: number, sign: number) => ((sign - fromSign + 12) % 12) + 1;
const strongSign = (p: PlanetAnalysis) => p.dignity === "own" || p.dignity === "moolatrikona" || p.dignity === "exalted";

export function detectYogas(chart: ParashariChart, opts: YogaOptions): YogaResult[] {
  const P = (id: GrahaId) => chart.planets.find((p) => p.id === id)!;
  const moon = P("moon");
  const lagnaSign = chart.lagna.sign;
  const lordOf = (house: number): SaptaGraha => RASHIS[(lagnaSign + house - 1) % 12]!.lord;
  const out: YogaResult[] = [];
  const push = (r: Omit<YogaResult, "status"> & { status: YogaStatus }) => {
    out.push(r.lagnaDependent && !opts.timeKnown && r.status !== "not_formed" ? { ...r, status: "insufficient_data" } : r);
  };

  // 1. Pancha Mahapurusha (BPHS 75): own/exalted sign in a kendra from Lagna.
  const mpMap: Record<string, YogaId> = { mars: "ruchaka", mercury: "bhadra", jupiter: "hamsa", venus: "malavya", saturn: "shasha" };
  for (const g of FIVE) {
    const p = P(g);
    const formed = strongSign(p) && KENDRAS.includes(p.house);
    push({
      id: mpMap[g]!,
      kind: "yoga",
      status: !formed ? "not_formed" : p.combust ? "weakened" : "confirmed",
      planets: [g],
      houses: [p.house],
      reference: "lagna",
      reasons: formed ? [`dignity:${p.dignity}`, `house:${p.house}`, ...(p.combust ? ["combust"] : [])] : [],
      source: "bphs",
      lagnaDependent: true,
    });
  }

  // 2. Gajakesari: Jupiter in a kendra from the Moon.
  {
    const j = P("jupiter");
    const h = houseFrom(moon.sign, j.sign);
    const formed = KENDRAS.includes(h);
    const weak = j.dignity === "debilitated" || j.combust || j.dignity === "great_enemy" || j.dignity === "enemy";
    push({
      id: "gajakesari",
      kind: "yoga",
      status: !formed ? "not_formed" : weak ? "weakened" : "confirmed",
      planets: ["jupiter", "moon"],
      houses: [h],
      reference: "moon",
      reasons: formed ? [`fromMoon:${h}`, ...(weak ? [`dignity:${j.dignity}`, ...(j.combust ? ["combust"] : [])] : [])] : [],
      source: "phaladeepika",
      lagnaDependent: false,
    });
  }

  // 3. Budhaditya: Sun and Mercury in one sign; combust Mercury weakens it.
  {
    const me = P("mercury");
    const formed = me.sign === P("sun").sign;
    push({
      id: "budhaditya",
      kind: "yoga",
      status: !formed ? "not_formed" : me.combust ? "weakened" : "confirmed",
      planets: ["sun", "mercury"],
      houses: [me.house],
      reference: "lagna",
      reasons: formed && me.combust ? ["combust"] : [],
      source: "later",
      lagnaDependent: false,
    });
  }

  // 4. Chandra-Mangala: Moon and Mars together.
  push({
    id: "chandra_mangala",
    kind: "yoga",
    status: P("mars").sign === moon.sign ? "confirmed" : "not_formed",
    planets: ["moon", "mars"],
    houses: [moon.house],
    reference: "lagna",
    reasons: [],
    source: "phaladeepika",
    lagnaDependent: false,
  });

  // 5. Sunapha / Anapha / Durudhura / Kemadruma (BPHS 38): planets other than Sun & nodes in 2nd/12th from Moon.
  const in2 = FIVE.filter((g) => houseFrom(moon.sign, P(g).sign) === 2);
  const in12 = FIVE.filter((g) => houseFrom(moon.sign, P(g).sign) === 12);
  const lunar = (id: YogaId, formed: boolean, planets: GrahaId[]) =>
    push({ id, kind: "yoga", status: formed ? "confirmed" : "not_formed", planets, houses: [], reference: "moon", reasons: [], source: "bphs", lagnaDependent: false });
  lunar("sunapha", in2.length > 0 && in12.length === 0, in2);
  lunar("anapha", in12.length > 0 && in2.length === 0, in12);
  lunar("durudhura", in2.length > 0 && in12.length > 0, [...in2, ...in12]);
  {
    const formed = in2.length === 0 && in12.length === 0;
    const kendraFromMoon = SAPTA_GRAHAS.filter((g) => g !== "moon" && KENDRAS.includes(houseFrom(moon.sign, P(g).sign)));
    const kendraFromLagna = SAPTA_GRAHAS.filter((g) => g !== "moon" && KENDRAS.includes(P(g).house));
    let status: YogaStatus = "not_formed";
    const reasons: string[] = [];
    if (formed) {
      if (kendraFromMoon.length) {
        status = "cancelled";
        reasons.push(`bhangaMoon:${kendraFromMoon.join(",")}`);
      } else if (kendraFromLagna.length) {
        status = opts.timeKnown ? "cancelled" : "insufficient_data";
        reasons.push(`bhangaLagna:${kendraFromLagna.join(",")}`);
      } else status = "confirmed";
    }
    out.push({ id: "kemadruma", kind: "dosha", status, planets: ["moon"], houses: [], reference: "moon", reasons, source: "bphs", lagnaDependent: false });
  }

  // 6. Adhi yoga: benefics in 6th, 7th, 8th from the Moon. All three houses → confirmed; some → conditional.
  {
    const ben: SaptaGraha[] = ["mercury", "jupiter", "venus"];
    const placed = ben.filter((g) => [6, 7, 8].includes(houseFrom(moon.sign, P(g).sign)));
    const housesHit = new Set(placed.map((g) => houseFrom(moon.sign, P(g).sign)));
    push({
      id: "adhi",
      kind: "yoga",
      status: placed.length === 0 ? "not_formed" : housesHit.size === 3 ? "confirmed" : "conditional",
      planets: placed,
      houses: [...housesHit].sort(),
      reference: "moon",
      reasons: placed.length && housesHit.size < 3 ? ["partial"] : [],
      source: "bphs",
      lagnaDependent: false,
    });
  }

  // 7. Raja yoga: a kendra lord and a trikona lord (different planets) conjoined, in mutual 7th, or exchanging signs.
  {
    const pairs = new Set<string>();
    for (const k of [4, 7, 10, 1]) {
      for (const t of [5, 9, 1]) {
        if (k === t) continue;
        const a = lordOf(k);
        const b = lordOf(t);
        if (a === b) continue;
        const key = [a, b].sort().join("+");
        if (pairs.has(key)) continue;
        const pa = P(a);
        const pb = P(b);
        const conj = pa.sign === pb.sign;
        const mutual = houseFrom(pa.sign, pb.sign) === 7;
        const exchange = chart.parivartana.some((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
        if (!conj && !mutual && !exchange) continue;
        pairs.add(key);
        const weak = [pa, pb].some((p) => DUSTHANAS.includes(p.house) || p.dignity === "debilitated" || p.combust);
        push({
          id: "raja",
          kind: "yoga",
          status: weak ? "weakened" : "confirmed",
          planets: [a, b],
          houses: [k, t],
          reference: "lagna",
          reasons: [conj ? "conjunct" : mutual ? "mutual7" : "exchange", ...(weak ? ["weakLord"] : [])],
          source: "bphs",
          lagnaDependent: true,
        });
      }
    }
    if (!out.some((r) => r.id === "raja")) {
      push({ id: "raja", kind: "yoga", status: "not_formed", planets: [], houses: [], reference: "lagna", reasons: [], source: "bphs", lagnaDependent: true });
    }
  }

  // 8. Dhana yoga: lord of 2 or 11 conjoined with lord of 1, 5 or 9.
  {
    const found: [SaptaGraha, SaptaGraha, number, number][] = [];
    for (const w of [2, 11]) {
      for (const t of TRIKONAS) {
        const a = lordOf(w);
        const b = lordOf(t);
        if (a !== b && P(a).sign === P(b).sign && !found.some((f) => f[0] === a && f[1] === b)) found.push([a, b, w, t]);
      }
    }
    if (found.length === 0)
      push({ id: "dhana", kind: "yoga", status: "not_formed", planets: [], houses: [], reference: "lagna", reasons: [], source: "bphs", lagnaDependent: true });
    for (const [a, b, w, t] of found)
      push({ id: "dhana", kind: "yoga", status: "confirmed", planets: [a, b], houses: [w, t], reference: "lagna", reasons: ["conjunct"], source: "bphs", lagnaDependent: true });
  }

  // 9. Viparita Raja yogas: lord of 6/8/12 placed in 6/8/12.
  for (const [h, id] of [
    [6, "harsha"],
    [8, "sarala"],
    [12, "vimala"],
  ] as const) {
    const l = P(lordOf(h));
    push({
      id,
      kind: "yoga",
      status: DUSTHANAS.includes(l.house) ? "confirmed" : "not_formed",
      planets: [l.id],
      houses: [h, l.house],
      reference: "lagna",
      reasons: [],
      source: "phaladeepika",
      lagnaDependent: true,
    });
  }

  // 10. Neecha Bhanga (Phaladeepika 7): cancellation of debility.
  for (const g of SAPTA_GRAHAS) {
    const p = P(g);
    if (p.dignity !== "debilitated") continue;
    const debSign = p.sign;
    const dispositor = RASHIS[debSign]!.lord;
    const exaltLord = RASHIS[EXALTATION[g].sign]!.lord;
    const exaltedHere = SAPTA_GRAHAS.find((x) => EXALTATION[x].sign === debSign);
    const reasons: string[] = [];
    const inKendra = (x: SaptaGraha, ref: "lagna" | "moon") =>
      KENDRAS.includes(ref === "lagna" ? P(x).house : houseFrom(moon.sign, P(x).sign));
    for (const [x, tag] of [
      [dispositor, "dispositor"],
      [exaltLord, "exaltLord"],
      ...(exaltedHere ? [[exaltedHere, "exaltedHere"] as const] : []),
    ] as const) {
      if (inKendra(x, "moon")) reasons.push(`${tag}:${x}:moon`);
      else if (inKendra(x, "lagna")) reasons.push(`${tag}:${x}:lagna`);
    }
    const onlyLagna = reasons.length > 0 && reasons.every((r) => r.endsWith(":lagna"));
    out.push({
      id: "neecha_bhanga",
      kind: "yoga",
      status: reasons.length === 0 ? "not_formed" : onlyLagna && !opts.timeKnown ? "insufficient_data" : "confirmed",
      planets: [g],
      houses: [p.house],
      reference: "lagna",
      reasons,
      source: "phaladeepika",
      lagnaDependent: false,
    });
  }

  // 11. Kuja dosha from Lagna, Moon and Venus.
  {
    const mars = P("mars");
    const set = opts.kujaIncludesSecond ? [1, 2, 4, 7, 8, 12] : [1, 4, 7, 8, 12];
    const exception = mars.dignity === "own" || mars.dignity === "moolatrikona" || mars.dignity === "exalted";
    for (const [ref, sign] of [
      ["lagna", lagnaSign],
      ["moon", moon.sign],
      ["venus", P("venus").sign],
    ] as const) {
      const h = houseFrom(sign, mars.sign);
      const formed = set.includes(h);
      push({
        id: "kuja_dosha",
        kind: "dosha",
        status: !formed ? "not_formed" : exception ? "cancelled" : "confirmed",
        planets: ["mars"],
        houses: [h],
        reference: ref,
        reasons: formed && exception ? [`dignity:${mars.dignity}`] : [],
        source: "later",
        lagnaDependent: ref === "lagna",
      });
    }
  }

  // 12. Kala Sarpa: all seven grahas on one side of the Rahu–Ketu axis (later tradition, not in BPHS).
  {
    const rahu = P("rahu").longitude;
    const side = (lon: number) => ((lon - rahu + 360) % 360) < 180;
    const sides = SAPTA_GRAHAS.map((g) => side(P(g).longitude));
    const a = sides.filter(Boolean).length;
    const oneSide = a === 7 || a === 0;
    const nearly = a === 6 || a === 1;
    out.push({
      id: "kala_sarpa",
      kind: "dosha",
      status: oneSide ? "confirmed" : "not_formed",
      planets: ["rahu", "ketu"],
      houses: [],
      reference: "none",
      reasons: nearly ? ["oneOutside"] : [],
      source: "later",
      lagnaDependent: false,
    });
  }

  // 13. Grahana dosha (Sun/Moon with a node) and Guru-Chandala (Jupiter with Rahu) — later tradition.
  {
    const nodes = [P("rahu").sign, P("ketu").sign];
    const lum = (["sun", "moon"] as const).filter((g) => nodes.includes(P(g).sign));
    out.push({
      id: "grahana",
      kind: "dosha",
      status: lum.length ? "confirmed" : "not_formed",
      planets: lum,
      houses: lum.map((g) => P(g).house),
      reference: "lagna",
      reasons: [],
      source: "later",
      lagnaDependent: false,
    });
    out.push({
      id: "guru_chandala",
      kind: "dosha",
      status: P("jupiter").sign === P("rahu").sign ? "confirmed" : "not_formed",
      planets: ["jupiter", "rahu"],
      houses: [P("jupiter").house],
      reference: "lagna",
      reasons: [],
      source: "later",
      lagnaDependent: false,
    });
  }

  return out;
}
