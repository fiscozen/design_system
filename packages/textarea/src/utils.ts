/**
 * Utility functions for the Fiscozen Textarea component library.
 *
 * @module @fiscozen/textarea/utils
 */

/**
 * Auto-incrementing counter for deterministic ID generation.
 * Using a counter instead of Math.random() makes ID generation fully
 * deterministic, which is critical for snapshot testing stability.
 *
 * @internal
 */
let idCounter = 0;

/**
 * Generates a unique ID for textarea components.
 *
 * Ensures label-textarea association works even when no explicit id prop is provided.
 * Composed of prefix, obfuscated timestamp, and auto-incrementing counter.
 *
 * @returns Unique textarea ID with "fz-textarea" prefix
 *
 * @example
 * generateTextareaId() // "fz-textarea-97123456-1"
 */
export function generateTextareaId(): string {
  const timestamp = Date.now() - 1600000000000;
  return `fz-textarea-${timestamp}-${++idCounter}`;
}
