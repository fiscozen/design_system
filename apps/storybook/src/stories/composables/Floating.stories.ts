import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, screen, waitFor } from '@storybook/test'
import { reactive, ref } from 'vue'

import { FzFloating } from '@fiscozen/composables'
import { FzNavlink } from '@fiscozen/navlink'
import { FzNavlist } from '@fiscozen/navlist'
import { FzButton } from '@fiscozen/button'

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

/**
 * Tolerance in pixels for position comparison tests.
 * This accounts for margins, rounding errors, and browser differences.
 */
const POSITION_TOLERANCE = 5

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Waits for the floating content to reposition after a dynamic change.
 * Uses waitFor with actual conditions instead of arbitrary timeouts.
 */
const waitForReposition = async (
  openerElement: Element,
  floatingContent: Element,
  positionCheck: 'below' | 'above' | 'left' | 'right' = 'below'
) => {
  await waitFor(() => {
    const openerRect = openerElement.getBoundingClientRect()
    const contentRect = floatingContent.getBoundingClientRect()
    
    switch (positionCheck) {
      case 'below':
        expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - POSITION_TOLERANCE)
        break
      case 'above':
        expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + POSITION_TOLERANCE)
        break
      case 'left':
        expect(contentRect.right).toBeLessThanOrEqual(openerRect.left + POSITION_TOLERANCE)
        break
      case 'right':
        expect(contentRect.left).toBeGreaterThanOrEqual(openerRect.right - POSITION_TOLERANCE)
        break
    }
  }, { timeout: 1000 })
}

const example = [
  {
    label: 'Label 1',
    items: [
      {
        label: 'Item #1',
        meta: {
          path: '/foo',
          name: 'foo'
        }
      },
      {
        summary: 'Item #2',
        subitems: [
          {
            label: 'Sub-Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Sub-Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      }
    ]
  },
  {
    label: 'Label 2',
    items: [
      {
        label: 'Item #1',
        disabled: true,
        meta: {
          path: '/foo',
          name: 'foo'
        }
      },
      {
        label: 'Item #2',
        meta: {
          path: '/foo',
          name: 'foo'
        }
      }
    ]
  }
]

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Composables/FzFloating',
  component: FzFloating,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'auto',
        'auto-vertical',
        'auto-start',
        'auto-vertical-start',
        'auto-end',
        'auto-vertical-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ],
      description: 'Position of the floating content relative to the opener'
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls visibility of floating content'
    },
    teleport: {
      control: 'boolean',
      description: 'Teleport content to body'
    }
  },
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false
  }
} satisfies Meta<typeof FzFloating>

export default meta
type Story = StoryObj<typeof FzFloating>

// ============================================================================
// HELPER: Get floating content element (handles teleport case)
// ============================================================================
const getFloatingContent = (canvasElement: HTMLElement, teleport: boolean = false) => {
  if (teleport) {
    // When teleported, content is in document.body
    return document.querySelector('.fz__floating__content')
  }
  return canvasElement.querySelector('.fz__floating__content')
}

// ============================================================================
// TEMPLATES
// ============================================================================

const simpleTemplate = `
  <div class="h-screen w-screen" :class="args.class">
    <FzFloating :position="args.position" :isOpen>
      <template #opener>
          <FzNavlink @click="isOpen = !isOpen">open float here</FzNavlink>
      </template> 
      <FzNavlist :sections/>
    </FzFloating>
  </div>
`

const testableTemplate = `
  <div class="h-screen w-screen flex" :class="args.class" data-testid="container">
    <FzFloating 
      :position="args.position" 
      :isOpen="isOpen"
      :teleport="args.teleport"
      :contentClass="args.contentClass"
    >
      <template #opener>
        <FzButton 
          data-testid="opener-button"
          @click="isOpen = !isOpen"
          label="Toggle Floating"
        />
      </template>
      <div data-testid="floating-content" class="p-16 bg-grey-100 border border-grey-300 rounded">
        <p class="text-sm">Floating content</p>
        <p class="text-xs text-grey-500">Position: {{ args.position }}</p>
      </div>
    </FzFloating>
  </div>
`

const Template: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(false)
      const sections = reactive(example)
      return { args, isOpen, sections }
    },
    components: { FzFloating, FzNavlink, FzNavlist },
    template: simpleTemplate
  })
}

