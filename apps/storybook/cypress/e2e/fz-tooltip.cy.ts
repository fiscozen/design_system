describe('FzTooltip Component', () => {

  // Selectors - centralized for maintainability
  const TOOLTIP_TRIGGER_SELECTOR = '.fz__tooltip [role="button"]'
  const TOOLTIP_CONTENT_SELECTOR = '[role="tooltip"]'

  describe('Basic Rendering', () => {
    it('should render neutral tooltip correctly', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Verify span trigger exists in canvas - specific selector to avoid Storybook spans
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .should('contain.text', 'hover')
        .should('be.visible')
    })

    it('should display tooltip on hover', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Initially tooltip should not be visible (teleported outside canvas)
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'true')
      
      // Hover on trigger span (inside canvas) - must be specific to avoid Storybook spans
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .trigger('mouseover')
      
      // Tooltip should appear (outside canvas, teleported)
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'false')
        .and('be.visible')
        .and('contain.text', 'this is a informative tooltip')
    })

    it('should hide tooltip on mouse leave', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Hover to show tooltip
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .trigger('mouseover')

      // Wait for tooltip to appear
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'false')
        .and('be.visible')
      
      // Mouse leave should hide tooltip
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .trigger('mouseleave')
      
      // Wait for hide delay and verify tooltip is hidden
      cy.wait(200)
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'true')
    })
  })

  describe('Different Status Types', () => {
    const statusTests = [
      { story: 'overlay-fztooltip--informative-tooltip', status: 'informative' },
      { story: 'overlay-fztooltip--positive-tooltip', status: 'positive' },
      { story: 'overlay-fztooltip--alert-tooltip', status: 'alert' },
      { story: 'overlay-fztooltip--error-tooltip', status: 'error' }
    ]

    statusTests.forEach(({ story, status }) => {
      it(`should render ${status} tooltip with correct styling`, () => {
        cy.visitStory(story)
        
        // Find tooltip span and trigger hover (specific selector to avoid Storybook spans)
        cy.getStoryCanvas()
          .find(TOOLTIP_TRIGGER_SELECTOR)
          .first()
          .trigger('mouseover')
        
        // Verify tooltip appears and has correct content (tooltip is teleported)
        cy.get(TOOLTIP_CONTENT_SELECTOR)
          .should('have.attr', 'aria-hidden', 'false')
          .and('be.visible')
          .and('contain.text', `this is a ${status} tooltip`)
      })
    })
  })

  describe('Accessibility (ARIA)', () => {
    it('should have correct trigger ARIA attributes', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Check trigger wrapper has correct attributes
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .should('have.attr', 'tabindex', '0')
        .should('have.attr', 'role', 'button')
    })

    it('should have correct tooltip ARIA attributes when visible', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Hover to show tooltip
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .trigger('mouseover')
      
      // Check tooltip ARIA attributes (tooltip is teleported)
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'role', 'tooltip')
        .should('have.attr', 'aria-hidden', 'false')
    })

    it('should have correct aria-describedby connection', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Hover to show tooltip
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .trigger('mouseover')
      
      // Check aria-describedby connection
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .should('have.attr', 'aria-describedby')  
        .then(($ariaDescribedby) => {
            cy.get(TOOLTIP_CONTENT_SELECTOR)
              .should('have.attr', 'id', $ariaDescribedby)
          })
        
    })
  })

  describe('Keyboard Navigation', () => {
    it('should show tooltip on focus', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Focus on trigger wrapper (has role="button" and tabindex="0")
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .focus()
      
      // Tooltip should appear (teleported outside canvas)
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'false')
        .and('be.visible')
    })

    it('should hide tooltip on blur', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // First show tooltip with focus
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .focus()
      
      // Verify tooltip is visible
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'false')
        .and('be.visible')
      
      // Blur (focus away)
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .blur()
      
      // Tooltip should disappear
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'true')
    })

    it('should hide tooltip on Escape key', () => {
      cy.visitStory('overlay-fztooltip--neutral-tooltip')
      
      // Focus and show tooltip on trigger wrapper
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .focus()
      
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'false')
        .and('be.visible')
      
      // Press Escape key on trigger wrapper
      cy.getStoryCanvas()
        .find(TOOLTIP_TRIGGER_SELECTOR)
        .type('{esc}')
      
      // Tooltip should hide
      cy.get(TOOLTIP_CONTENT_SELECTOR)
        .should('have.attr', 'aria-hidden', 'true')
    })
  })
})
