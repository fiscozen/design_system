/**
 * Shared utilities for the Fiscozen Select component library.
 * 
 * @module @fiscozen/select/common
 */

export const MIN_WIDTH = 240;

/**
 * Maps select size to icon size for consistent icon scaling.
 * 
 * Select components use larger sizes than icons, so this mapping
 * ensures icons are appropriately sized relative to the select.
 */
export const selectIconSizeMap = {
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

/**
 * Configuration object for select component size-based styling.
 * 
 * Centralizes all size-dependent CSS class mappings to eliminate duplication
 * across component files and ensure consistency.
 * 
 * @constant
 */
export const selectSizeConfig = {
  /**
   * Picker button classes (main select input)
   */
  picker: {
    sm: "h-24 text-sm",
    md: "h-32 text-base",
    lg: "h-40 text-lg",
  },
  /**
   * Label classes (group labels in options list)
   */
  label: {
    sm: "text-[10px] min-h-24 px-14",
    md: "text-xs min-h-32 px-16",
    lg: "text-sm min-h-40 px-20",
  },
  /**
   * Option classes (selectable items in options list)
   */
  option: {
    sm: "text-sm px-14 py-4",
    md: "text-base px-16 py-6",
    lg: "text-lg px-20 py-8",
  },
  /**
   * Subtitle classes (option subtitles)
   */
  subtitle: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  },
} as const;

/**
 * Calculates container width constraints based on opener position
 * 
 * Ensures dropdown width matches opener while respecting viewport boundaries.
 * Uses available space on both sides to determine maximum expandable width.
 * 
 * @param opener - The opener element to measure
 * @returns Object with minWidth and maxWidth in pixels
 * 
 * @example
 * const { minWidth, maxWidth } = calculateContainerWidth(openerElement);
 */
export function calculateContainerWidth(opener: HTMLElement) {
  const rect = opener.getBoundingClientRect();

  const minWidth = rect.width > MIN_WIDTH ? rect.width : MIN_WIDTH;
  const spaceOnRight = window.innerWidth - (rect.right + window.scrollX);
  const spaceOnLeft = rect.left + window.scrollX;
  const maxWidth = rect.width + Math.max(spaceOnRight, spaceOnLeft);

  return {
    minWidth,
    maxWidth,
  };
}