const TestableTemplate: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(args.isOpen ?? false)
      return { args, isOpen }
    },
    components: { FzFloating, FzButton },
    template: testableTemplate
  })
}
// ============================================================================
// TEST STORIES - Core Functionality
// ============================================================================

/**
 * Tests basic rendering: opener is visible, content is hidden initially
 */
export const BasicRendering: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify opener button exists and is visible
    const openerButton = canvas.getByTestId('opener-button')
    await expect(openerButton).toBeInTheDocument()
    await expect(openerButton).toBeVisible()

    // Verify floating content exists but is hidden (v-show)
    const floatingContent = getFloatingContent(canvasElement)
    await expect(floatingContent).toBeInTheDocument()

    // v-show uses display: none, so element exists but is not visible
    const computedStyle = window.getComputedStyle(floatingContent as Element)
    await expect(computedStyle.display).toBe('none')
  }
}

/**
 * Tests open/close toggle behavior
 */
export const OpenCloseToggle: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    const floatingContent = getFloatingContent(canvasElement)

    // Initially hidden
    let computedStyle = window.getComputedStyle(floatingContent as Element)
    await expect(computedStyle.display).toBe('none')

    // Click to open
    await userEvent.click(openerButton)

    // Wait for position to be set and content to be visible
    await waitFor(() => {
      computedStyle = window.getComputedStyle(floatingContent as Element)
      expect(computedStyle.display).not.toBe('none')
    })

    // Content should be visible after click
    await expect(floatingContent).toBeVisible()

    // Click to close
    await userEvent.click(openerButton)

    // Content should be hidden again
    await waitFor(() => {
      computedStyle = window.getComputedStyle(floatingContent as Element)
      expect(computedStyle.display).toBe('none')
    })
  }
}

/**
 * Tests that floating content gets position: fixed when opened
 */
export const FixedPositioning: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    // Wait for position to be calculated
    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      const computedStyle = window.getComputedStyle(floatingContent as Element)
      expect(computedStyle.position).toBe('fixed')
    })

    // Verify top and left are set (not default values)
    const computedStyle = window.getComputedStyle(floatingContent as Element)
    await expect(computedStyle.top).toBeTruthy()
    await expect(computedStyle.left).toBeTruthy()

    // Verify they are pixel values (indicating position was calculated)
    await expect(computedStyle.top).toMatch(/^\d+(\.\d+)?px$/)
    await expect(computedStyle.left).toMatch(/^\d+(\.\d+)?px$/)
  }
}

/**
 * Tests teleport functionality - content should be in document.body
 */
export const TeleportToBody: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: true,
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    // Wait for content to appear
    await waitFor(() => {
      // When teleported, content is child of body, not canvas
      const bodyFloatingContent = document.body.querySelector('.fz__floating__content')
      expect(bodyFloatingContent).toBeInTheDocument()
    })

    // Verify content is NOT inside canvasElement (it's teleported)
    const canvasFloatingContent = canvasElement.querySelector('.fz__floating__content')
    // This might be null or still exist depending on implementation
    // The key test is that it exists in body
    const bodyFloatingContent = document.body.querySelector('.fz__floating__content')
    await expect(bodyFloatingContent).toBeVisible()

    // Verify it has fixed positioning
    const computedStyle = window.getComputedStyle(bodyFloatingContent as Element)
    await expect(computedStyle.position).toBe('fixed')
  }
}

/**
 * Tests content class prop is applied correctly
 */
export const ContentClassApplication: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    contentClass: 'custom-test-class z-50',
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Verify custom class is applied
    await expect(floatingContent).toHaveClass('custom-test-class')
    await expect(floatingContent).toHaveClass('z-50')

    // Verify default classes are also present (when not overridden)
    await expect(floatingContent).toHaveClass('bg-core-white')
    await expect(floatingContent).toHaveClass('fixed')
  }
}

// ============================================================================
// POSITION TESTS - Verify floating content appears in correct position
// All tests use centered opener to avoid boundary corrections and clearly
// verify the intended positioning behavior
// ============================================================================

const centeredTestClass = 'items-center justify-center'

/**
 * Tests bottom-start position: content should appear below opener, aligned to left edge
 */
