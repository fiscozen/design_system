/// <reference types="cypress" />

// ***********************************************
// Custom Commands for Storybook + Component Testing
// Optimized for FzTooltip and Vue components
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Navigate to a specific Storybook story
       * @param storyId - Story ID in format: component-story--variant
       * @example cy.visitStory('overlay-fztooltip--neutral-tooltip')
       */
      visitStory(storyId: string): Chainable<void>
      
      /**
       * Wait for Storybook to load completely
       */
      waitForStorybook(): Chainable<void>
      
      /**
       * Get story canvas content
       */
      getStoryCanvas(): Chainable<JQuery<HTMLElement>>
    }
  }
}

/**
 * Navigate to a Storybook story by ID
 * Handles iframe navigation and story loading
 */
Cypress.Commands.add('visitStory', (storyId: string) => {
  // Navigate to story in iframe mode (direct story view)
  cy.visit(`/iframe.html?id=${storyId}&viewMode=story`)
  
  // Wait for story to load
  cy.waitForStorybook()
})

/**
 * Wait for Storybook iframe to be fully loaded
 * Ensures story content is ready for interaction
 */
Cypress.Commands.add('waitForStorybook', () => {
  // Wait for basic DOM structure
  cy.get('body').should('exist')
  
  // Wait for any potential loading states to complete
  cy.get('body').should('not.have.class', 'loading')
  
  // Additional wait for story rendering
  cy.wait(500)
})

/**
 * Get story canvas content (for complex story structures)
 * Useful when stories have multiple canvases
 */
Cypress.Commands.add('getStoryCanvas', () => {
  return cy.get('#storybook-root, #root, body').first()
})

export {}