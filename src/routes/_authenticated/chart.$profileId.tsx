import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { ChartView } from "@/components/chart/ChartView";
import { birthProfileQuery, userProfileQuery } from "@/lib/birth-profiles";
import { localToUtc, parseDateTime } from "@/lib/astro/time";
import { useI18n } from "@/lib/i18n";
import { recordRecentChart } from "@/lib/recent";

export const Route = createFileRoute("/_authenticated/chart/$profileId")({
  head: () => ({
    meta: [
      { title: "జన్మ కుండలి — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Rashi (D1) birth chart with planetary positions, nakshatras, dignities and houses." },
      { property: "og:title", content: "Birth chart — AstroJyotish Pro" },
      { property: "og:description", content: "Rashi (D1) birth chart from Swiss Ephemeris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(birthProfileQuery(params.profileId)),
      context.queryClient.ensureQueryData(userProfileQuery()),
    ]);
  },
  component: ChartPage,
});

function ChartPage() {
  const { profileId } = Route.useParams();
  const { t } = useI18n();
  const { data: profile } = useSuspenseQuery(birthProfileQuery(profileId));
  const { data: defaults } = useSuspenseQuery(userProfileQuery());
  const utc = useMemo(
    () =>
      profile
        ? localToUtc(parseDateTime(profile.birth_date, profile.time_known ? profile.birth_time : "12:00:00"), profile.utc_offset_minutes)
        : null,
    [profile],
  );

  useEffect(() => {
    if (profile) recordRecentChart(profile.id, profile.name);
  }, [profile]);

  if (!profile || !utc) {
    return (
      <div className="space-y-4">
        <p>{t("notFound")}</p>
        <Link to="/profiles" className="text-primary underline">
          {t("navProfiles")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/chart" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {t("selectProfile")}
        </Link>
        <h1 className="text-3xl font-bold">{t("chartTitle")}</h1>
        <p className="mt-1 text-muted-foreground tabular">
          {profile.name} · {profile.birth_date} {profile.time_known ? profile.birth_time?.slice(0, 8) : `(${t("timeUnknown")})`} ·{" "}
          {profile.place_name}
        </p>
        <div className="kolam-border mt-3 w-24" />
      </div>
      <ChartView profile={profile} utc={utc} defaults={defaults} />
    </div>
  );
}
