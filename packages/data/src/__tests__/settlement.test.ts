import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref } from "vue";
import { until } from "@vueuse/core";
import { setupFzFetcher, resetFzFetcher, useFzFetch, useActions } from "../rest";
import { getFirstFetchCall, type FetchMock } from "./test-utils";

/**
 * A regression here does not fail an assertion: the awaited promise never settles.
 * The short timeout turns that hang into a quick failure.
 */
const SETTLE_TIMEOUT_MS = 1000;

const BASE_URL = "https://api.example.com";

const jsonResponse = (status: number, body: unknown = null) =>
  new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const respondWith = (status: number, body: unknown = null) => {
  global.fetch = vi.fn(() => Promise.resolve(jsonResponse(status, body))) as unknown as typeof fetch;
};

/** Answers requests whose URL or body contains `heldMarker` only when the returned resolver is called. */
const holdRequestsMatching = (heldMarker: string, immediateBody: unknown) => {
  const held = Promise.withResolvers<Response>();
  global.fetch = vi.fn((url: string, init?: RequestInit) =>
    `${url} ${String(init?.body ?? "")}`.includes(heldMarker)
      ? held.promise
      : Promise.resolve(jsonResponse(200, immediateBody)),
  ) as unknown as typeof fetch;
  return (body: unknown) => held.resolve(jsonResponse(200, body));
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

describe("Awaiting useFzFetch on the default path", () => {
  beforeEach(() => {
    resetFzFetcher();
    setupFzFetcher({ baseUrl: BASE_URL });
    respondWith(200, { id: 1 });
  });

  it("resolves once the request VueUse runs on its own has completed", async () => {
    const settled = await useFzFetch<{ id: number }>("/items/1");

    expect(settled.data.value).toEqual({ id: 1 });
  }, SETTLE_TIMEOUT_MS);
});

describe("Awaiting useFzFetch behind a request interceptor that changes the request", () => {
  beforeEach(() => {
    resetFzFetcher();
    setupFzFetcher({ baseUrl: BASE_URL, requestInterceptor: addTestHeader });
    respondWith(200, { id: 1 });
  });

  it("resolves once the request has completed", async () => {
    const settled = await useFzFetch<{ id: number }>("/items/1");

    expect(settled.data.value).toEqual({ id: 1 });
  }, SETTLE_TIMEOUT_MS);

  it("the settled value's execute() goes through the interceptor", async () => {
    const settled = await useFzFetch<{ id: number }>("/items/1");

    await settled.execute();

    const [, secondInit] = (global.fetch as unknown as FetchMock).mock.calls[1] ?? [];
    expect(new Headers(secondInit?.headers).get("X-Test")).toBe("1");
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

describe("Awaiting useFzFetch while requests overlap", () => {
  beforeEach(() => {
    resetFzFetcher();
    setupFzFetcher({ baseUrl: BASE_URL });
  });

  it("an older execute() ending first does not settle a newer one", async () => {
    const releaseHeld = holdRequestsMatching("second", { call: "first" });
    const body = ref("first");
    const result = useFzFetch<{ call: string }>("/items", { method: "POST", body }, { immediate: false });
    const first = result.execute();
    body.value = "second";
    void result.execute();
    await first;

    const pending = result.then((settled) => settled.data.value);
    releaseHeld({ call: "second" });

    expect(await pending).toEqual({ call: "second" });
  }, SETTLE_TIMEOUT_MS);

  it("a refetch started by a URL change keeps a plain request pending", async () => {
    const releaseHeld = holdRequestsMatching("/items/2", { id: 1 });
    const id = ref(1);
    const result = useFzFetch<{ id: number }>(() => `/items/${id.value}`, { refetch: true, immediate: false });
    const first = result.execute();
    id.value = 2;
    await first;

    const pending = result.then((settled) => settled.data.value);
    releaseHeld({ id: 2 });

    expect(await pending).toEqual({ id: 2 });
  }, SETTLE_TIMEOUT_MS);

  it("a refetch ending does not settle an execute() served by a separate fetch", async () => {
    const releaseHeld = holdRequestsMatching("/items/1", { from: "refetch" });
    const id = ref(1);
    const body = ref("{}");
    const result = useFzFetch<{ from: string }>(
      () => `/items/${id.value}`,
      { method: "POST", body },
      { refetch: true, immediate: false },
    );
    void result.execute();
    id.value = 2;
    await until(result.data).toMatch((data) => data?.from === "refetch");

    const pending = result.then((settled) => settled.data.value);
    releaseHeld({ from: "execute" });

    expect(await pending).toEqual({ from: "execute" });
  }, SETTLE_TIMEOUT_MS);
});
