import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, HeartHandshake, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { birthProfilesQuery, userProfileQuery, type BirthProfile } from "@/lib/birth-profiles";
import type { SaptaGraha, GrahaId } from "@/lib/astro/constants";
import { jdFromDate, sunMoonAt } from "@/lib/astro/ephemeris";
import { grahaName, nakshatraName, rashiName } from "@/lib/astro/labels";
import { ashtakoota, moonData, type Gana, type KootaResult, type Nadi, type YoniAnimal } from "@/lib/astro/matching";
import { GANA_LABELS, KOOTA_NAMES, NADI_LABELS, VARNA_LABELS, YONI_LABELS } from "@/lib/astro/matching-names";
import { AYANAMSHAS, isAyanamshaId, type AyanamshaId } from "@/lib/astro/settings";
import { localToUtc, parseDateTime } from "@/lib/astro/time";
import { useEphemeris } from "@/lib/astro/use-chart";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/matching")({
  head: () => ({
    meta: [
      { title: "వివాహ పొంతన — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Ashtakoota Guna Milan (36 points) between two saved birth profiles, from Swiss Ephemeris Moon positions." },
      { property: "og:title", content: "Marriage matching — AstroJyotish Pro" },
      { property: "og:description", content: "Ashtakoota 36-point Guna Milan for two birth charts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(birthProfilesQuery()),
      context.queryClient.ensureQueryData(userProfileQuery()),
    ]);
  },
  component: MatchingPage,
});

const BAND_KEYS: Record<string, DictKey> = {
  low: "mtBandLow",
  average: "mtBandAverage",
  good: "mtBandGood",
  excellent: "mtBandExcellent",
};

function utcOf(p: BirthProfile, time?: string) {
  return localToUtc(parseDateTime(p.birth_date, time ?? (p.time_known ? p.birth_time : "12:00:00")), p.utc_offset_minutes);
}

