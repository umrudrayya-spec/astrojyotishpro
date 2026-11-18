import { birthProfileSchema, type BirthProfileForm } from "@/lib/birth-profiles-schema";
import { parseDateTime, resolveUtcOffsetMinutes } from "@/lib/astro/time";

export const CSV_COLUMNS = [
  "name",
  "gender",
  "relation",
  "birth_date",
  "birth_time",
  "time_known",
  "place_name",
  "latitude",
  "longitude",
  "timezone",
  "utc_offset_minutes",
  "notes",
] as const;

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function profilesToCsv(list: BirthProfileForm[]): string {
  const rows = [CSV_COLUMNS.join(",")];
  for (const p of list) rows.push(CSV_COLUMNS.map((c) => cell(p[c])).join(","));
  return rows.join("\r\n") + "\r\n";
}

/** RFC 4180 parser: quoted fields, doubled quotes, CRLF/LF, commas inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export interface CsvImportResult {
  profiles: BirthProfileForm[];
  errors: { row: number; message: string }[];
}

/**
 * Parse a profiles CSV. Required columns: name, birth_date, place_name, latitude, longitude, timezone.
 * A blank utc_offset_minutes is resolved from the IANA zone's historical rules for that birth date/time.
 */
export function csvToProfiles(text: string): CsvImportResult {
  const rows = parseCsv(text);
  const header = (rows[0] ?? []).map((h) => h.trim().toLowerCase());
  const required = ["name", "birth_date", "place_name", "latitude", "longitude", "timezone"];
  const missing = required.filter((c) => !header.includes(c));
  if (missing.length) return { profiles: [], errors: [{ row: 1, message: `Missing columns: ${missing.join(", ")}` }] };
  const profiles: BirthProfileForm[] = [];
  const errors: CsvImportResult["errors"] = [];
  rows.slice(1).forEach((r, idx) => {
    const get = (c: string) => {
      const i = header.indexOf(c);
      return i >= 0 ? (r[i] ?? "").trim() : "";
    };
    try {
      const time = get("birth_time");
      const tkRaw = get("time_known").toLowerCase();
      const timeKnown = tkRaw === "" ? time !== "" : ["true", "1", "yes", "y"].includes(tkRaw);
      const tz = get("timezone");
      const date = get("birth_date");
      const offRaw = get("utc_offset_minutes");
      const offset =
        offRaw !== "" ? Number(offRaw) : resolveUtcOffsetMinutes(parseDateTime(date, timeKnown && time ? time : "12:00:00"), tz);
      const gender = get("gender").toLowerCase();
      const relation = get("relation").toLowerCase();
      const form = birthProfileSchema.parse({
        name: get("name"),
        gender: gender === "" ? null : gender,
        relation: relation === "" ? "other" : relation,
        birth_date: date,
        birth_time: timeKnown && time ? (time.length === 5 ? `${time}:00` : time) : null,
        time_known: timeKnown && time !== "",
        place_name: get("place_name"),
        latitude: Number(get("latitude")),
        longitude: Number(get("longitude")),
        timezone: tz,
        utc_offset_minutes: offset,
        notes: get("notes") || null,
      });
      profiles.push(form);
    } catch (e) {
      errors.push({ row: idx + 2, message: e instanceof Error ? e.message.slice(0, 200) : "Invalid row" });
    }
  });
  return { profiles, errors };
}
