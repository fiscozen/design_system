/**
 * Utility functions for the Fiscozen Input component library.
 * 
 * @module @fiscozen/input/utils
 */

import { parse } from "@fiscozen/composables";
import type { InputEnvironment } from "./types";

type InputSize = "sm" | "md" | "lg";

/**
 * HTML "valid floating-point number" grammar: the only content a native
 * `<input type="number">` is guaranteed to accept wholesale across browsers.
 *
 * @see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number
 */
const NATIVE_FLOAT_RE = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/;

/**
 * Whether `text` matches the native floating-point grammar exactly (no
 * trimming: padded or grouped content is rejected by some browsers and
 * blanked out by others, so it cannot be considered natively safe).
 */
export const isNativeFloatString = (text: string): boolean =>
  NATIVE_FLOAT_RE.test(text);

/**
 * Parses clipboard text into a finite number, accepting the same formats as
 * currency-mode paste (Italian "1.234,56", comma decimals, padded whitespace).
 *
 * @returns The parsed number, or null when the text cannot be interpreted as
 * a finite number
 */
export const parseClipboardNumber = (text: string): number | null => {
  const parsed = parse(text);
  return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
};

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

