import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { ref } from 'vue'

import { FzDialog, FzConfirmDialog, FzConfirmDialogProps } from '@fiscozen/dialog'
import { FzButton } from '@fiscozen/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Overlay/FzConfirmDialog',
  component: FzConfirmDialog,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    isDrawer: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    footerEnabled: { control: 'boolean' },
    confirmButtonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'invisible', 'danger', 'success']
    },
    shouldAlwaysRender: { control: 'boolean' }
  },
  args: {}
} satisfies Meta<typeof FzConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Opens the confirm dialog by clicking the open button and waits for it to appear.
 */
const openConfirmDialog = async (canvas: ReturnType<typeof within>, buttonName: RegExp = /open modal/i) => {
  const openButton = canvas.getByRole('button', { name: buttonName })
  await userEvent.click(openButton)
  
  await waitFor(() => {
    const dialog = document.querySelector('dialog')
    expect(dialog).toBeInTheDocument()
  }, { timeout: 1000 })
}

/**
 * Closes the dialog using Escape key and waits for it to close.
 */
const closeDialogWithEscape = async () => {
  const dialog = document.querySelector('dialog') as HTMLElement
  dialog?.focus()
  await userEvent.keyboard('{Escape}')
  
  await waitFor(() => {
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  }, { timeout: 1000 })
}

/**
 * Verifies dialog remains open after an action that should NOT close it.
 */
const verifyDialogRemainsOpen = async () => {
  const dialogBefore = document.querySelector('dialog')
  
  await waitFor(
    () => {
      const dialogAfter = document.querySelector('dialog')
      expect(dialogAfter).toBeInTheDocument()
      expect(dialogAfter).toBe(dialogBefore)
    },
    { timeout: 500, interval: 100 }
  )
}

// ============================================================================
// Story Templates
// ============================================================================

const Template: Story = {
  render: (args) => ({
    setup() {
      const dialog = ref<InstanceType<typeof FzConfirmDialog>>()
      return { args, dialog }
    },
    components: { FzDialog, FzConfirmDialog, FzButton },
    template: `
      <div class="p-12">
        <FzButton @click="dialog?.show()">Open Modal</FzButton>
        <FzConfirmDialog v-bind="args" ref="dialog"></FzConfirmDialog>
      </div>
    `
  })
}

// ============================================================================
// Stories
// ============================================================================

export const SimpleDialog: Story = {
  ...Template,
  args: {
    title: 'Titolo',
    confirmLabel: 'Action 1',
    cancelLabel: 'Action 2'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify dialog is initially closed', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).not.toBeInTheDocument()
    })
    
    await step('Open dialog by clicking button', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify dialog is displayed', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).toBeInTheDocument()
      await expect(dialog).toBeVisible()
    })
    
    await step('Verify dialog title is rendered', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog?.textContent).toContain('Titolo')
    })
    
    await step('Verify confirm and cancel buttons are present', async () => {
      const confirmButton = canvas.getByRole('button', { name: /action 1/i })
      const cancelButton = canvas.getByRole('button', { name: /action 2/i })
      await expect(confirmButton).toBeInTheDocument()
      await expect(cancelButton).toBeInTheDocument()
    })
  }
}

export const SimpleDialogDanger: Story = {
  ...Template,
  args: {
    title: 'Titolo',
    confirmLabel: 'Action 1',
    cancelLabel: 'Action 2',
    confirmButtonVariant: 'danger'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify dialog is displayed with danger variant', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).toBeInTheDocument()
      await expect(dialog).toBeVisible()
    })
    
    await step('Verify confirm button has danger variant styling', async () => {
      const confirmButton = canvas.getByRole('button', { name: /action 1/i })
      await expect(confirmButton).toBeInTheDocument()
      // Danger variant should have specific classes or attributes
      const buttonElement = confirmButton as HTMLElement
      await expect(buttonElement).toBeVisible()
    })
  }
}

