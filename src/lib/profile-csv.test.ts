import { describe, expect, it } from "vitest";
import { csvToProfiles, parseCsv, profilesToCsv } from "./profile-csv";
import type { BirthProfileForm } from "./birth-profiles-schema";

const sample: BirthProfileForm = {
  name: 'Ravi "Kumar", Jr',
  gender: "male",
  relation: "self",
  birth_date: "1994-02-20",
  birth_time: "13:30:00",
  time_known: true,
  place_name: "Kurnool, Andhra Pradesh",
  latitude: 15.83,
  longitude: 78.04,
  timezone: "Asia/Kolkata",
  utc_offset_minutes: 330,
  notes: "line1\nline2",
};

describe("profile CSV", () => {
  it("round-trips quotes, commas and newlines", () => {
    const { profiles, errors } = csvToProfiles(profilesToCsv([sample]));
    expect(errors).toEqual([]);
    expect(profiles).toEqual([sample]);
  });

  it("parses quoted fields with doubled quotes", () => {
    expect(parseCsv('a,"b ""x"", c"\r\n1,2\n')).toEqual([
      ["a", 'b "x", c'],
      ["1", "2"],
    ]);
  });

  it("resolves a blank UTC offset from historical zone rules (India 1942 war time = +6:30)", () => {
    const csv = "name,birth_date,birth_time,place_name,latitude,longitude,timezone\nA,1943-06-01,10:00,Chennai,13.08,80.27,Asia/Kolkata\n";
    const { profiles } = csvToProfiles(csv);
    expect(profiles[0]?.utc_offset_minutes).toBe(390);
    expect(profiles[0]?.time_known).toBe(true);
    expect(profiles[0]?.birth_time).toBe("10:00:00");
  });

  it("treats a missing time as unknown birth time", () => {
    const csv = "name,birth_date,place_name,latitude,longitude,timezone,utc_offset_minutes\nB,2000-01-01,Delhi,28.6,77.2,Asia/Kolkata,330\n";
    const { profiles } = csvToProfiles(csv);
    expect(profiles[0]?.time_known).toBe(false);
    expect(profiles[0]?.birth_time).toBeNull();
  });

  it("reports bad rows by spreadsheet row number and keeps good rows", () => {
    const csv =
      "name,birth_date,place_name,latitude,longitude,timezone,utc_offset_minutes\nGood,2000-01-01,X,1,1,UTC,0\nBad,2000-13-99x,X,999,1,UTC,0\n";
    const r = csvToProfiles(csv);
    expect(r.profiles).toHaveLength(1);
    expect(r.errors.map((e) => e.row)).toEqual([3]);
  });

  it("rejects a file missing required columns", () => {
    const r = csvToProfiles("name,birth_date\nA,2000-01-01\n");
    expect(r.profiles).toHaveLength(0);
    expect(r.errors[0]?.message).toMatch(/place_name/);
  });
});
