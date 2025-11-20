import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setupFzFetcher,
  resetFzFetcher,
  createPaginatedListAction,
} from "../rest";
import type { PaginatedResponse } from "../rest/actions/paginated-list/types";

interface User {
  id: number;
  name: string;
  email: string;
}

describe("createPaginatedListAction", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();

    setupFzFetcher({
      baseUrl: "https://api.example.com",
    });
  });

  describe("Basic functionality", () => {
    it("should fetch paginated data and extract results", async () => {
      const mockResponse: PaginatedResponse<User> = {
        results: [
          { id: 1, name: "User 1", email: "user1@example.com" },
          { id: 2, name: "User 2", email: "user2@example.com" },
        ],
        count: 100,
        next: "https://api.example.com/users?page=2",
        previous: null,
        pages: 10,
        page: 1,
      };

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { data, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(data.value).toEqual([
        { id: 1, name: "User 1", email: "user1@example.com" },
        { id: 2, name: "User 2", email: "user2@example.com" },
      ]);
    });

    it("should extract meta from paginated response", async () => {
      const mockResponse: PaginatedResponse<User> = {
        results: [{ id: 1, name: "User 1", email: "user1@example.com" }],
        count: 100,
        next: null,
        previous: null,
        pages: 10,
        page: 2,
      };

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { meta, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(meta.value).toEqual({
        count: 100,
        pages: 10,
        page: 2,
      });
    });

    it("should return null meta when no data is loaded", () => {
      const { meta } = createPaginatedListAction<User>("users");

      expect(meta.value).toBeNull();
    });
  });

  describe("DataKey option", () => {
    it("should extract data from custom dataKey", async () => {
      const mockResponse = {
        items: [{ id: 1, name: "User 1", email: "user1@example.com" }],
        count: 100,
        next: null,
        previous: null,
        pages: 10,
        page: 1,
      };

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { data, execute } = createPaginatedListAction<User>("users", {
        dataKey: "items",
      });

      await execute();

      expect(data.value).toEqual([
        { id: 1, name: "User 1", email: "user1@example.com" },
      ]);
    });

    it("should default to 'results' when dataKey is not provided", async () => {
      const mockResponse: PaginatedResponse<User> = {
        results: [{ id: 1, name: "User 1", email: "user1@example.com" }],
        count: 100,
        next: null,
        previous: null,
        pages: 10,
        page: 1,
      };

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { data, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(data.value).toEqual([
        { id: 1, name: "User 1", email: "user1@example.com" },
      ]);
    });
  });

  describe("Ordering query string format", () => {
    it("should format ordering query string correctly", async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              results: [],
              count: 0,
              next: null,
              previous: null,
              pages: 0,
              page: 1,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          ),
        );
      }) as any;

      const { ordering, execute } = createPaginatedListAction<User>("users");

      ordering.push({ name: "asc" });
      ordering.push({ created_at: "desc" });

      await execute();

      const callUrl = (global.fetch as any).mock.calls[0][0];
      const url = new URL(callUrl);

      expect(url.searchParams.get("ordering")).toBe("name,-created_at");
    });

    it("should exclude 'none' values from ordering query string", async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              results: [],
              count: 0,
              next: null,
              previous: null,
              pages: 0,
              page: 1,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          ),
        );
      }) as any;

      const { ordering, execute } = createPaginatedListAction<User>("users");

      ordering.push({ name: "asc" });
      ordering.push({ created_at: "none" });
      ordering.push({ status: "desc" });

      await execute();

      const callUrl = (global.fetch as any).mock.calls[0][0];
      const url = new URL(callUrl);

      expect(url.searchParams.get("ordering")).toBe("name,-status");
    });
  });

  describe("handleOrderingChange", () => {
    it("should update ordering array (multiple ordering mode)", () => {
      const { ordering, handleOrderingChange } =
        createPaginatedListAction<User>("users");

      handleOrderingChange({ field: "name" }, "asc");
      expect(ordering).toEqual([{ name: "asc" }]);

      handleOrderingChange({ field: "created_at" }, "desc");
      expect(ordering).toEqual([{ name: "asc" }, { created_at: "desc" }]);
    });

    it("should update existing ordering entry", () => {
      const { ordering, handleOrderingChange } =
        createPaginatedListAction<User>("users");

      handleOrderingChange({ field: "name" }, "asc");
      expect(ordering).toEqual([{ name: "asc" }]);

      handleOrderingChange({ field: "name" }, "desc");
      expect(ordering).toEqual([{ name: "desc" }]);
    });

    it("should remove ordering entry when direction is 'none'", () => {
      const { ordering, handleOrderingChange } =
        createPaginatedListAction<User>("users");

      handleOrderingChange({ field: "name" }, "asc");
      handleOrderingChange({ field: "created_at" }, "desc");
      expect(ordering.length).toBe(2);

      handleOrderingChange({ field: "name" }, "none");
      expect(ordering).toEqual([{ created_at: "desc" }]);
    });

    it("should reset all orderings in single ordering mode", () => {
      const { ordering, handleOrderingChange } = createPaginatedListAction<User>(
        "users",
        {
          enableSingleOrdering: true,
        },
      );

      handleOrderingChange({ field: "name" }, "asc");
      expect(ordering).toEqual([{ name: "asc" }]);

      handleOrderingChange({ field: "created_at" }, "desc");
      expect(ordering).toEqual([{ created_at: "desc" }]);
    });

    it("should remove ordering entry when direction is 'none' in single ordering mode", () => {
      const { ordering, handleOrderingChange } = createPaginatedListAction<User>(
        "users",
        {
          enableSingleOrdering: true,
        },
      );

      handleOrderingChange({ field: "name" }, "asc");
      expect(ordering).toEqual([{ name: "asc" }]);

      handleOrderingChange({ field: "name" }, "none");
      expect(ordering).toEqual([]);
    });
  });

  describe("handlePageChange", () => {
    it("should update pagination.page", async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              results: [],
              count: 0,
              next: null,
              previous: null,
              pages: 0,
              page: 1,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          ),
        );
      }) as any;

      const { pagination, handlePageChange, execute } =
        createPaginatedListAction<User>("users", {
          pagination: { page: 1, pageSize: 25 },
        });

      expect(pagination.page).toBe(1);

      handlePageChange(2);
      expect(pagination.page).toBe(2);

      await execute();

      const callUrl = (global.fetch as any).mock.calls[0][0];
      const url = new URL(callUrl);
      expect(url.searchParams.get("page")).toBe("2");
    });
  });

  describe("Pagination synchronization", () => {
    it("should synchronize pagination.page with meta.page", async () => {
      const mockResponse: PaginatedResponse<User> = {
        results: [],
        count: 100,
        next: null,
        previous: null,
        pages: 10,
        page: 3,
      };

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { pagination, meta, execute } = createPaginatedListAction<User>(
        "users",
        {
          pagination: { page: 1, pageSize: 25 },
        },
      );

      // Initially different
      expect(pagination.page).toBe(1);

      await execute();

      // After response, should be synchronized
      expect(meta.value?.page).toBe(3);
      expect(pagination.page).toBe(3);
    });

    it("should prevent race condition when multiple page requests are made quickly", async () => {
      // Track fetch calls and their corresponding page numbers
      const fetchCalls: Array<{ page: number; resolve: () => void }> = [];

      global.fetch = vi.fn((url: string) => {
        // Extract page number from URL
        const urlObj = new URL(url);
        const page = parseInt(urlObj.searchParams.get("page") || "1", 10);

        return new Promise<Response>((resolve) => {
          // Store the resolve function with the page number
          fetchCalls.push({
            page,
            resolve: () => {
              const response: PaginatedResponse<User> = {
                results: [],
                count: 100,
                next: null,
                previous: null,
                pages: 10,
                page,
              };
              resolve(
                new Response(JSON.stringify(response), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }),
              );
            },
          });
        });
      }) as any;

      // Disable autoUpdate and onMount to have manual control over when requests are made
      const { pagination, meta, execute } = createPaginatedListAction<User>(
        "users",
        {
          pagination: { page: 1, pageSize: 25 },
        },
        {
          autoUpdate: false, // Disable autoUpdate
          onMount: false, // Disable onMount to prevent initial fetch
        },
      );

      // Request page 1
      expect(pagination.page).toBe(1);
      const execute1Promise = execute();

      // Wait a bit for the fetch to be initiated
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Should have exactly 1 fetch call for page 1
      expect(fetchCalls.length).toBe(1);
      expect(fetchCalls[0].page).toBe(1);

      // Immediately request page 2 (before page 1 completes)
      pagination.page = 2;
      expect(pagination.page).toBe(2);
      const execute2Promise = execute();

      // Wait a bit for the second fetch to be initiated
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(fetchCalls.length).toBe(2);
      expect(fetchCalls[1].page).toBe(2);

      // Resolve page 1 response first (older response arrives after newer request)
      // This simulates the race condition: page 1 response arrives after page 2 was requested
      fetchCalls[0].resolve();

      // Wait for page 1 response to be processed
      await new Promise((resolve) => setTimeout(resolve, 50));

      // pagination.page should still be 2 (not overwritten by page 1 response)
      // This verifies the race condition fix: older responses don't overwrite newer user actions
      expect(pagination.page).toBe(2);

      // Resolve page 2 response
      fetchCalls[1].resolve();

      // Wait for both requests to complete
      await Promise.all([execute1Promise, execute2Promise]);

      // Final state should reflect page 2 (the intended page)
      expect(pagination.page).toBe(2);
      expect(meta.value?.page).toBe(2);
    });
  });

  describe("Reactive objects", () => {
    it("should return reactive filters object", () => {
      const { filters } = createPaginatedListAction<User>("users", {
        filters: { active: true },
      });

      expect(filters.active).toBe(true);

      filters.active = false;
      expect(filters.active).toBe(false);
    });

    it("should return reactive ordering array", () => {
      const { ordering } = createPaginatedListAction<User>("users", {
        ordering: [{ name: "asc" }],
      });

      expect(ordering).toEqual([{ name: "asc" }]);

      ordering.push({ created_at: "desc" });
      expect(ordering).toEqual([{ name: "asc" }, { created_at: "desc" }]);
    });

    it("should return reactive pagination object", () => {
      const { pagination } = createPaginatedListAction<User>("users", {
        pagination: { page: 1, pageSize: 25 },
      });

      expect(pagination.page).toBe(1);
      expect(pagination.pageSize).toBe(25);

      pagination.page = 2;
      expect(pagination.page).toBe(2);
    });

    it("should always have pagination defaults even when not provided", () => {
      // Test without pagination in params
      const { pagination: pagination1 } = createPaginatedListAction<User>("users");
      expect(pagination1.page).toBe(1);
      expect(pagination1.pageSize).toBe(50);

      // Test with empty pagination object
      const { pagination: pagination2 } = createPaginatedListAction<User>("users", {
        pagination: {},
      });
      expect(pagination2.page).toBe(1);
      expect(pagination2.pageSize).toBe(50);

      // Test with only options (no params)
      const { pagination: pagination3 } = createPaginatedListAction<User>("users", {
        dataKey: "items",
      });
      expect(pagination3.page).toBe(1);
      expect(pagination3.pageSize).toBe(50);
    });
  });

  describe("Error handling", () => {
    it("should handle fetch errors gracefully", async () => {
      global.fetch = vi.fn(() => {
        return Promise.reject(new Error("Network error"));
      }) as any;

      const { error, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(error.value).toBeTruthy();
      expect(error.value).toBeInstanceOf(Error);
      if (error.value) {
        expect(error.value.message).toBe("Network error");
      }
    });

    it("should return null data on error", async () => {
      global.fetch = vi.fn(() => {
        return Promise.reject(new Error("Network error"));
      }) as any;

      const { data, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(data.value).toBeNull();
    });

    it("should return null meta on error", async () => {
      global.fetch = vi.fn(() => {
        return Promise.reject(new Error("Network error"));
      }) as any;

      const { meta, execute } = createPaginatedListAction<User>("users");

      await execute();

      expect(meta.value).toBeNull();
    });
  });
});
