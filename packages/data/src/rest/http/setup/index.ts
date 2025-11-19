import { createFetch } from "@vueuse/core";
import { toValue } from "vue";
import type { SetupFzFetcher } from "../types";
import { CsrfManager } from "../managers/csrf";
import { DeduplicationManager } from "../managers/deduplication";
import { state } from "./state";

/**
 * Setup the global fetcher instance with configuration
 *
 * @param options - Configuration options
 *
 * @example
 * // Basic setup
 * setupFzFetcher({
 *   baseUrl: 'https://api.example.com'
 * })
 *
 * @example
 * // Full setup with CSRF and deduplication
 * setupFzFetcher({
 *   baseUrl: 'https://api.example.com',
 *   csrf: {
 *     enabled: true,
 *     cookieName: 'csrf_token',
 *     headerName: 'X-CSRF-Token'
 *   },
 *   deduplication: true, // Enable request deduplication globally
 *   debug: false
 * })
 */
export const setupFzFetcher: SetupFzFetcher = (options) => {
  // Store global configuration
  state.globalCsrfOptions = options.csrf || null;
  state.globalDebug = options.debug || false;
  state.globalDeduplication = options.deduplication || false;
  state.globalRequestInterceptor = options.requestInterceptor || null;
  state.globalResponseInterceptor = options.responseInterceptor || null;

  // Initialize CSRF manager if enabled
  if (state.globalCsrfOptions && state.globalCsrfOptions.enabled) {
    state.csrfManager = new CsrfManager(
      state.globalCsrfOptions,
      state.globalDebug,
    );
    if (state.globalDebug) {
      console.debug("[setupFzFetcher] CSRF manager initialized:", {
        cookieName: state.globalCsrfOptions.cookieName,
        headerName: state.globalCsrfOptions.headerName,
      });
    }
  } else {
    state.csrfManager = null;
    if (state.globalDebug) {
      console.debug("[setupFzFetcher] CSRF protection disabled");
    }
  }

  // Initialize deduplication manager if enabled
  if (state.globalDeduplication) {
    state.deduplicationManager = new DeduplicationManager();
    if (state.globalDebug) {
      console.debug("[setupFzFetcher] Request deduplication enabled");
    }
  } else {
    state.deduplicationManager = null;
    if (state.globalDebug) {
      console.debug("[setupFzFetcher] Request deduplication disabled");
    }
  }

  if (state.globalDebug) {
    console.debug("[setupFzFetcher] Initializing with options:", {
      baseUrl: options.baseUrl,
      csrf: state.globalCsrfOptions,
      debug: state.globalDebug,
      deduplication: state.globalDeduplication,
      hasRequestInterceptor: !!state.globalRequestInterceptor,
      hasResponseInterceptor: !!state.globalResponseInterceptor,
    });
  }

  if (!options.baseUrl) {
    throw new Error(
      "[setupFzFetcher] baseUrl is required! Please provide a baseUrl in setupFzFetcher options.",
    );
  }

  // Resolve baseUrl for interceptor use
  state.globalBaseUrl = toValue(options.baseUrl);

  state.fzFetcher = createFetch({
    baseUrl: options.baseUrl,
    ...options.options,
    ...options.fetchOptions,
  });

  if (state.globalDebug) {
    console.debug("[setupFzFetcher] Fetcher initialized successfully");
  }
};

/**
 * Reset fetcher instance (useful for testing)
 * @internal
 */
export const resetFzFetcher = () => {
  const wasDebug = state.globalDebug;

  state.fzFetcher = null;
  state.globalBaseUrl = null;
  state.globalCsrfOptions = null;
  state.globalDebug = false;
  state.globalDeduplication = false;
  state.globalRequestInterceptor = null;
  state.globalResponseInterceptor = null;
  state.csrfManager = null;
  state.deduplicationManager = null;

  if (wasDebug) {
    console.debug("[resetFzFetcher] Fetcher reset");
  }
};

