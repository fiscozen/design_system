const globals = require('./output/global.json');
const { filterTokensByType, buildFontSizesObj } = require("./fns");

const colors = filterTokensByType('color', globals);
const spacing = filterTokensByType('spacing', globals).spacing;
const fontSize = buildFontSizesObj(globals);
const borderWidth = filterTokensByType('borderWidth', globals)['border-width'];
const borderRadius = filterTokensByType('borderRadius', globals)['border-radius'];
const screens = filterTokensByType('sizing', globals, true)['breakpoint'];

module.exports = {
    theme: {
      colors,
      fontSize,
      spacing,
      borderWidth,
      borderRadius,
      screens,
      extend: {
        spacing,
      }
    },
    variants: {},
    plugins: [],
}
