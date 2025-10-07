const globals = require('./output/global.json');
const { filterTokensByType, buildFontSizesObj, generateColorSafelist } = require("./fns");
const { safeColorNames: SAFE_COLOR_NAMES } = require('./safe-colors.json');
const { semanticColorNames: SEMANTIC_COLOR_NAMES } = require('./safe-semantic-colors.json');
const plugin = require("tailwindcss/plugin");

const colors = filterTokensByType('color', globals);
const allSpacing = filterTokensByType('spacing', globals);
const spacing = allSpacing.spacing;
const fontSize = buildFontSizesObj(globals);
const borderWidth = filterTokensByType('borderWidth', globals)['border'];
const borderRadius = filterTokensByType('borderRadius', globals)['rounded'];
borderRadius.DEFAULT = borderRadius.base
const screens = filterTokensByType('sizing', globals, true)['breakpoint'];

// Aggiungi i valori di default per i colori
// I colori base useranno il peso 500, i colori semantici il peso 200
SAFE_COLOR_NAMES.forEach(colorName => {
  if (colorName !== 'core' && colors[colorName] && colors[colorName]['500']) {
    colors[colorName].DEFAULT = colors[colorName]['500'];
  }
});

// Aggiungi i valori di default per i colori semantici
if (colors.semantic) {
  SEMANTIC_COLOR_NAMES.forEach(semanticType => {
    if (colors.semantic[semanticType] && colors.semantic[semanticType]['200']) {
      const fullColorName = `semantic-${semanticType}`;
      if (!colors[fullColorName]) {
        colors[fullColorName] = {};
      }
      // Copia tutte le varianti
      Object.keys(colors.semantic[semanticType]).forEach(weight => {
        colors[fullColorName][weight] = colors.semantic[semanticType][weight];
      });
      // Aggiungi il DEFAULT
      colors[fullColorName].DEFAULT = colors.semantic[semanticType]['200'];
    }
  });
}

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
