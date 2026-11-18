import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Sunrise, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceSearch } from "@/components/app/PlaceSearch";
import { userProfileQuery } from "@/lib/birth-profiles";
import { placeLabel } from "@/lib/geocode";
import { dateFromJd, jdFromDate, sunAltitude, sunMoonAt } from "@/lib/astro/ephemeris";
import { grahaName, nakshatraName, rashiName } from "@/lib/astro/labels";
import { CHOGHADIYA_QUALITY, computePanchanga, type Span, type SunriseConvention } from "@/lib/astro/panchanga";
import { CHOGHADIYA_NAMES, KARANA_NAMES, TITHIS, WEEKDAYS, YOGAS } from "@/lib/astro/panchanga-names";
import { formatDms, signOf } from "@/lib/astro/parashari";
import { AYANAMSHAS, isAyanamshaId, type AyanamshaId } from "@/lib/astro/settings";
import { formatOffset, parseDateTime, resolveUtcOffsetMinutes, zoneOffsetMinutesAt } from "@/lib/astro/time";
import { useEphemeris } from "@/lib/astro/use-chart";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/panchanga")({
  head: () => ({
    meta: [
      { title: "పంచాంగం — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Daily Panchanga: tithi, vara, nakshatra, yoga, karana, sunrise, Rahu Kalam, Choghadiya and Hora for any place." },
      { property: "og:title", content: "Panchanga — AstroJyotish Pro" },
      { property: "og:description", content: "Daily Panchanga calculated from Swiss Ephemeris for any date and place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(userProfileQuery()),
  component: PanchangaPage,
});

interface Loc {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
const HYDERABAD: Loc = { name: "హైదరాబాద్, తెలంగాణ, భారతదేశం", latitude: 17.385, longitude: 78.4867, timezone: "Asia/Kolkata" };

function todayIn(tz: string) {
  const d = new Date(Date.now() + zoneOffsetMinutesAt(Date.now(), tz) * 60000);
  return d.toISOString().slice(0, 10);
}

function PanchangaPage() {
  const { t, lang } = useI18n();
  const { data: me } = useSuspenseQuery(userProfileQuery());
  const [loc, setLoc] = useState<Loc>(HYDERABAD);
  const [date, setDate] = useState(() => todayIn(HYDERABAD.timezone));
  const [rule, setRule] = useState<SunriseConvention>("upper_limb_refraction");
  const [ayanamsha, setAyanamsha] = useState<AyanamshaId>(() => {
    const a = me?.default_ayanamsha;
    return a && isAyanamshaId(a) && a !== "tropical" ? a : "lahiri";
  });
  const { eph, error } = useEphemeris();
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));

  const result = useMemo(() => {
    if (!eph || !validDate) return null;
    try {
      const local = parseDateTime(date, "00:00:00");
      const offset = resolveUtcOffsetMinutes(local, loc.timezone);
      const midnightUtc = Date.UTC(local.year, local.month - 1, local.day) - offset * 60000;
      const weekday = new Date(Date.UTC(local.year, local.month - 1, local.day)).getUTCDay();
      const p = computePanchanga(
        {
          sunMoon: (jd) => sunMoonAt(eph, jd, ayanamsha),
          sunAltitude: (jd) => sunAltitude(eph, jd, loc.latitude, loc.longitude),
        },
        jdFromDate(new Date(midnightUtc)),
        weekday,
        rule,
      );
      return { p, offset, midnightUtc };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) } as const;
    }
  }, [eph, date, validDate, loc, rule, ayanamsha]);

  const fmt = useMemo(() => {
    const time = new Intl.DateTimeFormat(lang === "te" ? "te-IN" : "en-IN", {
      timeZone: loc.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const day = new Intl.DateTimeFormat(lang === "te" ? "te-IN" : "en-IN", { timeZone: loc.timezone, day: "numeric", month: "short" });
    return (jd: number | null, midnightUtc?: number) => {
      if (jd === null) return "—";
      const d = dateFromJd(jd);
      const nextDay = midnightUtc !== undefined && d.getTime() >= midnightUtc + 86_400_000;
      return nextDay ? `${time.format(d)} (${day.format(d)})` : time.format(d);
    };
  }, [lang, loc.timezone]);

  const span = (s: Span | null, m?: number) => (s ? `${fmt(s.start, m)} – ${fmt(s.end, m)}` : "—");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pnTitle")}</h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">{t("pnIntro")}</p>
        <div className="kolam-border mt-3 w-24" />
      </div>

      <section className="grid gap-4 rounded-2xl border bg-card p-4 shadow-card md:grid-cols-2 md:p-5 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="pn-date">{t("pnDate")}</Label>
          <div className="flex gap-2">
            <Input id="pn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button variant="outline" onClick={() => setDate(todayIn(loc.timezone))}>
              {t("pnToday")}
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{t("pnPlace")}</Label>
          <PlaceSearch
            value={loc.name}
            onPick={(p) => setLoc({ name: placeLabel(p), latitude: p.latitude, longitude: p.longitude, timezone: p.timezone })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("ayanamsha")}</Label>
          <Select value={ayanamsha} onValueChange={(v) => isAyanamshaId(v) && setAyanamsha(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(AYANAMSHAS) as AyanamshaId[])
                .filter((a) => a !== "tropical")
                .map((a) => (
                  <SelectItem key={a} value={a}>
                    {AYANAMSHAS[a][lang]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("pnSunriseRule")}</Label>
          <Select value={rule} onValueChange={(v) => setRule(v as SunriseConvention)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upper_limb_refraction">{t("pnUpperLimb")}</SelectItem>
              <SelectItem value="centre_no_refraction">{t("pnCentre")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {error || (result && "error" in result) ? (
        <p className="rounded-xl bg-destructive/10 p-4 text-destructive">{error ?? (result as { error: string }).error}</p>
      ) : !validDate ? (
        <p className="text-muted-foreground">{t("somethingWrong")}</p>
      ) : !result ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("calculating")}
        </div>
      ) : (
        <PanchangaView result={result} fmt={fmt} span={span} tz={loc.timezone} />
      )}
    </div>
  );

  function PanchangaView({
    result: { p, offset, midnightUtc },
    fmt: f,
    span: sp,
    tz,
  }: {
    result: { p: ReturnType<typeof computePanchanga>; offset: number; midnightUtc: number };
    fmt: (jd: number | null, m?: number) => string;
    span: (s: Span | null, m?: number) => string;
    tz: string;
  }) {
    const m = midnightUtc;
    const rows: { k: string; v: string; until: string; then: string }[] = [
      {
        k: t("pnTithi"),
        v: `${TITHIS[p.tithi.index]![lang]} · ${p.paksha === "shukla" ? t("pnShukla") : t("pnKrishna")}`,
        until: f(p.tithi.endsAt, m),
        then: TITHIS[p.tithi.next]![lang],
      },
      {
        k: t("pnNakshatra"),
        v: `${nakshatraName(p.nakshatra.index, lang)} · ${p.nakshatra.pada}`,
        until: f(p.nakshatra.endsAt, m),
        then: nakshatraName(p.nakshatra.next, lang),
      },
      { k: t("pnYoga"), v: YOGAS[p.yoga.index]![lang], until: f(p.yoga.endsAt, m), then: YOGAS[p.yoga.next]![lang] },
      { k: t("pnKarana"), v: KARANA_NAMES[p.karana.id][lang], until: f(p.karana.endsAt, m), then: KARANA_NAMES[p.karana.next][lang] },
    ];
    return (
      <div className="space-y-6">
        {p.sunrise === null && (
          <p className="flex items-center gap-2 rounded-xl bg-warning/10 p-3 text-sm text-warning">
            <AlertTriangle className="size-4" /> {t("pnNoSunrise")}
          </p>
        )}
        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
              <h2 className="text-lg font-semibold">
                {t("pnVara")}: {WEEKDAYS[p.weekday]![lang]}
              </h2>
              <span className="text-xs text-muted-foreground tabular">
                {tz} · {formatOffset(offset)}
              </span>
            </div>
            <dl className="divide-y">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3 sm:grid-cols-[8rem_1fr_auto]">
                  <dt className="text-muted-foreground">{r.k}</dt>
                  <dd className="font-semibold">{r.v}</dd>
                  <dd className="col-span-2 text-sm text-muted-foreground tabular sm:col-span-1 sm:text-right">
                    {r.until} {t("pnUntil")} · {t("pnThen")} {r.then}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-card p-4 shadow-card">
                <Sunrise className="mb-2 size-5 text-gold" />
                <div className="text-xs text-muted-foreground">{t("pnSunrise")}</div>
                <div className="text-2xl font-semibold tabular">{f(p.sunrise, m)}</div>
              </div>
              <div className="rounded-2xl border bg-card p-4 shadow-card">
                <Sunset className="mb-2 size-5 text-primary" />
                <div className="text-xs text-muted-foreground">{t("pnSunset")}</div>
                <div className="text-2xl font-semibold tabular">{f(p.sunset, m)}</div>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <h3 className="mb-2 font-semibold">{t("pnInauspicious")}</h3>
              <dl className="space-y-1.5 text-sm tabular">
                {(
                  [
                    [t("pnRahu"), p.rahuKalam],
                    [t("pnYama"), p.yamagandam],
                    [t("pnGulika"), p.gulikaKalam],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-destructive">{sp(v, m)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 border-t pt-1.5">
                  <dt className="text-muted-foreground">{t("pnAbhijit")}</dt>
                  <dd className="font-medium text-success">{sp(p.abhijit, m)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border bg-card p-4 text-sm shadow-card">
              <h3 className="mb-2 font-semibold">{t("pnSunMoon")}</h3>
              <div className="flex justify-between tabular">
                <span>{grahaName("sun", lang)}</span>
                <span>
                  {rashiName(signOf(p.sunLongitude), lang)} {formatDms(p.sunLongitude)}
                </span>
              </div>
              <div className="flex justify-between tabular">
                <span>{grahaName("moon", lang)}</span>
                <span>
                  {rashiName(signOf(p.moonLongitude), lang)} {formatDms(p.moonLongitude)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {p.choghadiya.day.length > 0 && (
          <section className="rounded-2xl border bg-card shadow-card">
            <h2 className="border-b px-5 py-4 text-lg font-semibold">{t("pnChoghadiya")}</h2>
            <div className="grid gap-6 p-5 md:grid-cols-2">
              {(
                [
                  [t("pnDay"), p.choghadiya.day],
                  [t("pnNight"), p.choghadiya.night],
                ] as const
              ).map(([title, list]) => (
                <div key={title}>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{title}</h3>
                  <ul className="space-y-1 text-sm tabular">
                    {list.map((c, i) => (
                      <li
                        key={i}
                        className={cn(
                          "flex justify-between rounded-md px-3 py-1.5",
                          CHOGHADIYA_QUALITY[c.id] === "good" && "bg-success/10 text-success",
                          CHOGHADIYA_QUALITY[c.id] === "bad" && "bg-destructive/10 text-destructive",
                          CHOGHADIYA_QUALITY[c.id] === "neutral" && "bg-muted",
                        )}
                      >
                        <span className="font-medium">{CHOGHADIYA_NAMES[c.id][lang]}</span>
                        <span>{sp(c, m)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {p.horas.length > 0 && (
          <section className="rounded-2xl border bg-card shadow-card">
            <h2 className="border-b px-5 py-4 text-lg font-semibold">{t("pnHora")}</h2>
            <ul className="grid gap-x-6 gap-y-1 p-5 text-sm tabular sm:grid-cols-2 lg:grid-cols-3">
              {p.horas.map((h, i) => (
                <li key={i} className="flex justify-between border-b border-dashed py-1">
                  <span className="font-medium">
                    {i + 1}. {grahaName(h.lord, lang)}
                  </span>
                  <span className="text-muted-foreground">{sp(h, m)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-muted-foreground">{t("pnMethod")}</p>
      </div>
    );
  }
}
