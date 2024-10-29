const globals = require('./output/global.json');
const { filterTokensByType, buildFontSizesObj } = require("./fns");
const plugin = require("tailwindcss/plugin");

const colors = filterTokensByType('color', globals);
const spacing = filterTokensByType('spacing', globals).spacing;
const fontSize = buildFontSizesObj(globals);
const borderWidth = filterTokensByType('borderWidth', globals)['border'];
const borderRadius = filterTokensByType('borderRadius', globals)['rounded'];
borderRadius.DEFAULT = borderRadius.base
const screens = filterTokensByType('sizing', globals, true)['breakpoint'];

module.exports = {
    theme: {
      fontSize,
      spacing,
      borderWidth,
      borderRadius,
      screens,
      extend: {
        spacing,
        colors,
      }
    },
    variants: {},
    plugins: [
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
