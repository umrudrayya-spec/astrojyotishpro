/**
 * Civil time ↔ UTC conversion using the IANA time zone database bundled with the JS runtime
 * (Intl), which includes historical offsets (e.g. India's +06:30 war time 1942–45, DST rules).
 */

function partsInZone(utcMs: number, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const out: Record<string, number> = {};
  for (const p of fmt.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return out as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

/** Offset (minutes east of UTC) that `timeZone` had at the given UTC instant. */
export function zoneOffsetMinutesAt(utcMs: number, timeZone: string): number {
  const p = partsInZone(utcMs, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

export interface LocalDateTime {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second?: number;
}

/** Resolve the UTC offset (minutes) for a local wall-clock time in an IANA zone. */
export function resolveUtcOffsetMinutes(local: LocalDateTime, timeZone: string): number {
  const wall = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second ?? 0);
  let offset = zoneOffsetMinutesAt(wall, timeZone);
  // Iterate: the offset at (wall - offset) may differ near transitions.
  for (let i = 0; i < 3; i++) {
    const next = zoneOffsetMinutesAt(wall - offset * 60000, timeZone);
    if (next === offset) break;
    offset = next;
  }
  return offset;
}

/** Convert a local wall-clock time with an explicit UTC offset to a UTC Date. */
export function localToUtc(local: LocalDateTime, utcOffsetMinutes: number): Date {
  const wall = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second ?? 0);
  return new Date(wall - utcOffsetMinutes * 60000);
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function parseDateTime(date: string, time: string | null): LocalDateTime {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi, s] = (time ?? "12:00:00").split(":").map(Number);
  return { year: y ?? 2000, month: mo ?? 1, day: d ?? 1, hour: h ?? 12, minute: mi ?? 0, second: s ?? 0 };
}
