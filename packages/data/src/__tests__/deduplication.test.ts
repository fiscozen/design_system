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
    }) as typeof fetch;

    const { execute: execute1 } = useFzFetch<{ id: number }>("/users/1");
    const { execute: execute2 } = useFzFetch<{ id: number }>("/users/1");

    // Execute both requests - should not cause stack overflow
    const promise1 = execute1();
    const promise2 = execute2();

    // Should complete without infinite recursion
    await expect(Promise.all([promise1, promise2])).resolves.not.toThrow();
  });

  describe("JSON normalization", () => {
    beforeEach(() => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });
    });

    it("should deduplicate requests with nested objects having different key orders", async () => {
      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Same data, different key order in nested object
      const body1 = JSON.stringify({
        user: { name: "John", age: 30, email: "john@example.com" },
      });
      const body2 = JSON.stringify({
        user: { email: "john@example.com", name: "John", age: 30 },
      });

      const { execute: execute1 } = useFzFetch<{ success: boolean }>(
        "/users",
        {
          method: "POST",
          body: body1,
        },
        { immediate: false },
      );

      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/users",
        {
          method: "POST",
          body: body2,
        },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Should only make one fetch call (deduplicated)
      expect(fetchCallCount).toBe(1);
    });

    it("should deduplicate requests with deeply nested objects having different key orders", async () => {
      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Same data, different key order at multiple nesting levels
      const body1 = JSON.stringify({
        level1: {
          level2: { c: 3, a: 1, b: 2 },
          x: "test",
        },
        top: "value",
      });
      const body2 = JSON.stringify({
        top: "value",
        level1: {
          x: "test",
          level2: { a: 1, b: 2, c: 3 },
        },
      });

      const { execute: execute1 } = useFzFetch<{ success: boolean }>(
        "/test",
        {
          method: "POST",
          body: body1,
        },
        { immediate: false },
      );

      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/test",
        {
          method: "POST",
          body: body2,
        },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Should only make one fetch call (deduplicated)
      expect(fetchCallCount).toBe(1);
    });

    it("should deduplicate requests with arrays containing objects with different key orders", async () => {
      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Same data, different key order in array elements
      const body1 = JSON.stringify({
        items: [
          { id: 1, name: "Item 1" },
          { name: "Item 2", id: 2 },
        ],
      });
      const body2 = JSON.stringify({
        items: [
          { name: "Item 1", id: 1 },
          { id: 2, name: "Item 2" },
        ],
      });

      const { execute: execute1 } = useFzFetch<{ success: boolean }>(
        "/items",
        {
          method: "POST",
          body: body1,
        },
        { immediate: false },
      );

      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/items",
        {
          method: "POST",
          body: body2,
        },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Should only make one fetch call (deduplicated)
      expect(fetchCallCount).toBe(1);
    });

    it("should not deduplicate requests with actually different nested objects", async () => {
      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Different data (different values)
      const body1 = JSON.stringify({
        user: { name: "John", age: 30 },
      });
      const body2 = JSON.stringify({
        user: { name: "Jane", age: 25 },
      });

      const { execute: execute1 } = useFzFetch<{ success: boolean }>(
        "/users",
        {
          method: "POST",
          body: body1,
        },
        { immediate: false },
      );

      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/users",
        {
          method: "POST",
          body: body2,
        },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Should make two fetch calls (not deduplicated - different data)
      expect(fetchCallCount).toBe(2);
    });

    it("should handle arrays with nested objects correctly", async () => {
      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Complex structure: array of objects with nested objects
      const body1 = JSON.stringify([
        {
          id: 1,
          metadata: { created: "2024-01-01", author: "John" },
          tags: ["tag1", "tag2"],
        },
        {
          metadata: { author: "Jane", created: "2024-01-02" },
          id: 2,
          tags: ["tag3"],
        },
      ]);
      const body2 = JSON.stringify([
        {
          metadata: { author: "John", created: "2024-01-01" },
          tags: ["tag1", "tag2"],
          id: 1,
        },
        {
          id: 2,
          tags: ["tag3"],
          metadata: { created: "2024-01-02", author: "Jane" },
        },
      ]);

      const { execute: execute1 } = useFzFetch<{ success: boolean }>(
        "/items",
        {
          method: "POST",
          body: body1,
        },
        { immediate: false },
      );

      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/items",
        {
          method: "POST",
          body: body2,
        },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Should only make one fetch call (deduplicated)
      expect(fetchCallCount).toBe(1);
    });
  });
});
