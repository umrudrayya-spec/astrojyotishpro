import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CircleDot, LayoutDashboard, LogOut, Menu, Settings, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useI18n, type DictKey } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { LogoMark } from "./Logo";

const NAV: { to: "/dashboard" | "/profiles" | "/chart" | "/settings"; label: DictKey; icon: typeof Users }[] = [
  { to: "/dashboard", label: "navDashboard", icon: LayoutDashboard },
  { to: "/profiles", label: "navProfiles", icon: Users },
  { to: "/chart", label: "navChart", icon: CircleDot },
  { to: "/settings", label: "navSettings", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}
        >
          <n.icon className="size-4" />
          {t(n.label)}
        </Link>
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
      <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2" {...(onNavigate ? { onClick: onNavigate } : {})}>
        <LogoMark />
        <div className="leading-tight">
          <div className="font-display text-lg font-semibold text-sidebar-primary">{t("appName")}</div>
          <div className="text-[11px] text-sidebar-foreground/60">AstroJyotish Pro</div>
        </div>
      </Link>
      <NavList {...(onNavigate ? { onNavigate } : {})} />
      <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
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
          <div className="ml-auto">
            <LanguageSwitch />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
