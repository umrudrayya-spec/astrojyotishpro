import { useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NorthIndianChart } from "@/components/charts/NorthIndianChart";
import { SouthIndianChart } from "@/components/charts/SouthIndianChart";
import type { ChartItem } from "@/components/charts/types";
import { OUTER_PLANETS, RASHIS, type GrahaId } from "@/lib/astro/constants";
import { DIGNITY_KEYS, DIGNITY_TONE, grahaAbbr, grahaName, nakshatraName, rashiName } from "@/lib/astro/labels";
import { formatDms } from "@/lib/astro/parashari";
import {
  AYANAMSHAS,
  HOUSE_SYSTEMS,
  isAyanamshaId,
  isHouseSystemId,
  type AyanamshaId,
  type CalcSettings,
  type ChartStyle,
  type HouseSystemId,
  type NodeAspectConvention,
  type NodeType,
} from "@/lib/astro/settings";
import { formatOffset } from "@/lib/astro/time";
import { useChart } from "@/lib/astro/use-chart";
import { VARGAS, VARGA_BY_ID, isVargottama, vargaPosition, type VargaId } from "@/lib/astro/varga";
import { DashaPanel } from "@/components/chart/DashaPanel";
import { NaturePanel } from "@/components/chart/NaturePanel";
import { AshtakavargaPanel } from "@/components/chart/AshtakavargaPanel";
import { JaiminiPanel } from "@/components/chart/JaiminiPanel";
import { YoginiPanel } from "@/components/chart/YoginiPanel";
import { YogaPanel } from "@/components/chart/YogaPanel";
import { TransitPanel } from "@/components/chart/TransitPanel";
import type { BirthProfile, UserProfile } from "@/lib/birth-profiles";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CATEGORY_KEYS = { kendra: "kendra", trikona: "trikona", dusthana: "dusthana", upachaya: "upachaya" } as const;

