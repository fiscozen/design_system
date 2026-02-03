import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, computed } from "vue";
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

  describe("Reactive body and headers", () => {
    it("should use current body on each execute() when body is reactive", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      const bodyRef = ref(JSON.stringify({ value: 1 }));

      const capturedBodies: string[] = [];
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedBodies.push(
          typeof init?.body === "string" ? init.body : String(init?.body ?? ""),
        );
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      await execute();
      expect(capturedBodies).toHaveLength(1);
      expect(capturedBodies[0]).toBe(JSON.stringify({ value: 1 }));

      bodyRef.value = JSON.stringify({ value: 2 });
      await execute();
      expect(capturedBodies).toHaveLength(2);
      expect(capturedBodies[1]).toBe(JSON.stringify({ value: 2 }));
    });

    it("should use current headers on each execute() when headers are reactive", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      const headersRef = ref<Record<string, string>>({
        "Content-Type": "application/json",
        "X-Custom": "first",
      });

      const capturedHeaders: Record<string, string>[] = [];
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        const h = init?.headers;
        capturedHeaders.push(
          h instanceof Headers
            ? Object.fromEntries(h.entries())
            : (h as Record<string, string>) ?? {},
        );
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: null,
        headers: headersRef,
      }, { immediate: false });

      await execute();
      expect(capturedHeaders).toHaveLength(1);
      expect(capturedHeaders[0]["X-Custom"]).toBe("first");

      headersRef.value = {
        "Content-Type": "application/json",
        "X-Custom": "second",
      };
      await execute();
      expect(capturedHeaders).toHaveLength(2);
      expect(capturedHeaders[1]["X-Custom"]).toBe("second");
    });

    it("should work with computed body and static headers", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      const count = ref(0);
      const bodyComputed = computed(() =>
        JSON.stringify({ count: count.value }),
      );

      let lastBody: string | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        lastBody =
          typeof init?.body === "string" ? init.body : undefined;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: bodyComputed,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      await execute();
      expect(lastBody).toBe(JSON.stringify({ count: 0 }));

      count.value = 5;
      await execute();
      expect(lastBody).toBe(JSON.stringify({ count: 5 }));
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
