import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GrahaId } from "@/lib/astro/constants";
import { dateFromJd, grahaLongitudeAt, jdFromDate } from "@/lib/astro/ephemeris";
import { sadeSatiPeriods, saturnPhase, saturnPhases, signIngresses, TRANSIT_GRAHAS, type SaturnPhase } from "@/lib/astro/gochara";
import { grahaName, rashiName } from "@/lib/astro/labels";
import { formatDms, type ParashariChart } from "@/lib/astro/parashari";
import type { CalcSettings } from "@/lib/astro/settings";
import { useEphemeris } from "@/lib/astro/use-chart";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PHASE_KEYS: Record<SaturnPhase, DictKey> = {
  sade_rising: "phSadeRising",
  sade_peak: "phSadePeak",
  sade_setting: "phSadeSetting",
  kantaka: "phKantaka",
  ashtama: "phAshtama",
};

export function TransitPanel({
  chart,
  birth,
  settings,
  timeZone,
  timeKnown,
}: {
  chart: ParashariChart;
  birth: Date;
  settings: CalcSettings;
  timeZone: string;
  timeKnown: boolean;
}) {
  const { t, lang } = useI18n();
  const { eph } = useEphemeris();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const moonSign = chart.planets.find((p) => p.id === "moon")!.sign;
  const lagnaSign = chart.lagna.sign;
  const fmt = useMemo(() => {
    let f: Intl.DateTimeFormat;
    try {
      f = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      f = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return (jd: number) => f.format(dateFromJd(jd)).replace(/\//g, "-");
  }, [timeZone]);

  const at = useMemo(() => {
    const d = Date.parse(`${date}T12:00:00Z`);
    return Number.isNaN(d) ? null : jdFromDate(new Date(d));
  }, [date]);

  const now = useMemo(() => {
    if (!eph || at === null) return null;
    return TRANSIT_GRAHAS.flatMap((g) => {
      const p = grahaLongitudeAt(eph, at, g, settings);
      const rows: { id: GrahaId; lon: number; retro: boolean }[] = [{ id: g, lon: p.longitude, retro: g === "rahu" ? true : p.speed < 0 }];
      if (g === "rahu") rows.push({ id: "ketu", lon: (p.longitude + 180) % 360, retro: true });
      return rows;
    });
  }, [eph, at, settings]);

  const life = useMemo(() => {
    if (!eph) return null;
    const start = jdFromDate(birth);
    const end = start + 100 * 365.25;
    const lon = (jd: number) => grahaLongitudeAt(eph, jd, "saturn", settings).longitude;
    const ing = signIngresses(lon, start, end);
    const spans = saturnPhases(moonSign, Math.floor(lon(start) / 30), ing, start, end);
    return { spans, sade: sadeSatiPeriods(spans) };
  }, [eph, birth, settings, moonSign]);

  const sat = now?.find((r) => r.id === "saturn");
  const phaseNow = sat ? saturnPhase(moonSign, Math.floor(sat.lon / 30)) : null;
  const h = (from: number, lon: number) => ((Math.floor(lon / 30) - from + 12) % 12) + 1;

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4">
        <h2 className="text-lg font-semibold">{t("gcTitle")}</h2>
        <div className="space-y-1">
          <Label htmlFor="gc-date" className="text-xs">
            {t("gcDate")}
          </Label>
          <Input id="gc-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <Table className="tabular">
          <TableHeader>
            <TableRow>
              <TableHead>{t("planet")}</TableHead>
              <TableHead>{t("sign")}</TableHead>
              <TableHead className="text-right">{t("gcFromMoon")}</TableHead>
              <TableHead className="text-right">{t("gcFromLagna")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(now ?? []).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {grahaName(r.id, lang)}
                  {r.retro && r.id !== "rahu" && r.id !== "ketu" && <span className="ml-1 text-chart-retro">({t("retroAbbr")})</span>}
                </TableCell>
                <TableCell>
                  {rashiName(Math.floor(r.lon / 30), lang)} {formatDms(r.lon).split("′")[0]}′
                </TableCell>
                <TableCell className="text-right">{h(moonSign, r.lon)}</TableCell>
                <TableCell className={cn("text-right", !timeKnown && "text-muted-foreground")}>{timeKnown ? h(lagnaSign, r.lon) : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="space-y-4 text-sm">
          <div className={cn("rounded-xl p-4", phaseNow ? "bg-warning/10" : "bg-muted/50")}>
            <div className="text-xs text-muted-foreground">{t("gcNow")}</div>
            <div className="text-lg font-semibold">{phaseNow ? t(PHASE_KEYS[phaseNow]) : t("phNone")}</div>
          </div>
          <div>
            <div className="mb-1 font-semibold">{t("gcLifetime")}</div>
            <div className="max-h-80 overflow-y-auto rounded-lg border">
              <Table className="text-xs tabular">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("gcPhase")}</TableHead>
                    <TableHead>{t("start")}</TableHead>
                    <TableHead>{t("end")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(life?.spans ?? []).map((s, i) => {
                    const cur = at !== null && s.start <= at && at < s.end;
                    return (
                      <TableRow key={i} className={cn(cur && "bg-gold/15 font-semibold")}>
                        <TableCell>{t(PHASE_KEYS[s.phase])}</TableCell>
                        <TableCell>{fmt(s.start)}</TableCell>
                        <TableCell>{fmt(s.end)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {life && <p className="mt-1 text-xs text-muted-foreground">{t("gcSadeCount")}: {life.sade.length}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
