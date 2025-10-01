// ***********************************************************
// Component Testing Support File  
// For future Vue component testing capabilities
// ***********************************************************

import './commands'
import { mount } from 'cypress/vue'

// Extend Cypress namespace for component testing
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Add component mounting command
Cypress.Commands.add('mount', mount)

// Global configuration for component tests
beforeEach(() => {
  // Add any global setup here
  // e.g., Vue plugins, global styles, etc.
})

export {}