export function ChartView({ profile, utc, defaults }: { profile: BirthProfile; utc: Date; defaults: UserProfile | null }) {
  const { t, lang } = useI18n();
  const [style, setStyle] = useState<ChartStyle>(defaults?.default_chart_style === "north" ? "north" : "south");
  const [settings, setSettings] = useState<CalcSettings>({
    ayanamsha: defaults && isAyanamshaId(defaults.default_ayanamsha) ? defaults.default_ayanamsha : "lahiri",
    nodeType: defaults?.default_node_type === "mean" ? "mean" : "true",
    houseSystem: defaults && isHouseSystemId(defaults.default_house_system) ? defaults.default_house_system : "whole_sign",
    nodeAspects: "seventh_only",
  });
  const [showDegrees, setShowDegrees] = useState(false);
  const [showOuter, setShowOuter] = useState(false);
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [varga, setVarga] = useState<VargaId>("D1");
  const vargaRule = VARGA_BY_ID[varga];

  const input = useMemo(
    () => ({ utc, latitude: profile.latitude, longitude: profile.longitude }),
    [utc, profile.latitude, profile.longitude],
  );
  const { raw, chart, error } = useChart(input, settings);

  const bySign = useMemo(() => {
    const arr: ChartItem[][] = Array.from({ length: 12 }, () => []);
    if (!chart) return arr;
    if (profile.time_known) {
      const lv = vargaPosition(varga, chart.lagna.longitude);
      arr[lv.sign]!.push({
        key: "lagna",
        label: t("lagnaAbbr"),
        title: `${t("lagna")} ${rashiName(lv.sign, lang)} ${formatDms(lv.degree)}`,
        degree: formatDms(lv.degree).split("′")[0] + "′",
        isLagna: true,
      });
    }
    for (const p of chart.planets) {
      if (!showOuter && OUTER_PLANETS.includes(p.id)) continue;
      const v = vargaPosition(varga, p.longitude);
      arr[v.sign]!.push({
        key: p.id,
        label: grahaAbbr(p.id, lang),
        title: `${grahaName(p.id, lang)} ${rashiName(v.sign, lang)} ${formatDms(v.degree)}`,
        degree: formatDms(v.degree).split("′")[0] + "′",
        retro: p.retrograde,
        combust: p.combust,
      });
    }
    return arr;
  }, [chart, lang, showOuter, profile.time_known, t, varga]);

  const signLabels = RASHIS.map((r) => r[lang]);
  const centerTitle = profile.name;
  const centerSubtitle = `${varga} · ${profile.birth_date} ${profile.time_known ? (profile.birth_time ?? "").slice(0, 5) : ""}`;
  const lagnaVargaSign = chart ? (profile.time_known || varga === "D1" ? vargaPosition(varga, chart.lagna.longitude).sign : chart.lagna.sign) : 0;
  const planetsShown = chart?.planets.filter((p) => showOuter || !OUTER_PLANETS.includes(p.id)) ?? [];
  const nameList = (ids: GrahaId[]) => (ids.length ? ids.map((g) => grahaName(g, lang)).join(", ") : "—");

  return (
    <div className="space-y-8">
      {/* Settings */}
      <section className="rounded-2xl border bg-card p-4 shadow-card md:p-5">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t("chartSettings")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">{t("ayanamsha")}</Label>
            <Select value={settings.ayanamsha} onValueChange={(v) => setSettings((s) => ({ ...s, ayanamsha: v as AyanamshaId }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(AYANAMSHAS) as AyanamshaId[]).map((id) => (
                  <SelectItem key={id} value={id}>
                    {AYANAMSHAS[id][lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("nodeType")}</Label>
            <Select value={settings.nodeType} onValueChange={(v) => setSettings((s) => ({ ...s, nodeType: v as NodeType }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">{t("trueNode")}</SelectItem>
                <SelectItem value="mean">{t("meanNode")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("houseSystem")}</Label>
            <Select value={settings.houseSystem} onValueChange={(v) => setSettings((s) => ({ ...s, houseSystem: v as HouseSystemId }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(HOUSE_SYSTEMS) as HouseSystemId[]).map((id) => (
                  <SelectItem key={id} value={id}>
                    {HOUSE_SYSTEMS[id][lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t("nodeAspects")}</Label>
            <Select
              value={settings.nodeAspects}
              onValueChange={(v) => setSettings((s) => ({ ...s, nodeAspects: v as NodeAspectConvention }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seventh_only">{t("nodeAspects7")}</SelectItem>
                <SelectItem value="fifth_seventh_ninth">{t("nodeAspects579")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">{t("varga")}</Label>
            <Select value={varga} onValueChange={(v) => { setVarga(v as VargaId); setSelectedSign(null); }}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VARGAS.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.id} · {v[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs value={style} onValueChange={(v) => setStyle(v as ChartStyle)}>
            <TabsList>
              <TabsTrigger value="south">{t("southIndian")}</TabsTrigger>
              <TabsTrigger value="north">{t("northIndian")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={showDegrees} onCheckedChange={setShowDegrees} /> {t("degree")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={showOuter} onCheckedChange={setShowOuter} /> {t("showOuter")}
          </label>
        </div>
      </section>

      {!profile.time_known && (
        <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <b>{t("uncertaintyTitle")}:</b> {t("lagnaUncertain")}
          </div>
        </div>
      )}

      {error && <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">{error}</div>}

      {!chart || !raw ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("calculating")}
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-[minmax(0,560px)_1fr]">
            <div className="rounded-2xl border bg-card p-3 shadow-card">
              {style === "south" ? (
                <SouthIndianChart
                  bySign={bySign}
                  lagnaSign={lagnaVargaSign}
                  signLabels={signLabels}
                  centerTitle={centerTitle}
                  centerSubtitle={centerSubtitle}
                  retroMark={t("retroAbbr")}
                  combustMark={t("combustAbbr")}
                  showDegrees={showDegrees}
                  onSelectSign={setSelectedSign}
                  selectedSign={selectedSign}
                />
              ) : (
                <NorthIndianChart
                  bySign={bySign}
                  lagnaSign={lagnaVargaSign}
                  signLabels={signLabels}
                  retroMark={t("retroAbbr")}
                  combustMark={t("combustAbbr")}
                  showDegrees={showDegrees}
                  onSelectSign={setSelectedSign}
                  selectedSign={selectedSign}
                />
              )}
              <div className="mt-3 space-y-1 border-t px-2 pt-3 text-xs text-muted-foreground">
                <div className="text-sm font-semibold text-foreground">
                  {vargaRule.id} {vargaRule[lang]} · {vargaRule.area[lang]}
                </div>
                <div>
                  <b>{t("vargaMethod")}:</b> {vargaRule.method[lang]}
                </div>
                <div>{t(vargaRule.source === "BPHS" ? "vargaSourceBphs" : "vargaSourceLater")}</div>
                {varga !== "D1" && <div>{t("vargaDegreeNote")}</div>}
                {varga !== "D1" && !profile.time_known && <div className="text-warning">{t("vargaTimeUnknown")}</div>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-kumkum p-5 text-primary-foreground shadow-glow">
                <div className="text-xs opacity-80">{t("lagna")}</div>
                <div className="mt-1 font-display text-3xl font-bold">
                  {rashiName(chart.lagna.sign, lang)} <span className="text-lg tabular">{formatDms(chart.lagna.longitude)}</span>
                </div>
                <div className="mt-2 text-sm opacity-90">
                  {nakshatraName(chart.lagna.nakshatra, lang)} {t("pada")} {chart.lagna.pada} · {t("lord")}:{" "}
                  {grahaName(chart.lagna.lord, lang)}
                </div>
              </div>
              {selectedSign !== null && (
                <SignDetail sign={selectedSign} chart={chart} varga={varga} onClose={() => setSelectedSign(null)} />
              )}
              <div className="rounded-2xl border bg-card p-5 shadow-card">
                <h3 className="mb-3 font-semibold">{t("combinations")}</h3>
                <ul className="space-y-2 text-sm">
                  {chart.conjunctions.map((c) => (
                    <li key={c.sign}>
                      <b>{rashiName(c.sign, lang)}</b> {t("conjunctionIn")}: {nameList(c.planets)}
                    </li>
                  ))}
                  {chart.parivartana.map((pv) => (
                    <li key={pv.a + pv.b}>
                      <b>{t("parivartana")}:</b> {grahaName(pv.a, lang)} ({rashiName(pv.signA, lang)}) ↔ {grahaName(pv.b, lang)} (
                      {rashiName(pv.signB, lang)})
                    </li>
                  ))}
                  {!chart.conjunctions.length && !chart.parivartana.length && <li className="text-muted-foreground">{t("none")}</li>}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card shadow-card">
            <h2 className="border-b px-5 py-4 text-lg font-semibold">{t("planetTable")}</h2>
            <div className="overflow-x-auto">
              <Table className="tabular">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("planet")}</TableHead>
                    <TableHead>{t("sign")}</TableHead>
                    <TableHead>{t("degree")}</TableHead>
                    <TableHead>{t("nakshatra")}</TableHead>
                    <TableHead>{t("nakLord")}</TableHead>
                    <TableHead>{t("navamshaShort")}</TableHead>
                    <TableHead>{t("house")}</TableHead>
                    <TableHead>{t("dignity")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("owns")}</TableHead>
                    <TableHead>{t("aspects")}</TableHead>
                    <TableHead className="text-right">{t("speed")}</TableHead>
                    <TableHead className="text-right">{t("latitudeShort")}</TableHead>
                    <TableHead className="text-right">{t("declination")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planetsShown.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold">{grahaName(p.id, lang)}</TableCell>
                      <TableCell>{rashiName(p.sign, lang)}</TableCell>
                      <TableCell>{formatDms(p.longitude)}</TableCell>
                      <TableCell>
                        {nakshatraName(p.nakshatra, lang)} · {p.pada}
                      </TableCell>
                      <TableCell>{grahaName(p.nakshatraLord, lang)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {rashiName(vargaPosition("D9", p.longitude).sign, lang)}
                        {isVargottama(p.longitude) && (
                          <Badge variant="outline" className="ml-1 border-gold/50 bg-gold/15 text-gold-foreground">
                            {t("vargottama")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{profile.time_known ? p.house : "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-medium", DIGNITY_TONE[p.dignity])}>
                          {t(DIGNITY_KEYS[p.dignity])}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1 whitespace-nowrap">
                        {p.retrograde && p.id !== "rahu" && p.id !== "ketu" && (
                          <Badge variant="outline" className="border-chart-retro/40 text-chart-retro">
                            {t("retro")}
                          </Badge>
                        )}
                        {p.combust && (
                          <Badge variant="outline" className="border-warning/50 text-warning">
                            {t("combust")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{profile.time_known && p.ownedHouses.length ? p.ownedHouses.join(", ") : "—"}</TableCell>
                      <TableCell>{profile.time_known ? p.aspectsHouses.join(", ") : "—"}</TableCell>
                      <TableCell className="text-right">{p.speed.toFixed(4)}</TableCell>
                      <TableCell className="text-right">{p.latitude.toFixed(4)}°</TableCell>
                      <TableCell className="text-right">{p.declination.toFixed(4)}°</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {profile.time_known && (
            <section className="rounded-2xl border bg-card shadow-card">
              <h2 className="border-b px-5 py-4 text-lg font-semibold">
                {t("houseTable")} <span className="text-sm font-normal text-muted-foreground">· {HOUSE_SYSTEMS[settings.houseSystem][lang]}</span>
              </h2>
              <div className="overflow-x-auto">
                <Table className="tabular">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("house")}</TableHead>
                      <TableHead>{t("sign")}</TableHead>
                      <TableHead>{t("lord")}</TableHead>
                      <TableHead>{t("cusp")}</TableHead>
                      <TableHead>{t("occupants")}</TableHead>
                      <TableHead>{t("aspectedBy")}</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chart.houses.map((h) => (
                      <TableRow key={h.house}>
                        <TableCell className="font-semibold">{h.house}</TableCell>
                        <TableCell>{rashiName(h.sign, lang)}</TableCell>
                        <TableCell>{grahaName(h.lord, lang)}</TableCell>
                        <TableCell>
                          {rashiName(Math.floor(h.cusp / 30), lang)} {formatDms(h.cusp)}
                        </TableCell>
                        <TableCell>{nameList(h.occupants)}</TableCell>
                        <TableCell>{nameList(h.aspectedBy)}</TableCell>
                        <TableCell className="space-x-1">
                          {h.categories.map((c) => (
                            <Badge key={c} variant="secondary">
                              {t(CATEGORY_KEYS[c])}
                            </Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          <NaturePanel chart={chart} timeKnown={profile.time_known} />

          <YogaPanel chart={chart} timeKnown={profile.time_known} />

          <DashaPanel
            moonLongitude={chart.planets.find((p) => p.id === "moon")!.longitude}
            birth={utc}
            timeZone={profile.timezone}
            timeKnown={profile.time_known}
          />

          <YoginiPanel
            moonLongitude={chart.planets.find((p) => p.id === "moon")!.longitude}
            birth={utc}
            timeZone={profile.timezone}
          />

          <AshtakavargaPanel chart={chart} timeKnown={profile.time_known} />

          <JaiminiPanel chart={chart} timeKnown={profile.time_known} />

          <TransitPanel chart={chart} birth={utc} settings={settings} timeZone={profile.timezone} timeKnown={profile.time_known} />

          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="mb-3 text-lg font-semibold">{t("calcDetails")}</h2>
            <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 tabular">
              <Meta k={t("engine")} v={`${raw.meta.engine} ${raw.meta.engineVersion}`} />
              <Meta k={t("ephemeris")} v={raw.meta.ephemeris === "moshier" ? t("moshier") : t("swissFiles")} />
              <Meta k={t("ayanamsha")} v={`${AYANAMSHAS[settings.ayanamsha][lang]} = ${formatDms(raw.ayanamshaDegrees, false)}`} />
              <Meta k={t("nodeType")} v={settings.nodeType === "true" ? t("trueNode") : t("meanNode")} />
              <Meta k={t("utcTime")} v={utc.toISOString().replace("T", " ").replace(".000Z", " UTC")} />
              <Meta k={t("utcOffset")} v={`${formatOffset(profile.utc_offset_minutes)} (${profile.timezone})`} />
              <Meta k={t("julianDay")} v={raw.jdUt.toFixed(6)} />
              <Meta k={`${t("latitude")} / ${t("longitude")}`} v={`${profile.latitude.toFixed(4)}°, ${profile.longitude.toFixed(4)}°`} />
              <Meta k={t("algorithm")} v={raw.meta.algorithmVersion} />
            </dl>
          </section>
        </>
      )}
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed py-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function SignDetail({
  sign,
  chart,
  varga,
  onClose,
}: {
  sign: number;
  varga: VargaId;
  chart: NonNullable<ReturnType<typeof useChart>["chart"]>;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  const house = varga === "D1" ? chart.houses.find((h) => h.sign === sign) : undefined;
  const planets = chart.planets.filter((p) => vargaPosition(varga, p.longitude).sign === sign);
  return (
    <div className="rounded-2xl border border-gold/50 bg-card p-5 shadow-card animate-rise">
      <div className="flex items-start justify-between">
        <h3 className="font-display text-xl font-semibold">
          {rashiName(sign, lang)}
          {house && <span className="ml-2 text-sm font-normal text-muted-foreground">· {t("house")} {house.house}</span>}
        </h3>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground" aria-label={t("cancel")}>
          ✕
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("lord")}: {grahaName(RASHIS[sign]!.lord, lang)}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {planets.length === 0 && <li className="text-muted-foreground">{t("none")}</li>}
        {planets.map((p) => (
          <li key={p.id} className="flex justify-between gap-3 tabular">
            <span className="font-medium">{grahaName(p.id, lang)}</span>
            <span>
              {formatDms(p.longitude)} · {nakshatraName(p.nakshatra, lang)} {p.pada}
            </span>
          </li>
        ))}
      </ul>
      {house && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("aspectedBy")}: {house.aspectedBy.map((g) => grahaName(g, lang)).join(", ") || "—"}
        </p>
      )}
    </div>
  );
}