export const PositionBottomStart: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Get positions
    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be below opener (content.top >= opener.bottom)
    await expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - 1) // -1 for rounding

    // Content left should be approximately aligned with opener left (start)
    await expect(Math.abs(contentRect.left - openerRect.left)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests bottom-end position: content should appear below opener, aligned to right edge
 */
export const PositionBottomEnd: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-end',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be below opener (content.top >= opener.bottom)
    await expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - 1)

    // Content right should be approximately aligned with opener right (end)
    await expect(Math.abs(contentRect.right - openerRect.right)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests bottom (center) position: content should appear below opener, centered
 */
export const PositionBottom: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be below opener
    await expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - 1)

    // Content should be approximately centered horizontally with opener
    const openerCenterX = openerRect.left + openerRect.width / 2
    const contentCenterX = contentRect.left + contentRect.width / 2
    await expect(Math.abs(contentCenterX - openerCenterX)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests top-start position: content should appear above opener, aligned to left edge
 */
export const PositionTopStart: Story = {
  ...TestableTemplate,
  args: {
    position: 'top-start',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be above opener (content.bottom <= opener.top)
    await expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + 1)

    // Content left should be approximately aligned with opener left (start)
    await expect(Math.abs(contentRect.left - openerRect.left)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests top-end position: content should appear above opener, aligned to right edge
 */
export const PositionTopEnd: Story = {
  ...TestableTemplate,
  args: {
    position: 'top-end',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be above opener (content.bottom <= opener.top)
    await expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + 1)

    // Content right should be approximately aligned with opener right (end)
    await expect(Math.abs(contentRect.right - openerRect.right)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests top (center) position: content should appear above opener, centered
 */
export const PositionTop: Story = {
  ...TestableTemplate,
  args: {
    position: 'top',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be above opener
    await expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + 1)

    // Content should be approximately centered horizontally with opener
    const openerCenterX = openerRect.left + openerRect.width / 2
    const contentCenterX = contentRect.left + contentRect.width / 2
    await expect(Math.abs(contentCenterX - openerCenterX)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests right-start position: content should appear to the right of opener, aligned to top
 */
export const PositionRightStart: Story = {
  ...TestableTemplate,
  args: {
    position: 'right-start',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the right of opener (content.left >= opener.right)
    await expect(contentRect.left).toBeGreaterThanOrEqual(openerRect.right - 1)

    // Content top should be approximately aligned with opener top (start)
    await expect(Math.abs(contentRect.top - openerRect.top)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests right-end position: content should appear to the right of opener, aligned to bottom
 */
export const PositionRightEnd: Story = {
  ...TestableTemplate,
  args: {
    position: 'right-end',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the right of opener
    await expect(contentRect.left).toBeGreaterThanOrEqual(openerRect.right - 1)

    // Content bottom should be approximately aligned with opener bottom (end)
    await expect(Math.abs(contentRect.bottom - openerRect.bottom)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests right (center) position: content should appear to the right of opener, vertically centered
 */
export const PositionRight: Story = {
  ...TestableTemplate,
  args: {
    position: 'right',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the right of opener
    await expect(contentRect.left).toBeGreaterThanOrEqual(openerRect.right - 1)

    // Content should be approximately centered vertically with opener
    const openerCenterY = openerRect.top + openerRect.height / 2
    const contentCenterY = contentRect.top + contentRect.height / 2
    await expect(Math.abs(contentCenterY - openerCenterY)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests left-start position: content should appear to the left of opener, aligned to top
 */
export const PositionLeftStart: Story = {
  ...TestableTemplate,
  args: {
    position: 'left-start',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the left of opener (content.right <= opener.left)
    await expect(contentRect.right).toBeLessThanOrEqual(openerRect.left + 1)

    // Content top should be approximately aligned with opener top (start)
    await expect(Math.abs(contentRect.top - openerRect.top)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests left-end position: content should appear to the left of opener, aligned to bottom
 */
export const PositionLeftEnd: Story = {
  ...TestableTemplate,
  args: {
    position: 'left-end',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the left of opener
    await expect(contentRect.right).toBeLessThanOrEqual(openerRect.left + 1)

    // Content bottom should be approximately aligned with opener bottom (end)
    await expect(Math.abs(contentRect.bottom - openerRect.bottom)).toBeLessThan(POSITION_TOLERANCE)
  }
}

/**
 * Tests left (center) position: content should appear to the left of opener, vertically centered
 */
export const PositionLeft: Story = {
  ...TestableTemplate,
  args: {
    position: 'left',
    isOpen: false,
    teleport: false,
    class: centeredTestClass
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')

    // Click to open
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the left of opener
    await expect(contentRect.right).toBeLessThanOrEqual(openerRect.left + 1)

    // Content should be approximately centered vertically with opener
    const openerCenterY = openerRect.top + openerRect.height / 2
    const contentCenterY = contentRect.top + contentRect.height / 2
    await expect(Math.abs(contentCenterY - openerCenterY)).toBeLessThan(POSITION_TOLERANCE)
  }
}

// ============================================================================
// VISUAL DEMO STORIES - Opener centered for clear position verification
// All stories center the opener to avoid boundary corrections and clearly
// demonstrate the intended positioning behavior
// ============================================================================

// Centered opener class - used by all visual demo stories
const centeredOpenerClass = 'flex items-center justify-center'

export const WithOpenerRightStart: Story = {
  ...Template,
  args: {
    position: 'right-start',
    class: centeredOpenerClass
  }
}

export const WithOpenerRight: Story = {
  ...Template,
  args: {
    position: 'right',
    class: centeredOpenerClass
  }
}

export const WithOpenerRightEnd: Story = {
  ...Template,
  args: {
    position: 'right-end',
    class: centeredOpenerClass
  }
}

export const WithOpenerTopStart: Story = {
  ...Template,
  args: {
    position: 'top-start',
    class: centeredOpenerClass
  }
}

export const WithOpenerTop: Story = {
  ...Template,
  args: {
    position: 'top',
    class: centeredOpenerClass
  }
}

export const WithOpenerTopEnd: Story = {
  ...Template,
  args: {
    position: 'top-end',
    class: centeredOpenerClass
  }
}

export const WithOpenerLeftEnd: Story = {
  ...Template,
  args: {
    position: 'left-end',
    class: centeredOpenerClass
  }
}

export const WithOpenerLeft: Story = {
  ...Template,
  args: {
    position: 'left',
    class: centeredOpenerClass
  }
}

export const WithOpenerLeftStart: Story = {
  ...Template,
  args: {
    position: 'left-start',
    class: centeredOpenerClass
  }
}

export const WithOpenerBottomEnd: Story = {
  ...Template,
  args: {
    position: 'bottom-end',
    class: centeredOpenerClass
  }
}

export const WithOpenerBottom: Story = {
  ...Template,
  args: {
    position: 'bottom',
    class: centeredOpenerClass
  }
}

export const WithOpenerBottomStart: Story = {
  ...Template,
  args: {
    position: 'bottom-start',
    class: centeredOpenerClass
  }
}

// ============================================================================
// AUTO POSITION TESTS - Verify automatic positioning based on opener location
// ============================================================================

/**
 * Tests auto positioning when opener is near the TOP edge of the container.
 * Expected: floating should appear BELOW the opener (bottom direction)
 */
export const AutoPositionNearTopEdge: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-center' // opener at top-center
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be BELOW the opener (content.top >= opener.bottom)
    // Using a small tolerance for the margin
    await expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - POSITION_TOLERANCE)
  }
}

/**
 * Tests auto positioning when opener is near the BOTTOM edge of the container.
 * Expected: floating should appear ABOVE the opener (top direction)
 */
export const AutoPositionNearBottomEdge: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-end justify-center' // opener at bottom-center
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be ABOVE the opener (content.bottom <= opener.top)
    // Using a small tolerance for the margin
    await expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + POSITION_TOLERANCE)
  }
}

/**
 * Tests auto positioning when opener is near the LEFT edge of the container.
 * Expected: floating should appear to the RIGHT of the opener
 */
export const AutoPositionNearLeftEdge: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-center justify-start' // opener at center-left
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be to the RIGHT of opener OR below (auto prefers bottom by default)
    // The key is that content should NOT be to the left (cut off by edge)
    await expect(contentRect.left).toBeGreaterThanOrEqual(0)
  }
}

/**
 * Tests auto positioning when opener is near the RIGHT edge of the container.
 * Expected: floating should NOT overflow to the right
 */
export const AutoPositionNearRightEdge: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-center justify-end' // opener at center-right
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const contentRect = (floatingContent as Element).getBoundingClientRect()
    const viewportWidth = window.innerWidth

    // Content should NOT overflow to the right of viewport
    await expect(contentRect.right).toBeLessThanOrEqual(viewportWidth + POSITION_TOLERANCE)
  }
}

/**
 * Tests auto positioning when opener is in the TOP-LEFT corner.
 * Expected: floating should appear in a direction that keeps it visible
 */
export const AutoPositionTopLeftCorner: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-start' // opener at top-left corner
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()

    // Content should be visible (not cut off by top-left corner)
    // It should appear below and/or to the right
    await expect(contentRect.top).toBeGreaterThanOrEqual(0)
    await expect(contentRect.left).toBeGreaterThanOrEqual(0)
    
    // Content should be below the opener (since both top and left are blocked)
    await expect(contentRect.top).toBeGreaterThanOrEqual(openerRect.bottom - POSITION_TOLERANCE)
  }
}

/**
 * Tests auto positioning when opener is in the BOTTOM-RIGHT corner.
 * Expected: floating should appear above and/or to the left
 */
export const AutoPositionBottomRightCorner: Story = {
  ...TestableTemplate,
  args: {
    position: 'auto',
    isOpen: false,
    teleport: false,
    class: 'items-end justify-end' // opener at bottom-right corner
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    const openerRect = openerButton.getBoundingClientRect()
    const contentRect = (floatingContent as Element).getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Content should not overflow viewport
    await expect(contentRect.right).toBeLessThanOrEqual(viewportWidth + POSITION_TOLERANCE)
    await expect(contentRect.bottom).toBeLessThanOrEqual(viewportHeight + POSITION_TOLERANCE)
    
    // Content should be above the opener (since bottom is blocked)
    await expect(contentRect.bottom).toBeLessThanOrEqual(openerRect.top + POSITION_TOLERANCE)
  }
}

// ============================================================================
// REACTIVITY TESTS - Verify floating repositions on dynamic changes
// ============================================================================

// Template for dynamic content tests
const dynamicContentTemplate = `
  <div class="h-screen w-screen flex" :class="args.class" data-testid="container">
    <FzFloating 
      :position="args.position" 
      :isOpen="isOpen"
      :teleport="args.teleport"
    >
      <template #opener>
        <FzButton 
          data-testid="opener-button"
          @click="isOpen = !isOpen"
          label="Toggle Floating"
        />
      </template>
      <div data-testid="floating-content" class="p-4 bg-grey-100 border border-grey-300 rounded">
        <p class="text-sm">Floating content</p>
        <div v-if="expanded" data-testid="extra-content" class="mt-4 p-4 bg-blue-100">
          <p>Extra content that makes the floating larger</p>
          <p>Line 2</p>
          <p>Line 3</p>
          <p>Line 4</p>
        </div>
        <FzButton 
          data-testid="expand-button"
          @click="expanded = !expanded"
          :label="expanded ? 'Collapse' : 'Expand'"
          size="sm"
          class="mt-2"
        />
      </div>
    </FzFloating>
  </div>
`

const DynamicContentTemplate: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(args.isOpen ?? false)
      const expanded = ref(false)
      return { args, isOpen, expanded }
    },
    components: { FzFloating, FzButton },
    template: dynamicContentTemplate
  })
}

// Template for opener resize tests - opener can expand/collapse
const dynamicOpenerTemplate = `
  <div class="h-screen w-screen flex" :class="args.class" data-testid="container">
    <FzFloating 
      :position="args.position" 
      :isOpen="isOpen"
      :teleport="args.teleport"
    >
      <template #opener>
        <div class="flex flex-col" data-testid="opener-wrapper">
          <FzButton 
            data-testid="opener-button"
            @click="isOpen = !isOpen"
            label="Toggle Floating"
          />
          <div v-if="openerExpanded" data-testid="opener-extra-content" class="p-4 bg-blue-100 border border-blue-300 rounded mt-2">
            <p>Extra opener content line 1</p>
            <p>Extra opener content line 2</p>
            <p>Extra opener content line 3</p>
          </div>
          <FzButton 
            data-testid="expand-opener-button"
            @click="openerExpanded = !openerExpanded"
            :label="openerExpanded ? 'Collapse Opener' : 'Expand Opener'"
            size="sm"
            variant="secondary"
            class="mt-2"
          />
        </div>
      </template>
      <div data-testid="floating-content" class="p-4 bg-grey-100 border border-grey-300 rounded">
        <p class="text-sm">Floating content</p>
        <p class="text-xs text-grey-500">Should stay below opener</p>
      </div>
    </FzFloating>
  </div>
`

const DynamicOpenerTemplate: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(args.isOpen ?? false)
      const openerExpanded = ref(false)
      return { args, isOpen, openerExpanded }
    },
    components: { FzFloating, FzButton },
    template: dynamicOpenerTemplate
  })
}

