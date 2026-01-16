import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzToastQueue, FzToastQueueProps, enqueueToast } from '@fiscozen/toast'
import { FzButton } from '@fiscozen/button'
import { ref } from 'vue'

const meta: Meta<typeof FzToastQueue> = {
  title: 'Messages/FzToastQueue',
  tags: ['autodocs'],
  component: FzToastQueue,
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right']
    }
  }
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: 'This is a toast.' })
      }

      function handleEnqueueLong(type: 'success' | 'warning' | 'error') {
        enqueueToast({
          type,
          message:
            'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.'
        })
      }

      return {
        handleEnqueue,
        handleEnqueueLong,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
          <FzButton @click="handleEnqueue('error')" class="mb-6">Error</FzButton>
          <FzButton @click="handleEnqueueLong('error')" class="mb-6 mr-auto">Error long</FzButton>
          <FzToastQueue v-bind="args" />
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify toast queue container renders', async () => {
      const queueContainer = canvasElement.querySelector('.hoverable')
      await expect(queueContainer).toBeInTheDocument()
    })
    
    await step('Verify control buttons render', async () => {
      const successButton = canvas.getByRole('button', { name: /^success$/i })
      const warningButton = canvas.getByRole('button', { name: /^warning$/i })
      // Use exact match to distinguish from "Error long"
      const errorButton = canvas.getByRole('button', { name: 'Error' })
      
      await expect(successButton).toBeInTheDocument()
      await expect(warningButton).toBeInTheDocument()
      await expect(errorButton).toBeInTheDocument()
    })
    
    await step('Add a toast to the queue', async () => {
      const successButton = canvas.getByRole('button', { name: /^success$/i })
      await userEvent.click(successButton)
      
      // Wait for toast to appear
      await waitFor(() => {
        const toast = canvasElement.querySelector('.bg-semantic-success')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify toast message is displayed', async () => {
      const toastMessage = canvasElement.querySelector('.toast')
      await expect(toastMessage).toBeInTheDocument()
      await expect(toastMessage?.textContent).toContain('This is a toast.')
    })
  }
}

const EnqueueMultiple: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: `${type.charAt(0).toUpperCase() + type.slice(1)} toast message` }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Add Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Add Warning</FzButton>
          <FzButton @click="handleEnqueue('error')">Add Error</FzButton>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add multiple toasts to the queue', async () => {
      const successButton = canvas.getByRole('button', { name: /add success/i })
      const warningButton = canvas.getByRole('button', { name: /add warning/i })
      const errorButton = canvas.getByRole('button', { name: /add error/i })
      
      // Add three toasts
      await userEvent.click(successButton)
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBeGreaterThanOrEqual(1)
      }, { timeout: 1000 })
      
      await userEvent.click(warningButton)
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBeGreaterThanOrEqual(2)
      }, { timeout: 1000 })
      
      await userEvent.click(errorButton)
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBeGreaterThanOrEqual(3)
      }, { timeout: 1000 })
    })
    
    await step('Verify toasts are stacked in queue', async () => {
      // All three toasts should be in the queue
      const toasts = canvasElement.querySelectorAll('.toast')
      await expect(toasts.length).toBe(3)
    })
    
    await step('Verify different toast types are present', async () => {
      const successToast = canvasElement.querySelector('.bg-semantic-success')
      const warningToast = canvasElement.querySelector('.bg-semantic-warning')
      const errorToast = canvasElement.querySelector('.bg-semantic-error')
      
      await expect(successToast).toBeInTheDocument()
      await expect(warningToast).toBeInTheDocument()
      await expect(errorToast).toBeInTheDocument()
    })
  }
}

const DismissToast: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: `${type.charAt(0).toUpperCase() + type.slice(1)} toast` }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('warning')">Add Warning Toast</FzButton>
          <FzButton @click="handleEnqueue('error')">Add Error Toast</FzButton>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add a warning toast', async () => {
      const warningButton = canvas.getByRole('button', { name: /add warning toast/i })
      await userEvent.click(warningButton)
      
      await waitFor(() => {
        const toast = canvasElement.querySelector('.bg-semantic-warning')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify close button is present on warning toast', async () => {
      const closeButton = canvasElement.querySelector('.toast button')
      await expect(closeButton).toBeInTheDocument()
    })
    
    await step('Click close button to dismiss toast', async () => {
      const closeButton = canvasElement.querySelector('.toast button') as HTMLElement
      await expect(closeButton).toBeInTheDocument()
      
      await userEvent.click(closeButton)
      
      // Wait for toast to be removed
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBe(0)
      }, { timeout: 1000 })
    })
    
    await step('Verify toast queue is empty after dismiss', async () => {
      const toasts = canvasElement.querySelectorAll('.toast')
      await expect(toasts.length).toBe(0)
    })
  }
}

