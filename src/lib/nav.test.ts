import { describe, expect, it } from "vitest";
import { findNavForPath, NAV_ITEMS, SPEC_SECTION_COUNT } from "./nav";

describe("navigation", () => {
  it("lists all 40 spec v3 sections", () => {
    expect(SPEC_SECTION_COUNT).toBe(40);
    expect(new Set(NAV_ITEMS.map((i) => i.id)).size).toBe(NAV_ITEMS.length);
  });
  it("maps a chart deep link to the Birth chart section", () => {
    expect(findNavForPath("/chart/abc")?.item.id).toBe("chart");
    expect(findNavForPath("/settings/")?.item.id).toBe("settings");
    expect(findNavForPath("/nowhere")).toBeNull();
  });
});
