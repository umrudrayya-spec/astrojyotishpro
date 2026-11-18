import { describe, expect, it } from "vitest";
import { pushRecent, RECENT_MAX, type RecentChart } from "./recent";

const r = (id: string, at = 0): RecentChart => ({ id, name: id, at });

describe("recent charts", () => {
  it("puts the newest first and removes the older copy", () => {
    expect(pushRecent([r("a"), r("b")], r("b", 5)).map((x) => x.id)).toEqual(["b", "a"]);
  });
  it("keeps at most 8 entries", () => {
    const list = Array.from({ length: 8 }, (_, i) => r(String(i)));
    const next = pushRecent(list, r("new"));
    expect(RECENT_MAX).toBe(8);
    expect(next).toHaveLength(8);
    expect(next[0]?.id).toBe("new");
    expect(next.some((x) => x.id === "7")).toBe(false);
  });
});
