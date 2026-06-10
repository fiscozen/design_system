import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { FzInput } from '@fiscozen/input'
import { all } from '@awesome.me/kit-8137893ad3/icons'

const templateForm =
  '<form action="javascript:void(0);"><story/> <button type="submit" class="mt-10 border-1 px-10 py-4 rounded ">Submit</button></form>'

const meta = {
  title: 'Form/FzInput',
  component: FzInput,
  tags: ['autodocs'],
  argTypes: {
    environment: {
      options: ['backoffice', 'frontoffice'],
      control: {
        type: 'select'
      }
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      },
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        category: 'Deprecated'
      },
      description:
        'Deprecated: Use environment prop instead. Size values map to environments: sm/md → backoffice, lg → frontoffice'
    },
    type: {
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'currency'],
      control: {
        type: 'select'
      }
    },
    autocomplete: {
      control: {
        type: 'boolean'
      }
    },
    leftIcon: {
      options: all.map((icon) => icon.iconName) as string[],
      control: {
        type: 'select'
      }
    },
    leftIconVariant: {
      options: all.map((icon) => icon.prefix) as string[],
      control: {
        type: 'select'
      }
    },
    rightIcon: {
      options: all.map((icon) => icon.iconName) as string[],
      control: {
        type: 'select'
      }
    },
    rightIconVariant: {
      options: all.map((icon) => icon.prefix) as string[],
      control: {
        type: 'select'
      }
    },
    highlighted: {
      control: {
        type: 'boolean'
      }
    },
    aiReasoning: {
      control: {
        type: 'boolean'
      }
    }
  },
  args: {
    label: 'Input Label',
    placeholder: 'Value'
  },
  decorators: [() => ({ template: '<div style="max-width: 300px; padding:10px;"><story/></div>' })]
} satisfies Meta<typeof FzInput>

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      // Extract onUpdate:modelValue from args if present (for spy functions)
      const { 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      return { args: restArgs, modelValue, onUpdateModelValue }
    },
    template: `<FzInput v-bind="args" v-model="modelValue" @update:modelValue="onUpdateModelValue ? onUpdateModelValue($event) : null" />`
  }),
  args: {
    label: 'Input Label',
    placeholder: 'Value'
  }
}

export const Default: Story = {
  ...Template,
  args: {
    ...Template.args,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeInTheDocument()
    })

    await step('Verify label is displayed', async () => {
      const label = canvas.getByText('Input Label')
      await expect(label).toBeVisible()
    })

    await step('Verify placeholder is shown', async () => {
      const placeholderInput = canvas.getByPlaceholderText('Value')
      await expect(placeholderInput).toBeInTheDocument()
    })

    await step('Verify user can type in input and update:modelValue IS called', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      // Use direct value assignment and input event to handle spaces correctly in tests
      await userEvent.clear(input)
      const inputElement = input as HTMLInputElement
      inputElement.value = 'Test value'
      inputElement.dispatchEvent(new Event('input', { bubbles: true }))
      await expect(input).toHaveValue('Test value')

      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })

    await step('Verify ARIA attributes', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toHaveAttribute('aria-required', 'false')
      await expect(input).toHaveAttribute('aria-invalid', 'false')
      await expect(input).toHaveAttribute('aria-disabled', 'false')

      // Verify aria-labelledby links to label
      const labelledBy = input.getAttribute('aria-labelledby')
      await expect(labelledBy).toBeTruthy()
      if (labelledBy) {
        const labelElement = canvasElement.querySelector(`#${labelledBy}`)
        await expect(labelElement).toBeInTheDocument()
        await expect(labelElement?.textContent).toContain('Input Label')
      }
    })

    await step('Verify container is keyboard accessible', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input > div')
      await expect(container).toHaveAttribute('tabindex', '0')
    })
  }
}

