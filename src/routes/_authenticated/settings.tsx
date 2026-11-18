import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";
import { userProfileQuery } from "@/lib/birth-profiles";
import { AYANAMSHAS, HOUSE_SYSTEMS, type AyanamshaId, type HouseSystemId } from "@/lib/astro/settings";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "అమరికలు — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Language, theme and default calculation conventions for your charts." },
      { property: "og:title", content: "Settings — AstroJyotish Pro" },
      { property: "og:description", content: "Language, theme and default calculation conventions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(userProfileQuery()),
  component: SettingsPage,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const qc = useQueryClient();
  const { data: me } = useSuspenseQuery(userProfileQuery());
  const [form, setForm] = useState({
    display_name: me?.display_name ?? "",
    default_ayanamsha: me?.default_ayanamsha ?? "lahiri",
    default_node_type: me?.default_node_type ?? "true",
    default_house_system: me?.default_house_system ?? "whole_sign",
    default_chart_style: me?.default_chart_style ?? "south",
  });
  const [busy, setBusy] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!me) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ ...form, display_name: form.display_name.trim().slice(0, 120) || null, preferred_language: lang })
      .eq("id", me.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("saved"));
    void qc.invalidateQueries({ queryKey: ["user_profile"] });
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("settingsTitle")}</h1>
        <div className="kolam-border mt-3 w-24" />
      </div>

      <section className="grid gap-4 rounded-2xl border bg-card p-5 shadow-card sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={t("displayName")}>
            <Input value={form.display_name} maxLength={120} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
          </Field>
        </div>
        <Field label={t("language")}>
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("theme")}>
          <Select value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="dark">{t("dark")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-card">
        <h2 className="font-semibold">{t("defaultsTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("ayanamsha")}>
            <Select value={form.default_ayanamsha} onValueChange={(v) => setForm({ ...form, default_ayanamsha: v })}>
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
          </Field>
          <Field label={t("nodeType")}>
            <Select value={form.default_node_type} onValueChange={(v) => setForm({ ...form, default_node_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">{t("trueNode")}</SelectItem>
                <SelectItem value="mean">{t("meanNode")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("houseSystem")}>
            <Select value={form.default_house_system} onValueChange={(v) => setForm({ ...form, default_house_system: v })}>
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
          </Field>
          <Field label={t("defaultChartStyle")}>
            <Select value={form.default_chart_style} onValueChange={(v) => setForm({ ...form, default_chart_style: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="south">{t("southIndian")}</SelectItem>
                <SelectItem value="north">{t("northIndian")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      <Button type="submit" variant="hero" disabled={busy}>
        {busy ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
