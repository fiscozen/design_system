const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');

function deepen(obj) {
    const result = {};
  
    // For each object path (property key) in the object
    for (const objectPath in obj) {
      // Split path into component parts
      const parts = objectPath.split('.');
  
      // Create sub-objects along path as needed
      let target = result;
      while (parts.length > 1) {
        const part = parts.shift();
        target = target[part] = target[part] || {};
      }
  
      // Set value at end of path
      target[parts[0]] = obj[objectPath]
    }
  
    return result;
  }
  
  function createArray({ dictionary, platform }) {
    const arr = dictionary.allTokens;
    return JSON.stringify(arr);
  }
  
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

function appendAdditionalCSSFiles(cssOutputPath, srcDirectory, additionalCSSFiles) {
  const fs = require('fs');
  const path = require('path');
  
  // Read the base generated CSS
  let generatedCSS = fs.readFileSync(cssOutputPath, 'utf8');
  
  // Process each additional CSS file
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
  
  // Write the combined CSS back to the output file
  fs.writeFileSync(cssOutputPath, generatedCSS);
  
  return generatedCSS;
}

/**
 * Genera automaticamente la safelist di Tailwind per tutti i colori
 * @param {Object} colors - Oggetto dei colori filtrati da filterTokensByType
 * @returns {Array<string>} Array di classi da includere nella safelist
 */
function generateColorSafelist(colors) {
  const patterns = [];
  
  // Funzione ricorsiva per ottenere tutti i nomi dei colori
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
  
  // Genera pattern per text, background e border
  colorNames.forEach(colorName => {
    patterns.push(`text-${colorName}`);
    patterns.push(`bg-${colorName}`);
    patterns.push(`border-${colorName}`);
    patterns.push(`hover:text-${colorName}`);
    patterns.push(`hover:bg-${colorName}`);
    patterns.push(`hover:border-${colorName}`);
  });
  
  // Aggiungi le classi di default senza peso (text-blue, text-pink, etc.)
  // Questi useranno il peso 500 di default (definito in tailwind.config.js)
  SAFE_COLOR_NAMES.forEach(colorName => {
    // Salta 'core' perché non ha pesi numerici
    if (colorName !== 'core') {
      patterns.push(`text-${colorName}`);
      patterns.push(`bg-${colorName}`);
      patterns.push(`border-${colorName}`);
      patterns.push(`hover:text-${colorName}`);
      patterns.push(`hover:bg-${colorName}`);
      patterns.push(`hover:border-${colorName}`);
    }
  });
  
  // Aggiungi i colori semantici con le loro varianti (semantic-error-200, etc.)
  // Solo per i colori specificati in safe-semantic-colors.json
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
    
    // Aggiungi anche le classi di default per i colori semantici (text-semantic-error, etc.)
    // Questi useranno il peso 200 di default (definito in tailwind.config.js)
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

module.exports = { 
  createArray, 
  filterTokensByType, 
  buildFontSizesObj, 
  appendAdditionalCSSFiles,
  generateColorSafelist 
};