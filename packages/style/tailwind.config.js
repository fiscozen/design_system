/**
 * Tailwind CSS Configuration
 * 
 * Integrates design tokens from Style Dictionary with Tailwind's utility class system.
 * This configuration bridges our token-based design system with Tailwind's build process,
 * ensuring design consistency across all utility classes.
 */

const globals = require('./output/global.json');
const { filterTokensByType, buildFontSizesObj, generateColorSafelist } = require("./fns");
const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');
const plugin = require("tailwindcss/plugin");

// ============================================================================
// TOKEN EXTRACTION
// ============================================================================

/**
 * Extract and transform design tokens into Tailwind-compatible formats.
 * 
 * filterTokensByType wraps values in var() for runtime theming,
 * except for screens which use raw values for @media queries.
 */
const colors = filterTokensByType('color', globals);
const allSpacing = filterTokensByType('spacing', globals);
const spacing = allSpacing.spacing;
const fontSize = buildFontSizesObj(globals);
const borderWidth = filterTokensByType('borderWidth', globals)['border'];
const borderRadius = filterTokensByType('borderRadius', globals)['rounded'];
borderRadius.DEFAULT = borderRadius.base
const screens = filterTokensByType('sizing', globals, true)['breakpoint'];

// ============================================================================
// COLOR CONFIGURATION
// ============================================================================

/**
 * Adds default color values to enable usage without explicit weights.
 * 
 * Strategy:
 * - Base colors: DEFAULT → weight 500 (e.g., text-blue → text-blue-500)
 * - Semantic colors: DEFAULT → weight 200 (e.g., text-semantic-error → text-semantic-error-200)
 * 
 * Why flatten semantic colors?
 * Tokens are nested as colors.semantic.error.200, but Tailwind expects
 * colors['semantic-error']['200'] for the class semantic-error-200 to work.
 * This flattening makes semantic colors consistent with base colors.
 */
SAFE_COLOR_NAMES.forEach(colorName => {
  if (colorName !== 'core' && colors[colorName] && colors[colorName]['500']) {
    colors[colorName].DEFAULT = colors[colorName]['500'];
  }
});

// Flatten semantic colors from nested structure and add defaults
if (colors.semantic) {
  SEMANTIC_COLOR_NAMES.forEach(semanticType => {
    if (colors.semantic[semanticType] && colors.semantic[semanticType]['200']) {
      const fullColorName = `semantic-${semanticType}`;
      if (!colors[fullColorName]) {
        colors[fullColorName] = {};
      }
      
      Object.keys(colors.semantic[semanticType]).forEach(weight => {
        colors[fullColorName][weight] = colors.semantic[semanticType][weight];
      });
      
      colors[fullColorName].DEFAULT = colors.semantic[semanticType]['200'];
    }
  });
}

// ============================================================================
// TAILWIND CONFIGURATION
// ============================================================================

module.exports = {
    /**
     * Safelist: Classes to always generate, even if not found in content scan.
     * 
     * Why safelist these classes?
     * 1. Semantic spacing: Used programmatically in components
     * 2. Color utilities: Applied via Vue directives (v-color), invisible to JIT scanner
     * 
     * See generateColorSafelist() in fns.js for color class generation logic.
     */
    safelist: [
      'gap-main-content-sm',
      'gap-main-content-base', 
      'gap-main-content-lg',
      'gap-section-content-sm',
      'gap-section-content-base',
      'gap-section-content-lg',
      ...generateColorSafelist(colors)
    ],
    theme: {
      fontSize,
      spacing,
      borderWidth,
      borderRadius,
      screens,
      extend: {
        /**
         * Extended spacing includes semantic spacing tokens.
         * 
         * Tokens like main-content.sm → gap-main-content-sm utility class.
         * This provides semantic spacing for component layouts.
         */
        spacing: {
          ...spacing,
          ...allSpacing['main-content'] && Object.fromEntries(
            Object.entries(allSpacing['main-content']).map(([key, value]) => [`main-content-${key}`, value])
          ),
          ...allSpacing['section-content'] && Object.fromEntries(
            Object.entries(allSpacing['section-content']).map(([key, value]) => [`section-content-${key}`, value])
          )
        },
        colors,
        zIndex: {
            '60': '60',
            '70': '70',
            '80': '80'
        }
      }
    },
    variants: {},
    plugins: [
        /**
         * Dynamic Viewport Height (dvh) Polyfill Plugin
         * 
         * Provides fallback for browsers not supporting the dvh unit.
         * The dvh unit accounts for mobile browser UI (address bar, etc.),
         * unlike vh which can cause layout issues when the UI shows/hides.
         * 
         * Fallback strategy: Uses CSS custom property --innerHeight set via JS
         * for mobile browsers lacking dvh support (mainly older iOS Safari).
         */
        plugin(function ({ addUtilities }) {
            addUtilities({
                '@supports not (height: 100dvh)': {
                    '.h-dvh': { height: 'var(--innerHeight, 100vh)' },
                    '.min-h-dvh': { 'min-height': 'var(--innerHeight, 100vh)' },
                    '.max-h-dvh': { 'max-height': 'var(--innerHeight, 100vh)' },
                }
            })
        })
    ],
}
