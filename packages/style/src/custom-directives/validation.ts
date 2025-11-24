import type { DirectiveBinding } from 'vue';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Single validation rule that specifies allowed combinations of tags, modifiers, and values.
 * 
 * Rules are evaluated in order - first matching rule wins.
 * - If `modifiers` is undefined: all modifiers are allowed
 * - If `modifiers` is an array: only those modifiers are allowed
 * - If `values` is undefined: all values are allowed
 * - If `values` is an array: only those values are allowed
 * 
 * @example
 * // Allow P to use v-color with any modifier and any value
 * { tags: ['P'], modifiers: undefined, values: undefined }
 * 
 * @example
 * // Allow H2 to use v-color:red="200" only
 * { tags: ['H2'], modifiers: ['red'], values: ['200'] }
 */
export type ValidationRule = {
  /** HTML element tags this rule applies to */
  tags: readonly string[];
  /** Allowed modifiers (undefined = all modifiers allowed) */
  modifiers?: readonly string[];
  /** Allowed values (undefined = all values allowed) */
  values?: readonly (string | number)[];
};

/**
 * Configuration type for directive validation rules.
 * 
 * Maps directive names to arrays of validation rules.
 */
export type DirectiveValidationConfig = Record<string, readonly ValidationRule[]>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Checks if a modifier is allowed according to a validation rule.
 * 
 * Rules:
 * - If rule doesn't restrict modifiers (undefined): all modifiers are allowed (including no modifier)
 * - If rule restricts modifiers (array): modifier must be in the array
 * 
 * @param rule - The validation rule to check
 * @param modifier - The modifier to validate
 * @returns true if modifier is allowed
 */
function isModifierAllowed(rule: ValidationRule, modifier?: string): boolean {
  // If rule doesn't restrict modifiers, all are allowed (including no modifier)
  if (!rule.modifiers) return true;
  
  // Rule restricts modifiers - modifier must be provided and in the list
  if (!modifier) return false;
  
  // Check if modifier is in allowed list
  return rule.modifiers.includes(modifier);
}

/**
 * Checks if a value is allowed according to a validation rule.
 * 
 * Rules:
 * - If rule doesn't restrict values (undefined): all values are allowed (including no value)
 * - If rule restricts values (array): value must be in the array
 * - `false` is always allowed as a special sentinel value used by directives to remove classes
 * 
 * @param rule - The validation rule to check
 * @param value - The value to validate
 * @returns true if value is allowed
 */
function isValueAllowed(rule: ValidationRule, value?: boolean | string | number): boolean {
  // If rule doesn't restrict values, all are allowed (including no value)
  if (!rule.values) return true;
  
  // false is a special sentinel value used by directives to remove classes
  // It should always be valid, regardless of value restrictions
  if (value === false) return true;
  
  // Rule restricts values - value must be provided and in the list
  if (value === undefined || value === null) return false;
  
  // Convert value to string for comparison
  const valueStr = String(value);
  
  // Check if value is in allowed list (compare as strings)
  return rule.values.some(v => String(v) === valueStr);
}

/**
 * Finds the first matching validation rule for a directive-tag-modifier-value combination.
 * 
 * @param config - The validation configuration
 * @param directiveName - The directive name
 * @param tagName - The HTML element tag name
 * @param modifier - The directive modifier (arg)
 * @param value - The directive value
 * @returns The matching rule, or undefined if no rule matches
 */
function findMatchingRule(
  config: DirectiveValidationConfig,
  directiveName: string,
  tagName: string,
  modifier?: string,
  value?: boolean | string | number
): ValidationRule | undefined {
  const rules = config[directiveName];
  if (!rules) return undefined;
  
  // Find first rule where:
  // 1. Tag matches
  // 2. Modifier is allowed (or rule doesn't restrict modifiers)
  // 3. Value is allowed (or rule doesn't restrict values)
  return rules.find(rule => {
    const tagMatches = rule.tags.includes(tagName);
    const modifierAllowed = isModifierAllowed(rule, modifier);
    const valueAllowed = isValueAllowed(rule, value);
    
    return tagMatches && modifierAllowed && valueAllowed;
  });
}

/**
 * Gets all valid element tags for a given directive (without modifier/value restrictions).
 * 
 * @param config - The validation configuration
 * @param directiveName - The directive name to check
 * @returns Array of valid tag names, or empty array if directive not found
 */
