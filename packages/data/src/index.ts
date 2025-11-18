// Namespace export (backward compatible with Breweries examples)
export * as rest from "./rest";

// Direct exports (for convenience)
export { useActions, setupFzFetcher, useFzFetch, resetFzFetcher } from "./rest";
export type * from "./rest/actions";
export type * from "./rest/http/types";