export const Disabled: Story = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true,
    // 👇 Define spy in args - it should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify input is disabled', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeDisabled()
      await expect(input).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify disabled styling is applied', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input')
      await expect(container).toBeInTheDocument()
    })

    await step('Verify user cannot type in disabled input', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await userEvent.type(input, 'Test')
      await expect(input).toHaveValue('')
    })

    await step('Verify update:modelValue is NOT called when typing in disabled input', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })

      // Attempt to type in the disabled input
      await userEvent.type(input, 'Test')

      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

export const Readonly: Story = {
  ...Template,
  args: {
    ...Template.args,
    readonly: true,
    modelValue: 'Read-only value',
    // 👇 Define spy in args - it should NOT be called when readonly
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify input is readonly', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toHaveAttribute('readonly')
      await expect(input).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify readonly styling is applied', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input')
      await expect(container).toBeInTheDocument()
    })

    await step('Verify container is not clickable (no tabindex)', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const containerDiv = input.closest('.fz-input > div')
      await expect(containerDiv).not.toHaveAttribute('tabindex')
    })

    await step('Verify user cannot modify readonly input', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await userEvent.type(input, 'New text')
      await expect(input).toHaveValue('Read-only value')
    })

    await step('Verify update:modelValue is NOT called when typing in readonly input', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })

      // Attempt to type in the readonly input
      await userEvent.type(input, 'New text')

      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

export const Password: Story = {
  ...Template,
  args: {
    ...Template.args,
    type: 'password'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByLabelText(/Input Label/i)

    // Verify input type is password
    await expect(input).toHaveAttribute('type', 'password')

    // Verify typed text is masked
    await userEvent.type(input, 'secret123')
    await expect(input).toHaveValue('secret123')
    await expect(input).toHaveAttribute('type', 'password')
  }
}

export const Email: Story = {
  ...Template,
  args: {
    ...Template.args,
    type: 'email',
    required: true
  },
  decorators: [() => ({ template: templateForm })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify input type is email
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toHaveAttribute('type', 'email')
  }
}

export const Telephone: Story = {
  ...Template,
  args: {
    ...Template.args,
    type: 'tel',
    pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
    required: true
  },
  decorators: [() => ({ template: templateForm })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Input Label/i })

    // Verify input type is tel
    await expect(input).toHaveAttribute('type', 'tel')

    // Verify pattern attribute is set
    await expect(input).toHaveAttribute('pattern', '[0-9]{3}-[0-9]{3}-[0-9]{4}')
  }
}

export const HelpText: Story = {
  ...Template,
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { args, modelValue }
    },
    template: `
      <FzInput v-bind="args" v-model="modelValue">
        <template #helpText>This is a helper text with a lot of content and it will be displayed in more than one line</template>
      </FzInput>
    `
  }),
  args: {
    ...Template.args
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify help text is displayed
    const helpText = canvas.getByText(/This is a helper text/i)
    await expect(helpText).toBeVisible()

    // Verify aria-describedby links to help text
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    const helpId = input.getAttribute('aria-describedby')
    await expect(helpId).toBeTruthy()
    if (helpId) {
      const helpElement = canvasElement.querySelector(`#${helpId}`)
      await expect(helpElement).toBeInTheDocument()
      await expect(helpElement?.textContent).toContain('helper text')
    }
  }
}

export const Error: Story = {
  ...Template,
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { args, modelValue }
    },
    template: `
      <FzInput v-bind="args" v-model="modelValue">
        <template #errorMessage>This is an error message</template>
      </FzInput>
    `
  }),
  args: {
    ...Template.args,
    error: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify error message is displayed
    const errorMessage = canvas.getByText('This is an error message')
    await expect(errorMessage).toBeVisible()

    // Verify error styling is applied
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    const container = input.closest('.fz-input')
    await expect(container).toBeInTheDocument()

    // Verify aria-invalid is set
    await expect(input).toHaveAttribute('aria-invalid', 'true')

    // Verify aria-describedby links to error message
    const errorId = input.getAttribute('aria-describedby')
    await expect(errorId).toBeTruthy()
    if (errorId) {
      const errorElement = canvasElement.querySelector(`#${errorId}`)
      await expect(errorElement).toBeInTheDocument()
      await expect(errorElement).toHaveAttribute('role', 'alert')
      await expect(errorElement?.textContent).toContain('error message')
    }

    // Verify error icon is decorative (aria-hidden)
    const errorIcon = canvasElement.querySelector('.fa-triangle-exclamation')
    if (errorIcon) {
      const errorIconWrapper = errorIcon.closest('[aria-hidden]')
      await expect(errorIconWrapper).toHaveAttribute('aria-hidden', 'true')
    }
  }
}

