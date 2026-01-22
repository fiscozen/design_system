import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzViewFlag } from '@fiscozen/view-flag'

const meta: Meta<typeof FzViewFlag> = {
  title: 'Overlay/FzViewFlag',
  component: FzViewFlag,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    role: 'Operatore',
    firstName: 'Mario',
    lastName: 'Rossi',
    environment: 'staging.D'
  }
}

export default meta

type Story = StoryObj<typeof meta>

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets the main container element (the bottom banner).
 * Uses .rounded-t-base selector because the ViewFlag component renders
 * its main content banner with rounded top corners to visually distinguish
 * it from the border indicators around the viewport edges.
 */
const getMainContainer = (canvasElement: HTMLElement): HTMLElement => {
  const container = canvasElement.querySelector('.rounded-t-base')
  if (!container) {
    throw new Error('Main container (.rounded-t-base) not found')
  }
  return container as HTMLElement
}

/**
 * Gets all border indicator elements (excludes main container)
 */
const getBorderIndicators = (canvasElement: HTMLElement): HTMLElement[] => {
  const allFixed = canvasElement.querySelectorAll('.bg-semantic-warning.fixed')
  const mainContainer = canvasElement.querySelector('.rounded-t-base')
  // Filter out the main container, keep only border indicators
  return Array.from(allFixed).filter((el) => el !== mainContainer) as HTMLElement[]
}

// ============================================
// BASIC STORIES
// ============================================

export const Primary: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify view flag renders correctly', async () => {
      const mainContainer = getMainContainer(canvasElement)
      await expect(mainContainer).toBeInTheDocument()
      await expect(mainContainer).toBeVisible()
    })
    
    await step('Verify all props are displayed', async () => {
      // Verify environment badge
      await expect(canvas.getByText('staging.D')).toBeInTheDocument()
      
      // Verify role
      await expect(canvas.getByText(/Operatore:/i)).toBeInTheDocument()
      
      // Verify user name (Mario R.)
      await expect(canvas.getByText(/Mario R\./i)).toBeInTheDocument()
    })
    
    await step('Verify border indicators are present', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      // Should have 4 border indicators (top, bottom, left, right)
      await expect(borderIndicators.length).toBeGreaterThanOrEqual(4)
    })
    
    await step('Verify main container positioning', async () => {
      const mainContainer = getMainContainer(canvasElement)
      const computedStyles = window.getComputedStyle(mainContainer)
      
      // Main container should be fixed positioned at bottom
      await expect(computedStyles.position).toBe('fixed')
      
      // Verify it's positioned at bottom
      const rect = mainContainer.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // Should be near bottom (within 100px of bottom)
      const distanceFromBottom = viewportHeight - rect.bottom
      await expect(distanceFromBottom).toBeLessThan(100)
    })
    
    await step('Verify main container is centered horizontally', async () => {
      const mainContainer = getMainContainer(canvasElement)
      const rect = mainContainer.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      
      // Calculate center position
      const centerX = viewportWidth / 2
      const containerCenterX = rect.left + rect.width / 2
      
      // Should be centered (within 50px tolerance)
      const centerDistance = Math.abs(containerCenterX - centerX)
      await expect(centerDistance).toBeLessThan(50)
    })
  }
}

