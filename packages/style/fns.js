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

module.exports = { createArray, filterTokensByType, buildFontSizesObj, appendAdditionalCSSFiles };