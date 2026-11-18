import { useEffect, useState } from "react";

export interface RecentChart {
  id: string;
  name: string;
  at: number;
}

export const RECENT_KEY = "ajp.recentCharts";
export const RECENT_MAX = 8;

/** Pure: put `entry` first, drop older copies of the same id, keep at most RECENT_MAX. */
export function pushRecent(list: RecentChart[], entry: RecentChart): RecentChart[] {
  return [entry, ...list.filter((r) => r.id !== entry.id)].slice(0, RECENT_MAX);
}

function read(): RecentChart[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RecentChart =>
        typeof r === "object" && r !== null && typeof (r as RecentChart).id === "string" && typeof (r as RecentChart).name === "string",
    );
  } catch {
    return [];
  }
}

const EVENT = "ajp:recent";

export function recordRecentChart(id: string, name: string) {
  const next = pushRecent(read(), { id, name, at: Date.now() });
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

/** Recently opened charts on this device (read after mount to avoid hydration mismatch). */
export function useRecentCharts() {
  const [list, setList] = useState<RecentChart[]>([]);
  useEffect(() => {
    const sync = () => setList(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return list;
}
