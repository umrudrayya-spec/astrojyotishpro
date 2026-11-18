import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currentPeriods, splitYears, subPeriods, vimshottari, type DashaPeriod, type DashaYearConvention } from "@/lib/astro/dasha";
import { grahaName, nakshatraName } from "@/lib/astro/labels";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVEL_KEYS: DictKey[] = ["dashaLevel1", "dashaLevel2", "dashaLevel3", "dashaLevel4", "dashaLevel5"];

function useDateFormat(timeZone: string) {
  return useMemo(() => {
    let fmt: Intl.DateTimeFormat;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return (d: Date) => fmt.format(d).replace(/\//g, "-");
  }, [timeZone]);
}

export function DashaPanel({ moonLongitude, birth, timeZone }: { moonLongitude: number; birth: Date; timeZone: string }) {
  const { t, lang } = useI18n();
  const [convention, setConvention] = useState<DashaYearConvention>("julian");
  const [open, setOpen] = useState<string[]>([]);
  const fmt = useDateFormat(timeZone);
  const result = useMemo(() => vimshottari(moonLongitude, birth, convention), [moonLongitude, birth, convention]);
  const now = useMemo(() => new Date(), []);
  const running = useMemo(() => currentPeriods(result, now, 5), [result, now]);
  const runningKeys = new Set(running.map((p) => p.path.join(">")));
  const bal = splitYears(result.balanceYears, convention);
  const dur = (y: number) => {
    const s = splitYears(y, convention);
    return `${s.y}${t("yearsShort")} ${s.m}${t("monthsShort")} ${s.d}${t("daysShort")}`;
  };

  const toggle = (p: DashaPeriod) => {
    const key = p.path.join(">");
    setOpen((cur) => {
      const atLevel = cur[p.level - 1];
      const base = cur.slice(0, p.level - 1);
      return atLevel === key ? base : [...base, key];
    });
  };

  const renderRows = (periods: DashaPeriod[]): ReactNode =>
    periods.map((p) => {
      const key = p.path.join(">");
      const isOpen = open[p.level - 1] === key;
      const isRunning = runningKeys.has(key);
      const canOpen = p.level < 5;
      return (
        <Fragment key={key}>
          <TableRow
            onClick={canOpen ? () => toggle(p) : undefined}
            className={cn(canOpen && "cursor-pointer", isRunning && "bg-gold/15 font-semibold")}
          >
            <TableCell>
              <span className="inline-flex items-center gap-1" style={{ paddingLeft: `${(p.level - 1) * 1.1}rem` }}>
                {canOpen ? (
                  <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", isOpen && "rotate-90")} />
                ) : (
                  <span className="inline-block w-3.5" />
                )}
                {p.path.map((g) => grahaName(g, lang)).join(" › ")}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground">{t(LEVEL_KEYS[p.level - 1]!)}</TableCell>
            <TableCell>{fmt(p.start)}</TableCell>
            <TableCell>{fmt(p.end)}</TableCell>
            <TableCell className="text-right">{dur(p.years)}</TableCell>
          </TableRow>
          {isOpen && renderRows(subPeriods(p, convention))}
        </Fragment>
      );
    });

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b px-5 py-4">
        <h2 className="text-lg font-semibold">{t("dashaTitle")}</h2>
        <div className="w-full space-y-1.5 sm:w-64">
          <Label className="text-xs">{t("dashaYear")}</Label>
          <Select value={convention} onValueChange={(v) => setConvention(v as DashaYearConvention)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="julian">{t("yearJulian")}</SelectItem>
              <SelectItem value="tropical">{t("yearTropical")}</SelectItem>
              <SelectItem value="savana">{t("yearSavana")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-4 text-sm md:grid-cols-3 tabular">
        <div>
          <div className="text-xs text-muted-foreground">{t("moonNakshatra")}</div>
          <div className="font-semibold">
            {nakshatraName(result.birthNakshatra, lang)} · {grahaName(result.birthLord, lang)} ({(result.traversed * 100).toFixed(2)}%)
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{t("birthBalance")}</div>
          <div className="font-semibold">
            {grahaName(result.birthLord, lang)} — {bal.y}
            {t("yearsShort")} {bal.m}
            {t("monthsShort")} {bal.d}
            {t("daysShort")}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">
            {t("currentDasha")} ({fmt(now)})
          </div>
          <div className="font-semibold">{running.map((p) => grahaName(p.lord, lang)).join(" › ") || "—"}</div>
          {running.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {t(LEVEL_KEYS[running.length - 1]!)} {t("end")}: {fmt(running[running.length - 1]!.end)}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border-t">
        <Table className="tabular">
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashaLevel1")}</TableHead>
              <TableHead />
              <TableHead>{t("start")}</TableHead>
              <TableHead>{t("end")}</TableHead>
              <TableHead className="text-right">{t("duration")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows(result.mahadashas)}</TableBody>
        </Table>
      </div>
      <p className="space-y-1 border-t px-5 py-3 text-xs text-muted-foreground">
        {t("dashaHint")} {t("datesInTz")}: {timeZone}. {t("dashaNote")}
      </p>
    </section>
  );
}
