import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NAVAGRAHAS, type GrahaId } from "@/lib/astro/constants";
import { argala, charaKarakas, karakamsha, rashiAspects, type KarakaScheme } from "@/lib/astro/jaimini";
import { grahaName, rashiName } from "@/lib/astro/labels";
import { KARAKA_NAMES } from "@/lib/astro/panchanga-names";
import { formatDms, type ParashariChart } from "@/lib/astro/parashari";
import { useI18n } from "@/lib/i18n";

export function JaiminiPanel({ chart, timeKnown }: { chart: ParashariChart; timeKnown: boolean }) {
  const { t, lang } = useI18n();
  const [scheme, setScheme] = useState<KarakaScheme>("seven");
  const data = useMemo(() => {
    const lons: Partial<Record<GrahaId, number>> = {};
    const signs: Partial<Record<GrahaId, number>> = {};
    for (const p of chart.planets) {
      if (!NAVAGRAHAS.includes(p.id)) continue;
      lons[p.id] = p.longitude;
      signs[p.id] = p.sign;
    }
    const karakas = charaKarakas(lons, scheme);
    const ak = karakas[0]!;
    const lagna = chart.lagna.sign;
    const aspecting = Array.from({ length: 12 }, (_, s) => s).filter((s) => rashiAspects(s).includes(lagna));
    return {
      karakas,
      karakamsha: karakamsha(lons[ak.planet]!),
      aspecting,
      planetsIn: (s: number) => (Object.entries(signs) as [GrahaId, number][]).filter(([, v]) => v === s).map(([g]) => g),
      argala: argala(lagna, signs),
    };
  }, [chart, scheme]);
  const names = (ids: GrahaId[]) => (ids.length ? ids.map((g) => grahaName(g, lang)).join(", ") : "—");

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4">
        <h2 className="text-lg font-semibold">{t("jmTitle")}</h2>
        <div className="space-y-1">
          <Label className="text-xs">{t("jmScheme")}</Label>
          <Select value={scheme} onValueChange={(v) => setScheme(v as KarakaScheme)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seven">{t("jmSeven")}</SelectItem>
              <SelectItem value="eight">{t("jmEight")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <Table className="tabular">
          <TableHeader>
            <TableRow>
              <TableHead>{t("jmKaraka")}</TableHead>
              <TableHead>{t("planet")}</TableHead>
              <TableHead className="text-right">{t("jmDegree")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.karakas.map((k) => (
              <TableRow key={k.karaka}>
                <TableCell className="font-medium">
                  {KARAKA_NAMES[k.karaka][lang]} <span className="text-xs text-muted-foreground">({k.karaka})</span>
                </TableCell>
                <TableCell>
                  {grahaName(k.planet, lang)}
                  {k.nearTie && (
                    <Badge variant="outline" className="ml-2 border-warning/40 text-[10px] text-warning" title={t("jmNearTie")}>
                      ≈
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatDms(k.effectiveDegree, false)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="space-y-5 text-sm">
          {data.karakas.some((k) => k.nearTie) && <p className="text-xs text-warning">≈ {t("jmNearTie")}</p>}
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">{t("jmKarakamsha")}</div>
            <div className="text-xl font-semibold">{rashiName(data.karakamsha, lang)}</div>
          </div>
          {!timeKnown && (
            <p className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
              <AlertTriangle className="size-3.5" /> {t("lagnaDependsOnTime")}
            </p>
          )}
          <div>
            <div className="mb-1 font-semibold">{t("jmRashiDrishti")}</div>
            <ul className="space-y-1">
              {data.aspecting.map((s) => (
                <li key={s} className="flex justify-between gap-3 border-b border-dashed py-1">
                  <span>{rashiName(s, lang)}</span>
                  <span className="text-muted-foreground">{names(data.planetsIn(s))}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1 font-semibold">{t("jmArgala")}</div>
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("jmArgalaFrom")}</TableHead>
                  <TableHead>{t("jmObstruction")}</TableHead>
                  <TableHead>{t("jmStatus")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.argala.map((a) => (
                  <TableRow key={a.from}>
                    <TableCell>
                      {a.from} · {names(a.planets)}
                    </TableCell>
                    <TableCell>
                      {a.obstruction} · {names(a.obstructors)}
                    </TableCell>
                    <TableCell>
                      {a.status === "argala" ? t("jmArgalaYes") : a.status === "obstructed" ? t("jmArgalaBlocked") : t("jmArgalaNone")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