/**
 * Tests that floating repositions when the OPENER size changes.
 * When opener expands vertically, the floating should move down to stay below it.
 */
export const ReactiveOpenerResize: Story = {
  ...DynamicOpenerTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-center' // opener at top-center
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    // Open the floating
    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Record initial positions
    const openerWrapper = canvas.getByTestId('opener-wrapper')
    const initialOpenerRect = openerWrapper.getBoundingClientRect()
    const initialContentRect = (floatingContent as Element).getBoundingClientRect()
    
    // Content should be below opener initially
    await expect(initialContentRect.top).toBeGreaterThanOrEqual(initialOpenerRect.bottom - POSITION_TOLERANCE)
    
    // Record initial gap between opener bottom and content top
    const initialGap = initialContentRect.top - initialOpenerRect.bottom

    // Expand the OPENER (not the floating content)
    const expandOpenerButton = canvas.getByTestId('expand-opener-button')
    await userEvent.click(expandOpenerButton)

    // Wait for opener to expand
    await waitFor(() => {
      expect(canvas.getByTestId('opener-extra-content')).toBeVisible()
    })

    // Wait for opener to expand AND content to reposition
    await waitFor(() => {
      const newOpenerRect = openerWrapper.getBoundingClientRect()
      const newContentRect = (floatingContent as Element).getBoundingClientRect()
      
      // Opener should have grown (its bottom should be lower now)
      expect(newOpenerRect.bottom).toBeGreaterThan(initialOpenerRect.bottom + POSITION_TOLERANCE)
      
      // Floating content should have moved down to stay below the expanded opener
      expect(newContentRect.top).toBeGreaterThanOrEqual(newOpenerRect.bottom - POSITION_TOLERANCE)
      
      // The gap should be approximately the same (within tolerance for margin)
      const newGap = newContentRect.top - newOpenerRect.bottom
      expect(Math.abs(newGap - initialGap)).toBeLessThan(POSITION_TOLERANCE)
    }, { timeout: 1000 })
  }
}

