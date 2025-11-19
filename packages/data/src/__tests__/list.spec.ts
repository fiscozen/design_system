import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useActions } from "../rest";

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
    }) as any;
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

    const callUrl = (global.fetch as any).mock.calls[0][0];
    const url = new URL(callUrl);
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("per_page")).toBe("50");
  });
});

