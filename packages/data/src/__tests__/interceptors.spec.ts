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
  });
});

