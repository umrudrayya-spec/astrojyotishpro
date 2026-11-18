import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useI18n } from "@/lib/i18n";
import { findNavForPath, NAV_GROUPS } from "@/lib/nav";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { GlobalSearch } from "./GlobalSearch";
import { LanguageSwitch } from "./LanguageSwitch";
import { LogoMark } from "./Logo";

/** Sections that live inside the birth chart page; only "Birth chart" itself shows as active there. */
const CHART_ALIASES = new Set(["vargas", "dashas", "parashari", "ashtakavarga", "jaimini"]);

const linkCls =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

/** Expandable categories with all spec sections; sections not built yet are listed but not clickable. */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeGroup = findNavForPath(pathname)?.group.id;
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((g) => [g.id, g.items.some((i) => i.to) || g.id === activeGroup])),
  );
  return (
    <nav className="flex flex-col gap-1">
      {NAV_GROUPS.map((g) => (
        <Collapsible key={g.id} open={open[g.id] ?? false} onOpenChange={(o) => setOpen((s) => ({ ...s, [g.id]: o }))}>
          <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/55 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
            {t(g.label)}
            <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-2 flex flex-col gap-0.5">
            {g.items.map((n) =>
              n.to ? (
                <Link
                  key={n.id}
                  to={n.to}
                  onClick={onNavigate}
                  className={linkCls}
                  activeOptions={{ exact: n.to === "/chart" ? false : true }}
                  activeProps={CHART_ALIASES.has(n.id) ? {} : { className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}
                >
                  <n.icon className="size-4 shrink-0" />
                  <span className="truncate">{t(n.label)}</span>
                </Link>
              ) : (
                <div
                  key={n.id}
                  aria-disabled="true"
                  className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/40"
                >
                  <n.icon className="size-4 shrink-0" />
                  <span className="truncate">{t(n.label)}</span>
                  <span className="ml-auto rounded bg-sidebar-accent/60 px-1.5 text-[9px] uppercase tracking-wide">{t("soon")}</span>
                </div>
              ),
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };
  return (
    <div className="flex h-full flex-col bg-sidebar p-4 text-sidebar-foreground">
      <Link to="/dashboard" className="mb-5 flex items-center gap-3 px-2" {...(onNavigate ? { onClick: onNavigate } : {})}>
        <LogoMark />
        <div className="leading-tight">
          <div className="font-display text-lg font-semibold text-sidebar-primary">{t("appName")}</div>
          <div className="text-[11px] text-sidebar-foreground/60">AstroJyotish Pro</div>
        </div>
      </Link>
      <ScrollArea className="-mx-2 min-h-0 flex-1 px-2">
        <NavList {...(onNavigate ? { onNavigate } : {})} />
      </ScrollArea>
      <div className="mt-3 space-y-3 border-t border-sidebar-border pt-4">
        <div className="truncate px-2 text-xs text-sidebar-foreground/60">{user?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut /> {t("signOut")}
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useTheme();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:block">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="hidden min-w-0 flex-1 md:block">
            <AppBreadcrumbs />
          </div>
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
            <GlobalSearch />
            <LanguageSwitch />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