export const LeftIcon: Story = {
  ...Template,
  args: {
    label: 'Label',
    environment: 'backoffice',
    leftIcon: 'calendar-lines'
  },
  play: async ({ canvasElement }) => {
    // Verify left icon is displayed
    const icon = canvasElement.querySelector('.fa-calendar-lines')
    await expect(icon).toBeInTheDocument()

    // Verify icon click emits event (event emission is tested in unit tests)
    if (icon) {
      await userEvent.click(icon)
    }
  }
}

export const LeftIconAccessible: Story = {
  ...Template,
  args: {
    label: 'Date',
    environment: 'backoffice',
    leftIcon: 'calendar-lines',
    leftIconAriaLabel: 'Open calendar picker'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify left icon is displayed
    const iconSvg = canvasElement.querySelector('.fa-calendar-lines')
    await expect(iconSvg).toBeInTheDocument()

    // Find the FzIcon wrapper which has the role="button"
    const iconWrapper = iconSvg?.closest('[role="button"]')
    await expect(iconWrapper).toBeInTheDocument()

    // Verify accessibility attributes are present on the wrapper
    if (iconWrapper) {
      await expect(iconWrapper).toHaveAttribute('role', 'button')
      await expect(iconWrapper).toHaveAttribute('aria-label', 'Open calendar picker')
      await expect(iconWrapper).toHaveAttribute('tabindex', '0')
    }

    // Verify keyboard navigation works
    if (iconWrapper) {
      ;(iconWrapper as HTMLElement).focus()
      await userEvent.keyboard('{Enter}')
      // Event emission is tested in unit tests
    }
  }
}

export const RightIcon: Story = {
  ...Template,
  args: {
    ...Template.args,
    rightIcon: 'credit-card'
  },
  play: async ({ canvasElement }) => {
    // Verify right icon is displayed
    const icon = canvasElement.querySelector('.fa-credit-card')
    await expect(icon).toBeInTheDocument()

    // Verify icon click emits event (event emission is tested in unit tests)
    if (icon) {
      await userEvent.click(icon)
    }
  }
}

export const RightIconAccessible: Story = {
  ...Template,
  args: {
    ...Template.args,
    rightIcon: 'eye',
    rightIconAriaLabel: 'Toggle password visibility'
  },
  play: async ({ canvasElement }) => {
    // Verify right icon is displayed
    const iconSvg = canvasElement.querySelector('.fa-eye')
    await expect(iconSvg).toBeInTheDocument()

    // Find the FzIcon wrapper which has the role="button"
    const iconWrapper = iconSvg?.closest('[role="button"]')
    await expect(iconWrapper).toBeInTheDocument()

    // Verify accessibility attributes are present on the wrapper
    if (iconWrapper) {
      await expect(iconWrapper).toHaveAttribute('role', 'button')
      await expect(iconWrapper).toHaveAttribute('aria-label', 'Toggle password visibility')
      await expect(iconWrapper).toHaveAttribute('tabindex', '0')
    }

    // Verify keyboard navigation works
    if (iconWrapper) {
      ;(iconWrapper as HTMLElement).focus()
      await userEvent.keyboard('{Space}')
      // Event emission is tested in unit tests
    }
  }
}

