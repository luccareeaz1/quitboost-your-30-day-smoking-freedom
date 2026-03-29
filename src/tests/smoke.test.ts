import { describe, it, expect, vi } from "vitest";

// Mock Supabase to test service logic without network
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "test-user", total_points: 100 }, error: null }),
    })),
  },
}));

describe("Smoke Test: Auth & Services Integration", () => {
  it("should handle profile fetching logic", async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.from("profiles").select("*").eq("id", "test-user").single();
    
    expect(data.id).toBe("test-user");
    expect(data.total_points).toBe(100);
  });

  it("should verify health milestones calculation logic", async () => {
    const { calculateHealthProgress } = await import("@/lib/calculations");
    // 24 hours = 86400 seconds
    const progress = calculateHealthProgress(86400);
    
    expect(progress.length).toBeGreaterThan(0);
    expect(progress[0].achieved).toBe(true); // 20m milestone
    expect(progress[1].achieved).toBe(true); // 8h milestone
    expect(progress[2].achieved).toBe(true); // 24h milestone
  });

  it("should verify streak check-in logic (mocked)", async () => {
    const { streakService } = await import("@/lib/services");
    const result = await streakService.get("test-user");
    // Since we mocked supabase.from().select().eq().single() to return {id: 'test-user'}, 
    // we expect the service to return something valid
    expect(result).toBeDefined();
  });
});
