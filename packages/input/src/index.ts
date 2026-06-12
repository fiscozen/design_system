export { default as FzInput } from "./FzInput.vue";
/**
 * @deprecated Use `<FzInput type="currency">` instead. This wrapper is kept
 * for backwards compatibility until the migration of all consumers is complete.
 */
export { default as FzCurrencyInput } from "./FzCurrencyInput.vue";

export type * from "./types";

// Utility exports
export { sizeToEnvironmentMapping } from "./utils";
