import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CircleDot, History, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { birthProfilesQuery } from "@/lib/birth-profiles";
import { NAV_GROUPS } from "@/lib/nav";
import { useRecentCharts } from "@/lib/recent";
import { useI18n } from "@/lib/i18n";

/** Global search (Ctrl/⌘+K): sections, saved profiles, recently opened charts. */
export function GlobalSearch() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const recent = useRecentCharts();
  const { data: profiles = [] } = useQuery({ ...birthProfilesQuery(), enabled: open });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 w-full max-w-xs justify-start gap-2 text-muted-foreground"
        aria-label={t("search")}
      >
        <Search className="size-4" />
        <span className="truncate">{t("search")}</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 text-[10px] font-medium sm:inline">Ctrl K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("searchNoResults")}</CommandEmpty>
          {recent.length > 0 && (
            <CommandGroup heading={t("recentCharts")}>
              {recent.map((r) => (
                <CommandItem
                  key={`recent-${r.id}`}
                  value={`recent ${r.name} ${r.id}`}
                  onSelect={() => go(() => void navigate({ to: "/chart/$profileId", params: { profileId: r.id } }))}
                >
                  <History /> {r.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {profiles.length > 0 && (
            <CommandGroup heading={t("searchProfiles")}>
              {profiles
                .filter((p) => !p.archived_at)
                .map((p) => (
                  <CommandItem
                    key={p.id}
                    value={`${p.name} ${p.place_name} ${p.birth_date} ${p.id}`}
                    onSelect={() => go(() => void navigate({ to: "/chart/$profileId", params: { profileId: p.id } }))}
                  >
                    <CircleDot />
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto truncate text-xs text-muted-foreground">{p.place_name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          {NAV_GROUPS.map((g) => (
            <CommandGroup key={g.id} heading={t(g.label)}>
              {g.items.map((item) => {
                const to = item.to;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${t(item.label)} ${item.id} ${item.keywords ?? ""}`}
                    disabled={!to}
                    onSelect={() => to && go(() => void navigate({ to }))}
                  >
                    <item.icon />
                    {t(item.label)}
                    {!to && <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">{t("soon")}</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
