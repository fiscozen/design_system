import { createFetch } from "@vueuse/core";
import type { CsrfOptions } from "../managers/csrf/types";
import type {
  RequestInterceptor,
  ResponseInterceptor,
} from "../features/interceptors/types";
import type { CsrfManager } from "../managers/csrf";
import type { DeduplicationManager } from "../managers/deduplication";

/**
 * Global state management for the HTTP layer
 *
 * All global state variables are centralized here for better organization
 * and easier testing/maintenance.
 *
 * Using a mutable object allows modification from other modules.
 */
export const state = {
  // Fetcher instance
  // createFetch returns a function that can be called with url, options
  fzFetcher: null as ReturnType<typeof createFetch> | null,

  // Configuration state
  globalBaseUrl: null as string | null, // Resolved baseUrl for interceptor use
  globalCsrfOptions: null as CsrfOptions | null,
  globalDebug: false,
  globalDeduplication: false,
  globalRequestInterceptor: null as RequestInterceptor | null,
  globalResponseInterceptor: null as ResponseInterceptor | null,

  // Manager instances
  csrfManager: null as CsrfManager | null,
  deduplicationManager: null as DeduplicationManager | null,
};

/**
 * Get global base URL
 * @internal
 */
export const getGlobalBaseUrl = (): string | null => state.globalBaseUrl;

/**
 * Get global request interceptor
 * @internal
 */
export const getGlobalRequestInterceptor = (): RequestInterceptor | null =>
  state.globalRequestInterceptor;

/**
 * Get global response interceptor
 * @internal
 */
export const getGlobalResponseInterceptor = (): ResponseInterceptor | null =>
  state.globalResponseInterceptor;

/**
 * Get global debug flag
 * @internal
 */
export const getGlobalDebug = (): boolean => state.globalDebug;

/**
 * Get CSRF manager instance
 * @internal
 */
export const getCsrfManager = (): CsrfManager | null => state.csrfManager;

/**
 * Get deduplication manager instance
 * @internal
 */
export const getDeduplicationManager = (): DeduplicationManager | null =>
  state.deduplicationManager;

/**
 * Get CSRF options
 * @internal
 */
export const getCsrfOptions = (): CsrfOptions | null => state.globalCsrfOptions;