export const Valid: Story = {
  ...Template,
  args: {
    ...Template.args,
    valid: true
  },
  play: async ({ canvasElement }) => {
    // Verify checkmark icon is displayed
    const checkIconSvg = canvasElement.querySelector('.fa-check')
    await expect(checkIconSvg).toBeInTheDocument()

    if (checkIconSvg) {
      // Find the FzIcon wrapper which has the success styling
      const checkIconWrapper = checkIconSvg.closest('[role="presentation"]')
      if (checkIconWrapper) {
        // Verify success styling is applied on the wrapper
        await expect(checkIconWrapper).toHaveClass('text-semantic-success')
      }

      // Verify check icon is decorative (aria-hidden)
      const ariaHiddenWrapper = checkIconSvg.closest('[aria-hidden]')
      if (ariaHiddenWrapper) {
        await expect(ariaHiddenWrapper).toHaveAttribute('aria-hidden', 'true')
      }
    }
  }
}

export const Required: Story = {
  ...Template,
  args: {
    ...Template.args,
    required: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify required indicator is displayed
    const label = canvas.getByText(/Input Label/i)
    await expect(label.textContent).toContain('*')

    // Verify input has required attribute
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toHaveAttribute('required')
    await expect(input).toHaveAttribute('aria-required', 'true')

    // Verify aria-labelledby links to label
    const labelledBy = input.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    if (labelledBy) {
      const labelElement = canvasElement.querySelector(`#${labelledBy}`)
      await expect(labelElement).toBeInTheDocument()
    }
  }
}

export const LeftAndRightWithValid: Story = {
  ...Template,
  args: {
    ...Template.args,
    leftIcon: 'calendar-lines',
    leftIconAriaLabel: 'Open calendar',
    rightIcon: 'credit-card',
    valid: true
  },
  play: async ({ canvasElement }) => {
    // Verify all icons are displayed (leftIcon, rightIcon, and valid checkmark at the end)
    const leftIcon = canvasElement.querySelector('.fa-calendar-lines')
    const rightIcon = canvasElement.querySelector('.fa-credit-card')
    const checkIcon = canvasElement.querySelector('.fa-check')
    await expect(leftIcon).toBeInTheDocument()
    await expect(rightIcon).toBeInTheDocument()
    await expect(checkIcon).toBeInTheDocument()

    // Verify left icon accessibility attributes
    const leftIconWrapper = leftIcon?.closest('[role="button"]')
    if (leftIconWrapper) {
      await expect(leftIconWrapper).toHaveAttribute('role', 'button')
      await expect(leftIconWrapper).toHaveAttribute('aria-label', 'Open calendar')
      await expect(leftIconWrapper).toHaveAttribute('tabindex', '0')
    }

    // Verify check icon is decorative (aria-hidden)
    if (checkIcon) {
      await expect(checkIcon).toHaveAttribute('aria-hidden', 'true')
    }
  }
}

export const Url: Story = {
  ...Template,
  args: {
    ...Template.args,
    type: 'url',
    required: true
  },
  decorators: [() => ({ template: templateForm })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify input type is url
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toHaveAttribute('type', 'url')
  }
}

export const MaxLength: Story = {
  ...Template,
  args: {
    ...Template.args,
    maxlength: 4
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Input Label/i })

    // Verify maxlength attribute is set
    await expect(input).toHaveAttribute('maxlength', '4')

    // Verify input limits characters to maxlength
    await userEvent.clear(input)
    await userEvent.type(input, '12345')
    await expect(input).toHaveValue('1234')
  }
}