const HoverExpand: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error', index: number) {
        enqueueToast({ type, message: `Toast number ${index}` }, toasts)
      }

      // Pre-populate with toasts
      setTimeout(() => {
        enqueueToast({ type: 'success', message: 'First toast in queue' }, toasts)
        enqueueToast({ type: 'warning', message: 'Second toast in queue' }, toasts)
        enqueueToast({ type: 'error', message: 'Third toast in queue' }, toasts)
      }, 100)

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <p class="text-grey-500">Hover over the toast queue to expand it</p>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" :openOnNewToast="false" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    // Wait for initial toasts to be added
    await waitFor(() => {
      const toasts = canvasElement.querySelectorAll('.toast')
      expect(toasts.length).toBe(3)
    }, { timeout: 2000 })
    
    await step('Verify toasts are stacked (not expanded) initially', async () => {
      const queueContainer = canvasElement.querySelector('.hoverable')
      await expect(queueContainer).toBeInTheDocument()
      
      // Should not have hovering class initially
      await expect(queueContainer).not.toHaveClass('hovering')
    })
    
    await step('Hover over toast queue to expand', async () => {
      const queueContainer = canvasElement.querySelector('.hoverable') as HTMLElement
      
      // Trigger hover by mouse enter
      await userEvent.hover(queueContainer)
      
      // Wait for hover state to be applied
      await waitFor(() => {
        expect(queueContainer).toHaveClass('hovering')
      }, { timeout: 1000 })
    })
    
    await step('Verify toasts are visible when expanded', async () => {
      // All toasts should be visible when expanded
      const toasts = canvasElement.querySelectorAll('.toast')
      await expect(toasts.length).toBe(3)
      
      // Each toast should have content
      const firstToast = canvasElement.querySelector('.toast')
      await expect(firstToast?.textContent).toContain('toast')
    })
    
    await step('Unhover to collapse toast queue', async () => {
      const queueContainer = canvasElement.querySelector('.hoverable') as HTMLElement
      
      // Trigger unhover
      await userEvent.unhover(queueContainer)
      
      // Wait for hover state to be removed
      await waitFor(() => {
        expect(queueContainer).not.toHaveClass('hovering')
      }, { timeout: 1000 })
    })
  }
}

const LeftAlign: Story = {
  args: {
    align: 'left'
  },
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: 'Left-aligned toast message' }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <div>
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
          <FzButton @click="handleEnqueue('success')" class="ml-auto">Add Toast</FzButton>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add a toast with left alignment', async () => {
      const addButton = canvas.getByRole('button', { name: /add toast/i })
      await userEvent.click(addButton)
      
      await waitFor(() => {
        const toast = canvasElement.querySelector('.toast')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify left alignment class is applied', async () => {
      const toast = canvasElement.querySelector('.toast')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toHaveClass('left-0')
    })
  }
}

const RightAlign: Story = {
  args: {
    align: 'right'
  },
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: 'Right-aligned toast message' }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Add Toast</FzButton>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add a toast with right alignment', async () => {
      const addButton = canvas.getByRole('button', { name: /add toast/i })
      await userEvent.click(addButton)
      
      await waitFor(() => {
        const toast = canvasElement.querySelector('.toast')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify right alignment class is applied', async () => {
      const toast = canvasElement.querySelector('.toast')
      await expect(toast).toBeInTheDocument()
      await expect(toast).toHaveClass('right-0')
    })
  }
}

const KeyboardNavigation: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue() {
        enqueueToast({ type: 'warning', message: 'Toast with keyboard navigation' }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue()">Add Toast</FzButton>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add a warning toast (has close button)', async () => {
      const addButton = canvas.getByRole('button', { name: /add toast/i })
      await userEvent.click(addButton)
      
      await waitFor(() => {
        const toast = canvasElement.querySelector('.toast')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify close button is focusable', async () => {
      const closeButton = canvasElement.querySelector('.toast button') as HTMLElement
      await expect(closeButton).toBeInTheDocument()
      
      // Focus the close button
      closeButton.focus()
      await expect(document.activeElement).toBe(closeButton)
    })
    
    await step('Activate close button with Enter key', async () => {
      const closeButton = canvasElement.querySelector('.toast button') as HTMLElement
      closeButton.focus()
      
      await userEvent.keyboard('{Enter}')
      
      // Toast should be dismissed
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBe(0)
      }, { timeout: 1000 })
    })
  }
}

