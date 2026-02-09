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
 * Auto-incrementing counter used by {@link generateId} to guarantee
 * uniqueness even when multiple components are created within the
 * same millisecond (e.g. in a v-for loop or during SSR).
 *
 * Using a counter instead of Math.random() makes ID generation fully
 * deterministic, which is critical for snapshot testing stability.
 *
 * @internal
 */
let idCounter = 0;

/**
 * Internal helper function to generate unique IDs with a given prefix.
 *
 * The ID is composed of:
 * - Prefix string (e.g., "fz-input")
 * - Obfuscated timestamp (Date.now() - epoch offset)
 * - Auto-incrementing counter (base-36 encoded)
 *
 * This strategy ensures uniqueness through:
 * - Different timestamps for components created at different times
 * - Counter prevents collisions within the same millisecond
 * - Deterministic generation (no Math.random(), safe for snapshot tests)
 *
 * @param prefix - The prefix to use for the generated ID
 * @returns Unique ID with the specified prefix
 *
 * @internal
 *
 * @example
 * generateId("fz-input") // "fz-input-97123456-1"
 */
function generateId(prefix: string): string {
  // Obfuscate timestamp (Sept 13, 2020 offset) for shorter IDs
  const timestamp = Date.now() - 1600000000000;
  return `${prefix}-${timestamp}-${++idCounter}`;
}

/**
 * Generates a unique ID for input components.
 *
 * @returns Unique input ID with "fz-input" prefix
 *
 * @example
 * generateInputId() // "fz-input-97123456-1"
 * generateInputId() // "fz-input-97123456-2"
 */
export function generateInputId(): string {
  return generateId("fz-input");
}