export const WithSlot: Story = {
  args: {},
  render: () => ({
    components: { FzViewFlag },
    template: `
      <FzViewFlag>
        <template #default>
          <div class="flex flex-col gap-8">
            <div>Slot content</div>
            <div>Slot content2</div>
          </div>
        </template>
      </FzViewFlag>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify view flag renders with slot content', async () => {
      const mainContainer = getMainContainer(canvasElement)
      await expect(mainContainer).toBeInTheDocument()
      await expect(mainContainer).toBeVisible()
    })
    
    await step('Verify slot content is displayed', async () => {
      await expect(canvas.getByText('Slot content')).toBeInTheDocument()
      await expect(canvas.getByText('Slot content2')).toBeInTheDocument()
    })
    
    await step('Verify default props content is not displayed when slot is used', async () => {
      // When slot is provided, default content (badge, user info) should not be rendered
      const badge = canvasElement.querySelector('[class*="badge"]')
      // Badge should not exist when slot is used
      await expect(badge).not.toBeInTheDocument()
    })
    
    await step('Verify border indicators are still present with slot', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      // Border indicators should still be present regardless of slot content
      await expect(borderIndicators.length).toBeGreaterThanOrEqual(4)
    })
  }
}

// ============================================
// VARIANT STORIES
// ============================================

export const EnvironmentOnly: Story = {
  args: {
    environment: 'production',
    role: undefined,
    firstName: undefined,
    lastName: undefined
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify environment badge is displayed', async () => {
      await expect(canvas.getByText('production')).toBeInTheDocument()
    })
    
    await step('Verify user info is not displayed', async () => {
      // No role or name should be displayed - check main container only
      const mainContainer = getMainContainer(canvasElement)
      const containerText = mainContainer.textContent || ''
      await expect(containerText).not.toContain(':')
      await expect(containerText).not.toContain('Operatore')
      await expect(containerText).not.toContain('Mario')
    })
  }
}

export const UserInfoOnly: Story = {
  args: {
    role: 'Admin',
    firstName: 'Jane',
    lastName: 'Doe'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify user info is displayed', async () => {
      await expect(canvas.getByText(/Admin:/i)).toBeInTheDocument()
      await expect(canvas.getByText(/Jane D\./i)).toBeInTheDocument()
    })
    
    await step('Verify environment badge is not displayed', async () => {
      const badge = canvasElement.querySelector('[class*="badge"]')
      await expect(badge).not.toBeInTheDocument()
    })
  }
}

export const EmptyProps: Story = {
  args: {
    role: undefined,
    firstName: undefined,
    lastName: undefined,
    environment: undefined
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify view flag renders with empty props', async () => {
      const mainContainer = getMainContainer(canvasElement)
      await expect(mainContainer).toBeInTheDocument()
      await expect(mainContainer).toBeVisible()
    })
    
    await step('Verify border indicators are still present', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      // Border indicators should always be present
      await expect(borderIndicators.length).toBeGreaterThanOrEqual(4)
    })
    
    await step('Verify no content is displayed when props are empty', async () => {
      const mainContainer = getMainContainer(canvasElement)
      const textContent = mainContainer.textContent?.trim() || ''
      // Should be empty or minimal when no props provided (may have whitespace)
      // Check that meaningful content is not present
      await expect(textContent).not.toContain('staging')
      await expect(textContent).not.toContain('Operatore')
      await expect(textContent).not.toContain('Mario')
    })
  }
}

// ============================================
// ACCESSIBILITY STORIES
// ============================================

export const Accessibility: Story = {
  args: {
    role: 'Operatore',
    firstName: 'Mario',
    lastName: 'Rossi',
    environment: 'staging.D'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify semantic HTML structure', async () => {
      const mainContainer = getMainContainer(canvasElement)
      // Component uses div elements (semantic structure could be enhanced)
      await expect(mainContainer.tagName.toLowerCase()).toBe('div')
    })
    
    await step('Verify visible text content for screen readers', async () => {
      // All important information should be in text content
      await expect(canvas.getByText('staging.D')).toBeInTheDocument()
      await expect(canvas.getByText(/Operatore:/i)).toBeInTheDocument()
      await expect(canvas.getByText(/Mario R\./i)).toBeInTheDocument()
    })
    
    await step('Verify text content is accessible', async () => {
      const mainContainer = getMainContainer(canvasElement)
      const textContent = mainContainer.textContent || ''
      
      // Verify meaningful content is present
      await expect(textContent.length).toBeGreaterThan(0)
      await expect(textContent).toContain('staging.D')
      await expect(textContent).toContain('Operatore')
      await expect(textContent).toContain('Mario')
    })
    
    await step('Verify border indicators do not interfere with content', async () => {
      // Border indicators should be decorative and not contain important content
      // They are separate divs, so they should not contain the main content text
      const borderIndicators = getBorderIndicators(canvasElement)
      
      // Verify border indicators exist and are separate from main container
      await expect(borderIndicators.length).toBeGreaterThanOrEqual(4)
      
      // Verify border indicators don't contain the main content
      for (const indicator of borderIndicators) {
        const indicatorText = indicator.textContent?.trim() || ''
        // Border indicators should be empty or contain only whitespace
        // They should not contain the main content text
        await expect(indicatorText.length).toBeLessThan(20) // Allow for whitespace
      }
    })
    
    await step('Verify main container has appropriate z-index', async () => {
      const mainContainer = getMainContainer(canvasElement)
      const computedStyles = window.getComputedStyle(mainContainer)
      const zIndex = parseInt(computedStyles.zIndex) || 0
      // Should have high z-index to appear above other content
      await expect(zIndex).toBeGreaterThanOrEqual(50)
    })
  }
}

// ============================================
// VISUAL POSITIONING STORIES
// ============================================

export const BorderIndicators: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    await step('Verify border indicators are present', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      // Should have 4 border indicators (top, bottom, left, right)
      await expect(borderIndicators.length).toBeGreaterThanOrEqual(4)
    })
    
    await step('Verify top border indicator positioning', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      const topBorder = borderIndicators.find((el) => {
        const styles = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        // Top border: positioned at top (y < 50px) and full width
        return rect.top < 50 && rect.width > window.innerWidth * 0.9
      })
      
      await expect(topBorder).toBeTruthy()
      if (topBorder) {
        await expect(topBorder).toBeInTheDocument()
        const rect = topBorder.getBoundingClientRect()
        await expect(rect.top).toBeLessThan(50)
        await expect(rect.width).toBeGreaterThan(window.innerWidth * 0.9)
      }
    })
    
    await step('Verify bottom border indicator positioning', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      const viewportHeight = window.innerHeight
      const bottomBorder = borderIndicators.find((el) => {
        const rect = el.getBoundingClientRect()
        // Bottom border: positioned at bottom (y > viewport - 50px) and full width
        return rect.bottom > viewportHeight - 50 && rect.width > window.innerWidth * 0.9
      })
      
      await expect(bottomBorder).toBeTruthy()
      if (bottomBorder) {
        await expect(bottomBorder).toBeInTheDocument()
        const rect = bottomBorder.getBoundingClientRect()
        await expect(rect.bottom).toBeGreaterThan(viewportHeight - 50)
      }
    })
    
    await step('Verify left border indicator positioning', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      const leftBorder = borderIndicators.find((el) => {
        const rect = el.getBoundingClientRect()
        // Left border: positioned at left (x < 50px) and tall (height > viewport * 0.9)
        return rect.left < 50 && rect.height > window.innerHeight * 0.9
      })
      
      await expect(leftBorder).toBeTruthy()
      if (leftBorder) {
        await expect(leftBorder).toBeInTheDocument()
        const rect = leftBorder.getBoundingClientRect()
        await expect(rect.left).toBeLessThan(50)
      }
    })
    
    await step('Verify right border indicator positioning', async () => {
      const borderIndicators = getBorderIndicators(canvasElement)
      const viewportWidth = window.innerWidth
      const rightBorder = borderIndicators.find((el) => {
        const rect = el.getBoundingClientRect()
        // Right border: positioned at right (x > viewport - 50px) and tall
        return rect.right > viewportWidth - 50 && rect.height > window.innerHeight * 0.9
      })
      
      await expect(rightBorder).toBeTruthy()
      if (rightBorder) {
        await expect(rightBorder).toBeInTheDocument()
        const rect = rightBorder.getBoundingClientRect()
        await expect(rect.right).toBeGreaterThan(viewportWidth - 50)
      }
    })
  }
}
