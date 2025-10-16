/**
 * Utility functions for the Fiscozen Checkbox component library.
 * 
 * @module @fiscozen/checkbox/utils
 */

/**
 * Epoch offset used to obfuscate timestamps in generated IDs.
 * Set to September 13, 2020 to produce shorter, less identifiable timestamps.
 * 
 * @internal
 */
const EPOCH_OFFSET = 1600000000000;

/**
 * Base for converting numbers to alphanumeric strings.
 * Base 36 uses digits 0-9 and letters a-z.
 * 
 * @internal
 */
const ALPHANUMERIC_BASE = 36;

/**
 * Start index for slicing random string (skips "0." prefix from Math.random()).
 * 
 * @internal
 */
const RANDOM_SLICE_START = 2;

/**
 * End index for slicing random string, producing a 5-character suffix.
 * 
 * @internal
 */
const RANDOM_SLICE_END = 7;

/**
 * Generates a unique ID for checkbox components.
 * 
 * The ID is composed of:
 * - Obfuscated timestamp (Date.now() - EPOCH_OFFSET)
 * - Random alphanumeric suffix (5 characters)
 * 
 * This strategy ensures uniqueness through:
 * - Different timestamps for components created at different times
 * - Random suffix prevents collisions within the same millisecond
 * - Stateless generation (no global counters to manage)
 * 
 * @returns Unique checkbox ID
 * 
 * @example
 * generateCheckboxId() // "fz-checkbox-97123456-a8d3k"
 * generateCheckboxId() // "fz-checkbox-97123457-k2m9p"
 */
export function generateCheckboxId(): string {
  const timestamp = Date.now() - EPOCH_OFFSET;
  const random = Math.random().toString(ALPHANUMERIC_BASE).slice(RANDOM_SLICE_START, RANDOM_SLICE_END);
  return `fz-checkbox-${timestamp}-${random}`;
}

/**
 * Generates a unique ID for checkbox group components.
 * 
 * Uses the same strategy as generateCheckboxId() but with a different prefix
 * to distinguish groups from individual checkboxes in the DOM.
 * 
 * @returns Unique checkbox group ID
 * 
 * @example
 * generateGroupId() // "fz-checkbox-group-97123456-b7f2n"
 */
export function generateGroupId(): string {
  const timestamp = Date.now() - EPOCH_OFFSET;
  const random = Math.random().toString(ALPHANUMERIC_BASE).slice(RANDOM_SLICE_START, RANDOM_SLICE_END);
  return `fz-checkbox-group-${timestamp}-${random}`;
}