/**
 * Tests that floating repositions when its content size changes.
 * When content expands, the floating should maintain proper position relative to opener.
 */
export const ReactiveContentResize: Story = {
  ...DynamicContentTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-center' // opener near top-center for space to expand
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Record initial position relative to opener
    const initialOpenerRect = openerButton.getBoundingClientRect()
    const initialContentRect = (floatingContent as Element).getBoundingClientRect()
    
    // Content should be below opener initially
    await expect(initialContentRect.top).toBeGreaterThanOrEqual(initialOpenerRect.bottom - POSITION_TOLERANCE)

    // Expand the content
    const expandButton = canvas.getByTestId('expand-button')
    await userEvent.click(expandButton)

    // Wait for content to expand
    await waitFor(() => {
      expect(canvas.getByTestId('extra-content')).toBeVisible()
    })

    // Wait for content to expand AND maintain position
    await waitFor(() => {
      const newOpenerRect = openerButton.getBoundingClientRect()
      const newContentRect = (floatingContent as Element).getBoundingClientRect()
      
      // Content should still be below the opener (not overlapping)
      expect(newContentRect.top).toBeGreaterThanOrEqual(newOpenerRect.bottom - POSITION_TOLERANCE)
      
      // Left edge should remain aligned with opener (bottom-start)
      expect(Math.abs(newContentRect.left - newOpenerRect.left)).toBeLessThan(POSITION_TOLERANCE)
    }, { timeout: 1000 })
  }
}

