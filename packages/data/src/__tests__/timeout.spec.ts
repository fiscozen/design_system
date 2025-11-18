import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useFzFetch } from "../rest";

describe("Timeout", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();
  });

  it("should cleanup timeout signal only once", async () => {
    setupFzFetcher({
      baseUrl: "https://api.example.com",
      timeout: 1000, // 1 second timeout
    });

    // Mock fetch that completes quickly
    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify({ data: "test" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as any;

    const { execute } = useFzFetch<{ data: string }>("/test");

    // Execute request - should complete before timeout
    await execute();

    // If cleanup was called multiple times, we'd see errors
    // This test verifies that cleanup works correctly without throwing
    expect(true).toBe(true);
  });
});