const SpaceKeyDismiss: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue() {
        enqueueToast({ type: 'error', message: 'Toast to dismiss with Space key' }, toasts)
      }

      return {
        handleEnqueue,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue()">Add Error Toast</FzButton>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Add an error toast (has close button)', async () => {
      const addButton = canvas.getByRole('button', { name: /add error toast/i })
      await userEvent.click(addButton)
      
      await waitFor(() => {
        const toast = canvasElement.querySelector('.toast')
        expect(toast).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Focus close button and dismiss with Space key', async () => {
      const closeButton = canvasElement.querySelector('.toast button') as HTMLElement
      await expect(closeButton).toBeInTheDocument()
      
      closeButton.focus()
      await expect(document.activeElement).toBe(closeButton)
      
      await userEvent.keyboard(' ')
      
      // Toast should be dismissed
      await waitFor(() => {
        const toasts = canvasElement.querySelectorAll('.toast')
        expect(toasts.length).toBe(0)
      }, { timeout: 1000 })
    })
  }
}

const Accessibility: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      // Pre-populate with toasts for accessibility testing
      setTimeout(() => {
        enqueueToast({ type: 'success', message: 'Success notification for screen readers' }, toasts)
        enqueueToast({ type: 'error', message: 'Error notification for screen readers' }, toasts)
      }, 100)

      return {
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <p class="text-grey-500">Toast queue with accessibility features</p>
          <div class="ml-auto">
            <FzToastQueue :toasts="toasts" v-bind="args" :openOnNewToast="false" />
          </div>
        </div>
      `
  }),
  play: async ({ canvasElement, step }) => {
    // Wait for initial toasts to be added
    await waitFor(() => {
      const toasts = canvasElement.querySelectorAll('.toast')
      expect(toasts.length).toBe(2)
    }, { timeout: 2000 })
    
    await step('Verify toast queue container has proper structure', async () => {
      const queueContainer = canvasElement.querySelector('.hoverable')
      await expect(queueContainer).toBeInTheDocument()
    })
    
    await step('Verify success toast has proper styling', async () => {
      const successToast = canvasElement.querySelector('.bg-semantic-success')
      await expect(successToast).toBeInTheDocument()
    })
    
    await step('Verify error toast has close button', async () => {
      // Error toasts should have close buttons
      const closeButtons = canvasElement.querySelectorAll('.toast button')
      await expect(closeButtons.length).toBeGreaterThanOrEqual(1)
    })
    
    await step('Verify toast messages are visible text content', async () => {
      // Screen readers should be able to read toast messages
      const toasts = canvasElement.querySelectorAll('.toast')
      
      let hasSuccessMessage = false
      let hasErrorMessage = false
      
      toasts.forEach(toast => {
        const text = toast.textContent || ''
        if (text.includes('Success notification')) hasSuccessMessage = true
        if (text.includes('Error notification')) hasErrorMessage = true
      })
      
      await expect(hasSuccessMessage).toBe(true)
      await expect(hasErrorMessage).toBe(true)
    })
  }
}

const CustomQueue: Story = {
  args: {},
  render: (args: FzToastQueueProps) => ({
    components: { FzToastQueue, FzButton },
    setup: () => {
      const toasts = ref<any[]>([])

      function handleEnqueue(type: 'success' | 'warning' | 'error') {
        enqueueToast({ type, message: 'This is a toast.' }, toasts)
      }

      function handleEnqueueLong(type: 'success' | 'warning' | 'error') {
        enqueueToast(
          {
            type,
            message:
              'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.'
          },
          toasts
        )
      }

      return {
        handleEnqueue,
        handleEnqueueLong,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
          <FzButton @click="handleEnqueue('error')" class="mb-6">Error</FzButton>
          <FzButton @click="handleEnqueueLong('error')" class="mb-6 mr-auto">Error long</FzButton>
          <FzToastQueue :toasts="toasts" v-bind="args" />
        </div>
      `
  })
}

export { Default, EnqueueMultiple, DismissToast, HoverExpand, LeftAlign, RightAlign, KeyboardNavigation, SpaceKeyDismiss, Accessibility, CustomQueue }

export default meta
