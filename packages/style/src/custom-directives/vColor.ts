import type { DirectiveBinding, ObjectDirective } from 'vue';

import tokens from "../../tokens.json";
import safeColorsConfig from "../../safe-colors.json";
import safeSemanticColorsConfig from "../../safe-semantic-colors.json";
import { validateElement } from './validation';
import { DIRECTIVE_VALIDATION_CONFIG } from './config';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

/**
 * Centralized color name lists used across the design system.
 * 
 * These are stored in JSON files (not TypeScript) to ensure they can be consumed
 * by both CommonJS build scripts (build.js, fns.js) and TypeScript source files,
 * avoiding module system conflicts during the build process.
 * 
 * @see safe-colors.json - Base color names (blue, purple, orange, etc.)
 * @see safe-semantic-colors.json - Semantic color types (error, warning, success, info)
 */
const SAFE_COLOR_NAMES = safeColorsConfig.safeColorNames as readonly string[];
const SEMANTIC_COLOR_NAMES = safeSemanticColorsConfig.semanticColorNames as readonly string[];

// ============================================================================
// COLOR INITIALIZATION
// ============================================================================

/**
 * Color registry built from tokens.json at module initialization.
 * 
 * Structure: { colorName: { weight: hexValue } }
 * Examples:
 *   - Base colors: colors['blue']['500'] = '#5a6eff'
 *   - Semantic colors: colors['semantic-error']['200'] = '#f04242'
 *   - Core colors: colors['core']['black'] = '#000000'
 * 
 * Semantic colors are flattened from tokens.global.semantic.error to 
 * colors['semantic-error'] to match the directive's expected naming convention
 * (v-color:semantic-error).
 */
const colors: Record<string, Record<string, string>> = {};

SAFE_COLOR_NAMES.forEach((color) => {
  const colorObj = (tokens.global as any)[color];
  
  if (!colorObj) return;

  Object.keys(colorObj).forEach((weight) => {
    const colorValue = (colorObj as Record<string, { value: string }>)[weight]?.value;
    
    if (colorValue) {
      if (!colors[color]) {
        colors[color] = {};
      }

      colors[color]![weight] = colorValue;
    }
  });
});

/**
 * Flatten semantic colors from tokens.global.semantic.{type} to colors['semantic-{type}'].
 * This allows v-color:semantic-error to work consistently with base colors.
 */
const semanticColors = (tokens.global as any).semantic;
if (semanticColors) {
  SEMANTIC_COLOR_NAMES.forEach((semanticType) => {
    const semanticObj = semanticColors[semanticType];
    if (semanticObj && typeof semanticObj === 'object') {
      Object.keys(semanticObj).forEach((weight) => {
        const colorValue = semanticObj[weight]?.value;
        if (colorValue) {
          const fullColorName = `semantic-${semanticType}`;
          if (!colors[fullColorName]) {
            colors[fullColorName] = {};
          }
          colors[fullColorName]![weight] = colorValue;
        }
      });
    }
  });
}

// ============================================================================
// COLOR DIRECTIVE - Logic & Helpers
// ============================================================================

/**
 * Normalizes and validates color directive parameters.
 * 
 * This function is the core validation logic for v-color, handling:
 * - Color name validation (base colors, semantic colors, core colors)
 * - Weight/value normalization (default weights vs explicit values)
 * - Special case handling (false for removal, core color naming)
 * - Comprehensive error reporting for invalid inputs
 * 
 * Default weight rules:
 * - Base colors (blue, purple, etc.): 500
 * - Semantic colors (semantic-error, etc.): 200
 * - Core colors: 'black' (core uses named values, not numeric weights)
 * 
 * @param colorName - Color identifier from directive arg (e.g., 'blue', 'semantic-error')
 * @param value - Weight specification: number/string for explicit weight, true/undefined for default, false for removal
 * @returns Normalized color data or validation failure indicator
 */
