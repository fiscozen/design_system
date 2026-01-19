import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzPdfViewer } from '@fiscozen/pdf-viewer'

const meta: Meta<typeof FzPdfViewer> = {
  title: 'Media/FzPdfViewer',
  component: FzPdfViewer,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

// Constants for consistent timeout values
const PDF_LOAD_TIMEOUT = 5000
const PDF_CLEANUP_DELAY = 300 // Delay to allow PDF library cleanup

/**
 * Helper function to wait for PDF to load
 */
const waitForPdfLoad = async (canvasElement: HTMLElement): Promise<void> => {
  await waitFor(
    () => {
      const pageDisplay = canvasElement.querySelector('[data-testid="pdf-page"]')
      expect(pageDisplay).toBeInTheDocument()
      return true
    },
    { timeout: PDF_LOAD_TIMEOUT }
  )
}

/**
 * Helper function to wait for PDF library cleanup
 * This prevents unhandled promise rejections from the PDF library
 * when components are unmounted between tests
 */
const waitForPdfCleanup = async (): Promise<void> => {
  // Small delay to allow PDF library to complete cleanup operations
  await new Promise(resolve => setTimeout(resolve, PDF_CLEANUP_DELAY))
}

export const Default: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify PDF viewer renders correctly', async () => {
      const container = canvasElement.querySelector('.flex.flex-col.gap-12')
      await expect(container).toBeInTheDocument()
      await expect(container).toBeVisible()
    })
    
    await step('Verify PDF container is present', async () => {
      const pdfContainer = canvasElement.querySelector('.bg-grey-100')
      await expect(pdfContainer).toBeInTheDocument()
      await expect(pdfContainer).toBeVisible()
    })
    
    await step('Verify page display shows initial page', async () => {
      const pageDisplay = canvas.getByTestId('pdf-page')
      await expect(pageDisplay).toBeInTheDocument()
      await expect(pageDisplay).toBeVisible()
      // Should show "1 / X" format
      await expect(pageDisplay.textContent).toMatch(/\d+\s*\/\s*\d+/)
    })
    
    await step('Verify scale display shows initial scale', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay).toBeInTheDocument()
      await expect(scaleDisplay).toBeVisible()
      // Should show percentage (e.g., "100 %")
      await expect(scaleDisplay.textContent).toMatch(/\d+\s*%/)
    })
    
    await step('Verify navigation buttons are present', async () => {
      // Previous page button
      const prevButton = canvasElement.querySelector('button[aria-label*="arrow-left"], button:has(svg.fa-arrow-left)')
      await expect(prevButton).toBeInTheDocument()
      
      // Next page button
      const nextButton = canvasElement.querySelector('button[aria-label*="arrow-right"], button:has(svg.fa-arrow-right)')
      await expect(nextButton).toBeInTheDocument()
    })
    
    await step('Verify scale control buttons are present', async () => {
      // Zoom out button
      const zoomOutButton = canvasElement.querySelector('button:has(svg.fa-minus)')
      await expect(zoomOutButton).toBeInTheDocument()
      
      // Zoom in button
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)')
      await expect(zoomInButton).toBeInTheDocument()
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const PageNavigation: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialPage: 1
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify initial page is 1', async () => {
      const pageDisplay = canvas.getByTestId('pdf-page')
      await expect(pageDisplay.textContent).toContain('1 /')
    })
    
    await step('Verify previous button is disabled on first page', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      await expect(prevButton).toBeInTheDocument()
      // Wait a bit for PDF to fully load before checking disabled state
      await waitFor(() => {
        expect(prevButton).toBeDisabled()
      }, { timeout: 2000 })
    })
    
    await step('Click next page button to navigate to page 2', async () => {
      const nextButton = canvasElement.querySelector('button:has(svg.fa-arrow-right)') as HTMLButtonElement
      await expect(nextButton).toBeInTheDocument()
      
      // Wait for PDF to load and button to be enabled
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled()
      }, { timeout: 3000 })
      
      await userEvent.click(nextButton)
      
      // Wait for page to change
      await waitFor(() => {
        const pageDisplay = canvasElement.querySelector('[data-testid="pdf-page"]')
        expect(pageDisplay?.textContent).toContain('2 /')
      }, { timeout: 2000 })
    })
    
    await step('Verify previous button is enabled after navigating forward', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      await expect(prevButton).not.toBeDisabled()
    })
    
    await step('Click previous page button to navigate back to page 1', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      await userEvent.click(prevButton)
      
      // Wait for page to change back
      await waitFor(() => {
        const pageDisplay = canvasElement.querySelector('[data-testid="pdf-page"]')
        expect(pageDisplay?.textContent).toContain('1 /')
      }, { timeout: 2000 })
    })
    
    await step('Verify previous button is disabled again on first page', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      await expect(prevButton).toBeDisabled()
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const ScaleControls: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialScale: 1
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify initial scale is 100%', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay.textContent).toContain('100')
    })
    
    await step('Verify zoom out button is enabled at 100%', async () => {
      const zoomOutButton = canvasElement.querySelector('button:has(svg.fa-minus)') as HTMLButtonElement
      await expect(zoomOutButton).toBeInTheDocument()
      await expect(zoomOutButton).not.toBeDisabled()
    })
    
    await step('Click zoom in button to increase scale', async () => {
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)') as HTMLButtonElement
      await expect(zoomInButton).toBeInTheDocument()
      await expect(zoomInButton).not.toBeDisabled()
      
      await userEvent.click(zoomInButton)
      
      // Wait for scale to update
      await waitFor(() => {
        const scaleDisplay = canvasElement.querySelector('[data-testid="pdf-scale"]')
        const scaleText = scaleDisplay?.textContent || ''
        const scaleValue = parseInt(scaleText.replace('%', '').trim())
        expect(scaleValue).toBeGreaterThan(100)
      }, { timeout: 2000 })
    })
    
    await step('Verify scale increased to 125%', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay.textContent).toContain('125')
    })
    
    await step('Click zoom out button to decrease scale', async () => {
      const zoomOutButton = canvasElement.querySelector('button:has(svg.fa-minus)') as HTMLButtonElement
      await userEvent.click(zoomOutButton)
      
      // Wait for scale to update back
      await waitFor(() => {
        const scaleDisplay = canvasElement.querySelector('[data-testid="pdf-scale"]')
        expect(scaleDisplay?.textContent).toContain('100')
      }, { timeout: 2000 })
    })
    
    await step('Verify scale decreased back to 100%', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay.textContent).toContain('100')
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const ScaleLimits: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialScale: 0.25
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify zoom out button is disabled at minimum scale (25%)', async () => {
      const zoomOutButton = canvasElement.querySelector('button:has(svg.fa-minus)') as HTMLButtonElement
      await expect(zoomOutButton).toBeDisabled()
    })
    
    await step('Click zoom in multiple times to reach maximum scale', async () => {
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)') as HTMLButtonElement
      
      // Click multiple times to reach max scale (200%)
      for (let i = 0; i < 7; i++) {
        if (!zoomInButton.disabled) {
          await userEvent.click(zoomInButton)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      // Wait for scale to reach maximum
      await waitFor(() => {
        const scaleDisplay = canvasElement.querySelector('[data-testid="pdf-scale"]')
        const scaleText = scaleDisplay?.textContent || ''
        const scaleValue = parseInt(scaleText.replace('%', '').trim())
        expect(scaleValue).toBeGreaterThanOrEqual(200)
      }, { timeout: 3000 })
    })
    
    await step('Verify zoom in button is disabled at maximum scale (200%)', async () => {
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)') as HTMLButtonElement
      await expect(zoomInButton).toBeDisabled()
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const KeyboardNavigation: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialPage: 2
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Tab to next page button and verify focus', async () => {
      const nextButton = canvasElement.querySelector('button:has(svg.fa-arrow-right)') as HTMLButtonElement
      await expect(nextButton).toBeInTheDocument()
      
      // Wait for PDF to load before focusing
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled()
      }, { timeout: 3000 })
      
      nextButton.focus()
      // Wait a bit for focus to be set
      await waitFor(() => {
        expect(document.activeElement).toBe(nextButton)
      }, { timeout: 500 })
    })
    
    await step('Activate next page button with Enter key', async () => {
      const nextButton = canvasElement.querySelector('button:has(svg.fa-arrow-right)') as HTMLButtonElement
      nextButton.focus()
      
      await userEvent.keyboard('{Enter}')
      
      // Wait for page to change
      await waitFor(() => {
        const pageDisplay = canvasElement.querySelector('[data-testid="pdf-page"]')
        expect(pageDisplay?.textContent).toContain('3 /')
      }, { timeout: 2000 })
    })
    
    await step('Tab to previous page button and activate with Space key', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      prevButton.focus()
      await expect(document.activeElement).toBe(prevButton)
      
      await userEvent.keyboard(' ')
      
      // Wait for page to change back
      await waitFor(() => {
        const pageDisplay = canvasElement.querySelector('[data-testid="pdf-page"]')
        expect(pageDisplay?.textContent).toContain('2 /')
      }, { timeout: 2000 })
    })
    
    await step('Tab to zoom in button and activate with Enter', async () => {
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)') as HTMLButtonElement
      zoomInButton.focus()
      await expect(document.activeElement).toBe(zoomInButton)
      
      await userEvent.keyboard('{Enter}')
      
      // Wait for scale to update
      await waitFor(() => {
        const scaleDisplay = canvasElement.querySelector('[data-testid="pdf-scale"]')
        const scaleText = scaleDisplay?.textContent || ''
        const scaleValue = parseInt(scaleText.replace('%', '').trim())
        expect(scaleValue).toBeGreaterThan(100)
      }, { timeout: 2000 })
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const CustomInitialPage: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialPage: 3
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify PDF starts on page 3', async () => {
      const pageDisplay = canvas.getByTestId('pdf-page')
      await expect(pageDisplay.textContent).toContain('3 /')
    })
    
    await step('Verify previous button is enabled when not on first page', async () => {
      const prevButton = canvasElement.querySelector('button:has(svg.fa-arrow-left)') as HTMLButtonElement
      await expect(prevButton).not.toBeDisabled()
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const CustomInitialScale: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    initialScale: 1.5
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })
    
    await step('Verify PDF starts at 150% scale', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay.textContent).toContain('150')
    })
    
    await step('Verify both zoom buttons are enabled at 150%', async () => {
      const zoomOutButton = canvasElement.querySelector('button:has(svg.fa-minus)') as HTMLButtonElement
      const zoomInButton = canvasElement.querySelector('button:has(svg.fa-plus)') as HTMLButtonElement
      
      await expect(zoomOutButton).not.toBeDisabled()
      await expect(zoomInButton).not.toBeDisabled()
    })
    
    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export default meta
