/**
 * Utility functions for the Fiscozen Radio component library.
 *
 * @module @fiscozen/radio/utils
 */

/**
 * Internal helper function to generate unique IDs with a given prefix.
 *
 * The ID is composed of:
 * - Prefix string (e.g., "fz-radio", "fz-radio-group")
 * - Obfuscated timestamp (Date.now() - epoch offset)
 * - Random alphanumeric suffix (5 characters)
 *
 * This strategy ensures uniqueness through:
 * - Different timestamps for components created at different times
 * - Random suffix prevents collisions within the same millisecond
 * - Stateless generation (no global counters to manage)
 *
 * @param prefix - The prefix to use for the generated ID
 * @returns Unique ID with the specified prefix
 *
 * @internal
 *
 * @example
 * generateId("fz-radio") // "fz-radio-97123456-a8d3k"
 * generateId("fz-radio-group") // "fz-radio-group-97123457-k2m9p"
 */
function generateId(prefix: string): string {
  // Obfuscate timestamp (Sept 13, 2020 offset) for shorter IDs
  const timestamp = Date.now() - 1600000000000;
  // Generate 5-char random alphanumeric suffix (base36: 0-9, a-z)
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generates a unique ID for radio components.
 *
 * @returns Unique radio ID with "fz-radio" prefix
 *
 * @example
 * generateRadioId() // "fz-radio-97123456-a8d3k"
 * generateRadioId() // "fz-radio-97123457-k2m9p"
 */
export function generateRadioId(): string {
  return generateId("fz-radio");
}

/**
 * Generates a unique ID for radio group components.
 *
 * @returns Unique radio group ID with "fz-radio-group" prefix
 *
 * @example
 * generateRadioGroupId() // "fz-radio-group-97123456-b7f2n"
 */
export function generateRadioGroupId(): string {
  return generateId("fz-radio-group");
}

