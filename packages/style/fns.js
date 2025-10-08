// ============================================================================
// IMPORTS & CONSTANTS
// ============================================================================

const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');

// ============================================================================
// TOKEN TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Converts flat dot-notation object to nested object structure.
 * 
 * This is necessary because Style Dictionary outputs tokens in a flat format
 * (e.g., "color.blue.500": "#value") but Tailwind expects a nested structure
 * (e.g., { color: { blue: { 500: "#value" } } }).
 * 
 * @example
 * Input:  { "color.blue.500": "#5a6eff", "color.blue.600": "#4654cc" }
 * Output: { color: { blue: { 500: "#5a6eff", 600: "#4654cc" } } }
 * 
 * @param {Object} obj - Flat object with dot-notation keys
 * @returns {Object} Nested object structure
 */
function deepen(obj) {
    const result = {};
  
    for (const objectPath in obj) {
      const parts = objectPath.split('.');
  
      let target = result;
      while (parts.length > 1) {
        const part = parts.shift();
        target = target[part] = target[part] || {};
      }
  
      target[parts[0]] = obj[objectPath]
    }
  
    return result;
  }
  
/**
 * Style Dictionary custom formatter that returns tokens as JSON array.
 * 
 * Used by build.js to generate the global.json output file containing
 * all design tokens in array format for consumption by other tools.
 * 
 * @param {Object} params - Style Dictionary formatter parameters
 * @param {Object} params.dictionary - Token dictionary
 * @param {Object} params.platform - Platform configuration
 * @returns {string} JSON stringified array of all tokens
 */
function createArray({ dictionary, platform }) {
    const arr = dictionary.allTokens;
    return JSON.stringify(arr);
}

/**
 * Filters and transforms tokens by type for Tailwind configuration.
 * 
 * This function serves two purposes:
 * 1. Extracts only tokens of a specific type (color, spacing, etc.)
 * 2. Optionally wraps values in CSS var() for runtime theming
 * 
 * The CSS var() approach allows theme switching without rebuilding CSS,
 * as Tailwind classes reference CSS variables that can be updated at runtime.
 * 
 * @param {string} type - Token type to filter (e.g., 'color', 'spacing')
 * @param {Array} tokens - Array of all design tokens
 * @param {boolean} noVars - If true, return raw values instead of CSS var() references
 * @returns {Object} Nested object structure ready for Tailwind config
 */
function filterTokensByType(type, tokens, noVars) {
    const obj = tokens.reduce((acc, cur) => {
      if (cur.type === type) {
        acc[cur.path.join(".")] = noVars ? cur.value : `var(--${cur.name}, ${cur.value})`
      }
      return acc
    }, {})
  
    const deep = deepen(obj)
    return deep
}
  
/**
 * Builds Tailwind-compatible fontSize configuration with line heights.
 * 
 * Tailwind expects fontSize to be either a string or a tuple [size, config].
 * This function pairs fontSize tokens with their corresponding lineHeight tokens
 * based on matching type attributes, creating the tuple format when available.
 * 
 * @example
 * Input tokens:
 *   { type: 'fontSizes', attributes: { type: 'base' }, value: '16px' }
 *   { type: 'lineHeights', attributes: { type: 'base' }, value: '24px' }
 * 
 * Output: { base: ['16px', { lineHeight: '24px' }] }
 * 
 * @param {Array} tokens - Array of all design tokens
 * @returns {Object} Tailwind fontSize configuration object
 */
function buildFontSizesObj(tokens) {
  const fontSizes = tokens.reduce((acc, curr, index, arr) => {
    if (curr.type === 'fontSizes') {
      const lineHeight = arr.find((el) => el.type === 'lineHeights' && el.attributes.type === curr.attributes.type);
      acc[curr.attributes.type] = lineHeight ? [curr.value, {lineHeight: lineHeight.value}] : [curr.value];
    }
    return acc;
  }, {});
  return fontSizes;
}

// ============================================================================
// BUILD UTILITIES
// ============================================================================

/**
 * Appends additional CSS files to the Style Dictionary generated output.
 * 
 * Style Dictionary generates CSS variables from tokens, but we also need to include
 * static CSS for typography, components, and utilities. This function concatenates
 * these additional files to the generated output, creating a single distributable CSS file.
 * 
 * Why not use @import?
 * - Single file = fewer HTTP requests
 * - Easier distribution via npm
 * - Build-time concatenation is faster than runtime @import
 * 
 * @param {string} cssOutputPath - Path to the generated CSS file to append to
 * @param {string} srcDirectory - Directory containing additional CSS files
 * @param {Array<string>} additionalCSSFiles - List of CSS filenames to append
 * @returns {string} Combined CSS content
 */