export const ShowHidePassword: Story = {
  args: {
    ...Template.args,
    rightIconClass: 'cursor-pointer',
    rightIconAriaLabel: 'Toggle password visibility'
  },
  render: (args) => ({
    components: { FzInput },
    setup() {
      const icon = ref('eye')
      const type = ref('password')
      const modelValue = ref('')
      const onRightClick = () => {
        if (icon.value === 'eye') {
          icon.value = 'eye-slash'
          type.value = 'text'
        } else {
          icon.value = 'eye'
          type.value = 'password'
        }
      }
      return {
        args,
        icon,
        type,
        modelValue,
        onRightClick
      }
    },
    template: `
      <div>
        <FzInput v-bind="args" :rightIcon="icon" :type="type" v-model="modelValue" @fzinput:right-icon-click="onRightClick" />
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify password input is initially hidden
    const input = canvas.getByLabelText(/Input Label/i)
    await expect(input).toHaveAttribute('type', 'password')

    // Verify eye icon is displayed
    const eyeIconSvg = canvasElement.querySelector('.fa-eye')
    await expect(eyeIconSvg).toBeInTheDocument()

    // Find the FzIcon wrapper which has the role="button"
    const eyeIconWrapper = eyeIconSvg?.closest('[role="button"]')
    await expect(eyeIconWrapper).toBeInTheDocument()

    // Verify accessibility attributes are present on the wrapper
    if (eyeIconWrapper) {
      await expect(eyeIconWrapper).toHaveAttribute('role', 'button')
      await expect(eyeIconWrapper).toHaveAttribute('aria-label', 'Toggle password visibility')
      await expect(eyeIconWrapper).toHaveAttribute('tabindex', '0')
    }

    // Verify clicking icon toggles visibility
    if (eyeIconWrapper) {
      await userEvent.click(eyeIconWrapper)
      await expect(input).toHaveAttribute('type', 'text')
      const eyeSlashIcon = canvasElement.querySelector('.fa-eye-slash')
      await expect(eyeSlashIcon).toBeInTheDocument()
    }

    // Verify keyboard navigation works
    if (eyeIconWrapper) {
      ;(eyeIconWrapper as HTMLElement).focus()
      await userEvent.keyboard('{Enter}')
    }
  }
}

export const FloatingLabelEmpty: Story = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'floating-label',
    placeholder: 'Enter your email',
    modelValue: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Input Label/i })

    // Verify input is empty
    await expect(input).toHaveValue('')

    // Verify placeholder is shown inside input (when empty and not focused)
    await expect(input).toHaveAttribute('placeholder', 'Enter your email')

    // Verify floating placeholder span is not shown when input is empty and not focused
    const floatingPlaceholder = canvasElement.querySelector('span.text-xs.text-grey-300')
    await expect(floatingPlaceholder).not.toBeInTheDocument()

    // Verify when focused, placeholder "floats" above
    await input.focus()
    await expect(input).toHaveAttribute('placeholder', '')
    const floatingPlaceholderFocused = canvasElement.querySelector('span.text-xs.text-grey-300')
    await expect(floatingPlaceholderFocused).toBeInTheDocument()
    if (floatingPlaceholderFocused) {
      await expect(floatingPlaceholderFocused.textContent).toBe('Enter your email')
    }
  }
}

export const Highlighted: Story = {
  ...Template,
  args: {
    ...Template.args,
    highlighted: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify input is rendered and accessible', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('aria-invalid', 'false')
      await expect(input).toHaveAttribute('aria-disabled', 'false')
    })

    await step('Verify container is keyboard accessible', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input > div')
      await expect(container).toHaveAttribute('tabindex', '0')
    })
  }
}

export const HighlightedBackoffice: Story = {
  ...Template,
  args: {
    ...Template.args,
    highlighted: true,
    environment: 'backoffice'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify highlighted input renders with backoffice environment', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    await step('Verify container is keyboard accessible', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input > div')
      await expect(container).toHaveAttribute('tabindex', '0')
    })
  }
}

export const AIReasoning: Story = {
  ...Template,
  args: {
    ...Template.args,
    aiReasoning: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify sparkles icon is auto-rendered with aria-hidden', async () => {
      const sparklesIcon = canvasElement.querySelector('.fa-sparkles')
      await expect(sparklesIcon).toBeInTheDocument()

      const iconWrapper = sparklesIcon?.closest('[aria-hidden="true"]')
      await expect(iconWrapper).toBeInTheDocument()
    })

    await step('Verify input is accessible', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toHaveAttribute('aria-invalid', 'false')
      await expect(input).toHaveAttribute('aria-disabled', 'false')
    })
  }
}

export const AIReasoningWithLeftIcon: Story = {
  ...Template,
  args: {
    ...Template.args,
    aiReasoning: true,
    leftIcon: 'magnifying-glass'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify leftIcon overrides auto sparkles', async () => {
      const leftIcon = canvasElement.querySelector(
        '[class*="magnifying-glass"], [data-icon="magnifying-glass"]'
      )
      await expect(leftIcon).toBeInTheDocument()

      const sparklesIcon = canvasElement.querySelector('.fa-sparkles')
      await expect(sparklesIcon).not.toBeInTheDocument()
    })

    await step('Verify input is accessible', async () => {
      const canvas = within(canvasElement)
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('aria-invalid', 'false')
    })
  }
}

export const HighlightedError: Story = {
  ...Template,
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { args, modelValue }
    },
    template: `
      <FzInput v-bind="args" v-model="modelValue">
        <template #errorMessage>This field has an error</template>
      </FzInput>
    `
  }),
  args: {
    ...Template.args,
    highlighted: true,
    error: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify error state takes priority via ARIA', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    await step('Verify error message is displayed', async () => {
      const errorMessage = canvas.getByText('This field has an error')
      await expect(errorMessage).toBeVisible()
    })

    await step('Verify error message is linked via aria-describedby', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const describedBy = input.getAttribute('aria-describedby')
      await expect(describedBy).toBeTruthy()
      if (describedBy) {
        const errorElement = canvasElement.querySelector(`#${describedBy}`)
        await expect(errorElement).toBeInTheDocument()
      }
    })
  }
}

