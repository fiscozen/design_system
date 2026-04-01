import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, computed } from "vue";
import {
  setupFzFetcher,
  resetFzFetcher,
  useFzFetch,
  useActions,
} from "../rest";
import {
  joinPathSegments,
  applyTrailingSlash,
} from "../rest/http/utils/url";

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

  describe("Trailing slash", () => {
    // We test both: (1) paths that occur with correct usage; (2) paths that should NOT occur
    // (wrong usage) but we verify the normalizer still behaves safely (e.g. no // at end).
    const mockFetch = () =>
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

    async function expectUrlForPath(
      path: string,
      setupTrailingSlash: true | false | null | undefined,
      expectedUrl: string,
      perRequestTrailingSlash?: true | false | null,
    ): Promise<void> {
      let interceptedUrl = "";
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        ...(setupTrailingSlash !== undefined && setupTrailingSlash !== null
          ? { trailingSlash: setupTrailingSlash }
          : {}),
        requestInterceptor: async (url) => {
          interceptedUrl = url;
          return {};
        },
      });
      global.fetch = mockFetch();
      const options =
        perRequestTrailingSlash !== undefined
          ? { trailingSlash: perRequestTrailingSlash, immediate: false }
          : undefined;
      const { execute } = useFzFetch<unknown>(path, options ?? {});
      await execute();
      expect(interceptedUrl).toBe(expectedUrl);
    }

    const pathPermutationsCorrectUsage: string[] = [
      "users",
      "users/",
      "/users",
      "/users/",
      "users/1",
      "/users/1",
    ];

    /** Paths that should NOT occur with correct usage; we still verify normalizer output. */
    const pathPermutationsWrongUsage: string[] = [
      "users/1/",   // WRONG: pk with trailing
      "users//1",   // WRONG: basePath with trailing → // in middle
      "users//1/",
      "/users/1/",  // WRONG: pk with trailing
      "/users//1",  // WRONG: basePath with trailing → // in middle
      "/users//1/",
    ];

    const expectedWhenSetupTrue: Record<string, string> = {
      users: "users/",
      "users/": "users/",
      "/users": "/users/",
      "/users/": "/users/",
      "users/1": "users/1/",
      "/users/1": "/users/1/",
      "users/1/": "users/1/",
      "users//1": "users//1/",
      "users//1/": "users//1/",
      "/users/1/": "/users/1/",
      "/users//1": "/users//1/",
      "/users//1/": "/users//1/",
    };

    const expectedWhenSetupFalse: Record<string, string> = {
      users: "users",
      "users/": "users",
      "/users": "/users",
      "/users/": "/users",
      "users/1": "users/1",
      "/users/1": "/users/1",
      "users/1/": "users/1",
      "users//1": "users//1",
      "users//1/": "users//1",
      "/users/1/": "/users/1",
      "/users//1": "/users//1",
      "/users//1/": "/users//1",
    };

    describe("correct usage paths (list = basePath; retrieve = basePath + '/' + pk, no trailing on basePath, pk without slash)", () => {
      it.each(pathPermutationsCorrectUsage)(
        "setup trailingSlash true: path %s → expected",
        async (path) => {
          await expectUrlForPath(path, true, expectedWhenSetupTrue[path]);
        },
      );

      it.each(pathPermutationsCorrectUsage)(
        "setup trailingSlash false: path %s → expected",
        async (path) => {
          await expectUrlForPath(path, false, expectedWhenSetupFalse[path]);
        },
      );

      it.each(pathPermutationsCorrectUsage)(
        "setup without trailingSlash: path %s left unchanged",
        async (path) => {
          await expectUrlForPath(path, undefined, path);
        },
      );
    });

    describe("wrong usage paths (should not occur; we verify normalizer still safe)", () => {
      it.each(pathPermutationsWrongUsage)(
        "setup trailingSlash true: path %s → expected (no double slash at end)",
        async (path) => {
          await expectUrlForPath(path, true, expectedWhenSetupTrue[path]);
        },
      );

      it.each(pathPermutationsWrongUsage)(
        "setup trailingSlash false: path %s → expected",
        async (path) => {
          await expectUrlForPath(path, false, expectedWhenSetupFalse[path]);
        },
      );

      it.each(pathPermutationsWrongUsage)(
        "setup without trailingSlash: path %s left unchanged",
        async (path) => {
          await expectUrlForPath(path, undefined, path);
        },
      );
    });

    it("per-request trailingSlash false overrides setup true", async () => {
      await expectUrlForPath("users/1", true, "users/1", false);
    });

    it("per-request trailingSlash true overrides setup false", async () => {
      await expectUrlForPath("users/1", false, "users/1/", true);
    });

    it("per-request trailingSlash null disables normalization (overrides setup true)", async () => {
      await expectUrlForPath("users/1", true, "users/1", null);
    });

    describe("trailingSlash via action options (useActions)", () => {
      it("useRetrieve with trailingSlash option overrides setup", async () => {
        let interceptedUrl = "";
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: true,
          requestInterceptor: async (url) => {
            interceptedUrl = url;
            return {};
          },
        });
        global.fetch = mockFetch();
        const { useRetrieve } = useActions<{ id: number }>("users");
        const { execute } = useRetrieve(1, {
          trailingSlash: false,
          onMount: false,
        });
        await execute();
        expect(interceptedUrl).toBe("users/1");
      });

      it("useList with trailingSlash option overrides setup", async () => {
        let interceptedUrl = "";
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: false,
          requestInterceptor: async (url) => {
            interceptedUrl = url;
            return {};
          },
        });
        global.fetch = mockFetch();
        const { useList } = useActions<{ id: number }>("users");
        const { execute } = useList({ trailingSlash: true, onMount: false });
        await execute();
        expect(interceptedUrl).toBe("users/");
      });

      it("useCreate with trailingSlash option overrides setup", async () => {
        let capturedUrl = "";
        const captureFetch = vi.fn((url: string | URL) => {
          capturedUrl = typeof url === "string" ? url : url.toString();
          return Promise.resolve(
            new Response(JSON.stringify({ id: 1, name: "Test" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }) as typeof fetch;
        global.fetch = captureFetch;
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: true,
        });
        const { useCreate } = useActions<{ id: number; name: string }>(
          "users",
        );
        const { execute } = useCreate({ trailingSlash: false });
        await execute({ name: "Test" });
        expect(capturedUrl).toBe("https://api.example.com/users");
      });

      it("useUpdate with trailingSlash option overrides setup", async () => {
        let capturedUrl = "";
        const captureFetch = vi.fn((url: string | URL) => {
          capturedUrl = typeof url === "string" ? url : url.toString();
          return Promise.resolve(
            new Response(JSON.stringify({ id: 1, name: "Updated" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }) as typeof fetch;
        global.fetch = captureFetch;
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: false,
        });
        const { useUpdate } = useActions<{ id: number; name: string }>(
          "users",
        );
        const { execute } = useUpdate({ trailingSlash: true });
        await execute(1, { name: "Updated" });
        expect(capturedUrl).toBe("https://api.example.com/users/1/");
      });

      it("useRetrieve: all permutations basePath × pk × trailingSlash never produce double slash", async () => {
        const basePaths = ["users", "/users", "/users/", "users/"] as const;
        const pks = ["self", "/self", "self/", "/self/"] as const;
        const trailingSlashOptions = [true, false] as const;

        for (const trailingSlash of trailingSlashOptions) {
          for (const basePath of basePaths) {
            for (const pk of pks) {
              resetFzFetcher();
              let capturedUrl = "";
              const captureFetch = vi.fn((url: string | URL) => {
                capturedUrl = typeof url === "string" ? url : url.toString();
                return Promise.resolve(
                  new Response(JSON.stringify({ id: 1 }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  }),
                );
              }) as typeof fetch;
              global.fetch = captureFetch;
              setupFzFetcher({
                baseUrl: "https://api.example.com",
                trailingSlash,
              });
              const { useRetrieve } = useActions<{ id: number }>(basePath);
              const { execute } = useRetrieve(pk, { onMount: false });
              await execute();

              const pathname = new URL(capturedUrl).pathname;
              expect(
                pathname.includes("//"),
                `basePath=${JSON.stringify(basePath)} pk=${JSON.stringify(pk)} trailingSlash=${trailingSlash} → ${pathname} must not contain //`,
              ).toBe(false);

              const expectedPath = applyTrailingSlash(
                joinPathSegments(basePath, pk),
                trailingSlash,
              );
              const expectedPathname = expectedPath.startsWith("/")
                ? expectedPath
                : `/${expectedPath}`;
              expect(
                pathname,
                `basePath=${JSON.stringify(basePath)} pk=${JSON.stringify(pk)} trailingSlash=${trailingSlash}`,
              ).toBe(expectedPathname);
            }
          }
        }
      });

      it("useDelete with trailingSlash option overrides setup", async () => {
        let capturedUrl = "";
        const captureFetch = vi.fn((url: string | URL) => {
          capturedUrl = typeof url === "string" ? url : url.toString();
          return Promise.resolve(
            new Response(JSON.stringify({}), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }) as typeof fetch;
        global.fetch = captureFetch;
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: true,
        });
        const { useDelete } = useActions<{ id: number }>("users");
        const { execute } = useDelete({ trailingSlash: false });
        await execute(1);
        expect(capturedUrl).toBe("https://api.example.com/users/1");
      });
    });

    it("DELETE with 204 No Content (empty body) does not throw and sets data to null", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 204 })),
      ) as typeof fetch;
      const { useDelete } = useActions<{ id: number }>("users");
      const { data, error, execute } = useDelete();
      await execute(1);
      expect(error.value).toBeNull();
      expect(data.value).toBeNull();
    });

    it("DELETE with 204 No Content and throwOnError: true does not throw", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 204 })),
      ) as typeof fetch;
      const { useDelete } = useActions<{ id: number }>("users");
      const { data, error, execute } = useDelete({ throwOnError: true });
      await expect(execute(1)).resolves.not.toThrow();
      expect(error.value).toBeNull();
      expect(data.value).toBeNull();
    });

    it("CREATE with 204 No Content and throwOnError: true does not throw", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 204 })),
      ) as typeof fetch;
      const { useCreate } = useActions<{ id: number; name: string }>("users");
      const { data, error, execute } = useCreate({ throwOnError: true });
      await expect(execute({ name: "John" })).resolves.not.toThrow();
      expect(error.value).toBeNull();
      expect(data.value).toBeNull();
    });

    it("UPDATE with 204 No Content and throwOnError: true does not throw", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 204 })),
      ) as typeof fetch;
      const { useUpdate } = useActions<{ id: number; name: string }>("users");
      const { data, error, execute } = useUpdate({ throwOnError: true });
      await expect(execute(1, { name: "Jane" })).resolves.not.toThrow();
      expect(error.value).toBeNull();
      expect(data.value).toBeNull();
    });

    it("DELETE with 205 Reset Content and throwOnError: true does not throw", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(null, { status: 205 })),
      ) as typeof fetch;
      const { useDelete } = useActions<{ id: number }>("users");
      const { data, error, execute } = useDelete({ throwOnError: true });
      await expect(execute(1)).resolves.not.toThrow();
      expect(error.value).toBeNull();
      expect(data.value).toBeNull();
    });

    it("DELETE with 500 and throwOnError: true still throws", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response("Internal Server Error", { status: 500 })),
      ) as typeof fetch;
      const { useDelete } = useActions<{ id: number }>("users");
      const { execute } = useDelete({ throwOnError: true });
      await expect(execute(1)).rejects.toThrow();
    });

    it("on non-204 error (e.g. 500) data retains previous value and is not cleared", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
      });
      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ id: 1, name: "Alice" }), {
            status: 200,
          }),
        ),
      ) as typeof fetch;
      const { data, error, execute } = useFzFetch<{ id: number; name: string }>(
        "users/1",
        { method: "GET" },
      );
      await execute();
      expect(error.value).toBeNull();
      expect(data.value).toEqual({ id: 1, name: "Alice" });
      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
          }),
        ),
      ) as typeof fetch;
      await execute();
      expect(data.value).toEqual({ id: 1, name: "Alice" });
    });

    it("correct usage: intercepted URL never has double slash at end when setup trailingSlash true", async () => {
      const pathWithScenario: Array<{ path: string; scenario: string }> = [
        { path: "users", scenario: "useActions('users') → useList()" },
        { path: "users/", scenario: "useActions('users/') → useList()" },
        { path: "/users", scenario: "useActions('/users') → useList()" },
        { path: "/users/", scenario: "useActions('/users/') → useList()" },
        { path: "users/1", scenario: "useActions('users') + useRetrieve('1')" },
        { path: "/users/1", scenario: "useActions('/users') + useRetrieve('1')" },
      ];
      for (const { path, scenario } of pathWithScenario) {
        let url = "";
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: true,
          requestInterceptor: async (u) => {
            url = u;
            return {};
          },
        });
        global.fetch = mockFetch();
        const { execute } = useFzFetch<unknown>(path);
        await execute();
        expect(url.endsWith("//"), `[${scenario}] path ${path} → ${url} must not end with //`).toBe(false);
      }
    });

    it("wrong usage: intercepted URL never has double slash at end when setup trailingSlash true", async () => {
      const pathWithScenario: Array<{ path: string; scenario: string }> = [
        { path: "users/1/", scenario: "WRONG: useRetrieve('1/') — pk with trailing" },
        { path: "users//1", scenario: "WRONG: useActions('users/') + useRetrieve('1')" },
        { path: "users//1/", scenario: "WRONG: useActions('users/') + useRetrieve('1/')" },
        { path: "/users/1/", scenario: "WRONG: useRetrieve('1/') — pk with trailing" },
        { path: "/users//1", scenario: "WRONG: useActions('/users/') + useRetrieve('1')" },
        { path: "/users//1/", scenario: "WRONG: useActions('/users/') + useRetrieve('1/')" },
      ];
      for (const { path, scenario } of pathWithScenario) {
        let url = "";
        setupFzFetcher({
          baseUrl: "https://api.example.com",
          trailingSlash: true,
          requestInterceptor: async (u) => {
            url = u;
            return {};
          },
        });
        global.fetch = mockFetch();
        const { execute } = useFzFetch<unknown>(path);
        await execute();
        expect(url.endsWith("//"), `[${scenario}] path ${path} → ${url} must not end with //`).toBe(false);
      }
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

    it("should run first request through params resolver when reactive body without useFetchOptions", async () => {
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

      // No third argument (useFetchOptions): default immediate would be true.
      // We disable immediate when reactive body/headers are present and run execute() after wrapping,
      // so the first request goes through params resolver and uses current body.
      useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(capturedBodies).toHaveLength(1);
      expect(capturedBodies[0]).toBe(JSON.stringify({ value: 1 }));
    });

    it("should run first request through params resolver when reactive headers without useFetchOptions", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      const headersRef = ref<Record<string, string>>({
        "Content-Type": "application/json",
        "X-Custom": "initial",
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

      useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: null,
        headers: headersRef,
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(capturedHeaders).toHaveLength(1);
      expect(capturedHeaders[0]["X-Custom"]).toBe("initial");
    });

    it("should treat second param as UseFzFetchParams when only headers is provided", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        headers: { "X-Custom": "value" },
      });
      await execute();

      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Custom"]).toBe("value");
    });

    it("should not run any request when reactive body and explicit immediate: false", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      const bodyRef = ref(JSON.stringify({ value: 1 }));
      let fetchCallCount = 0;
      global.fetch = vi.fn(() => {
        fetchCallCount++;
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

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fetchCallCount).toBe(0);

      await execute();
      expect(fetchCallCount).toBe(1);
    });

    it("should clean up previous watcher when execute() is called rapidly so only latest request syncs to fetchResult", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      let callIndex = 0;
      global.fetch = vi.fn((_url: string, _init?: RequestInit) => {
        const seq = ++callIndex;
        return Promise.resolve(
          new Response(JSON.stringify({ seq }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const bodyRef = ref(JSON.stringify({ value: 1 }));
      const { execute, data } = useFzFetch<{ seq: number }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      // Fire two execute() calls without awaiting the first (rapid double call)
      const promise1 = execute();
      const promise2 = execute();
      await Promise.all([promise1, promise2]);

      // Only one watcher should be active at a time; the second execute() cleans up the first watcher.
      // Final data must be from the second request (seq: 2), not corrupted by the first (seq: 1).
      expect(data.value).toEqual({ seq: 2 });
    });

    it("should apply deduplication when reactive body is used and same request is in flight", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });

      let fetchCallCount = 0;
      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return new Promise<Response>((resolve) => {
          setTimeout(
            () =>
              resolve(
                new Response(JSON.stringify({ id: 1 }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }),
              ),
            50,
          );
        });
      }) as typeof fetch;

      const bodyRef = ref(JSON.stringify({ value: 1 }));
      const { execute } = useFzFetch<{ id: number }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      // Two execute() calls with same body (reactive value) in flight: dedup should coalesce to one request
      const promise1 = execute();
      const promise2 = execute();
      await Promise.all([promise1, promise2]);

      expect(fetchCallCount).toBe(1);
    });

    it("should pass current reactive body/headers to request interceptor when it modifies request", async () => {
      const bodyRef = ref(JSON.stringify({ value: 1 }));
      const headersRef = ref<Record<string, string>>({
        "Content-Type": "application/json",
        "X-Seq": "first",
      });

      const bodiesSeenByInterceptor: string[] = [];
      const headersSeenByInterceptor: Record<string, string>[] = [];

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (_url, requestInit) => {
          bodiesSeenByInterceptor.push(
            typeof requestInit.body === "string"
              ? requestInit.body
              : String(requestInit.body ?? ""),
          );
          const h = requestInit.headers;
          headersSeenByInterceptor.push(
            h instanceof Headers
              ? Object.fromEntries(h.entries())
              : (h as Record<string, string>) ?? {},
          );
          return {
            ...requestInit,
            headers: {
              ...(requestInit.headers instanceof Headers
                ? Object.fromEntries(
                    (requestInit.headers as Headers).entries(),
                  )
                : (requestInit.headers as Record<string, string>) ?? {}),
              "X-Modified": "true",
            },
          };
        },
      });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: headersRef,
      }, { immediate: false });

      await execute();
      expect(bodiesSeenByInterceptor).toHaveLength(1);
      expect(bodiesSeenByInterceptor[0]).toBe(JSON.stringify({ value: 1 }));
      expect(headersSeenByInterceptor[0]["X-Seq"]).toBe("first");

      bodyRef.value = JSON.stringify({ value: 2 });
      headersRef.value = {
        "Content-Type": "application/json",
        "X-Seq": "second",
      };
      await execute();
      expect(bodiesSeenByInterceptor).toHaveLength(2);
      expect(bodiesSeenByInterceptor[1]).toBe(JSON.stringify({ value: 2 }));
      expect(headersSeenByInterceptor[1]["X-Seq"]).toBe("second");
    });

    it("should transition isFetching false -> true -> false with reactive body", async () => {
      setupFzFetcher({ baseUrl: "https://api.example.com" });

      let fetchResolve: (() => void) | null = null;
      global.fetch = vi.fn(() => {
        return new Promise<Response>((resolve) => {
          fetchResolve = () =>
            resolve(
              new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
        });
      }) as typeof fetch;

      const bodyRef = ref(JSON.stringify({ value: 1 }));
      const { isFetching, execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      expect(isFetching.value).toBe(false);

      const executePromise = execute();

      await new Promise((r) => setTimeout(r, 50));
      expect(isFetching.value).toBe(true);

      fetchResolve!();
      await executePromise;

      expect(isFetching.value).toBe(false);
    });

    it("should transition isFetching correctly when request interceptor modifies request", async () => {
      let fetchResolve: (() => void) | null = null;
      global.fetch = vi.fn(() => {
        return new Promise<Response>((resolve) => {
          fetchResolve = () =>
            resolve(
              new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
        });
      }) as typeof fetch;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (_url, requestInit) => {
          return {
            ...requestInit,
            headers: {
              ...(requestInit.headers as Record<string, string>),
              "X-Injected": "token-123",
            },
          };
        },
      });

      const { isFetching, execute } = useFzFetch<{ ok: boolean }>("/test", {
        method: "POST",
        body: JSON.stringify({ value: 1 }),
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      expect(isFetching.value).toBe(false);

      const executePromise = execute();

      await new Promise((r) => setTimeout(r, 50));
      expect(isFetching.value).toBe(true);

      fetchResolve!();
      await executePromise;

      expect(isFetching.value).toBe(false);
    });

    it("should transition isFetching correctly during dedup with reactive body", async () => {
      let fetchResolve: (() => void) | null = null;
      let fetchCallCount = 0;
      global.fetch = vi.fn(() => {
        fetchCallCount++;
        return new Promise<Response>((resolve) => {
          fetchResolve = () =>
            resolve(
              new Response(JSON.stringify({ id: 1 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
        });
      }) as typeof fetch;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
      });

      const bodyRef = ref(JSON.stringify({ value: 1 }));
      const { isFetching, execute } = useFzFetch<{ id: number }>("/test", {
        method: "POST",
        body: bodyRef,
        headers: { "Content-Type": "application/json" },
      }, { immediate: false });

      expect(isFetching.value).toBe(false);

      const promise1 = execute();
      const promise2 = execute();

      await new Promise((r) => setTimeout(r, 50));
      expect(isFetching.value).toBe(true);

      fetchResolve!();
      await Promise.all([promise1, promise2]);

      expect(isFetching.value).toBe(false);
      expect(fetchCallCount).toBeLessThanOrEqual(2);
    });
  });

  describe("Setup fetchOptions", () => {
    it("should include headers from setupFzFetcher fetchOptions in every request", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: {
            "X-Realm": "frontoffice",
          },
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test");
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Realm"]).toBe("frontoffice");
    });

    it("should merge per-request headers with setup fetchOptions headers", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: {
            "X-Realm": "frontoffice",
          },
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        headers: { "Content-Type": "application/json" },
      });
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Realm"]).toBe("frontoffice");
      expect(headersObj["Content-Type"]).toBe("application/json");
    });

    it("should remove a default header when per-request sets it to undefined", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: {
            "X-Realm": "frontoffice",
            "X-App": "web",
          },
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        headers: { "X-Realm": undefined },
      });
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Realm"]).toBeUndefined();
      expect(headersObj["X-App"]).toBe("web");
    });

    it("should override a default header with per-request value", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: {
            "X-Realm": "frontoffice",
          },
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test", {
        headers: { "X-Realm": "backoffice" },
      });
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Realm"]).toBe("backoffice");
    });

    it("should remove a default header with reactive headers set to undefined", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: {
            "X-Realm": "frontoffice",
            "X-App": "web",
          },
        },
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

      const headersRef = ref<Record<string, string | undefined>>({
        "X-Realm": undefined,
      });

      const { execute } = useFzFetch<{ ok: boolean }>(
        "/test",
        {
          method: "POST",
          body: null,
          headers: headersRef,
        },
        { immediate: false },
      );

      await execute();
      expect(capturedHeaders).toHaveLength(1);
      expect(capturedHeaders[0]["X-Realm"]).toBeUndefined();
      expect(capturedHeaders[0]["X-App"]).toBe("web");

      headersRef.value = { "Content-Type": "application/json" };
      await execute();
      expect(capturedHeaders).toHaveLength(2);
      expect(capturedHeaders[1]["X-Realm"]).toBe("frontoffice");
      expect(capturedHeaders[1]["X-App"]).toBe("web");
      expect(capturedHeaders[1]["Content-Type"]).toBe("application/json");
    });

    it("should handle Headers instance in fetchOptions.headers", async () => {
      const headersInstance = new Headers();
      headersInstance.set("X-Realm", "frontoffice");
      headersInstance.set("X-App", "web");

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: headersInstance,
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test");
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["x-realm"]).toBe("frontoffice");
      expect(headersObj["x-app"]).toBe("web");
    });

    it("should handle string[][] tuples in fetchOptions.headers", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          headers: [
            ["X-Realm", "frontoffice"],
            ["X-App", "web"],
          ],
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { execute } = useFzFetch<{ ok: boolean }>("/test");
      await execute();

      expect(capturedHeaders).toBeDefined();
      const headersObj =
        capturedHeaders instanceof Headers
          ? Object.fromEntries(capturedHeaders.entries())
          : (capturedHeaders as Record<string, string>) ?? {};
      expect(headersObj["X-Realm"]).toBe("frontoffice");
      expect(headersObj["X-App"]).toBe("web");
    });

    it("should pass non-header fetchOptions (like credentials) to createFetch", async () => {
      let capturedCredentials: RequestCredentials | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedCredentials = init?.credentials;
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        fetchOptions: {
          credentials: "include",
          headers: { "X-Realm": "frontoffice" },
        },
      });

      const { execute } = useFzFetch<{ ok: boolean }>("/test");
      await execute();

      expect(capturedCredentials).toBe("include");
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

  describe("Immediate execution with interceptors", () => {
    it("should auto-execute when immediate: true (default) with request interceptor that does not modify request", async () => {
      let interceptorCalled = false;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (url, init) => {
          interceptorCalled = true;
          return init;
        },
      });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ id: 1 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

      const { data, isFetching } = useFzFetch<{ id: number }>("/users/1");

      expect(isFetching.value).toBe(false);

      await new Promise((r) => setTimeout(r, 150));

      expect(interceptorCalled).toBe(true);
      expect(data.value).toEqual({ id: 1 });
      expect(isFetching.value).toBe(false);
    });

    it("should auto-execute when immediate: true with request interceptor that modifies headers", async () => {
      let capturedHeaders: HeadersInit | undefined;

      setupFzFetcher({
        baseUrl: "https://api.example.com",
        requestInterceptor: async (_url, init) => ({
          ...init,
          headers: {
            ...(init.headers as Record<string, string>),
            Authorization: "Bearer test-token",
          },
        }),
      });

      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ authorized: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { data, isFetching } = useFzFetch<{ authorized: boolean }>(
        "/protected",
      );

      await new Promise((r) => setTimeout(r, 150));

      expect(data.value).toEqual({ authorized: true });
      expect(isFetching.value).toBe(false);
      expect(global.fetch).toHaveBeenCalled();

      const headers = capturedHeaders as Record<string, string> | undefined;
      expect(headers?.Authorization).toBe("Bearer test-token");
    });

    it("should auto-execute when immediate: true with response interceptor", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        responseInterceptor: async (response) => {
          const body = await response.clone().json();
          return new Response(
            JSON.stringify({ ...body, intercepted: true }),
            { status: response.status, headers: response.headers },
          );
        },
      });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ original: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

      const { data } = useFzFetch<{ original: boolean; intercepted: boolean }>(
        "/data",
      );

      await new Promise((r) => setTimeout(r, 150));

      expect(data.value).toEqual({ original: true, intercepted: true });
    });
  });

  describe("Immediate execution with interceptors and deduplication", () => {
    it("should auto-execute with request interceptor and deduplication enabled", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
        requestInterceptor: async (_url, init) => init,
      });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ value: 42 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

      const { data, isFetching } = useFzFetch<{ value: number }>("/resource");

      await new Promise((r) => setTimeout(r, 150));

      expect(data.value).toEqual({ value: 42 });
      expect(isFetching.value).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should complete both requests when two identical immediate requests are made with interceptors and dedup", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
        requestInterceptor: async (_url, init) => init,
      });

      global.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ shared: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      ) as typeof fetch;

      const result1 = useFzFetch<{ shared: boolean }>("/same", {
        immediate: false,
      });
      const result2 = useFzFetch<{ shared: boolean }>("/same", {
        immediate: false,
      });

      const p1 = result1.execute();
      const p2 = result2.execute();
      await Promise.all([p1, p2]);

      await new Promise((r) => setTimeout(r, 150));

      expect(result1.data.value).toEqual({ shared: true });
      expect(result2.data.value).toEqual({ shared: true });
    });

    it("should auto-execute with slow async request interceptor and deduplication", async () => {
      setupFzFetcher({
        baseUrl: "https://api.example.com",
        deduplication: true,
        requestInterceptor: async (_url, init) => {
          await new Promise((r) => setTimeout(r, 50));
          return {
            ...init,
            headers: {
              ...(init.headers as Record<string, string>),
              Authorization: "Bearer slow-token",
            },
          };
        },
      });

      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn((_url: string, init?: RequestInit) => {
        capturedHeaders = init?.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ delayed: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }) as typeof fetch;

      const { data, isFetching } = useFzFetch<{ delayed: boolean }>(
        "/slow-auth",
      );

      await new Promise((r) => setTimeout(r, 300));

      expect(data.value).toEqual({ delayed: true });
      expect(isFetching.value).toBe(false);
      expect(global.fetch).toHaveBeenCalled();

      const headers = capturedHeaders as Record<string, string> | undefined;
      expect(headers?.Authorization).toBe("Bearer slow-token");
    });
  });
});
