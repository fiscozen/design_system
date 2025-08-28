const plugin = require('tailwindcss/plugin')

/**
 * FzCssContainer Layout Utilities Plugin
 * 
 * Sistema ufficiale di layout CSS per il design system Fiscozen.
 * Tutte le classi hanno il prefisso 'fz-container-' per namespacing.
 */
module.exports = plugin(function({ addUtilities, addComponents }) {

  // ==============================================
  // GRID LAYOUTS - Responsive Grid Systems
  // ==============================================
  
  const gridLayouts = {
    // Grid con colonne fisse
    '.fz-container-grid-1': {
      '@apply grid grid-cols-1': {},
    },
    '.fz-container-grid-2': {
      '@apply grid grid-cols-2': {},
    },
    '.fz-container-grid-3': {
      '@apply grid grid-cols-3': {},
    },
    '.fz-container-grid-4': {
      '@apply grid grid-cols-4': {},
    },
    '.fz-container-grid-5': {
      '@apply grid grid-cols-5': {},
    },
    '.fz-container-grid-6': {
      '@apply grid grid-cols-6': {},
    },
    
    // Grid responsive sistematici: TUTTE le combinazioni (1-6 colonne)
    // Pattern: fz-container-grid-responsive-{mobile}-{tablet}-{desktop}
    // Shortcuts: 
    //  - 1 numero = stesso per tutti i breakpoint
    //  - 2 numeri = mobile-tablet (desktop = tablet)
    //  - 3 numeri = mobile-tablet-desktop (tutti specificati)
    
    // Generate all possible combinations programmatically
    ...(() => {
      const responsive = {}
        
      // 1. Single number shortcuts (same columns across all breakpoints)
      for (let mobile = 1; mobile <= 6; mobile++) {
        responsive[`.fz-container-grid-responsive-${mobile}`] = {
          [`@apply grid grid-cols-${mobile}`]: {},
        }

        // 2. Two number shortcuts (mobile-tablet, desktop = tablet)
        for (let tablet = 1; tablet <= 6; tablet++) {
          responsive[`.fz-container-grid-responsive-${mobile}-${tablet}`] = {
            [`@apply grid grid-cols-${mobile} sm:grid-cols-${tablet}`]: {},
          }
          // 3. Three number combinations (mobile-tablet-desktop)
          for (let desktop = 1; desktop <= 6; desktop++) {
            responsive[`.fz-container-grid-responsive-${mobile}-${tablet}-${desktop}`] = {
              [`@apply grid grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`]: {},
            }
          }
        }
      }
      
      return responsive
    })(),

    // Grid responsive intelligente (default autodetect)
    '.fz-container-grid-responsive': {
      '@apply grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]': {},
    },
    
    // Varianti autodetect con diversi sizing minimi
    '.fz-container-grid-responsive-sm': {
      '@apply grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))]': {},
    },
    '.fz-container-grid-responsive-md': {
      '@apply grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]': {}, // Default
    },
    '.fz-container-grid-responsive-lg': {
      '@apply grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]': {},
    },
    '.fz-container-grid-responsive-xl': {
      '@apply grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]': {},
    },
  }

  // ==============================================
  // STACK LAYOUTS - Flex
  // ==============================================
  
  const stackLayouts = {
    // Stack direzioni base
    '.fz-container-stack-v': {
      '@apply flex flex-col': {},
    },

    // Stack orizzontale
    '.fz-container-stack-h': {
      '@apply flex flex-row': {},
    },

    // Stack verticale inversa
    '.fz-container-stack-vr': {
      '@apply flex flex-col-reverse': {},
    },

    // Stack orizzontale inversa
    '.fz-container-stack-hr': {
      '@apply flex flex-row-reverse': {},
    },
    
    // Stack responsive sistematici: TUTTE le combinazioni direzioni (v/h/vr/hr)
    // Pattern: fz-container-stack-responsive-{mobile}-{tablet}-{desktop}
    // Shortcuts: 
    //  - 1 direzione = stessa per tutti i breakpoint
    //  - 2 direzioni = mobile-tablet (desktop = tablet)
    //  - 3 direzioni = mobile-tablet-desktop (tutti specificati)
    
    // Generate all possible direction combinations programmatically
    ...(() => {
      const responsive = {}
      const directions = ['v', 'h', 'vr', 'hr']
      const directionMap = { v: 'flex-col', h: 'flex-row', vr: 'flex-col-reverse', hr: 'flex-row-reverse' }
      
      // 1. Single direction shortcuts (same direction across all breakpoints)
      for (const mobile of directions) {
        responsive[`.fz-container-stack-responsive-${mobile}`] = {
          [`@apply flex ${directionMap[mobile]}`]: {},
        }

        // 2. Two direction shortcuts (mobile-tablet, desktop = tablet)
        for (const tablet of directions) {
          responsive[`.fz-container-stack-responsive-${mobile}-${tablet}`] = {
            [`@apply flex ${directionMap[mobile]} sm:${directionMap[tablet]}`]: {},
          }

          // 3. Three direction combinations (mobile-tablet-desktop)
          for (const desktop of directions) {
            responsive[`.fz-container-stack-responsive-${mobile}-${tablet}-${desktop}`] = {
              [`@apply flex ${directionMap[mobile]} sm:${directionMap[tablet]} lg:${directionMap[desktop]}`]: {},
            }
          }
        }
      }
      
      return responsive
    })(),
  }

  // ==============================================
  // STACK ALIGNMENT UTILITIES
  // ==============================================
  
  const stackAlignments = {
    // Centering shortcuts (convenience)
    '.fz-container-stack-center': {
      '@apply flex items-center justify-center': {},
    },
    '.fz-container-stack-center-main': {
      '@apply flex justify-center': {},
    },
    '.fz-container-stack-center-cross': {
      '@apply flex items-center': {},
    },
    
    // Main axis alignment (justify-content - positioning)
    '.fz-container-stack-align-main-start': {
      '@apply flex justify-start': {},
    },
    '.fz-container-stack-align-main-center': {
      '@apply flex justify-center': {},
    },
    '.fz-container-stack-align-main-end': {
      '@apply flex justify-end': {},
    },
    
    // Cross axis alignment (align-items - positioning)
    '.fz-container-stack-align-cross-start': {
      '@apply flex items-start': {},
    },
    '.fz-container-stack-align-cross-center': {
      '@apply flex items-center': {},
    },
    '.fz-container-stack-align-cross-end': {
      '@apply flex items-end': {},
    },
    '.fz-container-stack-align-cross-stretch': {
      '@apply flex items-stretch': {},
    },
    
    // Main axis space distribution (justify-content - spacing)
    '.fz-container-stack-space-main-between': {
      '@apply flex justify-between': {},
    },
    '.fz-container-stack-space-main-around': {
      '@apply flex justify-around': {},
    },
    '.fz-container-stack-space-main-evenly': {
      '@apply flex justify-evenly': {},
    },
    
    // Cross axis space distribution (align-content - multi-line spacing)
    '.fz-container-stack-space-cross-between': {
      '@apply flex content-between': {},
    },
    '.fz-container-stack-space-cross-around': {
      '@apply flex content-around': {},
    },
    '.fz-container-stack-space-cross-evenly': {
      '@apply flex content-evenly': {},
    },
    '.fz-container-stack-space-cross-stretch': {
      '@apply flex content-stretch': {},
    },
  }

  // ==============================================
  // SEMANTIC SPACING UTILITIES
  // ==============================================
  
  const semanticSpacing = {
    // Gap semantico
    '.fz-container-gap-none': {
      '@apply gap-0': {},
    },
    '.fz-container-gap-xs': {
      '@apply gap-2': {},
    },
    '.fz-container-gap-sm': {
      '@apply gap-8': {},
    },
    '.fz-container-gap-md': {
      '@apply gap-16': {},
    },
    '.fz-container-gap-lg': {
      '@apply gap-24': {},
    },
    '.fz-container-gap-xl': {
      '@apply gap-32': {},
    },
    '.fz-container-gap-2xl': {
      '@apply gap-48': {},
    },
    
    // Padding semantico
    '.fz-container-padding-none': {
      '@apply p-0': {},
    },
    '.fz-container-padding-xs': {
      '@apply p-2': {},
    },
    '.fz-container-padding-sm': {
      '@apply p-8': {},
    },
    '.fz-container-padding-md': {
      '@apply p-16': {},
    },
    '.fz-container-padding-lg': {
      '@apply p-24': {},
    },
    '.fz-container-padding-xl': {
      '@apply p-32': {},
    },
    '.fz-container-padding-2xl': {
      '@apply p-48': {},
    },

    // Margin semantico
    '.fz-container-margin-none': {
      '@apply m-0': {},
    },
    '.fz-container-margin-xs': {
      '@apply m-2': {},
    },
    '.fz-container-margin-sm': {
      '@apply m-8': {},
    },
    '.fz-container-margin-md': {
      '@apply m-16': {},
    },
    '.fz-container-margin-lg': {
      '@apply m-24': {},
    },
    '.fz-container-margin-xl': {
      '@apply m-32': {},
    },
    '.fz-container-margin-2xl': {
      '@apply m-48': {},
    },
  }

  // Aggiungi tutte le utility
  addUtilities({
    ...gridLayouts,
    ...stackLayouts,
    ...stackAlignments,
    ...semanticSpacing,
  })
})
