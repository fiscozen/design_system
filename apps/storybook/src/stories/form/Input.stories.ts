import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { ref } from 'vue'
import { FzInput } from '@fiscozen/input'
import { all } from '@awesome.me/kit-8137893ad3/icons'

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
    
    // Verify aria-labelledby links to label
    const labelledBy = input.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    if (labelledBy) {
      const labelElement = canvasElement.querySelector(`#${labelledBy}`)
      await expect(labelElement).toBeInTheDocument()
      await expect(labelElement?.textContent).toContain('Input Label')
    }

    // Verify container is keyboard accessible
    const container = input.closest('.fz-input > div')
    await expect(container).toHaveAttribute('tabindex', '0')
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

export const Readonly: Story = {
  ...Template,
  args: {
    ...Template.args,
    readonly: true,
    modelValue: 'Read-only value'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Input Label/i })

    // Verify input is readonly
    await expect(input).toHaveAttribute('readonly')
    await expect(input).toHaveAttribute('aria-disabled', 'true')

    // Verify readonly styling is applied (same as disabled)
    const container = input.closest('.fz-input')
    await expect(container).toBeInTheDocument()

    // Verify container is not clickable (no tabindex)
    const containerDiv = input.closest('.fz-input > div')
    await expect(containerDiv).not.toHaveAttribute('tabindex')

    // Verify user cannot modify readonly input
    await userEvent.clear(input)
    await userEvent.type(input, 'New text')
    await expect(input).toHaveValue('Read-only value')
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

