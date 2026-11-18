import { Fragment, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { grahaName } from "@/lib/astro/labels";
import { YOGINI_NAMES } from "@/lib/astro/panchanga-names";
import { yoginiDasha, yoginiSubPeriods, type YoginiPeriod } from "@/lib/astro/yogini";
import { splitYears } from "@/lib/astro/dasha";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function YoginiPanel({ moonLongitude, birth, timeZone }: { moonLongitude: number; birth: Date; timeZone: string }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const result = useMemo(() => yoginiDasha(moonLongitude, birth), [moonLongitude, birth]);
  const now = useMemo(() => Date.now(), []);
  const fmt = useMemo(() => {
    let f: Intl.DateTimeFormat;
    try {
      f = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      f = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return (d: Date) => f.format(d).replace(/\//g, "-");
  }, [timeZone]);
  const bal = splitYears(result.balanceYears);
  const running = (p: YoginiPeriod) => p.start.getTime() <= now && now < p.end.getTime();
  const label = (p: YoginiPeriod) => `${YOGINI_NAMES[p.yogini][lang]} (${grahaName(p.lord, lang)})`;

  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">{t("ygTitle")}</h2>
        <p className="text-xs text-muted-foreground">
          {t("ygIntro")} {t("birthBalance")}: {bal.y}
          {t("yearsShort")} {bal.m}
          {t("monthsShort")} {bal.d}
          {t("daysShort")}
        </p>
      </div>
      <div className="max-h-[28rem] overflow-y-auto">
        <Table className="tabular">
          <TableHeader>
            <TableRow>
              <TableHead>{t("ygYogini")}</TableHead>
              <TableHead>{t("start")}</TableHead>
              <TableHead>{t("end")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.periods.map((p, i) => (
              <Fragment key={i}>
                <TableRow
                  className={cn("cursor-pointer", running(p) && "bg-gold/15 font-semibold")}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <ChevronRight className={cn("size-3.5 transition-transform", open === i && "rotate-90")} />
                      {label(p)}
                    </span>
                  </TableCell>
                  <TableCell>{fmt(p.start)}</TableCell>
                  <TableCell>{fmt(p.end)}</TableCell>
                </TableRow>
                {open === i &&
                  yoginiSubPeriods(p).map((s, j) => (
                    <TableRow key={`${i}-${j}`} className={cn("text-sm", running(s) && "bg-gold/10 font-semibold")}>
                      <TableCell className="pl-10">{label(s)}</TableCell>
                      <TableCell>{fmt(s.start)}</TableCell>
                      <TableCell>{fmt(s.end)}</TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