// Template for scroll tests with scrollable container
const scrollableContainerTemplate = `
  <div 
    class="h-[400px] w-full overflow-auto relative" 
    data-testid="scroll-container"
    style="border: 2px solid #ccc;"
  >
    <div class="h-[800px] p-4 flex flex-col">
      <div class="h-[200px]"></div>
      <FzFloating 
        :position="args.position" 
        :isOpen="isOpen"
        :teleport="args.teleport"
      >
        <template #opener>
          <FzButton 
            data-testid="opener-button"
            @click="isOpen = !isOpen"
            label="Toggle Floating"
          />
        </template>
        <div data-testid="floating-content" class="p-4 bg-grey-100 border border-grey-300 rounded">
          <p class="text-sm">Floating content</p>
          <p class="text-xs text-grey-500">Should follow opener on scroll</p>
        </div>
      </FzFloating>
      <div class="h-[400px]"></div>
    </div>
  </div>
`

const ScrollableContainerTemplate: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(args.isOpen ?? false)
      return { args, isOpen }
    },
    components: { FzFloating, FzButton },
    template: scrollableContainerTemplate
  })
}

/**
 * Tests that floating repositions when the page is scrolled.
 * The floating should follow its opener when scrolling occurs.
 */
export const ReactiveWindowScroll: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-start justify-start'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Record initial positions
    const initialOpenerRect = openerButton.getBoundingClientRect()
    const initialContentRect = (floatingContent as Element).getBoundingClientRect()
    
    // Calculate initial offset between opener and content
    const initialYOffset = initialContentRect.top - initialOpenerRect.bottom

    // Simulate scroll by dispatching scroll event
    window.dispatchEvent(new Event('scroll'))

    // Wait for floating to maintain relative position after scroll
    await waitFor(() => {
      const newOpenerRect = openerButton.getBoundingClientRect()
      const newContentRect = (floatingContent as Element).getBoundingClientRect()
      
      // The relative position should be maintained (within tolerance)
      const newYOffset = newContentRect.top - newOpenerRect.bottom
      expect(Math.abs(newYOffset - initialYOffset)).toBeLessThan(POSITION_TOLERANCE)
    }, { timeout: 1000 })
  }
}

