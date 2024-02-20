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
  
  module.exports = { createArray, filterTokensByType, buildFontSizesObj };