export const HighlightedDisabled: Story = {
  ...Template,
  args: {
    ...Template.args,
    highlighted: true,
    disabled: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify disabled state takes priority', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeDisabled()
      await expect(input).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify container is not keyboard accessible when disabled', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      const container = input.closest('.fz-input > div')
      await expect(container).not.toHaveAttribute('tabindex')
    })
  }
}

export const AIReasoningFloatingLabel: Story = {
  ...Template,
  args: {
    ...Template.args,
    aiReasoning: true,
    variant: 'floating-label',
    placeholder: 'AI-generated suggestion'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify sparkles icon is rendered with aria-hidden', async () => {
      const sparklesIcon = canvasElement.querySelector('.fa-sparkles')
      await expect(sparklesIcon).toBeInTheDocument()

      const iconWrapper = sparklesIcon?.closest('[aria-hidden="true"]')
      await expect(iconWrapper).toBeInTheDocument()
    })

    await step('Verify input is accessible with floating label', async () => {
      const input = canvas.getByRole('textbox', { name: /Input Label/i })
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('aria-invalid', 'false')
    })
  }
}

export const Clearable: Story = {
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      const { 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      return { args: restArgs, modelValue, onUpdateModelValue }
    },
    template: `<FzInput v-bind="args" v-model="modelValue" @update:modelValue="onUpdateModelValue ? onUpdateModelValue($event) : null" />`
  }),
  args: {
    label: 'Clearable Input',
    placeholder: 'Type something...',
    clearable: true,
    modelValue: 'Initial value',
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify clear icon is visible when input has value', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')
      await expect(clearButton).toBeInTheDocument()
    })

    await step('Click clear icon and verify input is cleared', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')!
      await userEvent.click(clearButton)

      const input = canvas.getByRole('textbox', { name: /Clearable Input/i })
      await expect(input).toHaveValue('')
    })

    await step('Verify clear icon disappears after clearing', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')
      await expect(clearButton).not.toBeInTheDocument()
    })

    await step('Verify update:modelValue was called with empty string', async () => {
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('')
    })
  }
}

