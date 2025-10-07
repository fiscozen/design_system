const globals = require('./output/global.json');
const { filterTokensByType, buildFontSizesObj, generateColorSafelist } = require("./fns");
const plugin = require("tailwindcss/plugin");

const colors = filterTokensByType('color', globals);
const allSpacing = filterTokensByType('spacing', globals);
const spacing = allSpacing.spacing;
const fontSize = buildFontSizesObj(globals);
const borderWidth = filterTokensByType('borderWidth', globals)['border'];
const borderRadius = filterTokensByType('borderRadius', globals)['rounded'];
borderRadius.DEFAULT = borderRadius.base
const screens = filterTokensByType('sizing', globals, true)['breakpoint'];

module.exports = {
    // Safelist per includere sempre le utility classes
    safelist: [
      // Spacing semantico
      'gap-main-content-sm',
      'gap-main-content-base', 
      'gap-main-content-lg',
      'gap-section-content-sm',
      'gap-section-content-base',
      'gap-section-content-lg',
      // Genera automaticamente tutte le classi utility per i colori
      // (text-*, bg-*, border-*, hover:*) per ogni colore in tokens.json
      // Vedi fns.js -> generateColorSafelist() per i dettagli
      ...generateColorSafelist(colors)
    ],
    theme: {
      fontSize,
      spacing,
      borderWidth,
      borderRadius,
      screens,
      extend: {
        spacing: {
          ...spacing,
          // Add semantic spacing tokens as utilities
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
