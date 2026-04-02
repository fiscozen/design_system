import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";

import { setupFzFetcher, resetFzFetcher } from "../rest";
import { state } from "../rest/http/setup/state";
import { CsrfManager } from "../rest/http/managers/csrf";
import { DeduplicationManager } from "../rest/http/managers/deduplication";

describe("setupFzFetcher", () => {
  beforeEach(() => {
    resetFzFetcher();
  });

  it("is a function", () => {
    expect(typeof setupFzFetcher).toBe("function");
  });

  it("throws if baseUrl is missing", () => {
    expect(() => setupFzFetcher({} as Parameters<typeof setupFzFetcher>[0])).toThrow(
      "baseUrl is required",
    );
  });

  it("throws if baseUrl is an empty string", () => {
    expect(() => setupFzFetcher({ baseUrl: "" })).toThrow(
      "baseUrl is required",
    );
  });

  it("resolves a ref baseUrl at setup time", () => {
    const baseUrl = ref("https://api.example.com");
    setupFzFetcher({ baseUrl });
    expect(state.globalBaseUrl).toBe("https://api.example.com");
  });

  it("resolves a getter baseUrl at setup time", () => {
    setupFzFetcher({ baseUrl: () => "https://getter.example.com" });
    expect(state.globalBaseUrl).toBe("https://getter.example.com");
  });

  describe("CSRF", () => {
    it("initializes csrfManager when csrf.enabled is true", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        csrf: { enabled: true, cookieName: "csrf", headerName: "X-CSRF" },
      });
      expect(state.csrfManager).toBeInstanceOf(CsrfManager);
    });

    it("does not initialize csrfManager when csrf.enabled is false", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        csrf: { enabled: false, cookieName: "csrf", headerName: "X-CSRF" },
      });
      expect(state.csrfManager).toBeNull();
    });

    it("does not initialize csrfManager when csrf is omitted", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.csrfManager).toBeNull();
    });
  });

  describe("deduplication", () => {
    it("initializes deduplicationManager when deduplication is true", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });
      expect(state.deduplicationManager).toBeInstanceOf(DeduplicationManager);
    });

    it("does not initialize deduplicationManager when deduplication is false", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: false,
      });
      expect(state.deduplicationManager).toBeNull();
    });

    it("does not initialize deduplicationManager when deduplication is omitted", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.deduplicationManager).toBeNull();
    });
  });

  describe("autoUpdateDebounceDelay", () => {
    it("applies custom autoUpdateDebounceDelay", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        autoUpdateDebounceDelay: 500,
      });
      expect(state.globalAutoUpdateDebounceDelay).toBe(500);
    });

    it("defaults autoUpdateDebounceDelay to 100 when omitted", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.globalAutoUpdateDebounceDelay).toBe(100);
    });
  });

  describe("trailingSlash", () => {
    it("applies trailingSlash true", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        trailingSlash: true,
      });
      expect(state.globalTrailingSlash).toBe(true);
    });

    it("applies trailingSlash false", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        trailingSlash: false,
      });
      expect(state.globalTrailingSlash).toBe(false);
    });

    it("applies trailingSlash null (no normalization)", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        trailingSlash: null,
      });
      expect(state.globalTrailingSlash).toBeNull();
    });

    it("defaults trailingSlash to null when omitted", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.globalTrailingSlash).toBeNull();
    });
  });

  describe("interceptors", () => {
    it("registers requestInterceptor", () => {
      const interceptor = async () => ({});
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: interceptor,
      });
      expect(state.globalRequestInterceptor).toBe(interceptor);
    });

    it("registers responseInterceptor", () => {
      const interceptor = async (r: Response) => r;
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        responseInterceptor: interceptor,
      });
      expect(state.globalResponseInterceptor).toBe(interceptor);
    });

    it("defaults interceptors to null when omitted", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.globalRequestInterceptor).toBeNull();
      expect(state.globalResponseInterceptor).toBeNull();
    });
  });

  describe("fetchOptions headers normalization", () => {
    it("normalizes headers from plain object", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: { "X-Custom": "value", "Accept": "application/json" },
        },
      });
      expect(state.globalDefaultHeaders).toEqual({
        "X-Custom": "value",
        "Accept": "application/json",
      });
    });

    it("normalizes headers from Headers instance", () => {
      const headers = new Headers();
      headers.set("X-Custom", "value");
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: { headers },
      });
      expect(state.globalDefaultHeaders).toEqual({ "x-custom": "value" });
    });

    it("normalizes headers from string[][] tuples", () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: [["X-Custom", "value"], ["Accept", "text/html"]],
        },
      });
      expect(state.globalDefaultHeaders).toEqual({
        "X-Custom": "value",
        "Accept": "text/html",
      });
    });

    it("sets globalDefaultHeaders to null when no headers provided", () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });
      expect(state.globalDefaultHeaders).toBeNull();
    });
  });

  it("called twice overwrites previous configuration", () => {
    const interceptor1 = async () => ({});
    setupFzFetcher({
      baseUrl: "https://first.example.com",
      deduplication: true,
      autoUpdateDebounceDelay: 200,
      requestInterceptor: interceptor1,
    });
    expect(state.globalBaseUrl).toBe("https://first.example.com");
    expect(state.globalAutoUpdateDebounceDelay).toBe(200);
    expect(state.deduplicationManager).toBeInstanceOf(DeduplicationManager);
    expect(state.globalRequestInterceptor).toBe(interceptor1);

    const interceptor2 = async () => ({});
    setupFzFetcher({
      baseUrl: "https://second.example.com",
      deduplication: false,
      autoUpdateDebounceDelay: 50,
      requestInterceptor: interceptor2,
    });
    expect(state.globalBaseUrl).toBe("https://second.example.com");
    expect(state.globalAutoUpdateDebounceDelay).toBe(50);
    expect(state.deduplicationManager).toBeNull();
    expect(state.globalRequestInterceptor).toBe(interceptor2);
  });
});

describe("resetFzFetcher", () => {
  it("restores all state to defaults", () => {
    setupFzFetcher({
      baseUrl: "https://api.example.com",
      csrf: { enabled: true, cookieName: "csrf", headerName: "X-CSRF" },
      deduplication: true,
      debug: true,
      autoUpdateDebounceDelay: 500,
      trailingSlash: true,
      requestInterceptor: async () => ({}),
      responseInterceptor: async (r: Response) => r,
      fetchOptions: { headers: { "X-Custom": "value" } },
    });

    resetFzFetcher();

    expect(state.fzFetcher).toBeNull();
    expect(state.globalDefaultHeaders).toBeNull();
    expect(state.globalBaseUrl).toBeNull();
    expect(state.globalCsrfOptions).toBeNull();
    expect(state.globalDebug).toBe(false);
    expect(state.globalDeduplication).toBe(false);
    expect(state.globalAutoUpdateDebounceDelay).toBe(100);
    expect(state.globalTrailingSlash).toBeNull();
    expect(state.globalRequestInterceptor).toBeNull();
    expect(state.globalResponseInterceptor).toBeNull();
    expect(state.csrfManager).toBeNull();
    expect(state.deduplicationManager).toBeNull();
  });
});
