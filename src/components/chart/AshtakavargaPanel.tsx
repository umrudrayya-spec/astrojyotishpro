import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ashtakavarga, trikonaShodhana, type AvReference } from "@/lib/astro/ashtakavarga";
import { SAPTA_GRAHAS } from "@/lib/astro/constants";
import { grahaName, rashiName } from "@/lib/astro/labels";
import type { ParashariChart } from "@/lib/astro/parashari";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AshtakavargaPanel({ chart, timeKnown }: { chart: ParashariChart; timeKnown: boolean }) {
  const { t, lang } = useI18n();
  const [shodhana, setShodhana] = useState(false);
  const result = useMemo(() => {
    const signs = { lagna: chart.lagna.sign } as Record<AvReference, number>;
    for (const g of SAPTA_GRAHAS) signs[g] = chart.planets.find((p) => p.id === g)!.sign;
    return ashtakavarga(signs);
  }, [chart]);
  const rows = SAPTA_GRAHAS.map((g) => ({ g, vals: shodhana ? trikonaShodhana(result.bav[g]) : result.bav[g] }));
  const sav = Array.from({ length: 12 }, (_, s) => rows.reduce((a, r) => a + r.vals[s]!, 0));
  const lagnaSign = chart.lagna.sign;

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">{t("avTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("avIntro")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="av-shodhana" checked={shodhana} onCheckedChange={setShodhana} />
          <Label htmlFor="av-shodhana" className="text-sm">
            {t("avTrikona")}
          </Label>
        </div>
      </div>
      {!timeKnown && (
        <p className="flex items-center gap-2 border-b bg-warning/10 px-5 py-2 text-xs text-warning">
          <AlertTriangle className="size-3.5" /> {t("lagnaDependsOnTime")}
        </p>
      )}
      <div className="overflow-x-auto">
        <Table className="tabular text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">{t("planet")}</TableHead>
              {Array.from({ length: 12 }, (_, s) => (
                <TableHead key={s} className={cn("px-2 text-center text-xs", s === lagnaSign && "text-primary")}>
                  {rashiName(s, lang).slice(0, lang === "te" ? 3 : 3)}
                </TableHead>
              ))}
              <TableHead className="text-center">{t("avTotal")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ g, vals }) => (
              <TableRow key={g}>
                <TableCell className="text-left font-medium">{grahaName(g, lang)}</TableCell>
                {vals.map((v, s) => (
                  <TableCell key={s} className={cn("px-2", v >= 5 && "font-semibold text-success", v <= 2 && "text-muted-foreground")}>
                    {v}
                  </TableCell>
                ))}
                <TableCell className="font-semibold">{vals.reduce((a, b) => a + b, 0)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell className="text-left">{t("avSav")}</TableCell>
              {sav.map((v, s) => (
                <TableCell key={s} className={cn("px-2", v >= 28 ? "text-success" : v < 25 && "text-destructive")}>
                  {v}
                </TableCell>
              ))}
              <TableCell>{sav.reduce((a, b) => a + b, 0)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="px-5 py-3 text-xs text-muted-foreground">{t("avPending")}</p>
    </section>
  );
}
