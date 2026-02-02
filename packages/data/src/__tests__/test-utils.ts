/**
 * Shared test utilities for @fiscozen/data tests.
 *
 * Encapsulates typing for global.fetch when replaced by vi.fn() so tests
 * don't repeat inline type assertions.
 *
 * @module @fiscozen/data/__tests__/test-utils
 */

/**
 * Shape of global.fetch when replaced by vi.fn() in tests.
 * Vitest mocks expose .mock.calls as array of [input, init?] per call.
 */
export type FetchMock = {
  mock: { calls: [RequestInfo, RequestInit?][] };
};

/**
 * Returns the first call's [url, init] from the current global.fetch mock.
 * Use after assigning global.fetch = vi.fn(...) in a test.
 *
 * @throws If fetch was not called
 * @returns Tuple of [RequestInfo, RequestInit?] for the first call
 */
export function getFirstFetchCall(): [RequestInfo, RequestInit?] {
  const mock = global.fetch as unknown as FetchMock;
  const call = mock.mock.calls[0];
  if (!call) {
    throw new Error("getFirstFetchCall: fetch was not called");
  }
  return call;
}

/**
 * Returns the first fetch call's URL as a string (for use with `new URL()`).
 * Handles RequestInfo (string, URL, or Request).
 *
 * @throws If fetch was not called
 * @returns URL string of the first call
 *
 * @example
 * const callUrl = getFirstFetchCallUrl();
 * const url = new URL(callUrl);
 * expect(url.searchParams.get("page")).toBe("1");
 */
export function getFirstFetchCallUrl(): string {
  const [requestInfo] = getFirstFetchCall();
  if (typeof requestInfo === "string") return requestInfo;
  if (requestInfo instanceof URL) return requestInfo.href;
  return requestInfo.url;
}
