import type { ValidationRule } from './validation';

// ============================================================================
// VALIDATION CONFIGURATION
// ============================================================================

/**
 * HTML element tag names supported by directives.
 */
export type ValidElementTag = 'P' | 'H1' | 'H2' | 'H3';

/**
 * Directive name type for type safety.
 */
export type DirectiveName = 'v-color' | 'v-bold' | 'v-small';

/**
 * Configuration for directive validation rules.
 * 
 * Each directive has an array of validation rules that are evaluated in order.
 * The first matching rule determines if the directive usage is valid.
 * 
 * This structure allows fine-grained control:
 * - P can support v-bold and v-color (no restrictions)
 * - H2 can support only v-color:red="200" (specific combination)
 * 
 * @example
 * // P supports v-bold and v-color (any modifier/value)
 * DIRECTIVE_VALIDATION_CONFIG['v-color'] = [
 *   { tags: ['P'] }  // modifiers/values undefined = all allowed
 * ]
 * 
 * @example
 * // H2 supports only v-color:red="200"
 * DIRECTIVE_VALIDATION_CONFIG['v-color'] = [
 *   { tags: ['P'] },  // P: all modifiers/values
 *   { tags: ['H1', 'H3'] }, // H1, H3: all modifiers/values
 *   { tags: ['H2'], modifiers: ['red'], values: ['200'] }  // H2: only red="200"
 * ]
 */
export const DIRECTIVE_VALIDATION_CONFIG: Record<DirectiveName, readonly ValidationRule[]> = {
  'v-color': [
    // P, H1, H2, H3 supports v-color with any modifier and any value
    { tags: ['P', 'H1', 'H2', 'H3'] },
  ],
  'v-bold': [
    // P supports v-bold (no modifiers/values for this directive)
    { tags: ['P'] },
  ],
  'v-small': [
    // P supports v-small (no modifiers/values for this directive)
    { tags: ['P'] },
  ],
} as const;

