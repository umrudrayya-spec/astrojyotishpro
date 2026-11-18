import { describe, expect, it } from "vitest";
import { localToUtc, resolveUtcOffsetMinutes } from "./time";

describe("Historical time zones", () => {
  it("India uses +05:30 in 1990", () => {
    expect(resolveUtcOffsetMinutes({ year: 1990, month: 5, day: 15, hour: 10, minute: 0 }, "Asia/Kolkata")).toBe(330);
  });
  it("India used +06:30 war time in 1943", () => {
    expect(resolveUtcOffsetMinutes({ year: 1943, month: 6, day: 1, hour: 10, minute: 0 }, "Asia/Kolkata")).toBe(390);
  });
  it("New York is -04:00 in July (DST) and -05:00 in January", () => {
    expect(resolveUtcOffsetMinutes({ year: 2020, month: 7, day: 1, hour: 12, minute: 0 }, "America/New_York")).toBe(-240);
    expect(resolveUtcOffsetMinutes({ year: 2020, month: 1, day: 1, hour: 12, minute: 0 }, "America/New_York")).toBe(-300);
  });
  it("converts local IST to UTC", () => {
    const utc = localToUtc({ year: 2000, month: 1, day: 1, hour: 17, minute: 30 }, 330);
    expect(utc.toISOString()).toBe("2000-01-01T12:00:00.000Z");
  });
  it("leap day converts correctly", () => {
    const utc = localToUtc({ year: 2024, month: 2, day: 29, hour: 0, minute: 15 }, 330);
    expect(utc.toISOString()).toBe("2024-02-28T18:45:00.000Z");
  });
});
