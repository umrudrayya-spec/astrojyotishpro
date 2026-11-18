import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageSquare, Plus } from "lucide-react";
import { AstrologerMark } from "@/components/ai/AstrologerMark";
import { Button } from "@/components/ui/button";
import { aiThreadsQuery } from "@/lib/ai/threads";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({
    meta: [
      { title: "AI జ్యోతిష్కుడు — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Chat with an AI astrologer that interprets your calculated Vedic chart, dashas and yogas." },
      { property: "og:title", content: "AI astrologer — AstroJyotish Pro" },
      { property: "og:description", content: "Chart-aware AI interpretation grounded in Swiss Ephemeris calculations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(aiThreadsQuery()),
  component: AiLayout,
});

function AiLayout() {
  const { t } = useI18n();
  const { data: threads } = useSuspenseQuery(aiThreadsQuery());
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AstrologerMark className="size-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("aiTitle")}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">{t("aiIntro")}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-2 rounded-2xl border bg-card p-3 shadow-card lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          <Button asChild className="w-full justify-start gap-2">
            <Link to="/ai">
              <Plus className="size-4" /> {t("aiNewChat")}
            </Link>
          </Button>
          <p className="px-1 pt-2 text-xs font-semibold text-muted-foreground">{t("aiChats")}</p>
          {threads.length === 0 && <p className="px-1 text-sm text-muted-foreground">{t("aiNoChats")}</p>}
          <nav className="space-y-1">
            {threads.map((th) => (
              <Link
                key={th.id}
                to="/ai/$threadId"
                params={{ threadId: th.id }}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                activeProps={{ className: "bg-muted font-semibold" }}
              >
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{th.title || t("aiUntitled")}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
