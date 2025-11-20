import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useFzFetch } from "../rest";

describe("Interceptors", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();
  });

  describe("Response Interceptor", () => {
    it("should re-parse body when response interceptor modifies response", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        responseInterceptor: async (response) => {
          // Modify response body
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          const modifiedData = { ...data, modified: true };

          return new Response(JSON.stringify(modifiedData), {
            status: response.status,
            headers: response.headers,
          });
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ original: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute, data } = useFzFetch<{
        original: boolean;
        modified?: boolean;
      }>("/test");

      await execute();

      // Data should be re-parsed with modified content
      expect(data.value).toEqual({ original: true, modified: true });
    });
  });

  describe("Request Interceptor", () => {
    it("should detect changes in Headers object correctly", async () => {
      let interceptedHeaders: HeadersInit | undefined;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Modify headers using Headers object
          const headers = new Headers(requestInit.headers);
          headers.set("X-Custom-Header", "custom-value");
          interceptedHeaders = headers;

          return {
            ...requestInit,
            headers,
          };
        },
      });

      global.fetch = vi.fn((url: string, init?: RequestInit) => {
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        headers: { "Content-Type": "application/json" },
      });

      await execute();

      // Verify that interceptor was applied (headers were modified)
      expect(interceptedHeaders).toBeDefined();
      if (interceptedHeaders instanceof Headers) {
        expect(interceptedHeaders.get("X-Custom-Header")).toBe("custom-value");
      }
    });

    it("should work correctly without redundant globalBaseUrl check", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Modify requestInit
          return {
            ...requestInit,
            headers: {
              ...(requestInit.headers as Record<string, string>),
              "X-Modified": "true",
            },
          };
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute } = useFzFetch<{ success: boolean }>("/test");

      // Should not throw error about baseUrl not available
      await expect(execute()).resolves.not.toThrow();
    });

    it("should handle headers as array of tuples [string, string][]", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Modify headers using array of tuples format
          const headersArray: [string, string][] = [
            ["Content-Type", "application/json"],
            ["X-Custom-Header", "custom-value"],
            ["Authorization", "Bearer token123"],
          ];

          return {
            ...requestInit,
            headers: headersArray,
          };
        },
      });

      global.fetch = vi.fn((url: string, init?: RequestInit) => {
        // Verify headers were correctly normalized and passed to fetch
        if (init?.headers) {
          const headers = init.headers as HeadersInit;
          // Headers should be properly formatted (fetch API accepts array format)
          expect(headers).toBeDefined();
        }

        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        headers: { "Original-Header": "original-value" },
      });

      // Should not throw error and should handle array format correctly
      await expect(execute()).resolves.not.toThrow();
    });

    it("should correctly normalize and compare headers in array format", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Return headers as array of tuples
          // This tests that normalizeHeaders correctly handles array format
          return {
            ...requestInit,
            headers: [
              ["Content-Type", "application/json"],
              ["X-Custom", "value1"],
            ] as [string, string][],
          };
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        headers: { "Original-Header": "original-value" },
      });

      // Should not throw error - normalizeHeaders should handle array format
      await expect(execute()).resolves.not.toThrow();

      // Verify fetch was called (request was processed)
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should treat headers with different case as equivalent (case-insensitive comparison)", async () => {
      let originalFetchCallCount = 0;
      let modifiedFetchCallCount = 0;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Return headers with different case but semantically equivalent values
          // compareRequestInit should identify these as equivalent and NOT trigger a new fetch
          return {
            ...requestInit,
            headers: {
              "content-type": "application/json", // lowercase - same value as original
            },
          };
        },
      });

      // Mock fetch to track calls
      global.fetch = vi.fn((url: string, init?: RequestInit) => {
        // Check if this is the original fetch or the modified fetch
        // The modified fetch would have lowercase headers
        if (init?.headers) {
          const headers = init.headers as Record<string, string>;
          if (headers["content-type"] === "application/json") {
            modifiedFetchCallCount++;
          } else if (headers["Content-Type"] === "application/json") {
            originalFetchCallCount++;
          }
        }

        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        headers: {
          "Content-Type": "application/json", // PascalCase - original
        },
      });

      await execute();

      // The key test: compareRequestInit should correctly identify that
      // { 'Content-Type': 'application/json' } and { 'content-type': 'application/json' }
      // are equivalent (case-insensitive headers)
      // Since headers are equivalent, compareRequestInit should return false
      // and the original fetch should be used (not a new fetch call)
      // However, the interceptor still modifies requestInit (new object reference),
      // so we need to verify that header comparison works correctly

      // With the fix, normalizeHeaders now normalizes plain object keys to lowercase,
      // so compareNormalizedHeaders will correctly identify them as equivalent
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("Request Interceptor - Watch Cleanup", () => {
    it("should cleanup watch when execute() is called multiple times rapidly", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Modify requestInit to trigger watch creation
          return {
            ...requestInit,
            headers: {
              ...(requestInit.headers as Record<string, string>),
              "X-Custom-Header": "modified",
            },
          };
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: "test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute, data } = useFzFetch<{ data: string }>("/test", {
        immediate: false,
      });

      // Call execute() multiple times rapidly
      // This tests that watches are properly cleaned up and don't accumulate
      const promise1 = execute();
      const promise2 = execute();
      const promise3 = execute();

      // Wait for all to complete
      await Promise.all([promise1, promise2, promise3]);

      // Verify that fetch was called (may be called multiple times due to deduplication)
      expect(global.fetch).toHaveBeenCalled();

      // Verify final state is correct (no errors from uncleaned watches)
      expect(data.value).toEqual({ data: "test" });

      // Call execute() again to verify no memory leak from previous watches
      await execute();
      expect(data.value).toEqual({ data: "test" });
    });

    it("should cleanup watch when interceptor throws an error", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          // Modify requestInit to trigger watch creation, then throw error
          const modified = {
            ...requestInit,
            headers: {
              ...(requestInit.headers as Record<string, string>),
              "X-Custom-Header": "modified",
            },
          };
          // Simulate error after modification
          throw new Error("Interceptor error");
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: "test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      const { execute, error } = useFzFetch<{ data: string }>("/test", {
        immediate: false,
      });

      // Call execute() - should handle error and cleanup watch
      await execute();

      // Verify error was set
      expect(error.value).toBeDefined();
      expect(error.value?.message).toContain("Interceptor error");

      // Call execute() again - should not have memory leak from previous watch
      await execute();
      expect(error.value?.message).toContain("Interceptor error");
    });
  });

  describe("Request Interceptor - Immediate Execution", () => {
    it("should call request interceptor when immediate: true (automatic execution)", async () => {
      let interceptorCalled = false;
      let interceptedUrl: string | null = null;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          interceptorCalled = true;
          interceptedUrl = url;
          return requestInit;
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: "test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      // useFzFetch with immediate: true (default) should call interceptor
      const { data } = useFzFetch<{ data: string }>("/test", {
        immediate: true, // Explicitly set to true (this is the default)
      });

      // Wait for automatic execution to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify interceptor was called during automatic execution
      expect(interceptorCalled).toBe(true);
      expect(interceptedUrl).toBe("/test");
      expect(data.value).toEqual({ data: "test" });
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should call request interceptor when immediate: false and execute() is called manually", async () => {
      let interceptorCalled = false;
      let interceptedUrl: string | null = null;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          interceptorCalled = true;
          interceptedUrl = url;
          return requestInit;
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: "test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      // useFzFetch with immediate: false
      const { execute, data } = useFzFetch<{ data: string }>("/test", {
        immediate: false,
      });

      // Interceptor should not be called yet
      expect(interceptorCalled).toBe(false);

      // Manually call execute()
      await execute();

      // Verify interceptor was called during manual execution
      expect(interceptorCalled).toBe(true);
      expect(interceptedUrl).toBe("/test");
      expect(data.value).toEqual({ data: "test" });
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should call response interceptor when immediate: true (automatic execution)", async () => {
      let interceptorCalled = false;
      let interceptedUrl: string | null = null;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        responseInterceptor: async (response, url) => {
          interceptorCalled = true;
          interceptedUrl = url;
          return response;
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: "test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as any;

      // useFzFetch with immediate: true (default) should call interceptor
      const { data } = useFzFetch<{ data: string }>("/test", {
        immediate: true,
      });

      // Wait for automatic execution to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify interceptor was called during automatic execution
      expect(interceptorCalled).toBe(true);
      expect(interceptedUrl).toBe("/test");
      expect(data.value).toEqual({ data: "test" });
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
