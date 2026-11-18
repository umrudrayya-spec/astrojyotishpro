import { useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NAVAGRAHAS, type GrahaId } from "@/lib/astro/constants";
import { analyseKp } from "@/lib/astro/kp";
import { grahaName, nakshatraName, rashiName } from "@/lib/astro/labels";
import { formatDms } from "@/lib/astro/parashari";
import type { CalcSettings } from "@/lib/astro/settings";
import { useChart } from "@/lib/astro/use-chart";
import { useI18n } from "@/lib/i18n";

type AyanChoice = "kp" | "chart";

export function KpPanel({
  input,
  settings,
  timeKnown,
}: {
  input: { utc: Date; latitude: number; longitude: number };
  settings: CalcSettings;
  timeKnown: boolean;
}) {
  const { t, lang } = useI18n();
  const [ayan, setAyan] = useState<AyanChoice>("kp");
  const kpSettings = useMemo<CalcSettings>(
    () => ({ ...settings, ayanamsha: ayan === "kp" ? "kp_old" : settings.ayanamsha, houseSystem: "placidus" }),
    [settings, ayan],
  );
  const { raw, error } = useChart(input, kpSettings);
  const kp = useMemo(() => {
    if (!raw) return null;
    const lons: Partial<Record<GrahaId, number>> = {};
    for (const b of raw.bodies) if (NAVAGRAHAS.includes(b.id)) lons[b.id] = b.longitude;
    return analyseKp(lons, raw.cusps);
  }, [raw]);
  const g = (id: GrahaId) => grahaName(id, lang);
  const names = (ids: GrahaId[]) => (ids.length ? ids.map(g).join(", ") : "—");
  const pos = (lon: number) => `${rashiName(Math.floor(lon / 30), lang)} ${formatDms(lon % 30)}`;

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4">
        <div className="max-w-2xl space-y-1">
          <h2 className="text-lg font-semibold">{t("kpTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("kpIntro")}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t("kpAyanamsha")}</Label>
          <Select value={ayan} onValueChange={(v) => setAyan(v as AyanChoice)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kp">{t("kpUseKp")}</SelectItem>
              <SelectItem value="chart">{t("kpUseChart")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!timeKnown && (
        <p className="flex items-center gap-2 border-b bg-destructive/10 px-5 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" /> {t("kpTimeWarn")}
        </p>
      )}
      {error && <p className="px-5 py-4 text-sm text-destructive">{error}</p>}
      {!kp && !error && (
        <div className="flex items-center gap-2 px-5 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {kp && (
        <div className="space-y-6 p-5">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="overflow-x-auto">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("kpCusps")}</h3>
              <Table className="tabular">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("kpCusp")}</TableHead>
                    <TableHead>{t("longitude")}</TableHead>
                    <TableHead>{t("kpSignLord")}</TableHead>
                    <TableHead>{t("kpStarLord")}</TableHead>
                    <TableHead>{t("kpSubLord")}</TableHead>
                    <TableHead>{t("kpSubSub")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kp.cusps.map((c) => (
                    <TableRow key={c.house}>
                      <TableCell className="font-medium">{c.house}</TableCell>
                      <TableCell className="whitespace-nowrap">{pos(c.longitude)}</TableCell>
                      <TableCell>{g(c.signLord)}</TableCell>
                      <TableCell>{g(c.starLord)}</TableCell>
                      <TableCell className="font-semibold">{g(c.subLord)}</TableCell>
                      <TableCell>{g(c.subSubLord)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="overflow-x-auto">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("kpPlanets")}</h3>
              <Table className="tabular">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("planet")}</TableHead>
                    <TableHead>{t("longitude")}</TableHead>
                    <TableHead>{t("house")}</TableHead>
                    <TableHead>{t("kpStarLord")}</TableHead>
                    <TableHead>{t("kpSubLord")}</TableHead>
                    <TableHead>{t("kpSubSub")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kp.planets.map((p) => (
                    <TableRow key={p.planet}>
                      <TableCell className="font-medium">{g(p.planet)}</TableCell>
                      <TableCell className="whitespace-nowrap" title={nakshatraName(p.nakshatra, lang)}>
                        {pos(p.longitude)}
                      </TableCell>
                      <TableCell>{p.house}</TableCell>
                      <TableCell>{g(p.starLord)}</TableCell>
                      <TableCell className="font-semibold">{g(p.subLord)}</TableCell>
                      <TableCell>{g(p.subSubLord)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="overflow-x-auto">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("kpSignificators")}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("house")}</TableHead>
                  <TableHead>{t("kpL1")}</TableHead>
                  <TableHead>{t("kpL2")}</TableHead>
                  <TableHead>{t("kpL3")}</TableHead>
                  <TableHead>{t("kpL4")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kp.significators.map((s) => (
                  <TableRow key={s.house}>
                    <TableCell className="font-medium">{s.house}</TableCell>
                    <TableCell>{names(s.l1)}</TableCell>
                    <TableCell>{names(s.l2)}</TableCell>
                    <TableCell>{names(s.l3)}</TableCell>
                    <TableCell>{names(s.l4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{t("kpPlanetHouses")}</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {kp.planets.map((p) => (
                <span key={p.planet} className="rounded-lg border bg-muted/40 px-3 py-1.5 tabular">
                  <span className="font-medium">{g(p.planet)}</span>: {kp.planetHouses[p.planet].join(", ") || "—"}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("kpNote")}</p>
        </div>
      )}
    </section>
  );
}
