import { describe, it, expect } from "vitest";
import { normalizeParams } from "../rest/actions/shared/normalize";
import { computed } from "vue";

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

    it("should exclude null and undefined filter values", () => {
      const params = normalizeParams({
        filters: {
          by_city: "Rome",
          by_type: null,
          by_status: undefined,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.by_city).toBe("Rome");
      expect(queryParams.by_type).toBeUndefined();
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
      expect(queryParams.per_page).toBe(25);
    });

    it("should handle pagination with only page", () => {
      const params = normalizeParams({
        pagination: {
          page: 3,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.page).toBe(3);
      expect(queryParams.per_page).toBeUndefined();
    });

    it("should handle pagination with only pageSize", () => {
      const params = normalizeParams({
        pagination: {
          pageSize: 100,
        },
      });

      const queryParams = params.queryParams.value;

      expect(queryParams.page).toBeUndefined();
      expect(queryParams.per_page).toBe(100);
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
      expect(queryParams.per_page).toBe(25);
    });
  });
});