export function getValidTagsForDirective(
  config: DirectiveValidationConfig,
  directiveName: string
): readonly string[] {
  const rules = config[directiveName];
  if (!rules) return [];
  
  const allTags = new Set<string>();
  rules.forEach(rule => {
    rule.tags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags);
}

/**
 * Gets all directives that can be used on a given element tag.
 * 
 * @param config - The validation configuration
 * @param tagName - The HTML element tag name
 * @returns Array of directive names that support this tag
 */
export function getDirectivesForTag(
  config: DirectiveValidationConfig,
  tagName: string
): string[] {
  return Object.keys(config).filter(
    (directive) => {
      const rules = config[directive];
      return rules.some(rule => rule.tags.includes(tagName));
    }
  );
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validates that a directive is applied to an appropriate HTML element with valid modifier/value combination.
 * 
 * Uses the provided validation configuration to check if the directive
 * can be used on the given element tag with the specified modifier and value.
 * This generalized approach:
 * - Supports any directive-tag-modifier-value combination defined in the config
 * - Makes it easy to add new directives, tags, or restrictions
 * - Provides clear error messages for invalid combinations
 * - Supports fine-grained rules (e.g., H2 only allows v-color:red="200")
 * 
 * @param config - The validation configuration
 * @param el - The HTML element the directive is applied to
 * @param directive - The directive binding with name, arg (modifier), and value
 * @returns true if the element is valid for this directive with the given modifier/value
 * 
 * @example
 * // Valid: v-color:blue on P (P allows any modifier/value)
 * validateElement(config, pElement, { name: 'v-color', arg: 'blue', ... }) // true
 * 
 * @example
 * // Valid: v-color:red="200" on H2 (matches specific rule)
 * validateElement(config, h2Element, { name: 'v-color', arg: 'red', value: '200' }) // true
 * 
 * @example
 * // Invalid: v-color:blue on H2 (H2 only allows red)
 * validateElement(config, h2Element, { name: 'v-color', arg: 'blue', ... }) // false, logs error
 */
export function validateElement(
  config: DirectiveValidationConfig,
  el: HTMLElement,
  directive: {name: string} & DirectiveBinding<any>
): boolean {
  const directiveName = directive.name;
  const tagName = el.tagName;
  const modifier = directive.arg as string | undefined;
  const value = directive.value;
  
  // Find matching rule for this directive-tag-modifier-value combination
  const matchingRule = findMatchingRule(config, directiveName, tagName, modifier, value);
  
  if (matchingRule) {
    return true;
  }
  
  // Validation failed - determine error message based on context
  const allSupportedTags = Array.from(
    new Set(
      Object.values(config).flatMap(rules => 
        rules.flatMap(rule => rule.tags)
      )
    )
  );
  
  const isSupportedTag = allSupportedTags.includes(tagName);
  const rules = config[directiveName];
  
  if (!rules) {
    // Directive not found in config
    console.error(
      `[${directiveName}] Unknown directive. Available directives: ${Object.keys(config).join(', ')}`
    );
    return false;
  }
  
  // Check if tag is supported by this directive (even if modifier/value don't match)
  const tagRules = rules.filter(rule => rule.tags.includes(tagName));
  
  if (tagRules.length > 0) {
    // Tag is supported, but modifier/value combination is invalid
    const allowedModifiers = tagRules
      .flatMap(rule => rule.modifiers || [])
      .filter((v, i, arr) => arr.indexOf(v) === i); // unique
    
    const allowedValues = tagRules
      .flatMap(rule => rule.values || [])
      .filter((v, i, arr) => arr.indexOf(v) === i); // unique
    
    let errorMsg = `[${directiveName}] Invalid combination on <${tagName.toLowerCase()}>:`;
    
    if (modifier && allowedModifiers.length > 0 && !allowedModifiers.includes(modifier)) {
      errorMsg += ` modifier '${modifier}' not allowed. Allowed modifiers: ${allowedModifiers.join(', ')}`;
    }
    
    if (value !== undefined && value !== null && allowedValues.length > 0) {
      const valueStr = String(value);
      if (!allowedValues.some(v => String(v) === valueStr)) {
        errorMsg += ` value '${valueStr}' not allowed. Allowed values: ${allowedValues.map(v => String(v)).join(', ')}`;
      }
    }
    
    if (errorMsg === `[${directiveName}] Invalid combination on <${tagName.toLowerCase()}>:`) {
      errorMsg += ` this modifier/value combination is not allowed for this tag.`;
    }
    
    console.error(errorMsg);
  } else if (isSupportedTag) {
    // Element type is supported by some directives, but not this one
    const supportedDirectives = getDirectivesForTag(config, tagName);
    if (supportedDirectives.length > 0) {
      console.error(
        `[${directiveName}] Directive can not be used on: ${tagName.toLowerCase()}. ` +
        `Supported directives for <${tagName.toLowerCase()}> are: ${supportedDirectives.join(', ')}`
      );
    } else {
      console.error(
        `[${directiveName}] Directive can not be used on: ${tagName.toLowerCase()}`
      );
    }
  } else {
    // Element type is not supported by any directive
    const supportedTagsList = allSupportedTags.map(t => t.toLowerCase()).join(', ');
    console.error(
      `[${directiveName}] Directive can only be used on: ${supportedTagsList}. ` +
      `Found: ${tagName.toLowerCase()}`
    );
  }
  
  return false;
}