function MatchingPage() {
  const { t, lang } = useI18n();
  const { data: all } = useSuspenseQuery(birthProfilesQuery());
  const { data: me } = useSuspenseQuery(userProfileQuery());
  const profiles = useMemo(() => all.filter((p) => !p.archived_at), [all]);
  const [boyId, setBoyId] = useState<string>("");
  const [girlId, setGirlId] = useState<string>("");
  const [ayanamsha, setAyanamsha] = useState<AyanamshaId>(() => {
    const a = me?.default_ayanamsha;
    return a && isAyanamshaId(a) && a !== "tropical" ? a : "lahiri";
  });
  const { eph, error } = useEphemeris();
  const boy = profiles.find((p) => p.id === boyId);
  const girl = profiles.find((p) => p.id === girlId);

  const result = useMemo(() => {
    if (!eph || !boy || !girl || boy.id === girl.id) return null;
    const moonAt = (p: BirthProfile, time?: string) => sunMoonAt(eph, jdFromDate(utcOf(p, time)), ayanamsha).moon;
    const shifted = (p: BirthProfile) => {
      if (p.time_known) return false;
      const a = moonData(moonAt(p, "00:00:00"));
      const b = moonData(moonAt(p, "23:59:59"));
      return a.nakshatra !== b.nakshatra || a.sign !== b.sign;
    };
    const bm = moonAt(boy);
    const gm = moonAt(girl);
    return { match: ashtakoota(bm, gm), boy: moonData(bm), girl: moonData(gm), warnBoy: shifted(boy), warnGirl: shifted(girl) };
  }, [eph, boy, girl, ayanamsha]);

  const detail = (r: KootaResult, side: "boy" | "girl") => {
    const v = r[side];
    switch (r.id) {
      case "varna":
        return VARNA_LABELS[v]![lang];
      case "vashya":
      case "bhakoot":
        return rashiName(Number(v), lang);
      case "tara":
        return nakshatraName(Number(v), lang);
      case "yoni":
        return YONI_LABELS[v as YoniAnimal][lang];
      case "maitri":
        return grahaName(v as SaptaGraha as GrahaId, lang);
      case "gana":
        return GANA_LABELS[v as Gana][lang];
      case "nadi":
        return NADI_LABELS[v as Nadi][lang];
    }
  };

  const picker = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={t("selectProfile")} />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} · {p.birth_date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <HeartHandshake className="size-7 text-primary" /> {t("mtTitle")}
        </h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">{t("mtIntro")}</p>
        <div className="kolam-border mt-3 w-24" />
      </div>

      {profiles.length < 2 ? (
        <p className="rounded-2xl border bg-card p-5 text-sm shadow-card">{t("mtNeedTwo")}</p>
      ) : (
        <section className="grid gap-3 rounded-2xl border bg-card p-4 shadow-card sm:grid-cols-3 md:p-5">
          {picker(t("mtBoy"), boyId, setBoyId)}
          {picker(t("mtGirl"), girlId, setGirlId)}
          <div className="space-y-1.5">
            <Label className="text-xs">{t("ayanamsha")}</Label>
            <Select value={ayanamsha} onValueChange={(v) => setAyanamsha(v as AyanamshaId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(AYANAMSHAS) as AyanamshaId[])
                  .filter((id) => id !== "tropical")
                  .map((id) => (
                    <SelectItem key={id} value={id}>
                      {AYANAMSHAS[id][lang]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </section>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {profiles.length >= 2 && (!boy || !girl) && <p className="text-sm text-muted-foreground">{t("mtPick")}</p>}
      {boy && girl && boy.id === girl.id && <p className="text-sm text-destructive">{t("mtSame")}</p>}
      {boy && girl && boy.id !== girl.id && !result && !error && <Loader2 className="size-5 animate-spin text-muted-foreground" />}

      {result && boy && girl && (
        <section className="rounded-2xl border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
            <div className="text-sm tabular">
              <p>
                <span className="font-semibold">{boy.name}</span>: {rashiName(result.boy.sign, lang)} · {nakshatraName(result.boy.nakshatra, lang)}
              </p>
              <p>
                <span className="font-semibold">{girl.name}</span>: {rashiName(result.girl.sign, lang)} · {nakshatraName(result.girl.nakshatra, lang)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("mtTotal")}</p>
              <p className="text-4xl font-bold tabular text-primary">
                {result.match.total}
                <span className="text-lg text-muted-foreground"> / 36</span>
              </p>
              <p className="text-sm font-medium">{t(BAND_KEYS[result.match.band]!)}</p>
            </div>
          </div>

          {(result.warnBoy || result.warnGirl) && (
            <p className="flex items-center gap-2 border-b bg-destructive/10 px-5 py-2 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" /> {t("mtMoonShift")} ({[result.warnBoy && boy.name, result.warnGirl && girl.name].filter(Boolean).join(", ")})
            </p>
          )}

          <div className="overflow-x-auto p-5">
            <Table className="tabular">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("mtKoota")}</TableHead>
                  <TableHead>{t("mtBoy")}</TableHead>
                  <TableHead>{t("mtGirl")}</TableHead>
                  <TableHead className="text-right">{t("mtScore")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.match.kootas.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{KOOTA_NAMES[k.id][lang]}</TableCell>
                    <TableCell>{detail(k, "boy")}</TableCell>
                    <TableCell>{detail(k, "girl")}</TableCell>
                    <TableCell className={cn("text-right font-semibold", k.score === 0 && "text-destructive")}>
                      {k.score} / {k.max}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>{t("mtTotal")}</TableCell>
                  <TableCell className="text-right font-bold">{result.match.total} / 36</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.match.nadiDosha && <Badge variant="destructive">{t("mtNadiDosha")}</Badge>}
              {result.match.bhakootDosha && <Badge variant="destructive">{t("mtBhakootDosha")}</Badge>}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{t("mtNote")}</p>
          </div>
        </section>
      )}
    </div>
  );
}
