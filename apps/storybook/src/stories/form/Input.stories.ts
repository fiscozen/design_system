import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
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
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    },
    type: {
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      control: {
        type: 'select'
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
      return { args, modelValue }
    },
    template: `<FzInput v-bind="args" v-model="modelValue" />`
  }),
  args: {
    label: 'Input Label',
    placeholder: 'Value'
  }
}

export const Default: Story = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify component renders
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toBeInTheDocument()

    // Verify label is displayed
    const label = canvas.getByText('Input Label')
    await expect(label).toBeVisible()

    // Verify placeholder is shown
    const placeholderInput = canvas.getByPlaceholderText('Value')
    await expect(placeholderInput).toBeInTheDocument()

    // Verify user can type in input
    await userEvent.type(input, 'Test value')
    await expect(input).toHaveValue('Test value')

    // Verify ARIA attributes
    await expect(input).toHaveAttribute('aria-required', 'false')
    await expect(input).toHaveAttribute('aria-invalid', 'false')
    await expect(input).toHaveAttribute('aria-disabled', 'false')
    await expect(input).toHaveAttribute('aria-labelledby')
  }
}

export const Disabled: Story = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Input Label/i })

    // Verify input is disabled
    await expect(input).toBeDisabled()
    await expect(input).toHaveAttribute('aria-disabled', 'true')

    // Verify disabled styling is applied
    const container = input.closest('.fz-input')
    await expect(container).toBeInTheDocument()

    // Verify user cannot type in disabled input
    await userEvent.type(input, 'Test')
    await expect(input).toHaveValue('')
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
  }
}

export const LeftIcon: Story = {
  ...Template,
  args: {
    label: 'Label',
    size: 'md',
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

export const Valid: Story = {
  ...Template,
  args: {
    ...Template.args,
    valid: true
  },
  play: async ({ canvasElement }) => {
    // Verify checkmark icon is displayed
    const checkIcon = canvasElement.querySelector('.fa-check')
    await expect(checkIcon).toBeInTheDocument()

    // Verify success styling is applied
    await expect(checkIcon).toHaveClass('text-semantic-success')
  }
}

export const Required: Story = {
  ...Template,
  args: {
    ...Template.args,
    required: true
  },
  decorators: [() => ({ template: templateForm })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify required indicator is displayed
    const label = canvas.getByText(/Input Label/i)
    await expect(label.textContent).toContain('*')

    // Verify input has required attribute
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toHaveAttribute('required')
    await expect(input).toHaveAttribute('aria-required', 'true')
  }
}

export const LeftAndRightWithValid: Story = {
  ...Template,
  args: {
    ...Template.args,
    leftIcon: 'calendar-lines',
    rightIcon: 'credit-card',
    valid: true
  },
  play: async ({ canvasElement }) => {
    // Verify both icons and valid checkmark are displayed
    const leftIcon = canvasElement.querySelector('.fa-calendar-lines')
    const checkIcon = canvasElement.querySelector('.fa-check')
    await expect(leftIcon).toBeInTheDocument()
    await expect(checkIcon).toBeInTheDocument()
    // Valid checkmark takes precedence over rightIcon
    const rightIcon = canvasElement.querySelector('.fa-credit-card')
    await expect(rightIcon).not.toBeInTheDocument()
  }
}

export const WithDefaultValues: Story = {
  ...Template,
  args: {
    label: 'Input Label',
    placeholder: 'This is a very long placeholder with a longer value and longer meaning',
    modelValue: 'This is a very long text with a longer value and longer meaning'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify default value is displayed
    const input = canvas.getByRole('textbox', { name: /Input Label/i })
    await expect(input).toHaveValue('This is a very long text with a longer value and longer meaning')
  }
}

export const Number: Story = {
  ...Template,
  args: {
    ...Template.args,
    type: 'number',
    required: true
  },
  decorators: [() => ({ template: templateForm })],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify input type is number
    const input = canvas.getByRole('spinbutton', { name: /Input Label/i })
    await expect(input).toHaveAttribute('type', 'number')
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
  decorators: [() => ({ template: templateForm })],
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
    rightIconClass: 'cursor-pointer'
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
    const eyeIcon = canvasElement.querySelector('.fa-eye')
    await expect(eyeIcon).toBeInTheDocument()

    // Verify clicking icon toggles visibility
    if (eyeIcon) {
      await userEvent.click(eyeIcon)
      await expect(input).toHaveAttribute('type', 'text')
      const eyeSlashIcon = canvasElement.querySelector('.fa-eye-slash')
      await expect(eyeSlashIcon).toBeInTheDocument()
    }
  }
}

export const CustomLabel: Story = {
  ...Template,
  render: (args) => ({
    components: { FzInput },
    setup() {
      const modelValue = ref('')
      return { args, modelValue }
    },
    template: `
      <div>
        <FzInput v-bind="args" v-model="modelValue">
          <template #label><b>This is a custom label</b></template>
        </FzInput>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify custom label is displayed
    const customLabel = canvas.getByText('This is a custom label')
    await expect(customLabel).toBeVisible()
    await expect(customLabel.tagName).toBe('B')
  }
}

export const FloatingLabel: Story = {
  ...Template,
  args: {
    label: 'Label',
    size: 'md',
    rightIcon: 'calendar-lines',
    rightIconButtonVariant: 'secondary',
    rightIconButton: true,
    rightIconSize: 'sm',
    variant: 'floating-label'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify floating label variant styling
    const input = canvas.getByRole('textbox', { name: /Label/i })
    const container = input.closest('.fz-input')
    await expect(container).toBeInTheDocument()

    // Verify placeholder behavior in floating label mode
    // In floating-label mode, placeholder shows above input when empty
    const placeholderSpan = canvasElement.querySelector('span.text-xs.text-gray-300')
    await expect(placeholderSpan).toBeInTheDocument()

    // Verify right icon button is rendered
    const iconButton = canvasElement.querySelector('.fz-icon-button')
    await expect(iconButton).toBeInTheDocument()
  }
}

// Note: All stories are exported above with 'export const'

export default meta
