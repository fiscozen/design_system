import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useActions } from "../rest";
import { getFirstFetchCallUrl } from "./test-utils";

describe("useList - Pagination Defaults", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();

    setupFzFetcher({
      baseUrl: "https://api.example.com",
    });

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, name: "User 1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as typeof fetch;
  });

  it("should apply default pagination values when pagination is provided but empty", () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { pagination } = useList({ pagination: {} });

    expect(pagination.page).toBe(1);
    expect(pagination.pageSize).toBe(50);
  });

  it("should apply default pageSize when only page is provided", () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { pagination } = useList({ pagination: { page: 2 } });

    expect(pagination.page).toBe(2);
    expect(pagination.pageSize).toBe(50);
  });

  it("should apply default page when only pageSize is provided", () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { pagination } = useList({ pagination: { pageSize: 100 } });

    expect(pagination.page).toBe(1);
    expect(pagination.pageSize).toBe(100);
  });

  it("should not apply defaults when pagination is not provided", () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { pagination } = useList();

    expect(pagination.page).toBeUndefined();
    expect(pagination.pageSize).toBeUndefined();
  });

  it("should preserve custom values when both page and pageSize are provided", () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { pagination } = useList({ pagination: { page: 3, pageSize: 25 } });

    expect(pagination.page).toBe(3);
    expect(pagination.pageSize).toBe(25);
  });

  it("should use defaults in query string when pagination is provided", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { execute } = useList({ pagination: {} });

    await execute();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.example.com/users"),
      expect.objectContaining({
        method: "GET",
      }),
    );

    const callUrl = getFirstFetchCallUrl();
    const url = new URL(callUrl);
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("page_size")).toBe("50");
  });
});

describe("useList - Ordering", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();

    setupFzFetcher({
      baseUrl: "https://api.example.com",
    });

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, name: "User 1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as typeof fetch;
  });

  it("should format ordering query string correctly", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { ordering, execute } = useList();

    ordering.push({ name: "asc" });
    ordering.push({ created_at: "desc" });

    await execute();

    const callUrl = getFirstFetchCallUrl();
    const url = new URL(callUrl);

    expect(url.searchParams.get("ordering")).toBe("name,-created_at");
  });

  it("should exclude 'none' values from ordering query string", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { ordering, execute } = useList();

    ordering.push({ name: "asc" });
    ordering.push({ created_at: "none" });
    ordering.push({ status: "desc" });

    await execute();

    const callUrl = getFirstFetchCallUrl();
    const url = new URL(callUrl);

    expect(url.searchParams.get("ordering")).toBe("name,-status");
  });

  it("should preserve order of ordering array in query string", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { ordering, execute } = useList();

    ordering.push({ name: "asc" });
    ordering.push({ created_at: "desc" });
    ordering.push({ status: "asc" });

    await execute();

    const callUrl = getFirstFetchCallUrl();
    const url = new URL(callUrl);

    expect(url.searchParams.get("ordering")).toBe("name,-created_at,status");
  });

  it("should not include ordering in query string when array is empty", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { execute } = useList();

    await execute();

    const callUrl = getFirstFetchCallUrl();
    const url = new URL(callUrl);

    expect(url.searchParams.get("ordering")).toBeNull();
  });
});

describe("useList - AutoUpdate Debounce", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();

    setupFzFetcher({
      baseUrl: "https://api.example.com",
      autoUpdateDebounceDelay: 100, // 100ms debounce
    });

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, name: "User 1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as typeof fetch;
  });

  it("should debounce rapid changes and execute only one request", async () => {
    const { useList } = useActions<{ id: number; name: string }>("users");
    const { filters, ordering, pagination } = useList({
      autoUpdate: true,
      onMount: false, // Disable onMount to control when requests start
    });

    // Rapid changes that should be debounced into a single request
    filters.name = "John";
    ordering.push({ age: "asc" });
    pagination.page = 2;

    // Wait for debounce delay + a bit more to ensure request completes
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should have been called only once (after debounce)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should use default debounce delay when not configured", async () => {
    resetFzFetcher();
    setupFzFetcher({
      baseUrl: "https://api.example.com",
      // autoUpdateDebounceDelay not specified, should use default 100ms
    });

    global.fetch = vi.fn(() => {
      return Promise.resolve(
        new Response(JSON.stringify([{ id: 1, name: "User 1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }) as typeof fetch;

    const { useList } = useActions<{ id: number; name: string }>("users");
    const { filters } = useList({
      autoUpdate: true,
      onMount: false,
    });

    filters.name = "John";

    // Wait for debounce delay + execution time
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should have been called once after debounce
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
