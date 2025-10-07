const StyleDictionaryPackage = require('style-dictionary');
const {createArray, appendAdditionalCSSFiles} = require('./fns');
const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const ADDITIONAL_CSS_FILES = [
    'typography.css',
    // Add more CSS files here as needed
    // 'components.css',
    // 'utilities.css',
];

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {
    const cssVars = dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n');
    
    // Aggiungi i valori di default per i colori
    const defaultColorVars = [];
    
    // Colori base (peso 500)
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
    
    // Colori semantici (peso 200)
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

StyleDictionaryPackage.registerTransform({
    name: 'sizes/px',
    type: 'value',
    matcher: function(prop) {
        // You can be more specific here if you only want 'em' units for font sizes    
        return ["fontSizes", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
    },
    transformer: function(prop) {
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + 'px';
    }
    });

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

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global'].map(function (theme) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

    StyleDictionary.buildPlatform('web');

    // Append additional CSS files to the generated CSS
    const cssOutputPath = path.join(__dirname, 'output', `${theme}.css`);
    const srcDirectory = path.join(__dirname, 'src');
    
    appendAdditionalCSSFiles(cssOutputPath, srcDirectory, ADDITIONAL_CSS_FILES);

    console.log('\nEnd processing');
})

console.log('\n==============================================');
console.log('\nBuild completed!');