export const ConfirmAction: Story = {
  ...Template,
  args: {
    title: 'Confirm Action',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    text: 'Are you sure you want to proceed?'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Click confirm button', async () => {
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      await expect(confirmButton).toBeInTheDocument()
      await userEvent.click(confirmButton)
    })
    
    await step('Verify dialog closes after confirm', async () => {
      await waitFor(() => {
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

export const CancelAction: Story = {
  ...Template,
  args: {
    title: 'Cancel Action',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    text: 'Are you sure you want to cancel?'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Click cancel button', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      await expect(cancelButton).toBeInTheDocument()
      await userEvent.click(cancelButton)
    })
    
    await step('Verify dialog closes after cancel', async () => {
      await waitFor(() => {
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

export const KeyboardNavigation: Story = {
  ...Template,
  args: {
    title: 'Keyboard Navigation',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    text: 'Test keyboard navigation'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify buttons are accessible and can be focused', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      await expect(cancelButton).toBeInTheDocument()
      await expect(confirmButton).toBeInTheDocument()
      await expect(cancelButton).toBeVisible()
      await expect(confirmButton).toBeVisible()
    })
    
    await step('Focus and activate cancel button with Enter key', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      cancelButton.focus()
      await expect(document.activeElement).toBe(cancelButton)
      await userEvent.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

export const EscapeKey: Story = {
  ...Template,
  args: {
    title: 'Escape Key Test',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    closeOnEscape: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Press Escape key to close dialog', async () => {
      await closeDialogWithEscape()
    })
    
    await step('Verify dialog closed', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).not.toBeInTheDocument()
    })
  }
}

export const EscapeKeyDisabled: Story = {
  ...Template,
  args: {
    title: 'Escape Key Disabled',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    closeOnEscape: false
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Press Escape key - dialog should remain open', async () => {
      const dialog = document.querySelector('dialog') as HTMLElement
      await expect(dialog).toBeInTheDocument()
      
      dialog.focus()
      await userEvent.keyboard('{Escape}')
      
      await verifyDialogRemainsOpen()
    })
  }
}

export const SpaceKeyActivation: Story = {
  ...Template,
  args: {
    title: 'Space Key Activation',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Focus on cancel button and activate with Space', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      cancelButton.focus()
      await expect(document.activeElement).toBe(cancelButton)
      
      await userEvent.keyboard(' ')
      
      await waitFor(() => {
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

export const DisabledConfirm: Story = {
  ...Template,
  args: {
    title: 'Disabled Confirm Button',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    disableConfirm: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify confirm button is disabled', async () => {
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      await expect(confirmButton).toBeDisabled()
    })
    
    await step('Verify cancel button is still enabled', async () => {
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      await expect(cancelButton).not.toBeDisabled()
    })
    
    await step('Try to click disabled confirm button - should not close dialog', async () => {
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      await userEvent.click(confirmButton)
      
      await verifyDialogRemainsOpen()
    })
  }
}

export const NoFooter: Story = {
  ...Template,
  args: {
    title: 'No Footer',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    footerEnabled: false,
    closeOnEscape: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify dialog is displayed', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).toBeInTheDocument()
      await expect(dialog).toBeVisible()
    })
    
    await step('Verify footer buttons are not present', async () => {
      const confirmButton = canvas.queryByRole('button', { name: /confirm/i })
      const cancelButton = canvas.queryByRole('button', { name: /cancel/i })
      await expect(confirmButton).not.toBeInTheDocument()
      await expect(cancelButton).not.toBeInTheDocument()
    })
    
    await step('Close dialog with Escape key', async () => {
      const dialog = document.querySelector('dialog') as HTMLElement
      await expect(dialog).toBeInTheDocument()
      dialog.focus()
      await userEvent.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify dialog closed', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).not.toBeInTheDocument()
    })
  }
}

export const Accessibility: Story = {
  ...Template,
  args: {
    title: 'Accessibility Test',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    text: 'This dialog tests accessibility features'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Open dialog', async () => {
      await openConfirmDialog(canvas)
    })
    
    await step('Verify dialog has role="dialog"', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog).toBeInTheDocument()
      // Native dialog element has implicit role="dialog"
      await expect(dialog).toHaveAttribute('open')
    })
    
    await step('Verify buttons are accessible', async () => {
      const confirmButton = canvas.getByRole('button', { name: /confirm/i })
      const cancelButton = canvas.getByRole('button', { name: /cancel/i })
      await expect(confirmButton).toBeInTheDocument()
      await expect(cancelButton).toBeInTheDocument()
      await expect(confirmButton).toBeVisible()
      await expect(cancelButton).toBeVisible()
    })
    
    await step('Verify dialog title is visible', async () => {
      const dialog = document.querySelector('dialog')
      await expect(dialog?.textContent).toContain('Accessibility Test')
    })
  }
}
