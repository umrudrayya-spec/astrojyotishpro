import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { placeLabel, searchPlaces, type Place } from "@/lib/geocode";
import { useI18n } from "@/lib/i18n";

export function PlaceSearch({ value, onPick }: { value: string; onPick: (p: Place) => void }) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState(value);
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setQ(value), [value]);

  const onChange = (v: string) => {
    setQ(v);
    setOpen(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        setResults(await searchPlaces(v, lang));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div className="relative">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t("searchPlace")}
        className="pl-9"
        aria-label={t("birthPlace")}
      />
      {loading && <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(p);
                  setQ(placeLabel(p));
                  setOpen(false);
                }}
              >
                <div className="font-medium">{placeLabel(p)}</div>
                <div className="text-xs text-muted-foreground tabular">
                  {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)} · {p.timezone}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
