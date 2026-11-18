import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CircleDot, History, Loader2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthProfilesQuery, userProfileQuery } from "@/lib/birth-profiles";
import { OUTER_PLANETS } from "@/lib/astro/constants";
import { grahaName, nakshatraName, rashiName } from "@/lib/astro/labels";
import { formatDms } from "@/lib/astro/parashari";
import { AYANAMSHAS, DEFAULT_SETTINGS, isAyanamshaId, type CalcSettings } from "@/lib/astro/settings";
import { useChart } from "@/lib/astro/use-chart";
import { useI18n } from "@/lib/i18n";
import { useRecentCharts } from "@/lib/recent";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "ముఖ్య పేజీ — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Your astrology dashboard: saved birth profiles and today's planetary positions." },
      { property: "og:title", content: "Dashboard — AstroJyotish Pro" },
      { property: "og:description", content: "Saved birth profiles and today's planetary positions." },
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
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();
  const { data: profiles } = useSuspenseQuery(birthProfilesQuery());
  const { data: me } = useSuspenseQuery(userProfileQuery());
  const recent = useRecentCharts();
  const active = profiles.filter((p) => !p.archived_at);
  const [now] = useState(() => new Date());
  const settings: CalcSettings = useMemo(
    () => ({
      ...DEFAULT_SETTINGS,
      ayanamsha: me && isAyanamshaId(me.default_ayanamsha) ? me.default_ayanamsha : "lahiri",
      nodeType: me?.default_node_type === "mean" ? "mean" : "true",
    }),
    [me],
  );
  const input = useMemo(() => ({ utc: now, latitude: 0, longitude: 0 }), [now]);
  const { chart } = useChart(input, settings);

  return (
    <div className="space-y-10">
      <section className="animate-rise">
        <p className="text-sm text-muted-foreground">{t("welcome")},</p>
        <h1 className="text-4xl font-bold">{me?.display_name ?? ""}</h1>
        <div className="kolam-border mt-4 w-24" />
      </section>

      {recent.length > 0 && (
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <History className="size-4 text-primary" /> {t("recentCharts")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <Button key={r.id} asChild size="sm" variant="outline">
                <Link to="/chart/$profileId" params={{ profileId: r.id }}>
                  <CircleDot /> {r.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("yourProfiles")}</h2>
            <Button asChild size="sm" variant="outline">
              <Link to="/profiles">
                <Plus /> {t("addProfile")}
              </Link>
            </Button>
          </div>
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noProfiles")}</p>
          ) : (
            <ul className="divide-y">
              {active.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-medium">
                      {p.is_favorite && <Star className="size-3.5 shrink-0 fill-primary text-primary" aria-label={t("filterFavorites")} />}
                      {p.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground tabular">
                      {p.birth_date} · {p.place_name}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="hero">
                    <Link to="/chart/$profileId" params={{ profileId: p.id }}>
                      <CircleDot /> {t("viewChart")}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="text-lg font-semibold">{t("todaySky")}</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            {t("todaySkyNote")} {AYANAMSHAS[settings.ayanamsha][lang]} · {now.toLocaleString(lang === "te" ? "te-IN" : "en-IN")}
          </p>
          {!chart ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> {t("calculating")}
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {chart.planets
                .filter((p) => !OUTER_PLANETS.includes(p.id))
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm tabular">
                    <span className="font-medium">
                      {grahaName(p.id, lang)}
                      {p.retrograde && p.id !== "rahu" && p.id !== "ketu" && (
                        <span className="ml-1 text-chart-retro">({t("retroAbbr")})</span>
                      )}
                    </span>
                    <span className="text-right">
                      {rashiName(p.sign, lang)} {formatDms(p.longitude).split("′")[0]}′
                      <span className="block text-[11px] text-muted-foreground">
                        {nakshatraName(p.nakshatra, lang)} {p.pada}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
