import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupFzFetcher, resetFzFetcher, useFzFetch } from "../rest";

/**
 * Integration tests for the complete request flow
 *
 * These tests verify that multiple components work together correctly:
 * - Setup → Request → Interceptor → Response → Deduplication
 */
describe("Integration Tests", () => {
  beforeEach(() => {
    resetFzFetcher();
    vi.clearAllMocks();
  });

  describe("Complete Request Flow", () => {
    it("should handle complete flow: setup → request → interceptor → response → deduplication", async () => {
      const requestInterceptorCalls: string[] = [];
      const responseInterceptorCalls: string[] = [];

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
        requestInterceptor: async (url, requestInit) => {
          requestInterceptorCalls.push(url);
          return requestInit;
        },
        responseInterceptor: async (response) => {
          responseInterceptorCalls.push(response.url);
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
      }) as typeof fetch;

      const { execute, data, statusCode } = useFzFetch<{ data: string }>(
        "/test",
      );

      await execute();

      // Verify request interceptor was called (receives relative URL)
      expect(requestInterceptorCalls).toContain("/test");

      // Verify response interceptor was called
      expect(responseInterceptorCalls.length).toBeGreaterThan(0);

      // Verify response data
      expect(data.value).toEqual({ data: "test" });
      expect(statusCode.value).toBe(200);
    });

    it("should handle request interceptor modifying requestInit", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          return {
            ...requestInit,
            headers: {
              ...(requestInit.headers as Record<string, string>),
              "X-Modified": "true",
            },
          };
        },
      });

      let interceptedHeaders: HeadersInit | undefined;

      global.fetch = vi.fn((url: string, init?: RequestInit) => {
        interceptedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        headers: { "Content-Type": "application/json" },
      });

      await execute();

      // Verify headers were modified by interceptor
      expect(interceptedHeaders).toBeDefined();
      if (interceptedHeaders instanceof Headers) {
        expect(interceptedHeaders.get("X-Modified")).toBe("true");
      } else if (interceptedHeaders && typeof interceptedHeaders === "object") {
        const headersObj = interceptedHeaders as Record<string, string>;
        expect(headersObj["X-Modified"]).toBe("true");
      }
    });

    it("should handle response interceptor modifying response", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        responseInterceptor: async (response) => {
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
      }) as typeof fetch;

      const { execute, data } = useFzFetch<{
        original: boolean;
        modified?: boolean;
      }>("/test");

      await execute();

      // Verify response was modified by interceptor
      expect(data.value).toEqual({ original: true, modified: true });
    });
  });

  describe("Deduplication Integration", () => {
    it("should deduplicate identical simultaneous requests", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });

      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ data: `response-${fetchCallCount}` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Make two identical requests simultaneously with immediate: false
      const { execute: execute1, data: data1 } = useFzFetch<{
        data: string;
      }>("/test", { immediate: false });

      const { execute: execute2, data: data2 } = useFzFetch<{
        data: string;
      }>("/test", { immediate: false });

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Verify only one fetch call was made (deduplication working)
      expect(fetchCallCount).toBe(1);

      // Verify both requests received the same data
      expect(data1.value).toEqual(data2.value);
    });

    it("should not deduplicate requests with different URLs", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });

      let fetchCallCount = 0;

      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ data: `response-${fetchCallCount}` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      // Make two different requests with immediate: false
      const { execute: execute1 } = useFzFetch<{ data: string }>("/test1", {
        immediate: false,
      });
      const { execute: execute2 } = useFzFetch<{ data: string }>("/test2", {
        immediate: false,
      });

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Verify two fetch calls were made (no deduplication for different URLs)
      expect(fetchCallCount).toBe(2);
    });

    it("should not deduplicate requests with different methods", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });

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

      // Make GET and POST requests to same URL with immediate: false
      const { execute: execute1 } = useFzFetch<{ success: boolean }>("/test", {
        immediate: false,
      });
      const { execute: execute2 } = useFzFetch<{ success: boolean }>(
        "/test",
        { method: "POST", body: JSON.stringify({}) },
        { immediate: false },
      );

      // Execute both simultaneously
      await Promise.all([execute1(), execute2()]);

      // Verify two fetch calls were made (no deduplication for different methods)
      expect(fetchCallCount).toBe(2);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle errors through complete flow", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, requestInit) => {
          return requestInit;
        },
        responseInterceptor: async (response) => {
          return response;
        },
      });

      global.fetch = vi.fn(() => {
        return Promise.reject(new Error("Network error"));
      }) as typeof fetch;

      const { execute, error } = useFzFetch("/test", { immediate: false });

      await execute();

      // Verify error was set and normalized
      expect(error.value).toBeTruthy();
      expect(error.value).toBeInstanceOf(Error);
      if (error.value) {
        expect(error.value.message).toBe("Network error");
      }
    });

    it("should handle interceptor errors correctly", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async () => {
          throw new Error("Interceptor error");
        },
      });

      const { execute, error } = useFzFetch("/test");

      await execute();

      // Verify error was set
      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe("Interceptor error");
    });
  });

  describe("CSRF Integration", () => {
    it("should inject CSRF token for mutation methods", async () => {
      // Set CSRF cookie
      document.cookie = "csrf_token=test-csrf-token";

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        csrf: {
          enabled: true,
          cookieName: "csrf_token",
          headerName: "X-CSRF-Token",
        },
      });

      let interceptedHeaders: HeadersInit | undefined;

      global.fetch = vi.fn((url: string, init?: RequestInit) => {
        interceptedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ success: boolean }>("/test", {
        method: "POST",
        body: JSON.stringify({}),
      });

      await execute();

      // Verify CSRF token was injected
      expect(interceptedHeaders).toBeDefined();
      if (interceptedHeaders instanceof Headers) {
        expect(interceptedHeaders.get("X-CSRF-Token")).toBe("test-csrf-token");
      } else if (interceptedHeaders && typeof interceptedHeaders === "object") {
        const headersObj = interceptedHeaders as Record<string, string>;
        expect(headersObj["X-CSRF-Token"]).toBe("test-csrf-token");
      }
    });
  });
});
