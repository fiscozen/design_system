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

const Error: TextareaStory = {
  args: {
    id: 'error',
    error: true
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() { return { args } },
    template: `<FzTextarea v-bind="args"><template #errorMessage>This is an error message</template></FzTextarea>`
  }),
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
      await expect(textarea).toHaveClass('border-semantic-error-200')
      await expect(textarea).toHaveClass('focus:border-semantic-error-300')
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
    id: 'help'
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() { return { args } },
    template: `<FzTextarea v-bind="args"><template #helpText>This is a long long long long long long long long long long help message</template></FzTextarea>`
  }),
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
      await expect(textarea).toHaveClass('bg-grey-100')
      await expect(textarea).toHaveClass('border-grey-100')
      await expect(textarea).toHaveClass('text-grey-300')
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

    await step('Verify readonly styling matches disabled (same as FzInput)', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('bg-grey-100')
      await expect(textarea).toHaveClass('border-grey-100')
      await expect(textarea).toHaveClass('text-grey-300')
      await expect(textarea).toHaveClass('cursor-not-allowed')
    })

    await step('Verify readonly ARIA attribute', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify label is greyed out', async () => {
      const label = canvasElement.querySelector('label')
      await expect(label).toHaveClass('text-grey-300')
    })
  }
}

const ErrorWithValue: TextareaStory = {
  args: {
    id: 'error-with-value',
    error: true,
    modelValue: 'Some invalid content'
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('Some invalid content')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="value = $event"><template #errorMessage>This field has an error</template></FzTextarea>`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify value is displayed with error state', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await expect(textarea).toHaveValue('Some invalid content')
    })

    await step('Verify error border is applied', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('border-semantic-error-200')
    })

    await step('Verify error message is displayed', async () => {
      const errorMessage = canvas.getByText('This field has an error')
      await expect(errorMessage).toBeVisible()
    })

    await step('Verify error ARIA attributes', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-invalid', 'true')
      await expect(textarea).toHaveAttribute('aria-describedby', 'error-with-value-error')
    })
  }
}

const ValidWithValue: TextareaStory = {
  args: {
    id: 'valid-with-value',
    valid: true,
    modelValue: 'This content is valid'
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('This content is valid')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="value = $event" />`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify value is displayed', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await expect(textarea).toHaveValue('This content is valid')
    })

    await step('Verify check icon is visible', async () => {
      const checkIcon = canvasElement.querySelector('.text-semantic-success')
      await expect(checkIcon).toBeInTheDocument()
    })

    await step('Verify padding for icon', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('pr-[38px]')
    })

    await step('Verify default border (not error)', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('border-grey-300')
    })
  }
}

const DisabledWithValue: TextareaStory = {
  args: {
    id: 'disabled-with-value',
    disabled: true,
    modelValue: 'This content is locked'
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() {
      const value = ref('This content is locked')
      return { args, value }
    },
    template: `<FzTextarea v-bind="args" :modelValue="value" @update:modelValue="value = $event" />`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify value is displayed in disabled state', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i) as HTMLTextAreaElement
      await expect(textarea).toHaveValue('This content is locked')
    })

    await step('Verify textarea is disabled', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeDisabled()
    })

    await step('Verify disabled styling', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveClass('bg-grey-100')
      await expect(textarea).toHaveClass('border-grey-100')
      await expect(textarea).toHaveClass('text-grey-300')
    })

    await step('Verify label is greyed out', async () => {
      const label = canvasElement.querySelector('label')
      await expect(label).toHaveClass('text-grey-300')
    })
  }
}

const HelpDisabled: TextareaStory = {
  args: {
    id: 'help-disabled',
    disabled: true
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() { return { args } },
    template: `<FzTextarea v-bind="args"><template #helpText>This help text should be greyed out</template></FzTextarea>`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify help message is displayed', async () => {
      const helpText = canvas.getByText(/This help text should be greyed out/i)
      await expect(helpText).toBeVisible()
    })

    await step('Verify help text is greyed out when disabled', async () => {
      const helpSpan = canvasElement.querySelector(`#help-disabled-help`)
      await expect(helpSpan).toHaveClass('text-grey-300')
      await expect(helpSpan).not.toHaveClass('text-grey-500')
    })

    await step('Verify label is also greyed out', async () => {
      const label = canvasElement.querySelector('label')
      await expect(label).toHaveClass('text-grey-300')
    })

    await step('Verify textarea is disabled', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toBeDisabled()
    })
  }
}

const RequiredWithHelp: TextareaStory = {
  args: {
    id: 'required-with-help',
    required: true
  },
  render: (args) => ({
    components: { FzTextarea },
    setup() { return { args } },
    template: `<FzTextarea v-bind="args"><template #helpText>This field is mandatory</template></FzTextarea>`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify required asterisk is displayed', async () => {
      const label = canvas.getByText(/This is a label/i)
      await expect(label.textContent).toContain('*')
    })

    await step('Verify help message is displayed', async () => {
      const helpText = canvas.getByText('This field is mandatory')
      await expect(helpText).toBeVisible()
    })

    await step('Verify aria-required is true', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-required', 'true')
    })

    await step('Verify aria-describedby links to help', async () => {
      const textarea = canvas.getByLabelText(/This is a label/i)
      await expect(textarea).toHaveAttribute('aria-describedby', 'required-with-help-help')
    })
  }
}

export {
  Default, Error, Help, Valid, Required, Disabled, Readonly,
  ErrorWithValue, ValidWithValue, DisabledWithValue,
  HelpDisabled, RequiredWithHelp
}
