import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref } from "vue";
import { setupFzFetcher, resetFzFetcher, useFzFetch, useActions } from "../rest";
import { getFirstFetchCall } from "./test-utils";

/**
 * A regression here does not fail an assertion: the awaited promise never settles.
 * The short timeout turns that hang into a quick failure.
 */
const SETTLE_TIMEOUT_MS = 1000;

const BASE_URL = "https://api.example.com";

const respondWith = (status: number, body: unknown = null) => {
  global.fetch = vi.fn(() =>
    Promise.resolve(
      new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  ) as unknown as typeof fetch;
};

const addTestHeader = async (_url: string, init: RequestInit): Promise<RequestInit> => ({
  ...init,
  headers: { ...(init.headers as Record<string, string>), "X-Test": "1" },
});

describe("Mutations settle when the request interceptor changes the request", () => {
  beforeEach(() => {
    resetFzFetcher();
    setupFzFetcher({ baseUrl: BASE_URL, requestInterceptor: addTestHeader });
  });

  it("useCreate resolves with the created entity", async () => {
    respondWith(201, { id: 1 });
    const { data, error, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useCreate();

    await execute({});

    expect(new Headers(getFirstFetchCall()[1]?.headers).get("X-Test")).toBe("1");
    expect(data.value).toEqual({ id: 1 });
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);

  it("useCreate stores a failed response as error when throwOnError is false", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ detail: "invalid" }), { status: 400, statusText: "Bad Request" })),
    ) as unknown as typeof fetch;
    const { data, error, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useCreate();

    await execute({});

    expect(error.value?.message).toBe("Bad Request");
    expect(data.value).toBeNull();
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);

  it("useUpdate resolves with the updated entity", async () => {
    respondWith(200, { id: 1 });
    const { data, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useUpdate();

    await execute(1, {});

    expect(data.value).toEqual({ id: 1 });
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);

  it("useDelete resolves on an empty 204 response", async () => {
    respondWith(204);
    const { data, error, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useDelete();

    await execute(1);

    expect(data.value).toBeNull();
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);
});

describe("Mutations settle when the request interceptor sends no request", () => {
  beforeEach(() => {
    resetFzFetcher();
    respondWith(201, { id: 1 });
  });

  it("an interceptor returning null stores the abort as error", async () => {
    setupFzFetcher({ baseUrl: BASE_URL, requestInterceptor: async () => null });
    const { error, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useCreate();

    await execute({});

    expect(global.fetch).not.toHaveBeenCalled();
    expect(error.value?.name).toBe("AbortError");
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);

  it("an interceptor that throws stores its error", async () => {
    setupFzFetcher({
      baseUrl: BASE_URL,
      requestInterceptor: async () => {
        throw new Error("interceptor failed");
      },
    });
    const { error, isLoading, execute } = useActions<{ id: number }>("api/v1/items/").useCreate();

    await execute({});

    expect(global.fetch).not.toHaveBeenCalled();
    expect(error.value?.message).toBe("interceptor failed");
    expect(isLoading.value).toBe(false);
  }, SETTLE_TIMEOUT_MS);
});

describe("Awaiting useFzFetch with a reactive body", () => {
  beforeEach(() => {
    resetFzFetcher();
    setupFzFetcher({ baseUrl: BASE_URL });
    respondWith(200, { ok: true });
  });

  it("resolves once execute() has completed", async () => {
    const body = ref(JSON.stringify({ a: 1 }));
    const result = useFzFetch<{ ok: boolean }>("/items", { method: "POST", body }, { immediate: false });
    await result.execute();

    const settled = await result;

    expect(settled.data.value).toEqual({ ok: true });
  }, SETTLE_TIMEOUT_MS);

  it("waits for a later execute() still in flight", async () => {
    const body = ref(JSON.stringify({ a: 1 }));
    const result = useFzFetch<{ ok: boolean }>("/items", { method: "POST", body }, { immediate: false });
    await result.execute();
    respondWith(200, { ok: false });
    void result.execute();

    const settled = await result;

    expect(settled.data.value).toEqual({ ok: false });
  }, SETTLE_TIMEOUT_MS);
});