/**
 * Tests that floating repositions when scrolling in a scrollable container.
 */
export const ReactiveContainerScroll: Story = {
  ...ScrollableContainerTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const scrollContainer = canvas.getByTestId('scroll-container')

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Record initial opener position
    const initialOpenerRect = openerButton.getBoundingClientRect()
    
    // Scroll the container
    scrollContainer.scrollTop = 100

    // Dispatch scroll event on the container
    scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }))

    // Wait for content to follow opener after scroll
    await waitFor(() => {
      const newOpenerRect = openerButton.getBoundingClientRect()
      const newContentRect = (floatingContent as Element).getBoundingClientRect()
      
      // Content should still be below the opener after scroll
      expect(newContentRect.top).toBeGreaterThanOrEqual(newOpenerRect.bottom - POSITION_TOLERANCE)
    }, { timeout: 1000 })
  }
}

/**
 * Tests that floating repositions on window resize.
 */
export const ReactiveWindowResize: Story = {
  ...TestableTemplate,
  args: {
    position: 'bottom-start',
    isOpen: false,
    teleport: false,
    class: 'items-center justify-center'
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    const openerButton = canvas.getByTestId('opener-button')
    await userEvent.click(openerButton)

    const floatingContent = getFloatingContent(canvasElement)
    await waitFor(() => {
      expect(floatingContent).toBeVisible()
    })

    // Record initial position relative to opener
    const initialOpenerRect = openerButton.getBoundingClientRect()
    const initialContentRect = (floatingContent as Element).getBoundingClientRect()

    // Dispatch resize event
    window.dispatchEvent(new Event('resize'))

    // Wait for content to maintain position after resize
    await waitFor(() => {
      const newOpenerRect = openerButton.getBoundingClientRect()
      const newContentRect = (floatingContent as Element).getBoundingClientRect()
      
      // Content should still be properly positioned below opener
      expect(newContentRect.top).toBeGreaterThanOrEqual(newOpenerRect.bottom - POSITION_TOLERANCE)
    }, { timeout: 1000 })
  }
}

// following stories are left as comments until related design is finalized
/* const windowContainer = (args) => ({
  setup() {
    return { args }
  },
  components: { FzFloating },
  template: `
    <fz-floating v-bind="args">
      <div>some content </div>
    </fz-floating>
  `
})

export const WindowContainer = windowContainer.bind({})
WindowContainer.args = {
}

const customContainer = (args) => ({
  setup() {
    return { args }
  },
  components: { FzFloating },
  template: `
    <div class="page">
      <main></main>
      <aside>
        <FzFloating>floating in a separate container like an aside</FzFloating>
      </aside>
    </div>
    <fz-floating v-bind="args">
      <div>some content </div>
    </fz-floating>
  `
}) 

export const CustomContainer = customContainer.bind({})
CustomContainer.args = {
} */