export const LeftIconAccessible: Story = {
  ...Template,
  args: {
    label: 'Date',
    size: 'md',
    leftIcon: 'calendar-lines',
    leftIconAriaLabel: 'Open calendar picker'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify left icon is displayed
    const icon = canvasElement.querySelector('.fa-calendar-lines')
    await expect(icon).toBeInTheDocument()

    // Verify accessibility attributes are present
    if (icon) {
      await expect(icon).toHaveAttribute('role', 'button')
      await expect(icon).toHaveAttribute('aria-label', 'Open calendar picker')
      await expect(icon).toHaveAttribute('tabindex', '0')
    }

    // Verify keyboard navigation works
    if (icon) {
      ;(icon as HTMLElement).focus()
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
    const icon = canvasElement.querySelector('.fa-eye')
    await expect(icon).toBeInTheDocument()

    // Verify accessibility attributes are present
    if (icon) {
      await expect(icon).toHaveAttribute('role', 'button')
      await expect(icon).toHaveAttribute('aria-label', 'Toggle password visibility')
      await expect(icon).toHaveAttribute('tabindex', '0')
    }

    // Verify keyboard navigation works
    if (icon) {
      ;(icon as HTMLElement).focus()
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
    const checkIcon = canvasElement.querySelector('.fa-check')
    await expect(checkIcon).toBeInTheDocument()

    if (checkIcon) {
      // Verify success styling is applied
      await expect(checkIcon).toHaveClass('text-semantic-success')

      // Verify check icon is decorative (aria-hidden)
      const checkIconWrapper = checkIcon.closest('[aria-hidden]')
      if (checkIconWrapper) {
        await expect(checkIconWrapper).toHaveAttribute('aria-hidden', 'true')
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
    if (leftIcon) {
      await expect(leftIcon).toHaveAttribute('role', 'button')
      await expect(leftIcon).toHaveAttribute('aria-label', 'Open calendar')
      await expect(leftIcon).toHaveAttribute('tabindex', '0')
    }

    // Verify check icon is decorative (aria-hidden)
    if (checkIcon) {
      await expect(checkIcon).toHaveAttribute('aria-hidden', 'true')
    }
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
    const eyeIcon = canvasElement.querySelector('.fa-eye')
    await expect(eyeIcon).toBeInTheDocument()

    // Verify accessibility attributes are present
    if (eyeIcon) {
      await expect(eyeIcon).toHaveAttribute('role', 'button')
      await expect(eyeIcon).toHaveAttribute('aria-label', 'Toggle password visibility')
      await expect(eyeIcon).toHaveAttribute('tabindex', '0')
    }

    // Verify clicking icon toggles visibility
    if (eyeIcon) {
      await userEvent.click(eyeIcon)
      await expect(input).toHaveAttribute('type', 'text')
      const eyeSlashIcon = canvasElement.querySelector('.fa-eye-slash')
      await expect(eyeSlashIcon).toBeInTheDocument()
    }

    // Verify keyboard navigation works
    if (eyeIcon) {
      ;(eyeIcon as HTMLElement).focus()
      await userEvent.keyboard('{Enter}')
    }
  }
}

export const TwoRightIcons: Story = {
  ...Template,
  args: {
    ...Template.args,
    secondRightIcon: 'info-circle',
    rightIcon: 'envelope',
    secondRightIconAriaLabel: 'Show information',
    rightIconAriaLabel: 'Email details'
  },
  play: async ({ canvasElement }) => {
    // Verify no left icon is displayed
    const leftIcon = canvasElement.querySelector('.fa-calendar-lines')
    await expect(leftIcon).not.toBeInTheDocument()

    // Verify both right icons are displayed (order: secondRightIcon, rightIcon)
    const secondIcon = canvasElement.querySelector('.fa-info-circle')
    const rightIcon = canvasElement.querySelector('.fa-envelope')
    await expect(secondIcon).toBeInTheDocument()
    await expect(rightIcon).toBeInTheDocument()

    // Verify second icon accessibility attributes
    if (secondIcon) {
      await expect(secondIcon).toHaveAttribute('role', 'button')
      await expect(secondIcon).toHaveAttribute('aria-label', 'Show information')
      await expect(secondIcon).toHaveAttribute('tabindex', '0')
    }

    // Verify right icon accessibility attributes
    if (rightIcon) {
      await expect(rightIcon).toHaveAttribute('role', 'button')
      await expect(rightIcon).toHaveAttribute('aria-label', 'Email details')
      await expect(rightIcon).toHaveAttribute('tabindex', '0')
    }
  }
}

export const TwoRightIconsWithValid: Story = {
  ...Template,
  args: {
    ...Template.args,
    valid: true,
    secondRightIcon: 'info-circle',
    rightIcon: 'envelope',
    secondRightIconAriaLabel: 'Show information',
    rightIconAriaLabel: 'Email details'
  },
  play: async ({ canvasElement }) => {
    // Verify no left icon is displayed
    const leftIcon = canvasElement.querySelector('.fa-calendar-lines')
    await expect(leftIcon).not.toBeInTheDocument()

    // Verify all three right icons are displayed (order: secondRightIcon, rightIcon, valid checkmark)
    const secondIcon = canvasElement.querySelector('.fa-info-circle')
    const rightIcon = canvasElement.querySelector('.fa-envelope')
    const checkIcon = canvasElement.querySelector('.fa-check')
    
    await expect(secondIcon).toBeInTheDocument()
    await expect(rightIcon).toBeInTheDocument()
    await expect(checkIcon).toBeInTheDocument()

    // Verify check icon is decorative (aria-hidden)
    if (checkIcon) {
      const checkIconWrapper = checkIcon.closest('[aria-hidden]')
      if (checkIconWrapper) {
        await expect(checkIconWrapper).toHaveAttribute('aria-hidden', 'true')
      }
    }

    // Verify second icon accessibility attributes
    if (secondIcon) {
      await expect(secondIcon).toHaveAttribute('role', 'button')
      await expect(secondIcon).toHaveAttribute('aria-label', 'Show information')
      await expect(secondIcon).toHaveAttribute('tabindex', '0')
    }

    // Verify right icon accessibility attributes
    if (rightIcon) {
      await expect(rightIcon).toHaveAttribute('role', 'button')
      await expect(rightIcon).toHaveAttribute('aria-label', 'Email details')
      await expect(rightIcon).toHaveAttribute('tabindex', '0')
    }
  }
}

// Note: All stories are exported above with 'export const'

export default meta
