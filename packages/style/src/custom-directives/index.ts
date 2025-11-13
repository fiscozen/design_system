/**
 * Custom directives module for FiscoZen Design System.
 * 
 * This module exports all custom Vue directives and their configuration.
 * 
 * @module custom-directives
 */

import { vBold } from './vBold';
import { vColor } from './vColor';
import { vSmall } from './vSmall';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ValidElementTag, DirectiveName } from './config';
export type { ValidationRule, DirectiveValidationConfig } from './validation';
export { DIRECTIVE_VALIDATION_CONFIG } from './config';

// ============================================================================
// DIRECTIVES REGISTRY
// ============================================================================

/**
 * Registry of all custom directives for easy registration in Vue applications.
 * 
 * Usage in Vue app:
 * ```ts
 * import { directives } from '@fiscozen/style';
 * directives.forEach(({ name, directive }) => {
 *   app.directive(name, directive);
 * });
 * ```
 */
export const directives = [
    {name: 'bold', directive: vBold},
    {name: 'small', directive: vSmall},
    {name: 'color', directive: vColor},
];

