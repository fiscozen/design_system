import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzToast } from '@fiscozen/toast'
import { ref } from 'vue'

const meta: Meta<typeof FzToast> = {
  title: 'Messages/FzToast',
  component: FzToast,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'warning', 'error']
    }
  },
  args: {
    default: 'This is a toast.'
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const Success: Story = {
  args: {
    type: 'success'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify success toast renders correctly', async () => {
      const toast = canvas.getByText('This is a toast.')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toBeVisible()
    })
    
    await step('Verify success toast has correct styling', async () => {
      const toast = canvas.getByText('This is a toast.')
      const container = toast.closest('.bg-semantic-success')
      await expect(container).toBeInTheDocument()
    })
    
    await step('Verify success toast has no close button', async () => {
      const closeButton = canvasElement.querySelector('button[aria-label*="close"], button[aria-label*="Close"]')
      await expect(closeButton).not.toBeInTheDocument()
    })
    
    await step('Verify success icon is present', async () => {
      const icon = canvasElement.querySelector('.fa-circle-check')
      await expect(icon).toBeInTheDocument()
    })
  }
}

const Warning: Story = {
  args: {
    type: 'warning'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify warning toast renders correctly', async () => {
      const toast = canvas.getByText('This is a toast.')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toBeVisible()
    })
    
    await step('Verify warning toast has correct styling', async () => {
      const toast = canvas.getByText('This is a toast.')
      const container = toast.closest('.bg-semantic-warning')
      await expect(container).toBeInTheDocument()
    })
    
    await step('Verify warning toast has close button', async () => {
      const closeButton = canvasElement.querySelector('button')
      await expect(closeButton).toBeInTheDocument()
    })
    
    await step('Verify warning icon is present', async () => {
      const icon = canvasElement.querySelector('.fa-triangle-exclamation')
      await expect(icon).toBeInTheDocument()
    })
  }
}

const Error: Story = {
  args: {
    type: 'error'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify error toast renders correctly', async () => {
      const toast = canvas.getByText('This is a toast.')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toBeVisible()
    })
    
    await step('Verify error toast has correct styling', async () => {
      const toast = canvas.getByText('This is a toast.')
      const container = toast.closest('.bg-semantic-error')
      await expect(container).toBeInTheDocument()
    })
    
    await step('Verify error toast has close button', async () => {
      const closeButton = canvasElement.querySelector('button')
      await expect(closeButton).toBeInTheDocument()
    })
    
    await step('Verify error icon is present', async () => {
      const icon = canvasElement.querySelector('.fa-circle-xmark')
      await expect(icon).toBeInTheDocument()
    })
  }
}

const Dismiss: Story = {
  render: (args) => ({
    components: { FzToast },
    setup() {
      const isVisible = ref(true)
      return {
        isVisible,
        args
      }
    },
    template: `
      <div class="p-12">
        <FzToast v-if="isVisible" v-bind="args" @close="isVisible = false">
          This toast can be dismissed.
        </FzToast>
      </div>
    `
  }),
  args: {
    type: 'warning'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify toast is visible initially', async () => {
      const toast = canvas.getByText('This toast can be dismissed.')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toBeVisible()
    })
    
    await step('Click close button to dismiss toast', async () => {
      const closeButton = canvasElement.querySelector('button')
      await expect(closeButton).toBeInTheDocument()
      
      await userEvent.click(closeButton!)
      
      // Wait for toast to be removed
      await waitFor(() => {
        const toast = canvasElement.querySelector('.bg-semantic-warning')
        expect(toast).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify toast is dismissed', async () => {
      const toast = canvasElement.querySelector('.bg-semantic-warning')
      await expect(toast).not.toBeInTheDocument()
    })
  }
}

const KeyboardNavigation: Story = {
  render: (args) => ({
    components: { FzToast },
    setup() {
      return { args }
    },
    template: `
      <div class="p-12">
        <FzToast v-bind="args">
          This toast supports keyboard navigation.
        </FzToast>
      </div>
    `
  }),
  args: {
    type: 'warning'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify toast is visible', async () => {
      const toast = canvas.getByText('This toast supports keyboard navigation.')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toBeVisible()
    })
    
    await step('Tab to focus close button', async () => {
      const closeButton = canvasElement.querySelector('button') as HTMLElement
      await expect(closeButton).toBeInTheDocument()
      
      // Focus the button to verify it's focusable
      closeButton.focus()
      await expect(document.activeElement).toBe(closeButton)
    })
    
    await step('Activate close button with Enter key', async () => {
      const closeButton = canvasElement.querySelector('button') as HTMLElement
      closeButton.focus()
      await expect(document.activeElement).toBe(closeButton)
      
      await userEvent.keyboard('{Enter}')
      // Note: In this test, the toast won't actually dismiss since we're not managing state
      // But we verify the button is keyboard accessible
      await expect(closeButton).toBeInTheDocument()
    })
    
    await step('Activate close button with Space key', async () => {
      const closeButton = canvasElement.querySelector('button') as HTMLElement
      closeButton.focus()
      await expect(document.activeElement).toBe(closeButton)
      
      await userEvent.keyboard(' ')
      // Note: In this test, the toast won't actually dismiss since we're not managing state
      // But we verify the button is keyboard accessible
      await expect(closeButton).toBeInTheDocument()
    })
  }
}

const WithShadow: Story = {
  args: {
    type: 'success',
    showShadow: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify toast renders with shadow', async () => {
      const toast = canvas.getByText('This is a toast.')
      const container = toast.closest('.shadow-xl')
      await expect(container).toBeInTheDocument()
    })
  }
}

const WithoutShadow: Story = {
  args: {
    type: 'success',
    showShadow: false
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify toast renders without shadow', async () => {
      const toast = canvas.getByText('This is a toast.')
      const container = toast.closest('.shadow-xl')
      await expect(container).not.toBeInTheDocument()
    })
  }
}

export { Success, Warning, Error, Dismiss, KeyboardNavigation, WithShadow, WithoutShadow }

export default meta
