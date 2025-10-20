/**
 * Utility functions for the Fiscozen Checkbox component library.
 * 
 * @module @fiscozen/checkbox/utils
 */

/**
 * Internal helper function to generate unique IDs with a given prefix.
 * 
 * The ID is composed of:
 * - Prefix string (e.g., "fz-checkbox", "fz-checkbox-group")
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
 * generateId("fz-checkbox") // "fz-checkbox-97123456-a8d3k"
 * generateId("fz-checkbox-group") // "fz-checkbox-group-97123457-k2m9p"
 */
function generateId(prefix: string): string {
  // Obfuscate timestamp (Sept 13, 2020 offset) for shorter IDs
  const timestamp = Date.now() - 1600000000000;
  // Generate 5-char random alphanumeric suffix (base36: 0-9, a-z)
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generates a unique ID for checkbox components.
 * 
 * @returns Unique checkbox ID with "fz-checkbox" prefix
 * 
 * @example
 * generateCheckboxId() // "fz-checkbox-97123456-a8d3k"
 * generateCheckboxId() // "fz-checkbox-97123457-k2m9p"
 */
export function generateCheckboxId(): string {
  return generateId("fz-checkbox");
}

/**
 * Generates a unique ID for checkbox group components.
 * 
 * @returns Unique checkbox group ID with "fz-checkbox-group" prefix
 * 
 * @example
 * generateGroupId() // "fz-checkbox-group-97123456-b7f2n"
 */
export function generateGroupId(): string {
  return generateId("fz-checkbox-group");
}

