/**
 * Utility functions for the Fiscozen Input component library.
 * 
 * @module @fiscozen/input/utils
 */

import type { InputEnvironment } from "./types";

type InputSize = "sm" | "md" | "lg";

/**
 * Maps deprecated InputSize to InputEnvironment
 * 
 * Used for backward compatibility when size prop is provided instead of environment.
 * Size values map to environments: sm/md → backoffice, lg → frontoffice
 */
export const sizeToEnvironmentMapping: Record<InputSize, InputEnvironment> = {
  sm: "backoffice",
  md: "backoffice",
  lg: "frontoffice",
};

/**
 * Internal helper function to generate unique IDs with a given prefix.
 *
 * The ID is composed of:
 * - Prefix string (e.g., "fz-input")
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
 * generateId("fz-input") // "fz-input-97123456-a8d3k"
 */
function generateId(prefix: string): string {
  // Obfuscate timestamp (Sept 13, 2020 offset) for shorter IDs
  const timestamp = Date.now() - 1600000000000;
  // Generate 5-char random alphanumeric suffix (base36: 0-9, a-z)
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generates a unique ID for input components.
 *
 * @returns Unique input ID with "fz-input" prefix
 *
 * @example
 * generateInputId() // "fz-input-97123456-a8d3k"
 * generateInputId() // "fz-input-97123457-k2m9p"
 */
export function generateInputId(): string {
  return generateId("fz-input");
}

