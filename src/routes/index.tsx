import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Languages, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/app/LanguageSwitch";
import { LogoMark } from "@/components/app/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { RASHIS } from "@/lib/astro/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "జ్యోతిష దర్పణం — Telugu Vedic Astrology on Swiss Ephemeris" },
      {
        name: "description",
        content:
          "Calculate your Vedic birth chart in Telugu or English: Lagna, Nakshatra, Pada and planetary dignities from Swiss Ephemeris, with every value traceable.",
      },
      { property: "og:title", content: "జ్యోతిష దర్పణం — Telugu Vedic Astrology" },
      {
        property: "og:description",
        content: "Vedic birth charts from real Swiss Ephemeris calculations, in Telugu and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Wheel() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <g className="origin-center animate-slow-spin" style={{ transformBox: "fill-box" }}>
        <circle cx="200" cy="200" r="190" className="fill-none stroke-gold" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="150" className="fill-none stroke-chart-line/40" strokeWidth="1" />
        {RASHIS.map((r, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const a2 = (((i + 0.5) * 30 - 90) * Math.PI) / 180;
          return (
            <g key={r.en}>
              <line
                x1={200 + Math.cos(a) * 150}
                y1={200 + Math.sin(a) * 150}
                x2={200 + Math.cos(a) * 190}
                y2={200 + Math.sin(a) * 190}
                className="stroke-gold"
                strokeWidth="1"
              />
              <text
                x={200 + Math.cos(a2) * 170}
                y={200 + Math.sin(a2) * 170}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground/70"
                style={{ fontSize: 11 }}
              >
                {r.te}
              </text>
            </g>
          );
        })}
      </g>
      <circle cx="200" cy="200" r="110" className="fill-primary" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i * 40 * Math.PI) / 180;
        return <circle key={i} cx={200 + Math.cos(a) * 70} cy={200 + Math.sin(a) * 70} r="9" className="fill-gold" />;
      })}
      <circle cx="200" cy="200" r="26" className="fill-gold" />
    </svg>
  );
}

function Landing() {
  const { t } = useI18n();
  const { user } = useAuth();
  const features = [
    { icon: Compass, te: "స్విస్ ఎఫెమెరిస్ గణన", en: "Swiss Ephemeris calculation" },
    { icon: ShieldCheck, te: "ప్రతి విలువకు గణన వివరాలు", en: "Every value is traceable" },
    { icon: Languages, te: "తెలుగు & ఇంగ్లీష్", en: "Telugu & English" },
    { icon: Sparkles, te: "దశలవారీగా మరిన్ని విభాగాలు", en: "More modules phase by phase" },
  ];
  const { lang } = useI18n();
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span className="font-display text-lg font-semibold text-primary">{t("appName")}</span>
        </div>
        <LanguageSwitch />
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <section className="animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-gold" /> {t("tagline")}
          </p>
          <h1 className="text-4xl font-bold leading-[1.25] text-foreground md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("heroBody")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Button asChild variant="hero" size="lg">
                <Link to="/dashboard">{t("openDashboard")}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="hero" size="lg">
                  <Link to="/auth">{t("getStarted")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">{t("signIn")}</Link>
                </Button>
              </>
            )}
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-4">
            {features.map((f) => (
              <li key={f.en} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="grid size-9 place-items-center rounded-lg bg-card shadow-card">
                  <f.icon className="size-4 text-primary" />
                </span>
                {f[lang]}
              </li>
            ))}
          </ul>
        </section>
        <div className="mx-auto aspect-square w-full max-w-md animate-rise [animation-delay:120ms]">
          <Wheel />
        </div>
      </main>
    </div>
  );
}
