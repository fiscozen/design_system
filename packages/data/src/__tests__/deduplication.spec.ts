import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useFzFetch } from "../rest";

describe("Deduplication", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();
  });

  it("should not cause infinite recursion when finding pending request", async () => {
    setupFzFetcher({
      baseUrl: "https://api.example.com",
      deduplication: true,
    });

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as any;

    const { execute: execute1 } = useFzFetch<{ id: number }>("/users/1");
    const { execute: execute2 } = useFzFetch<{ id: number }>("/users/1");

    // Execute both requests - should not cause stack overflow
    const promise1 = execute1();
    const promise2 = execute2();

    // Should complete without infinite recursion
    await expect(Promise.all([promise1, promise2])).resolves.not.toThrow();
  });
});

