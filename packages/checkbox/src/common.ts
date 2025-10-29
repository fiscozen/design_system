/**
 * Shared utilities for the Fiscozen Checkbox component library.
 *
 * @module @fiscozen/checkbox/common
 */

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
