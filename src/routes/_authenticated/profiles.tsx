import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Archive, ArchiveRestore, CircleDot, Copy, Download, FileSpreadsheet, Pencil, Plus, Search, Star, Trash2, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BirthProfileFormView } from "@/components/app/BirthProfileForm";
import {
  birthProfilesQuery,
  deleteBirthProfile,
  exportProfiles,
  matchesProfile,
  parseImport,
  saveBirthProfile,
  setProfileArchived,
  setProfileFavorite,
  toForm,
  type BirthProfile,
  type BirthProfileForm,
} from "@/lib/birth-profiles";
import { formatOffset } from "@/lib/astro/time";
import { csvToProfiles, profilesToCsv } from "@/lib/profile-csv";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profiles")({
  head: () => ({
    meta: [
      { title: "జాతక వివరాలు — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Manage saved birth profiles for yourself, family and clients." },
      { property: "og:title", content: "Birth profiles — AstroJyotish Pro" },
      { property: "og:description", content: "Manage saved birth profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(birthProfilesQuery()),
  component: ProfilesPage,
});

function ProfilesPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: profiles } = useSuspenseQuery(birthProfilesQuery());
  const [editing, setEditing] = useState<{ id?: string; initial?: BirthProfileForm } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "fav" | "archived">("all");
  const visible = useMemo(
    () =>
      profiles.filter((p) => {
        if (filter === "archived" ? !p.archived_at : !!p.archived_at) return false;
        if (filter === "fav" && !p.is_favorite) return false;
        return matchesProfile(p, query);
      }),
    [profiles, filter, query],
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ["birth_profiles"] });

  const del = useMutation({
    mutationFn: deleteBirthProfile,
    onSuccess: () => {
      toast.success(t("deleted"));
      void refresh();
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = async (form: BirthProfileForm) => {
    await saveBirthProfile(form, editing?.id);
    toast.success(t("saved"));
    setEditing(null);
    await refresh();
  };

  const duplicate = async (p: BirthProfile) => {
    try {
      await saveBirthProfile({ ...toForm(p), name: `${p.name} (2)`.slice(0, 120) });
      toast.success(t("saved"));
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("somethingWrong"));
    }
  };

  const download = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const doExport = () => download(exportProfiles(profiles), "application/json", "birth-profiles.json");
  const doExportCsv = () => download("\uFEFF" + profilesToCsv(profiles.map(toForm)), "text/csv;charset=utf-8", "birth-profiles.csv");

  const doImportCsv = async (file: File) => {
    try {
      const { profiles: forms, errors } = csvToProfiles(await file.text());
      for (const f of forms) await saveBirthProfile(f);
      if (forms.length) toast.success(`${t("imported")} (${forms.length})`);
      if (errors.length) {
        toast.error(t("csvRowErrors"), {
          description: errors
            .slice(0, 5)
            .map((e) => `#${e.row}: ${e.message}`)
            .join("\n"),
        });
      }
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("somethingWrong"));
    }
  };

  const toggleFav = async (p: BirthProfile) => {
    try {
      await setProfileFavorite(p.id, !p.is_favorite);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("somethingWrong"));
    }
  };

  const toggleArchive = async (p: BirthProfile) => {
    try {
      await setProfileArchived(p.id, !p.archived_at);
      toast.success(p.archived_at ? t("restored") : t("archived"));
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("somethingWrong"));
    }
  };

  const doImport = async (file: File) => {
    try {
      const forms = parseImport(await file.text());
      for (const f of forms) await saveBirthProfile(f);
      toast.success(`${t("imported")} (${forms.length})`);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("somethingWrong"));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("navProfiles")}</h1>
          <div className="kolam-border mt-3 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload /> {t("importJson")}
          </Button>
          <Button variant="outline" size="sm" onClick={doExport} disabled={!profiles.length}>
            <Download /> {t("exportJson")}
          </Button>
          <input
            ref={csvRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImportCsv(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" onClick={() => csvRef.current?.click()}>
            <FileSpreadsheet /> {t("importCsv")}
          </Button>
          <Button variant="outline" size="sm" onClick={doExportCsv} disabled={!profiles.length}>
            <Download /> {t("exportCsv")}
          </Button>
          <Button variant="hero" onClick={() => setEditing({})}>
            <Plus /> {t("addProfile")}
          </Button>
        </div>
      </div>

      {profiles.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchProfilesPh")}
              aria-label={t("searchProfilesPh")}
              className="pl-9"
            />
          </div>
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(v) => v && setFilter(v as typeof filter)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all">{t("filterAll")}</ToggleGroupItem>
            <ToggleGroupItem value="fav">
              <Star /> {t("filterFavorites")}
            </ToggleGroupItem>
            <ToggleGroupItem value="archived">
              <Archive /> {t("filterArchived")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">{t("noProfiles")}</div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">{t("searchNoResults")}</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <li key={p.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="-mr-2 -mt-1 size-8 shrink-0"
                  onClick={() => toggleFav(p)}
                  aria-label={p.is_favorite ? t("unfavorite") : t("favorite")}
                  aria-pressed={p.is_favorite}
                >
                  <Star className={p.is_favorite ? "fill-primary text-primary" : "text-muted-foreground"} />
                </Button>
              </div>
              <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                <div className="tabular">
                  {p.birth_date} · {p.time_known ? p.birth_time?.slice(0, 8) : t("timeUnknown")}
                </div>
                <div className="truncate">{p.place_name}</div>
                <div className="text-xs tabular">
                  {p.timezone} · {formatOffset(p.utc_offset_minutes)}
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <Button asChild size="sm" variant="hero">
                  <Link to="/chart/$profileId" params={{ profileId: p.id }}>
                    <CircleDot /> {t("viewChart")}
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing({ id: p.id, initial: toForm(p) })} aria-label={t("edit")}>
                  <Pencil />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => duplicate(p)} aria-label={t("duplicate")}>
                  <Copy />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleArchive(p)} aria-label={p.archived_at ? t("unarchive") : t("archive")}>
                  {p.archived_at ? <ArchiveRestore /> : <Archive />}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label={t("delete")}>
                      <Trash2 className="text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => del.mutate(p.id)}>{t("delete")}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? t("editProfile") : t("addProfile")}</DialogTitle>
          </DialogHeader>
          {editing && (
            <BirthProfileFormView
              {...(editing.initial ? { initial: editing.initial } : {})}
              onSubmit={onSubmit}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
