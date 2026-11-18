import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { birthProfilesQuery } from "@/lib/birth-profiles";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/chart/")({
  head: () => ({
    meta: [
      { title: "కుండలి ఎంపిక — జ్యోతిష దర్పణం" },
      { name: "description", content: "Choose a saved birth profile to open its Vedic birth chart." },
      { property: "og:title", content: "Choose a chart — Jyotisha Darpanam" },
      { property: "og:description", content: "Choose a saved birth profile to open its chart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(birthProfilesQuery()),
  component: ChartIndex,
});

function ChartIndex() {
  const { t } = useI18n();
  const { data: profiles } = useSuspenseQuery(birthProfilesQuery());
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("navChart")}</h1>
        <p className="mt-1 text-muted-foreground">{t("selectProfile")}</p>
        <div className="kolam-border mt-3 w-24" />
      </div>
      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <p className="mb-4 text-muted-foreground">{t("noProfiles")}</p>
          <Button asChild variant="hero">
            <Link to="/profiles">{t("addProfile")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y rounded-2xl border bg-card shadow-card">
          {profiles.map((p) => (
            <li key={p.id}>
              <Link
                to="/chart/$profileId"
                params={{ profileId: p.id }}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-accent/40"
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground tabular">
                    {p.birth_date} · {p.place_name}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