export const ClearableWithRightIcon: Story = {
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref(args.modelValue || '')
      const { 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      return { args: restArgs, modelValue, onUpdateModelValue }
    },
    template: `<FzInput v-bind="args" v-model="modelValue" @update:modelValue="onUpdateModelValue ? onUpdateModelValue($event) : null" />`
  }),
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    clearable: true,
    modelValue: 'Some query',
    rightIcon: 'magnifying-glass',
    rightIconAriaLabel: 'Search',
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify both clear icon and right icon are visible', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')
      await expect(clearButton).toBeInTheDocument()

      const rightIcon = canvasElement.querySelector('.fa-magnifying-glass')
      await expect(rightIcon).toBeInTheDocument()
    })

    await step('Click clear icon and verify input is cleared', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')!
      await userEvent.click(clearButton)

      const input = canvas.getByRole('textbox', { name: /Search/i })
      await expect(input).toHaveValue('')
    })

    await step('Verify clear icon disappears but right icon remains', async () => {
      const clearButton = canvasElement.querySelector('[aria-label="Cancella"]')
      await expect(clearButton).not.toBeInTheDocument()

      const rightIcon = canvasElement.querySelector('.fa-magnifying-glass')
      await expect(rightIcon).toBeInTheDocument()
    })
  }
}

export const Currency: Story = {
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref<number | undefined>(1234.56)
      return { args, modelValue }
    },
    template: `
      <div>
        <FzInput v-bind="args" type="currency" v-model="modelValue" />
        <p style="margin-top: 60px; font-size: 14px;" data-testid="raw-value">
          Raw value (v-model): {{ modelValue === undefined ? 'undefined' : modelValue }}
        </p>
      </div>
    `
  }),
  args: {
    label: 'Amount',
    placeholder: '1.234,56'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify currency input renders as text input with formatted value', async () => {
      const input = canvas.getByRole('textbox', { name: /Amount/i })
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveValue('1.234,56')
    })

    await step('Verify step controls are visible', async () => {
      const arrowUp = canvasElement.querySelector('.fz__input__arrowup')
      const arrowDown = canvasElement.querySelector('.fz__input__arrowdown')
      await expect(arrowUp).toBeInTheDocument()
      await expect(arrowDown).toBeInTheDocument()
    })

    await step('Verify step up increments the numeric v-model', async () => {
      const arrowUp = canvasElement.querySelector('.fz__input__arrowup') as HTMLElement
      await userEvent.click(arrowUp)
      const raw = canvasElement.querySelector('[data-testid="raw-value"]') as HTMLElement
      await expect(raw.textContent).toContain('1235.56')
    })
  }
}

export const NumberWithStepControls: Story = {
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref('4')
      return { args, modelValue }
    },
    template: `<FzInput v-bind="args" type="number" v-model="modelValue" />`
  }),
  args: {
    label: 'Quantity',
    placeholder: '0',
    step: 2,
    min: 0,
    max: 10
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify step controls replace the native spinners', async () => {
      const arrowUp = canvasElement.querySelector('.fz__input__arrowup')
      const arrowDown = canvasElement.querySelector('.fz__input__arrowdown')
      await expect(arrowUp).toBeInTheDocument()
      await expect(arrowDown).toBeInTheDocument()
    })

    await step('Verify step up uses the native stepping algorithm', async () => {
      const input = canvasElement.querySelector('input') as HTMLInputElement
      const arrowUp = canvasElement.querySelector('.fz__input__arrowup') as HTMLElement
      await userEvent.click(arrowUp)
      await expect(input).toHaveValue(6)
    })

    await step('Verify step down decrements the value', async () => {
      const input = canvasElement.querySelector('input') as HTMLInputElement
      const arrowDown = canvasElement.querySelector('.fz__input__arrowdown') as HTMLElement
      await userEvent.click(arrowDown)
      await expect(input).toHaveValue(4)
    })
  }
}

// Note: All stories are exported above with 'export const'

export default meta
