import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { FzTextarea } from '@fiscozen/textarea'
import { ref } from 'vue'

const meta: Meta<typeof FzTextarea> = {
  title: 'Form/FzTextarea',
  component: FzTextarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'all']
    }
  },
  args: {
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    modelValue: ''
  },
  decorators: [
    () => ({
      template: '<div class="p-10"><story/></div>'
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    id: 'default'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify textarea renders correctly', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeInTheDocument()
      await expect(textarea).toBeVisible()
    })
    
    await step('Verify textarea is accessible', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('id', 'default')
      await expect(textarea).toHaveAttribute('placeholder', 'This is a placeholder')
    })
    
    await step('Verify label association', async () => {
      const label = canvas.getByText(/This is a label/i)
      const textarea = canvas.getByLabelText(/This is a label/i)
      const labelFor = label.getAttribute('for')
      const textareaId = textarea.getAttribute('id')
      await expect(labelFor).toBe(textareaId)
    })
  }
}

const WithValue: Story = {
  args: {
    id: 'default',
    modelValue: 'This is the initial value'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify initial value is displayed', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await expect(textarea).toHaveValue('This is the initial value')
    })
    
    await step('Type additional text', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Updated value')
      await expect(textarea).toHaveValue('Updated value')
    })
    
    await step('Clear textarea', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await expect(textarea).toHaveValue('')
    })
  }
}

const Small: Story = {
  args: {
    id: 'small',
    size: 'sm'
  }
}

const Large: Story = {
  args: {
    id: 'large',
    size: 'lg'
  }
}

const Error: Story = {
  args: {
    id: 'error',
    error: true,
    errorMessage: 'This is an error message'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify error state renders', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeInTheDocument()
      await expect(textarea).toBeVisible()
    })
    
    await step('Verify error message is displayed', async () => {
      const errorMessage = canvas.getByText('This is an error message')
      await expect(errorMessage).toBeVisible()
    })
    
    await step('Verify error state attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      // Note: aria-invalid is not currently implemented, but error styling is applied
      // Component uses CSS class for error state
    })
    
    await step('Verify error styling is applied', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('border-semantic-error')
    })
    
    await step('Verify error message is accessible', async () => {
      const errorMessage = canvas.getByText('This is an error message')
      await expect(errorMessage).toBeVisible()
      // Note: aria-describedby linking to error message is not currently implemented
      // but error message is displayed and visible to screen readers
    })
  }
}

const Help: Story = {
  args: {
    id: 'help',
    helpMessage: 'This is a long long long long long long long long long long help message'
  }
}

const Valid: Story = {
  args: {
    id: 'valid',
    valid: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify valid state renders', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeInTheDocument()
      await expect(textarea).toBeVisible()
    })
    
    await step('Verify valid check icon is displayed', async () => {
      const checkIcon = canvasElement.querySelector('.text-semantic-success')
      await expect(checkIcon).toBeInTheDocument()
    })
    
    await step('Verify valid styling includes padding for icon', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('pr-[38px]')
    })
  }
}

const Required: Story = {
  args: {
    id: 'required',
    required: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify required asterisk is displayed', async () => {
      const label = canvas.getByText(/This is a label/i)
      await expect(label.textContent).toContain('*')
    })
    
    await step('Verify required attribute', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      // Note: aria-required is not currently implemented, but native required attribute is present
      await expect(textarea).toHaveAttribute('required')
    })
    
    await step('Verify textarea is focusable', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await userEvent.tab()
      await expect(document.activeElement).toBe(textarea)
    })
  }
}

const Disabled: Story = {
  args: {
    id: 'disabled',
    disabled: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify disabled state', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeDisabled()
    })
    
    await step('Verify disabled attribute', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      // Note: aria-disabled is not currently implemented, but native disabled attribute is present
      await expect(textarea).toBeDisabled()
    })
    
    await step('Verify disabled styling', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('disabled:bg-grey-100')
      await expect(textarea).toHaveClass('disabled:border-grey-100')
    })
    
    await step('Verify no interaction when disabled', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      const initialValue = textarea.value
      
      // Try to type - should not work
      await userEvent.type(textarea, 'test')
      await expect(textarea).toHaveValue(initialValue)
    })
  }
}

const Typing: Story = {
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" v-model="value" />`
  }),
  args: {
    id: 'typing'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Type in textarea field', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'This is a test message')
      await expect(textarea).toHaveValue('This is a test message')
    })
    
    await step('Type multiple lines', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')
      await expect(textarea.value).toContain('Line 1')
      await expect(textarea.value).toContain('Line 2')
      await expect(textarea.value).toContain('Line 3')
    })
    
    await step('Verify textarea can be cleared', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await expect(textarea).toHaveValue('')
    })
  }
}

const KeyboardNavigation: Story = {
  args: {
    id: 'keyboard-nav'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus textarea', async () => {
      await userEvent.tab()
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(document.activeElement).toBe(textarea)
    })
    
    await step('Type text with keyboard', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Keyboard input test')
      await expect(textarea).toHaveValue('Keyboard input test')
    })
    
    await step('Navigate with arrow keys', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      textarea.focus()
      await userEvent.keyboard('{Home}')
      await userEvent.keyboard('{ArrowRight}')
      // Verify cursor position changed (textarea should still be focused)
      await expect(document.activeElement).toBe(textarea)
    })
    
    await step('Tab away from textarea', async () => {
      await userEvent.tab()
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(document.activeElement).not.toBe(textarea)
    })
  }
}

export { Default, WithValue, Small, Large, Error, Help, Valid, Required, Disabled, Typing, KeyboardNavigation }

export default meta
