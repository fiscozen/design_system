// Namespace export (alternative import pattern)
export * as rest from "./rest";

// Direct exports (for convenience)
export {
  useActions,
  setupFzFetcher,
  useFzFetch,
  resetFzFetcher,
  callListActionWithDefaults,
  callPaginatedListActionWithDefaults,
  callRetrieveActionWithDefaults,
  callCreateActionWithDefaults,
  callUpdateActionWithDefaults,
  callDeleteActionWithDefaults,
} from "./rest";
export type * from "./rest/actions";
export type * from "./rest/http/types";
