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

/**
 * FontAwesome icon names for different checkbox states.
 * Frozen for optimal memory usage - string literals are interned once and reused.
 * 
 * @constant
 * 
 * @example
 * const icon = isChecked ? CHECKBOX_ICONS.CHECKED : CHECKBOX_ICONS.UNCHECKED;
 */
export const CHECKBOX_ICONS = Object.freeze({
  /** Icon for indeterminate state (partial selection) */
  INDETERMINATE: "square-minus",
  /** Icon for checked state */
  CHECKED: "square-check",
  /** Icon for unchecked state */
  UNCHECKED: "square",
} as const);

/**
 * FontAwesome icon variant prefixes for checkbox icons.
 * 
 * @constant
 */
export const CHECKBOX_ICON_VARIANTS = Object.freeze({
  /** Solid variant (filled) - used for checked and indeterminate states */
  SOLID: "fas",
  /** Regular variant (outline) - used for unchecked state */
  REGULAR: "far",
} as const);
