import { describe, it, expect } from "vitest";
import { normalizeParams, normalizePaginatedListResponse } from "../rest/actions/shared/normalize";
import { shallowRef } from "vue";
import type { UseFzFetchReturn } from "../rest/http/types";

describe("normalizeParams", () => {
  describe("Ordering normalization", () => {
    it("should normalize ordering array to query string with correct format", () => {
      const params = normalizeParams({
        ordering: [{ name: "asc" }, { created_at: "desc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("name,-created_at");
    });

    it("should exclude 'none' values from ordering query string", () => {
      const params = normalizeParams({
        ordering: [{ name: "asc" }, { created_at: "desc" }, { status: "none" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("name,-created_at");
      expect(queryParams.ordering).not.toContain("status");
    });

    it("should preserve order of ordering array", () => {
      const params = normalizeParams({
        ordering: [{ name: "asc" }, { created_at: "desc" }, { status: "asc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("name,-created_at,status");
    });

    it("should handle single ordering field", () => {
      const params = normalizeParams({
        ordering: [{ name: "asc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("name");
    });

    it("should handle single desc ordering field", () => {
      const params = normalizeParams({
        ordering: [{ name: "desc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("-name");
    });

    it("should not include ordering in query params when array is empty", () => {
      const params = normalizeParams({
        ordering: [],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBeUndefined();
    });

    it("should not include ordering in query params when all values are 'none'", () => {
      const params = normalizeParams({
        ordering: [{ name: "none" }, { created_at: "none" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBeUndefined();
    });

    it("should handle multiple desc fields", () => {
      const params = normalizeParams({
        ordering: [{ name: "desc" }, { created_at: "desc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("-name,-created_at");
    });

    it("should handle mixed asc and desc fields", () => {
      const params = normalizeParams({
        ordering: [{ name: "desc" }, { created_at: "asc" }, { status: "desc" }],
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.ordering).toBe("-name,created_at,-status");
    });
  });

  describe("Filters normalization", () => {
    it("should normalize filters to query params", () => {
      const params = normalizeParams({
        filters: {
          by_city: "Rome",
          by_type: "micro",
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.by_city).toBe("Rome");
      expect(queryParams.by_type).toBe("micro");
    });

    it("should exclude undefined filter values and include null (sent to server)", () => {
      const params = normalizeParams({
        filters: {
          by_city: "Rome",
          by_type: null,
          by_status: undefined,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.by_city).toBe("Rome");
      // undefined = omit from request; null = send to server
      expect(queryParams.by_type).toBe(null);
      expect(queryParams.by_status).toBeUndefined();
    });
  });

  describe("Pagination normalization", () => {
    it("should normalize pagination to query params", () => {
      const params = normalizeParams({
        pagination: {
          page: 2,
          pageSize: 25,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.page).toBe(2);
      expect(queryParams.page_size).toBe(25);
    });

    it("should handle pagination with only page", () => {
      const params = normalizeParams({
        pagination: {
          page: 3,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.page).toBe(3);
      expect(queryParams.page_size).toBeUndefined();
    });

    it("should handle pagination with only pageSize", () => {
      const params = normalizeParams({
        pagination: {
          pageSize: 100,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.page).toBeUndefined();
      expect(queryParams.page_size).toBe(100);
    });
  });

  describe("Combined params normalization", () => {
    it("should normalize all params together", () => {
      const params = normalizeParams({
        filters: {
          by_city: "Rome",
        },
        ordering: [{ name: "asc" }, { created_at: "desc" }],
        pagination: {
          page: 2,
          pageSize: 25,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.by_city).toBe("Rome");
      expect(queryParams.ordering).toBe("name,-created_at");
      expect(queryParams.page).toBe(2);
      expect(queryParams.page_size).toBe(25);
    });
  });

  describe("normalizePaginatedListResponse", () => {
    const createMockResponse = <T>(
      data: T | null,
      error: Error | null = null,
    ): UseFzFetchReturn<T> => {
      return {
        data: shallowRef(data),
        error: shallowRef(error),
        statusCode: shallowRef(null),
        response: shallowRef(null),
        isFetching: shallowRef(false),
        execute: async () => {},
      };
    };

    it("should extract data array from paginated response with default dataKey", () => {
      const mockResponse = createMockResponse({
        results: [{ id: 1, name: "User 1" }],
        count: 100,
        pages: 10,
        page: 1,
        next: null,
        previous: null,
      });

      const normalized = normalizePaginatedListResponse(mockResponse);

      expect(normalized.data.value).toEqual([{ id: 1, name: "User 1" }]);
    });

    it("should extract data array from paginated response with custom dataKey", () => {
      const mockResponse = createMockResponse({
        items: [{ id: 1, name: "User 1" }],
        count: 100,
        pages: 10,
        page: 1,
        next: null,
        previous: null,
      }) as any;

      const normalized = normalizePaginatedListResponse(mockResponse, "items");

      expect(normalized.data.value).toEqual([{ id: 1, name: "User 1" }]);
    });

    it("should return null when response data is null", () => {
      const mockResponse = createMockResponse(null) as any;

      const normalized = normalizePaginatedListResponse(mockResponse);

      expect(normalized.data.value).toBeNull();
    });

    it("should throw error when dataKey is missing from response", () => {
      const mockResponse = createMockResponse({
        count: 100,
        pages: 10,
        page: 1,
        next: null,
        previous: null,
        // Missing 'results' key
      }) as any;

      const normalized = normalizePaginatedListResponse(mockResponse, "results");

      expect(() => {
        // Access computed to trigger evaluation
        normalized.data.value;
      }).toThrowError(
        /\[normalizePaginatedListResponse\] Key "results" not found in response/,
      );
    });

    it("should throw error when dataKey exists but is not an array", () => {
      const mockResponse = createMockResponse({
        results: "not an array",
        count: 100,
        pages: 10,
        page: 1,
        next: null,
        previous: null,
      }) as any;

      const normalized = normalizePaginatedListResponse(mockResponse, "results");

      expect(() => {
        normalized.data.value;
      }).toThrowError(
        /\[normalizePaginatedListResponse\] Expected array at key "results"/,
      );
    });

    it("should include available keys in error message when dataKey is missing", () => {
      const mockResponse = createMockResponse({
        items: [],
        count: 100,
        pages: 10,
        page: 1,
        next: null,
        previous: null,
      }) as any;

      const normalized = normalizePaginatedListResponse(mockResponse, "results");

      expect(() => {
        normalized.data.value;
      }).toThrowError(/Available keys: items, count, pages, page, next, previous/);
    });
  });
});