function getDefaultColorAndValue(
  colorName?: string, 
  value?: boolean | string | number
): { colorName?: string, value?: string | number | false, valid: boolean } {
  // Early return for removal case - value:false signals "remove all color classes"
  if (value === false) {
    return { colorName, value: false, valid: true };
  }

  if (!colorName) {
    console.error(`[v-color] Missing color name`);
    return { valid: false };
  }

  const isSafeColor = SAFE_COLOR_NAMES.includes(colorName as typeof SAFE_COLOR_NAMES[number]);
  
  // Semantic colors require additional validation: the semantic type must be in our registry
  // This prevents typos like v-color:semantic-errorr from silently failing
  let isSemanticColor = false;
  if (colorName.startsWith('semantic-')) {
    const semanticType = colorName.replace('semantic-', '');
    isSemanticColor = SEMANTIC_COLOR_NAMES.includes(semanticType as typeof SEMANTIC_COLOR_NAMES[number]);
    
    if (!isSemanticColor) {
      const semanticColorsList = SEMANTIC_COLOR_NAMES.map(name => `semantic-${name}`).join(', ');
      console.error(
        `[v-color] Invalid semantic color: ${colorName}. ` +
        `Available semantic colors are: ${semanticColorsList}`
      );
      return { valid: false };
    }
  }
  
  if (!isSafeColor && !isSemanticColor) {
    const semanticColorsList = SEMANTIC_COLOR_NAMES.map(name => `semantic-${name}`).join(', ');
    console.error(
      `[v-color] Invalid color name: ${colorName}. ` +
      `Available colors are: ${SAFE_COLOR_NAMES.join(', ')}, ${semanticColorsList}`
    );
    return { valid: false };
  }

  if (!colors[colorName] || typeof colors[colorName] !== 'object') {
    console.error(`[v-color] Color '${colorName}' not found in colors object`);
    return { valid: false };
  }

  const availableWeights = Object.keys(colors[colorName]);
  if (availableWeights.length === 0) {
    console.error(`[v-color] Color '${colorName}' has no available weights`);
    return { valid: false };
  }

  let defaultValue: string | number;

  if (typeof value === 'undefined' || value === true || value === null) {
    if (colorName === 'core') {
      // Core colors use named values (white, black) instead of numeric weights
      defaultValue = 'black';
    } else if (isSemanticColor) {
      defaultValue = '200';
    } else {
      defaultValue = '500';
    }
  } else if (typeof value === 'number') {
    defaultValue = value.toString();
  } else if (typeof value === 'string') {
    defaultValue = value;
  } else {
    console.error(`[v-color:${colorName}] Invalid value type: ${typeof value}`);
    return { valid: false };
  }

  const weightKey = defaultValue.toString();
  const colorValue = colors[colorName]?.[weightKey];
  
  if (!colorValue || typeof colorValue !== "string") {
    console.error(
      `[v-color:${colorName}] Invalid color value: ${defaultValue}. ` +
      `Available values for '${colorName}' are: ${availableWeights.join(', ')}`
    );

    return { valid: false };
  }

  return { colorName, value: defaultValue, valid: true };
}

/**
 * Determines if a class name is a color class that should be removed by v-color.
 * 
 * This function uses a whitelist approach for common Tailwind utilities to avoid
 * accidentally removing non-color text classes (like text-left, text-sm).
 * 
 * Implementation rationale:
 * - Regex patterns would be too broad and remove alignment utilities
 * - Simple string matching on all text patterns could remove size utilities
 * - Dynamic checking against SAFE_COLOR_NAMES ensures we only remove actual color classes
 * 
 * @param className - The class name to check
 * @returns true if the class should be removed, false otherwise
 */
function isColorClassToRemove(className: string): boolean {
  const utilityClasses = ['text-left', 'text-center', 'text-right', 'text-justify', 
                          'text-start', 'text-end', 'text-xs', 'text-sm', 'text-base', 
                          'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 
                          'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];
  
  if (utilityClasses.includes(className)) {
    return false;
  }

  // Check against actual color names to avoid false positives
  for (const colorName of SAFE_COLOR_NAMES) {
    if (className.startsWith(`text-${colorName}-`)) {
      return true;
    }
  }

  for (const semanticType of SEMANTIC_COLOR_NAMES) {
    if (className.startsWith(`text-semantic-${semanticType}-`)) {
      return true;
    }
  }

  return false;
}

/**
 * Applies or removes color classes from an element.
 * 
 * Implementation strategy:
 * 1. Always remove existing color classes first (clean slate approach)
 * 2. Add new class only if not in removal mode (value !== false)
 * 3. Always use explicit weights (text-blue-500, never text-blue) for consistency
 * 
 * @param el - The element to modify
 * @param colorName - Color identifier (e.g., 'blue', 'semantic-error')
 * @param value - Weight value, true for default, false for removal
 */
function updateColorClass(el: HTMLElement, colorName?: string, value?: boolean | string | number): void {
  const { colorName: defaultColorName, value: defaultValue, valid } = getDefaultColorAndValue(colorName, value);

  if (!valid) {
    return;
  }

  // Clean slate: remove all existing color classes before applying new ones
  Array.from(el.classList).forEach((className) => {
    if (isColorClassToRemove(className)) {
      el.classList.remove(className);
    }
  });

  // Exit early if in removal mode
  if (defaultValue === false) {
    return;
  }

  // Apply color class with explicit weight (e.g., text-blue-500, text-semantic-error-200)
  el.classList.add(`text-${defaultColorName}-${defaultValue}`);
}

// ============================================================================
// DIRECTIVE DEFINITION
// ============================================================================

/**
 * v-color Directive
 * 
 * Applies design system text colors to heading and paragraph elements.
 * 
 * @example Basic usage with default weight
 * <p v-color:blue>Text</p>              // Applies text-blue-500
 * <h1 v-color:semantic-error>Error</h1> // Applies text-semantic-error-200
 * 
 * @example Explicit weight
 * <p v-color:blue="300">Text</p>        // Applies text-blue-300
 * 
 * @example Remove color classes
 * <p v-color:blue="false">Text</p>      // Removes all text-color-* classes
 * 
 * Default weights:
 * - Base colors (blue, purple, etc.): 500
 * - Semantic colors (semantic-error, etc.): 200
 * - Core colors: 'black'
 * 
 * Implementation note: Always generates classes with explicit weights 
 * (e.g., text-blue-500) to ensure consistency with Tailwind's safelist
 * and avoid ambiguous class generation.
 */
export const vColor: ObjectDirective<HTMLElement, boolean | string | number> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string | number>) {
    if (validateElement(DIRECTIVE_VALIDATION_CONFIG, el, {
      name: 'v-color',
      ...binding,
    })) {
      updateColorClass(el, binding.arg, binding.value);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string | number>) {
    updateColorClass(el, binding.arg, binding.value);
  }
}

