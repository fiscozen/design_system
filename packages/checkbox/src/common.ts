/**
 * Shared utilities for the Fiscozen Checkbox component library.
 *
 * @module @fiscozen/checkbox/common
 */

import type { ComputedRef, InjectionKey, Ref } from "vue";

/**
 * Maps checkbox size variants to corresponding Tailwind CSS text size classes.
 *
 * Used to maintain consistent typography across checkbox labels and helper text.
 * Applied to both FzCheckbox and FzCheckboxGroup components.
 *
 * @constant
 * @type {Record<"sm" | "md", string>}
 *
 * @example
 * const labelClass = mapSizeToClasses[props.size]; // "text-sm" or "text-base"
 */
export const mapSizeToClasses = {
  /** Small size: 14px font size (0.875rem) */
  sm: "text-sm",
  /** Medium size: 16px font size (1rem) - default */
  md: "text-base",
};

export interface CheckedSetProvision {
  /** The group's model ref — consumers compare by reference identity to decide
   *  whether the shared Set is built from the same data they hold. */
  source: Ref<(string | number | boolean)[]>;
  /** Pre-built Set for O(1) lookups, derived from `source`. */
  set: ComputedRef<Set<string | number | boolean>>;
}

/**
 * Injection key for the shared checked-values Set.
 * Provided by FzCheckboxGroup so child cards/checkboxes can do O(1) membership
 * checks instead of O(N) Array.includes scans — but only when the group's
 * model and the child's model reference the same array.
 */
export const CHECKED_SET_KEY: InjectionKey<CheckedSetProvision> =
  Symbol("FzCheckboxCheckedSet");
