const plugin = require('tailwindcss/plugin')

/**
 * FzFormContainer Form Container Utilities Plugin
 * 
 * Sistema di classi per container di form con layout responsive e fissi.
 */

// ==============================================
// CONFIGURAZIONE
// ==============================================

const CONFIG = {
  // Breakpoints responsive - usa prefissi Tailwind
  BREAKPOINTS: {
    tablet: 'md:',
    desktop: 'lg:',
  },
  
  // Dimensioni minime delle colonne per breakpoint (solo per layout smart)
  COLUMN_MIN_WIDTH: {
    tablet: '200px',
    desktop: '250px',
  },
  
  // Numero massimo di colonne per breakpoint
  // Limita il numero di colonne per evitare sprecchi di spazio su schermi grandi
  MAX_COLUMNS: {
    tablet: 2,
    desktop: 3,
  },
  
  // Gap (spacing) per breakpoint - usa classi Tailwind
  GAP: {
    mobile: 'gap-2',
    tablet: 'gap-4',
    desktop: 'gap-6',
  }
}

// ==============================================
// PLUGIN
// ==============================================
  
module.exports = plugin(function({ addUtilities }) {
  
  const formContainer = {
    // Layout intelligente principale - responsive auto-fit con limite massimo colonne
    // Formula: minmax(max(min-width, 100%/max-cols), 1fr) 
    // Combina dimensione minima con percentuale massima per limitare le colonne
    '.fz-form-container': {
      [`@apply grid grid-cols-1 ${CONFIG.GAP.mobile} ${CONFIG.BREAKPOINTS.tablet}grid-cols-[repeat(auto-fit,minmax(max(${CONFIG.COLUMN_MIN_WIDTH.tablet},${100/CONFIG.MAX_COLUMNS.tablet}%),1fr))] ${CONFIG.BREAKPOINTS.tablet}${CONFIG.GAP.tablet} ${CONFIG.BREAKPOINTS.desktop}grid-cols-[repeat(auto-fit,minmax(max(${CONFIG.COLUMN_MIN_WIDTH.desktop},${100/CONFIG.MAX_COLUMNS.desktop}%),1fr))] ${CONFIG.BREAKPOINTS.desktop}${CONFIG.GAP.desktop}`]: {},
    },
    
    // Gruppo sempre verticale
    '.fz-form-group-vertical': {
      [`@apply flex flex-col ${CONFIG.GAP.mobile} ${CONFIG.BREAKPOINTS.tablet}${CONFIG.GAP.tablet} ${CONFIG.BREAKPOINTS.desktop}${CONFIG.GAP.desktop}`]: {},
    },
    
    // Gruppo sempre orizzontale
    '.fz-form-group-horizontal': {
      [`@apply flex flex-row ${CONFIG.GAP.mobile} ${CONFIG.BREAKPOINTS.tablet}${CONFIG.GAP.tablet} ${CONFIG.BREAKPOINTS.desktop}${CONFIG.GAP.desktop}`]: {},
    },
    
    // Action buttons - allineati a destra, wrap se necessario, sempre full-width
    '.fz-form-actions': {
      [`@apply flex flex-row flex-wrap justify-end ${CONFIG.GAP.mobile} ${CONFIG.BREAKPOINTS.tablet}${CONFIG.GAP.tablet} ${CONFIG.BREAKPOINTS.desktop}${CONFIG.GAP.desktop}`]: {},
      'grid-column': '1 / -1', // Occupa tutte le colonne del grid parent
    },
    
    // Action buttons inline - si comportano come qualsiasi altro child del grid
    '.fz-form-actions-inline': {
      [`@apply flex flex-row flex-wrap justify-end ${CONFIG.GAP.mobile} ${CONFIG.BREAKPOINTS.tablet}${CONFIG.GAP.tablet} ${CONFIG.BREAKPOINTS.desktop}${CONFIG.GAP.desktop}`]: {},
    },
    
    // Textarea - sempre full-width nel form container (breaker del grid)
    '.fz-form-container .fz-textarea': {
      'grid-column': '1 / -1', // Occupa tutte le colonne del grid parent
    }
  }

  addUtilities(formContainer)
})