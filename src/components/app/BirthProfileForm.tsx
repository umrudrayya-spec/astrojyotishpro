import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RELATIONS, birthProfileSchema, type BirthProfileForm } from "@/lib/birth-profiles";
import { placeLabel } from "@/lib/geocode";
import { formatOffset, parseDateTime, resolveUtcOffsetMinutes } from "@/lib/astro/time";
import { useI18n, type DictKey } from "@/lib/i18n";
import { PlaceSearch } from "./PlaceSearch";

const REL_KEYS: Record<(typeof RELATIONS)[number], DictKey> = {
  self: "relSelf",
  spouse: "relSpouse",
  child: "relChild",
  parent: "relParent",
  sibling: "relSibling",
  friend: "relFriend",
  client: "relClient",
  other: "other",
};

const EMPTY: BirthProfileForm = {
  name: "",
  gender: null,
  relation: "self",
  birth_date: "",
  birth_time: "",
  time_known: true,
  place_name: "",
  latitude: 0,
  longitude: 0,
  timezone: "",
  utc_offset_minutes: 0,
  notes: null,
};

export function BirthProfileFormView({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: BirthProfileForm;
  onSubmit: (f: BirthProfileForm) => Promise<void>;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [f, setF] = useState<BirthProfileForm>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof BirthProfileForm>(k: K, v: BirthProfileForm[K]) => setF((s) => ({ ...s, [k]: v }));

  const computedOffset = useMemo(() => {
    if (!f.timezone || !f.birth_date) return null;
    try {
      return resolveUtcOffsetMinutes(parseDateTime(f.birth_date, f.time_known ? f.birth_time || "12:00" : "12:00"), f.timezone);
    } catch {
      return null;
    }
  }, [f.timezone, f.birth_date, f.birth_time, f.time_known]);

  useEffect(() => {
    if (computedOffset !== null) setF((s) => ({ ...s, utc_offset_minutes: computedOffset }));
  }, [computedOffset]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.timezone) {
      toast.error(t("pickPlace"));
      return;
    }
    const payload: BirthProfileForm = {
      ...f,
      birth_time: f.time_known ? (f.birth_time && f.birth_time.length === 5 ? `${f.birth_time}:00` : f.birth_time) : null,
      notes: f.notes?.trim() ? f.notes : null,
    };
    const parsed = birthProfileSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues.map((i) => i.path.join(".")).join(", "));
      return;
    }
    setBusy(true);
    try {
      await onSubmit(parsed.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("somethingWrong"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bp-name">{t("name")} *</Label>
          <Input id="bp-name" required maxLength={120} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{t("gender")}</Label>
          <Select value={f.gender ?? ""} onValueChange={(v) => set("gender", v as BirthProfileForm["gender"])}>
            <SelectTrigger>
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("male")}</SelectItem>
              <SelectItem value="female">{t("female")}</SelectItem>
              <SelectItem value="other">{t("other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("relation")}</Label>
          <Select value={f.relation} onValueChange={(v) => set("relation", v as BirthProfileForm["relation"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELATIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {t(REL_KEYS[r])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-date">{t("birthDate")} *</Label>
          <Input
            id="bp-date"
            type="date"
            required
            min="1800-01-01"
            max="2100-12-31"
            value={f.birth_date}
            onChange={(e) => set("birth_date", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-time">{t("birthTime")}</Label>
          <Input
            id="bp-time"
            type="time"
            step={1}
            disabled={!f.time_known}
            required={f.time_known}
            value={f.birth_time ?? ""}
            onChange={(e) => set("birth_time", e.target.value)}
          />
          <label className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <Checkbox checked={!f.time_known} onCheckedChange={(c) => set("time_known", c !== true)} />
            {t("timeUnknown")}
          </label>
        </div>
        {!f.time_known && (
          <p className="rounded-md border border-warning/40 bg-warning/10 p-3 text-xs sm:col-span-2">{t("timeUnknownNote")}</p>
        )}
        <div className="space-y-1.5 sm:col-span-2">
          <Label>{t("birthPlace")} *</Label>
          <PlaceSearch
            value={f.place_name}
            onPick={(p) =>
              setF((s) => ({
                ...s,
                place_name: placeLabel(p),
                latitude: Number(p.latitude.toFixed(6)),
                longitude: Number(p.longitude.toFixed(6)),
                timezone: p.timezone,
              }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-lat">{t("latitude")}</Label>
          <Input
            id="bp-lat"
            type="number"
            step="0.000001"
            min={-90}
            max={90}
            value={f.latitude}
            onChange={(e) => set("latitude", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bp-lon">{t("longitude")}</Label>
          <Input
            id="bp-lon"
            type="number"
            step="0.000001"
            min={-180}
            max={180}
            value={f.longitude}
            onChange={(e) => set("longitude", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
            <span>
              {t("timezone")}: <b>{f.timezone || "—"}</b>
            </span>
            <span className="tabular">
              {t("utcOffset")}: <b>{f.timezone ? formatOffset(f.utc_offset_minutes) : "—"}</b>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{t("utcOffsetAuto")}</p>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bp-notes">{t("notes")}</Label>
          <Textarea id="bp-notes" maxLength={2000} value={f.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="hero" disabled={busy}>
          {busy ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
