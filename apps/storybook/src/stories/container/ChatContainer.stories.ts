import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { FzChatContainer } from '@fiscozen/chat-container'

const meta = {
  title: 'Layout/FzChatContainer',
  component: FzChatContainer,
  tags: ['autodocs'],
  argTypes: {
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice'],
      description: 'Component environment determining size and spacing',
      table: {
        defaultValue: { summary: 'frontoffice' }
      }
    },
    disabled: { control: 'boolean' }
  },
  args: {
    // Default args for all stories
    disabled: false
  },
  decorators: [
    () => ({
      template: '<div style="max-width: 400px; padding: 16px;"><story/></div>'
    })
  ]
} satisfies Meta<typeof FzChatContainer>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// DEFAULT STORY
// ============================================

export const Default: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      // Adjust selector based on your component
      const element = canvas.getByRole('button') // or 'textbox', etc.
      await expect(element).toBeInTheDocument()
      await expect(element).toBeVisible()
    })

    await step('Verify default ARIA attributes', async () => {
      const element = canvas.getByRole('button')
      await expect(element).toHaveAttribute('aria-disabled', 'false')
    })

    await step('Verify default environment styling (frontoffice)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-44')).toBe(true)
    })
  }
}

// ============================================
// ENVIRONMENT STORIES
// ============================================

export const Frontoffice: Story = {
  args: {
    environment: 'frontoffice'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify frontoffice height (44px = h-44)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-44')).toBe(true)
    })
  }
}

export const Backoffice: Story = {
  args: {
    environment: 'backoffice'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify backoffice height (32px = h-32)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-32')).toBe(true)
    })
  }
}

// ============================================
// STATE STORIES
// ============================================

export const Disabled: Story = {
  args: {
    disabled: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')

    await step('Verify disabled state', async () => {
      await expect(element).toBeDisabled()
      await expect(element).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify click does not fire when disabled', async () => {
      await userEvent.click(element)
      // No error should occur, component should not respond
    })
  }
}

// ============================================
// INTERACTION STORIES
// ============================================

export const UserInteraction: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')

    await step('Click the component', async () => {
      await userEvent.click(element)
      // Add assertions for expected behavior after click
    })
  }
}

export const KeyboardNavigation: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus element', async () => {
      await userEvent.tab()
      const focusedElement = document.activeElement
      await expect(focusedElement).toBe(canvas.getByRole('button'))
    })

    await step('Activate with Enter key', async () => {
      await userEvent.keyboard('{Enter}')
      // Add assertions for expected behavior
    })

    await step('Activate with Space key', async () => {
      await userEvent.keyboard(' ')
      // Add assertions for expected behavior
    })
  }
}

// ============================================
// ADDITIONAL STORIES TO ADD (as needed)
// ============================================
// 
// Add these stories if your component supports them:
// 
// - Variant stories (Primary, Secondary, etc.): If component has visual variants,
//   add a story for each with play function verifying variant-specific CSS classes.
// 
// - Error state: If component supports error prop, add Error story with
//   #errorMessage slot and verify aria-invalid="true" and role="alert".
// 
// - V-Model: If component supports v-model, add WithVModel story using
//   render function with ref() and verify two-way binding works.
// 
// See existing stories in apps/storybook/src/stories/ for examples.

// ============================================
// ALL STATES STORY
// ============================================

export const AllStates: Story = {
  render: () => ({
    components: { FzChatContainer },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-grey-500 mb-2">Default</p>
          <FzChatContainer />
        </div>
        <div>
          <p class="text-sm text-grey-500 mb-2">Disabled</p>
          <FzChatContainer :disabled="true" />
        </div>
        <div>
          <p class="text-sm text-grey-500 mb-2">Backoffice</p>
          <FzChatContainer environment="backoffice" />
        </div>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button, input, [role="button"]')
    await expect(buttons.length).toBeGreaterThanOrEqual(3)
  }
}
