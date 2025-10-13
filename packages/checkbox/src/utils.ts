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
  const random = Math.random().toString(36).slice(2, 7);
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
  const random = Math.random().toString(36).slice(2, 7);
  return `fz-checkbox-group-${timestamp}-${random}`;
}

