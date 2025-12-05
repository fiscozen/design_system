/**
 * Shared utilities for the Fiscozen Typeahead component library.
 * 
 * @module @fiscozen/typeahead/common
 */

/**
 * Minimum width for the dropdown container in pixels
 */
export const MIN_WIDTH = 240;

/**
 * Height of a single option element in pixels
 * 
 * Used for calculating max height and lazy loading buffer.
 */
export const OPTIONS_HEIGHT = 20;

/**
 * Number of option heights to use as buffer for lazy loading
 * 
 * Triggers loading of next batch before reaching absolute bottom.
 * Also used for calculating max height with viewport constraints.
 */
export const OPTIONS_BUFFER = 5;

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
