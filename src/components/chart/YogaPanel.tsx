import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { GrahaId } from "@/lib/astro/constants";
import { DIGNITY_KEYS, grahaName } from "@/lib/astro/labels";
import { YOGA_NAMES } from "@/lib/astro/panchanga-names";
import type { Dignity, ParashariChart } from "@/lib/astro/parashari";
import { detectYogas, type YogaResult, type YogaStatus } from "@/lib/astro/yogas";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STATUS: Record<YogaStatus, { key: DictKey; tone: string }> = {
  confirmed: { key: "ysConfirmed", tone: "bg-success/15 text-success border-success/30" },
  weakened: { key: "ysWeakened", tone: "bg-warning/15 text-warning border-warning/30" },
  cancelled: { key: "ysCancelled", tone: "bg-muted text-muted-foreground border-border line-through" },
  conditional: { key: "ysConditional", tone: "bg-gold/20 text-gold-foreground border-gold/40" },
  not_formed: { key: "ysNotFormed", tone: "bg-muted text-muted-foreground border-border" },
  insufficient_data: { key: "ysInsufficient", tone: "bg-destructive/10 text-destructive border-destructive/25" },
};
const SRC: Record<YogaResult["source"], DictKey> = { bphs: "srcBphs", phaladeepika: "srcPhaladeepika", later: "srcLater" };
const REF: Record<YogaResult["reference"], DictKey | null> = { lagna: "refLagna", moon: "refMoon", venus: "refVenus", none: null };

export function YogaPanel({ chart, timeKnown }: { chart: ParashariChart; timeKnown: boolean }) {
  const { t, lang } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [kuja2, setKuja2] = useState(true);
  const results = useMemo(() => detectYogas(chart, { timeKnown, kujaIncludesSecond: kuja2 }), [chart, timeKnown, kuja2]);
  const visible = results.filter((r) => showAll || r.status !== "not_formed");

  const reasonText = (r: string): string => {
    const [k, a, b] = r.split(":");
    switch (k) {
      case "combust":
        return t("rsCombust");
      case "partial":
        return t("rsPartial");
      case "weakLord":
        return t("rsWeakLord");
      case "conjunct":
        return t("rsConjunct");
      case "mutual7":
        return t("rsMutual7");
      case "exchange":
        return t("rsExchange");
      case "oneOutside":
        return t("rsOneOutside");
      case "bhangaMoon":
      case "bhangaLagna":
        return `${t("rsBhanga")}: ${(a ?? "").split(",").map((g) => grahaName(g as GrahaId, lang)).join(", ")} ${t("rsKendraOf")} ${t(k === "bhangaMoon" ? "refMoon" : "refLagna")}`;
      case "dispositor":
      case "exaltLord":
      case "exaltedHere":
        return `${grahaName(a as GrahaId, lang)} ${t("rsKendraOf")} ${t(b === "moon" ? "refMoon" : "refLagna")}`;
      case "dignity":
        return a && a in DIGNITY_KEYS ? t(DIGNITY_KEYS[a as Dignity]) : (a ?? "");
      case "house":
      case "fromMoon":
        return `${a}`;
      default:
        return r;
    }
  };

  const groups: { kind: YogaResult["kind"]; title: DictKey }[] = [
    { kind: "yoga", title: "secYogas" },
    { kind: "dosha", title: "secDoshas" },
  ];

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">{t("yoTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("yoIntro")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="yo-all" checked={showAll} onCheckedChange={setShowAll} />
            <Label htmlFor="yo-all" className="text-sm">
              {t("yoShowAll")}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="yo-kuja" checked={kuja2} onCheckedChange={setKuja2} />
            <Label htmlFor="yo-kuja" className="text-sm">
              {t("yoKujaSecond")}
            </Label>
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {groups.map((g) => {
          const list = visible.filter((r) => r.kind === g.kind);
          return (
            <div key={g.kind}>
              <h3 className="mb-2 font-semibold">{t(g.title)}</h3>
              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("yoNone")}</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((r, i) => {
                    const ref = REF[r.reference];
                    return (
                      <li key={`${r.id}-${i}`} className="rounded-xl border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">{YOGA_NAMES[r.id][lang]}</span>
                          <Badge variant="outline" className={cn("text-[11px]", STATUS[r.status].tone)}>
                            {t(STATUS[r.status].key)}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {r.planets.length > 0 && r.planets.map((p) => grahaName(p, lang)).join(", ")}
                          {r.houses.length > 0 && ` · ${r.houses.join(", ")}`}
                          {ref && ` (${t("yoFrom")} ${t(ref)})`}
                          {" · "}
                          {t(SRC[r.source])}
                        </div>
                        {r.reasons.length > 0 && (
                          <div className="mt-1 text-xs">{r.reasons.map(reasonText).join("; ")}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
