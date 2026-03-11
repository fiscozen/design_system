import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from '@storybook/test'
import { FzTextarea } from '@fiscozen/textarea'
import { ref } from 'vue'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
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
} satisfies Meta<typeof FzTextarea>

export default meta

type TextareaStory = StoryObj<typeof FzTextarea>

const Default: TextareaStory = {
  args: {
    id: 'default',
    'onUpdate:modelValue': fn()
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="args['onUpdate:modelValue']($event); value = $event" />`
  }),
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify textarea renders correctly', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeInTheDocument()
      await expect(textarea).toBeVisible()
    })

    await step('Verify textarea accessibility attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('id', 'default')
      await expect(textarea).toHaveAttribute('placeholder', 'This is a placeholder')
      await expect(textarea).toHaveAttribute('aria-required', 'false')
      await expect(textarea).toHaveAttribute('aria-invalid', 'false')
      await expect(textarea).toHaveAttribute('aria-disabled', 'false')
    })

    await step('Verify label association', async () => {
      const label = canvas.getByText(/This is a label/i)
      const textarea = canvas.getByLabelText(/This is a label/i)
      const labelFor = label.getAttribute('for')
      const textareaId = textarea.getAttribute('id')
      await expect(labelFor).toBe(textareaId)
    })

    await step('Verify update:modelValue IS called when typing', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.type(textarea, 'Test')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
  }
}

const WithValue: TextareaStory = {
  args: {
    id: 'with-value',
    modelValue: 'This is the initial value',
    'onUpdate:modelValue': fn()
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('This is the initial value')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="args['onUpdate:modelValue']($event); value = $event" />`
  }),
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify initial value is displayed', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await expect(textarea).toHaveValue('This is the initial value')
    })

    await step('Type additional text and verify update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Updated value')
      await expect(textarea).toHaveValue('Updated value')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })

    await step('Clear textarea and verify update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await expect(textarea).toHaveValue('')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
  }
}

const Small: TextareaStory = {
  args: {
    id: 'small',
    size: 'sm'
  }
}

const Large: TextareaStory = {
  args: {
    id: 'large',
    size: 'lg'
  }
}

const Error: TextareaStory = {
  args: {
    id: 'error',
    error: true,
    errorMessage: 'This is an error message'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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

    await step('Verify error ARIA attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-invalid', 'true')
      await expect(textarea).toHaveAttribute('aria-describedby', 'error-error')
    })

    await step('Verify error styling is applied', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('border-semantic-error')
    })

    await step('Verify error message has role="alert"', async () => {
      const alertContainer = canvasElement.querySelector('[role="alert"]')
      await expect(alertContainer).toBeInTheDocument()
      await expect(alertContainer?.textContent).toContain('This is an error message')
    })
  }
}

const Help: TextareaStory = {
  args: {
    id: 'help',
    helpMessage: 'This is a long long long long long long long long long long help message'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify help message is displayed', async () => {
      const helpText = canvas.getByText(/This is a long/i)
      await expect(helpText).toBeVisible()
    })

    await step('Verify help message ARIA linkage', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-describedby', 'help-help')
      const helpElement = canvasElement.querySelector('#help-help')
      await expect(helpElement).toBeInTheDocument()
    })
  }
}

const Valid: TextareaStory = {
  args: {
    id: 'valid',
    valid: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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

    await step('Verify valid check icon is decorative', async () => {
      const checkIcon = canvasElement.querySelector('.text-semantic-success')
      await expect(checkIcon).toHaveAttribute('aria-hidden', 'true')
    })

    await step('Verify valid styling includes padding for icon', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('pr-[38px]')
    })
  }
}

const Required: TextareaStory = {
  args: {
    id: 'required',
    required: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify required asterisk is displayed', async () => {
      const label = canvas.getByText(/This is a label/i)
      await expect(label.textContent).toContain('*')
    })

    await step('Verify required ARIA attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('required')
      await expect(textarea).toHaveAttribute('aria-required', 'true')
    })

    await step('Verify textarea is focusable', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await userEvent.tab()
      await expect(document.activeElement).toBe(textarea)
    })
  }
}

const Disabled: TextareaStory = {
  args: {
    id: 'disabled',
    disabled: true,
    'onUpdate:modelValue': fn()
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="args['onUpdate:modelValue']($event); value = $event" />`
  }),
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify disabled state', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeDisabled()
    })

    await step('Verify disabled ARIA attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeDisabled()
      await expect(textarea).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify disabled styling', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('disabled:bg-grey-100')
      await expect(textarea).toHaveClass('disabled:border-grey-100')
    })

    await step('Verify no interaction when disabled', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      const initialValue = textarea.value
      await userEvent.type(textarea, 'test')
      await expect(textarea).toHaveValue(initialValue)
    })

    await step('Verify update:modelValue is NOT called when typing in disabled textarea', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.type(textarea, 'test')
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

const Typing: TextareaStory = {
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="args['onUpdate:modelValue']($event); value = $event" />`
  }),
  args: {
    id: 'typing',
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Type in textarea field and verify update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'This is a test message')
      await expect(textarea).toHaveValue('This is a test message')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })

    await step('Type multiple lines and verify update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')
      await expect(textarea.value).toContain('Line 1')
      await expect(textarea.value).toContain('Line 2')
      await expect(textarea.value).toContain('Line 3')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })

    await step('Verify textarea can be cleared and update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await expect(textarea).toHaveValue('')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
  }
}

const KeyboardNavigation: TextareaStory = {
  args: {
    id: 'keyboard-nav',
    'onUpdate:modelValue': fn()
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="args['onUpdate:modelValue']($event); value = $event" />`
  }),
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Tab to focus textarea', async () => {
      await userEvent.tab()
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(document.activeElement).toBe(textarea)
    })

    await step('Type text with keyboard and verify update:modelValue IS called', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await userEvent.clear(textarea)
      await userEvent.type(textarea, 'Keyboard input test')
      await expect(textarea).toHaveValue('Keyboard input test')
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })

    await step('Navigate with arrow keys', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      textarea.focus()
      await userEvent.keyboard('{Home}')
      await userEvent.keyboard('{ArrowRight}')
      await expect(document.activeElement).toBe(textarea)
    })

    await step('Tab away from textarea', async () => {
      await userEvent.tab()
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(document.activeElement).not.toBe(textarea)
    })
  }
}

const Readonly: TextareaStory = {
  args: {
    id: 'readonly',
    readonly: true,
    modelValue: 'This content is read-only'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify readonly state', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('readonly')
    })

    await step('Verify readonly ARIA attribute', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-disabled', 'false')
    })
  }
}

export { Default, WithValue, Small, Large, Error, Help, Valid, Required, Disabled, Typing, KeyboardNavigation, Readonly }

export default meta
