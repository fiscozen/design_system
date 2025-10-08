/**
 * Style Dictionary Build Script
 * 
 * Transforms design tokens from tokens.json into consumable formats:
 * - CSS variables (output/global.css)
 * - JSON array (output/global.json)
 * 
 * This script orchestrates the entire token transformation pipeline using
 * Style Dictionary with custom formatters and transformers tailored to
 * our design system needs.
 */

const StyleDictionaryPackage = require('style-dictionary');
const {createArray, appendAdditionalCSSFiles} = require('./fns');
const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Additional CSS files to append to the generated output.
 * These files contain static styles (typography, components) that complement
 * the dynamic CSS variables generated from design tokens.
 */
const ADDITIONAL_CSS_FILES = [
    'typography.css',
    // Add more CSS files here as needed
    // 'components.css',
    // 'utilities.css',
];

// ============================================================================
// CUSTOM STYLE DICTIONARY FORMATTERS
// ============================================================================

/**
 * Custom CSS Variables Formatter
 * 
 * Extends Style Dictionary's default css/variables formatter to include
 * default color values for improved DX and backward compatibility.
 * 
 * Why add default color values?
 * - Allows usage like `var(--blue)` instead of always requiring `var(--blue-500)`
 * - Provides sensible defaults (500 for base colors, 200 for semantic)
 * - Maintains consistency with v-color directive defaults
 * - Simplifies migration from older design system versions
 * 
 * Generated CSS includes:
 * - All token CSS variables (--blue-500, --semantic-error-200, etc.)
 * - Default aliases (--blue → --blue-500, --semantic-error → --semantic-error-200)
 */
StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {
    const cssVars = dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n');
    
    const defaultColorVars = [];
    
    // Base colors default to weight 500
    SAFE_COLOR_NAMES.forEach(colorName => {
      if (colorName !== 'core') {
        const color500Prop = dictionary.allProperties.find(
          prop => prop.path && prop.path.join('-') === `${colorName}-500`
        );
        if (color500Prop) {
          defaultColorVars.push(`  --${colorName}: ${color500Prop.value};`);
        }
      }
    });
    
    // Semantic colors default to weight 200
    SEMANTIC_COLOR_NAMES.forEach(semanticType => {
      const semanticColor200Prop = dictionary.allProperties.find(
        prop => prop.path && prop.path.join('-') === `semantic-${semanticType}-200`
      );
      if (semanticColor200Prop) {
        defaultColorVars.push(`  --semantic-${semanticType}: ${semanticColor200Prop.value};`);
      }
    });
    
    const allVars = defaultColorVars.length > 0 
      ? `${cssVars}\n\n  /* Default color values */\n${defaultColorVars.join('\n')}`
      : cssVars;
    
    return `${this.selector} {\n${allVars}\n}`
  }
});

// ============================================================================
// CUSTOM STYLE DICTIONARY TRANSFORMERS
// ============================================================================

/**
 * Pixel Unit Transformer
 * 
 * Converts unitless numeric token values to pixel units for CSS compatibility.
 * 
 * Why this is needed:
 * Design tokens in Figma/tokens.json are often stored as raw numbers (e.g., 16)
 * for flexibility, but CSS requires explicit units (e.g., 16px). This transformer
 * automatically appends 'px' to specific token categories.
 * 
 * Applied to: fontSizes, spacing, borderRadius, borderWidth, sizing
 * Not applied to: unitless values like lineHeight ratios, z-index, etc.
 */
StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function(prop) {
        return ["fontSizes", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
    },
    transformer: function(prop) {
        return parseFloat(prop.original.value) + 'px';
    }
});

// ============================================================================
// STYLE DICTIONARY CONFIGURATION
// ============================================================================

/**
 * Generates Style Dictionary configuration for a theme.
 * 
 * Configuration strategy:
 * - Source: tokens/{theme}.json (output from token-transformer)
 * - Transforms: attribute/cti (categorize), name/cti/kebab (naming), sizes/px (units)
 * - Outputs: JSON array for programmatic use, CSS variables for browser consumption
 * 
 * @param {string} theme - Theme name (e.g., 'global', 'dark', 'brand-a')
 * @returns {Object} Style Dictionary configuration object
 */
function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `tokens/${theme}.json`,
    ],
    "format": {
      createArray
    },
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": `output/`,
        "files": [{
          "destination": `${theme}.json`,
          "format": "createArray"
        }, {
          "destination": `${theme}.css`,
          "format": "css/variables",
          "selector": `.${theme}-theme`
        }]
      }
    }
  };
}

// ============================================================================
// BUILD EXECUTION
// ============================================================================

console.log('Build started...');

/**
 * Process each theme through the Style Dictionary pipeline.
 * 
 * Currently processing: ['global']
 * 
 * Multi-theme support is ready for future expansion:
 * - Add theme names to the array (e.g., ['global', 'dark', 'brand-a'])
 * - Each theme will generate its own output files
 * - Theme CSS can be swapped at runtime by changing the theme class
 * 
 * Build pipeline per theme:
 * 1. Extend Style Dictionary with theme config
 * 2. Build platform (generates JSON + CSS with tokens)
 * 3. Append additional CSS files (typography, etc.)
 */
['global'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');

    const cssOutputPath = path.join(__dirname, 'output', `${theme}.css`);
    const srcDirectory = path.join(__dirname, 'src');
    
    appendAdditionalCSSFiles(cssOutputPath, srcDirectory, ADDITIONAL_CSS_FILES);

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');