function appendAdditionalCSSFiles(cssOutputPath, srcDirectory, additionalCSSFiles) {
  const fs = require('fs');
  const path = require('path');
  
  let generatedCSS = fs.readFileSync(cssOutputPath, 'utf8');
  
  additionalCSSFiles.forEach(filename => {
    const filePath = path.join(srcDirectory, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`\nAppending ${filename}...`);
      
      const fileCSS = fs.readFileSync(filePath, 'utf8');
      generatedCSS += '\n\n' + fileCSS;
      
      console.log(`${filename} appended successfully`);
    } else {
      console.log(`${filename} not found, skipping...`);
    }
  });
  
  fs.writeFileSync(cssOutputPath, generatedCSS);
  
  return generatedCSS;
}

// ============================================================================
// TAILWIND SAFELIST GENERATION
// ============================================================================

/**
 * Generates Tailwind safelist entries for all design system colors.
 * 
 * Why is this needed?
 * Tailwind's JIT mode only generates classes found in scanned files. Classes applied
 * via Vue directives (v-color:blue="500") or generated dynamically are not detected,
 * so they won't be included in the final CSS unless explicitly safelisted.
 * 
 * This function generates all color utility classes (text-*, bg-*, border-*, hover:*)
 * for every color variant defined in tokens.json, ensuring they're always available.
 * 
 * Strategy:
 * 1. Generate classes for all color variants (blue-500, semantic-error-200, etc.)
 * 2. Generate default weight classes (blue → blue-500, semantic-error → semantic-error-200)
 * 3. Filter to only include colors listed in safe-colors.json and safe-semantic-colors.json
 * 
 * @param {Object} colors - Nested color object from filterTokensByType
 * @returns {Array<string>} Array of class names to safelist
 */
function generateColorSafelist(colors) {
  const patterns = [];
  
  /**
   * Recursively extracts all color variant names from nested color object.
   * @example { blue: { 500: '#...', 600: '#...' } } → ['blue-500', 'blue-600']
   */
  function getColorNames(obj, prefix = '') {
    const names = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}-${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !obj[key].hasOwnProperty('value')) {
        names.push(...getColorNames(obj[key], fullKey));
      } else {
        names.push(fullKey);
      }
    }
    return names;
  }
  
  const colorNames = getColorNames(colors).filter(name => 
    SAFE_COLOR_NAMES.some(safe => name.startsWith(safe))
  );
  
  colorNames.forEach(colorName => {
    patterns.push(`text-${colorName}`);
    patterns.push(`bg-${colorName}`);
    patterns.push(`border-${colorName}`);
    patterns.push(`hover:text-${colorName}`);
    patterns.push(`hover:bg-${colorName}`);
    patterns.push(`hover:border-${colorName}`);
  });
  
  // Add default weight classes (e.g., text-blue uses weight 500 by default)
  SAFE_COLOR_NAMES.forEach(colorName => {
    if (colorName !== 'core') {
      patterns.push(`text-${colorName}`);
      patterns.push(`bg-${colorName}`);
      patterns.push(`border-${colorName}`);
      patterns.push(`hover:text-${colorName}`);
      patterns.push(`hover:bg-${colorName}`);
      patterns.push(`hover:border-${colorName}`);
    }
  });
  
  // Add semantic color variants (semantic-error-200, etc.)
  if (colors.semantic) {
    SEMANTIC_COLOR_NAMES.forEach(semanticType => {
      const semanticObj = colors.semantic[semanticType];
      if (semanticObj && typeof semanticObj === 'object') {
        Object.keys(semanticObj).forEach(weight => {
          const fullColorName = `semantic-${semanticType}-${weight}`;
          patterns.push(`text-${fullColorName}`);
          patterns.push(`bg-${fullColorName}`);
          patterns.push(`border-${fullColorName}`);
          patterns.push(`hover:text-${fullColorName}`);
          patterns.push(`hover:bg-${fullColorName}`);
          patterns.push(`hover:border-${fullColorName}`);
        });
      }
    });
    
    // Add default semantic color classes (e.g., text-semantic-error uses weight 200)
    SEMANTIC_COLOR_NAMES.forEach(semanticType => {
      const fullColorName = `semantic-${semanticType}`;
      patterns.push(`text-${fullColorName}`);
      patterns.push(`bg-${fullColorName}`);
      patterns.push(`border-${fullColorName}`);
      patterns.push(`hover:text-${fullColorName}`);
      patterns.push(`hover:bg-${fullColorName}`);
      patterns.push(`hover:border-${fullColorName}`);
    });
  }
  
  return patterns;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = { 
  createArray, 
  filterTokensByType, 
  buildFontSizesObj, 
  appendAdditionalCSSFiles,
  generateColorSafelist 
};