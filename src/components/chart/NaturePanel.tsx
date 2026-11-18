import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  arudhaPadas,
  badhaka,
  dispositorChain,
  finalDispositor,
  functionalNature,
  marakaLords,
  naturalNature,
  type FunctionalNature,
} from "@/lib/astro/bhava";
import { NAVAGRAHAS, SAPTA_GRAHAS, type GrahaId, type SaptaGraha } from "@/lib/astro/constants";
import { grahaName, rashiName } from "@/lib/astro/labels";
import type { ParashariChart } from "@/lib/astro/parashari";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const F_KEYS: Record<FunctionalNature, DictKey> = {
  yogakaraka: "fYogakaraka",
  benefic: "fBenefic",
  mixed: "fMixed",
  neutral: "fNeutral",
  malefic: "fMalefic",
};
const F_TONE: Record<FunctionalNature, string> = {
  yogakaraka: "bg-gold/25 text-gold-foreground border-gold/50",
  benefic: "bg-success/15 text-success border-success/30",
  mixed: "bg-warning/15 text-warning border-warning/30",
  neutral: "bg-muted text-muted-foreground border-border",
  malefic: "bg-destructive/10 text-destructive border-destructive/25",
};

export function NaturePanel({ chart, timeKnown }: { chart: ParashariChart; timeKnown: boolean }) {
  const { t, lang } = useI18n();
  const data = useMemo(() => {
    const signs: Partial<Record<GrahaId, number>> = {};
    const lons: Partial<Record<GrahaId, number>> = {};
    for (const p of chart.planets) {
      signs[p.id] = p.sign;
      lons[p.id] = p.longitude;
    }
    const lagna = chart.lagna.sign;
    return {
      signs,
      lons,
      functional: functionalNature(lagna),
      maraka: marakaLords(lagna),
      badhaka: badhaka(lagna),
      padas: arudhaPadas(lagna, signs),
      final: finalDispositor(signs),
    };
  }, [chart]);

  const rows = NAVAGRAHAS;
  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <h2 className="border-b px-5 py-4 text-lg font-semibold">{t("natureTitle")}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("planet")}</TableHead>
              <TableHead>{t("naturalNature")}</TableHead>
              {timeKnown && <TableHead>{t("functionalNature")}</TableHead>}
              {timeKnown && <TableHead>{t("owns")}</TableHead>}
              <TableHead>{t("dispositorChain")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((g) => {
              const nat = naturalNature(g, data.lons);
              const fn = (SAPTA_GRAHAS as GrahaId[]).includes(g) ? data.functional[g as SaptaGraha] : null;
              return (
                <TableRow key={g}>
                  <TableCell className="font-semibold">{grahaName(g, lang)}</TableCell>
                  <TableCell>
                    {nat && (
                      <Badge variant="outline" className={cn(nat === "benefic" ? F_TONE.benefic : F_TONE.malefic)}>
                        {t(nat === "benefic" ? "nBenefic" : "nMalefic")}
                      </Badge>
                    )}
                  </TableCell>
                  {timeKnown && (
                    <TableCell>
                      {fn ? (
                        <Badge variant="outline" className={F_TONE[fn.nature]}>
                          {t(F_KEYS[fn.nature])}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  )}
                  {timeKnown && <TableCell className="tabular">{fn ? fn.houses.join(", ") : "—"}</TableCell>}
                  <TableCell className="text-sm">
                    {dispositorChain(g, data.signs)
                      .map((x) => grahaName(x, lang))
                      .join(" → ")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <dl className="grid gap-x-8 gap-y-2 border-t px-5 py-4 text-sm sm:grid-cols-2">
        <Row k={t("finalDispositor")} v={data.final ? grahaName(data.final, lang) : t("noFinalDispositor")} />
        {timeKnown && (
          <>
            <Row
              k={t("maraka")}
              v={data.maraka.map((m) => `${m.house}: ${grahaName(m.lord, lang)}`).join(" · ")}
            />
            <Row
              k={t("badhaka")}
              v={`${data.badhaka.house} · ${rashiName(data.badhaka.sign, lang)} · ${grahaName(data.badhaka.lord, lang)}`}
            />
            <Row k={t("arudhaLagna")} v={rashiName(data.padas[0]!, lang)} />
            <Row k={t("upapada")} v={rashiName(data.padas[11]!, lang)} />
          </>
        )}
      </dl>

      {timeKnown && (
        <div className="border-t px-5 py-4">
          <h3 className="mb-2 text-sm font-semibold">{t("arudhaTitle")}</h3>
          <div className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-6 lg:grid-cols-12">
            {data.padas.map((s, i) => (
              <div key={i} className="rounded-lg border bg-background/60 px-2 py-1.5 text-center">
                <div className="text-xs text-muted-foreground">A{i + 1}</div>
                <div className="font-medium">{rashiName(s, lang)}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t("arudhaRuleNote")}</p>
        </div>
      )}
      <p className="border-t px-5 py-3 text-xs text-muted-foreground">{t("natureRuleNote")}</p>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed py-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
