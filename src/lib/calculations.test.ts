import { describe, it, expect } from "vitest";
import { calculateQuitStats } from "./calculations";

describe("calculateQuitStats", () => {
  it("should calculate correct stats for exactly 1 day (24h)", () => {
    const profile = {
      cigarettes_per_day: 24,
      pack_price: 24,
      cigarettes_per_pack: 20,
      quit_date: "2026-03-20T12:00:00.000Z",
    };
    const now = new Date("2026-03-21T12:00:00.000Z");

    const result = calculateQuitStats(profile, now);

    expect(result.days).toBe(1);
    expect(result.avoidedCount).toBe(24);
  });

  it("should handle 0 cigarettes avoided properly", () => {
    const profile = {
      cigarettes_per_day: 20,
      pack_price: 25,
      cigarettes_per_pack: 20,
      quit_date: "2026-03-21T12:00:00.000Z",
    };
    const now = new Date("2026-03-21T12:00:00.000Z");

    const result = calculateQuitStats(profile, now);

    expect(result.days).toBe(0);
    expect(result.avoidedCount).toBe(0);
    expect(result.moneySaved).toBe(0);
  });

  it("should calculate partial units avoided during the first hours", () => {
    const profile = {
      cigarettes_per_day: 24,
      pack_price: 200,
      cigarettes_per_pack: 20,
      quit_date: "2026-03-21T10:00:00.000Z",
    };
    const now = new Date("2026-03-21T12:30:00.000Z");

    const result = calculateQuitStats(profile, now);

    expect(result.avoidedCount).toBe(2);
  });
});
