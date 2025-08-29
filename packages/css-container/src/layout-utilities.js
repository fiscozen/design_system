const plugin = require('tailwindcss/plugin')

/**
 * FzCssContainer Layout Utilities Plugin
 * 
 * Sistema ufficiale di layout CSS per il design system Fiscozen.
 * Tutte le classi hanno il prefisso 'fz-container-' per namespacing.
 */

// ==============================================
// CONFIGURAZIONE SISTEMA
// ==============================================
//
// 🎛️ PERSONALIZZA IL SISTEMA MODIFICANDO QUESTE COSTANTI:
//
// - BREAKPOINTS: Cambia i breakpoint responsive (mobile/tablet/desktop)
// - GRID.MAX_COLUMNS: Cambia il numero massimo di colonne supportate
// - AUTODETECT: Cambia i valori minimi per le grid autodetect
// - STACK: Aggiungi nuove direzioni stack o modifica le esistenti
//
// ==============================================

const CONFIG = {
  // Breakpoints Tailwind (responsive)
  BREAKPOINTS: {
    mobile: '',           // Default (no prefix)
    tablet: 'sm:',        // ≥640px
    desktop: 'lg:',       // ≥1024px
  },
  
  // Colonne supportate per grid responsive
  GRID: {
    MAX_COLUMNS: 6,       // Numero massimo di colonne (1-6)
  },
  
  // Valori minimi per grid autodetect
  AUTODETECT: {
    sm: '150px',          // Molti elementi piccoli
    md: '200px',          // Default bilanciato
    lg: '250px',          // Contenuto più ricco
    xl: '300px',          // Widgets larghi
  },
  
  // Direzioni stack supportate
  STACK: {
    DIRECTIONS: ['v', 'h', 'vr', 'hr'],
    DIRECTION_MAP: {
      v: 'flex-col',
      h: 'flex-row', 
      vr: 'flex-col-reverse',
      hr: 'flex-row-reverse'
    }
  }
}

module.exports = plugin(function({ addUtilities, addComponents }) {

  // ==============================================
  // GRID LAYOUTS - Responsive Grid Systems
  // ==============================================
  
  const gridLayouts = {
    // Grid con colonne fisse
    ...(() => {
      const fixed = {}
      for (let cols = 1; cols <= CONFIG.GRID.MAX_COLUMNS; cols++) {
        fixed[`.fz-container-grid-${cols}`] = {
          [`@apply grid grid-cols-${cols}`]: {},
        }
      }
      return fixed
    })(),
    
    // Grid responsive (1/CONFIG.GRID.MAX_COLUMNS colonne)
    // Pattern: fz-container-grid-responsive-{mobile}-{tablet}-{desktop}
    // Shortcuts: 
    //  - 1 numero = stesso per tutti i breakpoint
    //  - 2 numeri = mobile-tablet (desktop = tablet)
    //  - 3 numeri = mobile-tablet-desktop (tutti specificati)
    
    // Generate all possible combinations programmatically
    ...(() => {
      const responsive = {}
      const { mobile, tablet, desktop } = CONFIG.BREAKPOINTS
      const maxCols = CONFIG.GRID.MAX_COLUMNS
        
      // 1. Single number shortcuts (same columns across all breakpoints)
      for (let mobileCol = 1; mobileCol <= maxCols; mobileCol++) {
        responsive[`.fz-container-grid-responsive-${mobileCol}`] = {
          [`@apply grid ${mobile}grid-cols-${mobileCol}`]: {},
        }

        // 2. Two number shortcuts (mobile-tablet, desktop = tablet)
        for (let tabletCol = 1; tabletCol <= maxCols; tabletCol++) {
          responsive[`.fz-container-grid-responsive-${mobileCol}-${tabletCol}`] = {
            [`@apply grid grid-cols-${mobileCol} ${tablet}grid-cols-${tabletCol}`]: {},
          }
          // 3. Three number combinations (mobile-tablet-desktop)
          for (let desktopCol = 1; desktopCol <= maxCols; desktopCol++) {
            responsive[`.fz-container-grid-responsive-${mobileCol}-${tabletCol}-${desktopCol}`] = {
              [`@apply grid grid-cols-${mobileCol} ${tablet}grid-cols-${tabletCol} ${desktop}grid-cols-${desktopCol}`]: {},
            }
          }
        }
      }
      
      return responsive
    })(),

    // Grid responsive autodetect 
    '.fz-container-grid-responsive': {
      [`@apply grid grid-cols-[repeat(auto-fit,minmax(${CONFIG.AUTODETECT.md},1fr))]`]: {},
    },
    
    // Varianti autodetect con diversi sizing minimi
    ...(() => {
      const autodetect = {}
      Object.entries(CONFIG.AUTODETECT).forEach(([size, minWidth]) => {
        autodetect[`.fz-container-grid-responsive-${size}`] = {
          [`@apply grid grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`]: {},
        }
      })
      return autodetect
    })(),
  }

  // ==============================================
  // STACK LAYOUTS - Flex
  // ==============================================
  
  const stackLayouts = {
    // Stack direzioni base
    ...(() => {
      const base = {}
      CONFIG.STACK.DIRECTIONS.forEach(direction => {
        const flexClass = CONFIG.STACK.DIRECTION_MAP[direction]
        base[`.fz-container-stack-${direction}`] = {
          [`@apply flex ${flexClass}`]: {},
        }
      })
      return base
    })(),
    
    // Stack responsive (v/h/vr/hr)
    // Pattern: fz-container-stack-responsive-{mobile}-{tablet}-{desktop}
    // Shortcuts: 
    //  - 1 direzione = stessa per tutti i breakpoint
    //  - 2 direzioni = mobile-tablet (desktop = tablet)
    //  - 3 direzioni = mobile-tablet-desktop (tutti specificati)
    
    // Generate all possible direction combinations programmatically
    ...(() => {
      const responsive = {}
      const directions = CONFIG.STACK.DIRECTIONS
      const directionMap = CONFIG.STACK.DIRECTION_MAP
      const { mobile, tablet, desktop } = CONFIG.BREAKPOINTS
      
      // 1. Single direction shortcuts (same direction across all breakpoints)
      for (const mobileDir of directions) {
        responsive[`.fz-container-stack-responsive-${mobileDir}`] = {
          [`@apply flex ${directionMap[mobileDir]}`]: {},
        }

        // 2. Two direction shortcuts (mobile-tablet, desktop = tablet)
        for (const tabletDir of directions) {
          responsive[`.fz-container-stack-responsive-${mobileDir}-${tabletDir}`] = {
            [`@apply flex ${directionMap[mobileDir]} ${tablet}${directionMap[tabletDir]}`]: {},
          }

          // 3. Three direction combinations (mobile-tablet-desktop)
          for (const desktopDir of directions) {
            responsive[`.fz-container-stack-responsive-${mobileDir}-${tabletDir}-${desktopDir}`] = {
              [`@apply flex ${directionMap[mobileDir]} ${tablet}${directionMap[tabletDir]} ${desktop}${directionMap[desktopDir]}`]: {},
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
