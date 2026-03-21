import { describe, it, expect } from "vitest";
import { calculateQuitStats } from "./calculations";

describe("calculateQuitStats", () => {
  it("should calculate correct stats for exactly 1 day (24h)", () => {
    const profile = {
      cigarettes_per_day: 24,
      price_per_cigarette: 1.0,
      quit_date: "2026-03-20T12:00:00.000Z",
    };
    const now = new Date("2026-03-21T12:00:00.000Z");

    const result = calculateQuitStats(profile, now);

    expect(result.days).toBe(1);
    expect(result.avoidedCount).toBe(24);
    expect(result.moneySaved).toBe(24);
    expect(result.hoursRecovered).toBe(4); // 24 * 11 min = 264 min = 4.4h (Math.floor is 4)
  });

  it("should handle 0 cigarettes avoided properly", () => {
    const profile = {
      cigarettes_per_day: 20,
      price_per_cigarette: 1.25,
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
      cigarettes_per_day: 24, // 1 per hour
      price_per_cigarette: 10,
      quit_date: "2026-03-21T10:00:00.000Z",
    };
    const now = new Date("2026-03-21T12:30:00.000Z"); // 2.5 hours elapsed

    const result = calculateQuitStats(profile, now);

    expect(result.avoidedCount).toBe(2); // 2.5 hours = 2 units (Math.floor)
    expect(result.moneySaved).toBe(20);
  });
});
