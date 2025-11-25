import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { ref } from 'vue'
import { FzCurrencyInput } from '@fiscozen/input'

const meta = {
  title: 'Form/FzCurrencyInput',
  component: FzCurrencyInput,
  tags: ['autodocs'],
  args: {
    label: 'Amount',
    placeholder: '1.234,56'
  },
  decorators: [() => ({ template: '<div style="max-width: 300px; padding:10px;"><story/></div>' })]
} satisfies Meta<typeof FzCurrencyInput>

export default meta

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: { FzCurrencyInput },
    setup() {
      const initialValue = typeof args.modelValue === 'number' ? args.modelValue : undefined
      const modelValue = ref<number | undefined>(initialValue)
      return { args, modelValue }
    },
    template: `
      <div>
        <FzCurrencyInput v-bind="args" v-model="modelValue" />
        <p style="margin-top: 60px; font-size: 14px;">
          Raw value (v-model): {{ modelValue === undefined ? 'undefined' : modelValue }}
        </p>
      </div>
    `
  }),
  args: {
    label: 'Amount',
    placeholder: '1.234,56'
  }
}

export const Default: Story = {
  ...Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify component renders
    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toBeInTheDocument()

    // Verify step controls are visible
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown')
    await expect(arrowUp).toBeInTheDocument()
    await expect(arrowDown).toBeInTheDocument()

    // Verify step controls accessibility
    await expect(arrowUp).toHaveAttribute('role', 'button')
    await expect(arrowUp).toHaveAttribute('aria-label', 'Incrementa di 1')
    await expect(arrowDown).toHaveAttribute('role', 'button')
    await expect(arrowDown).toHaveAttribute('aria-label', 'Decrementa di 1')
  }
}

export const WithValue: Story = {
  ...Template,
  args: {
    ...Template.args,
    modelValue: 123.45
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveValue('123,45')
  }
}

export const WithStep: Story = {
  ...Template,
  args: {
    ...Template.args,
    step: 5
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup') as HTMLElement
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown') as HTMLElement

    // Verify custom step aria-labels
    await expect(arrowUp).toHaveAttribute('aria-label', 'Incrementa di 5')
    await expect(arrowDown).toHaveAttribute('aria-label', 'Decrementa di 5')

    // Test step controls
    // Initial value is undefined, so clicking arrowUp should set it to 5 (0 + 5)
    await userEvent.click(arrowUp)
    await waitFor(async () => {
      await expect(input).toHaveValue('5,00')
    }, { timeout: 1000 })

    // Clicking arrowDown should decrease by 5, so 5 - 5 = 0
    await userEvent.click(arrowDown)
    await waitFor(async () => {
      await expect(input).toHaveValue('0,00')
    }, { timeout: 2000 })
  }
}

export const WithDecimalStep: Story = {
  ...Template,
  args: {
    ...Template.args,
    step: 0.25,
    modelValue: 10.5
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup') as HTMLElement

    await expect(input).toHaveValue('10,50')

    await userEvent.click(arrowUp)
    await waitFor(async () => {
      await expect(input).toHaveValue('10,75')
    }, { timeout: 1000 })
  }
}

export const WithCustomAriaLabels: Story = {
  ...Template,
  args: {
    ...Template.args,
    step: 2,
    stepUpAriaLabel: 'Increase by 2',
    stepDownAriaLabel: 'Decrease by 2'
  },
  play: async ({ canvasElement }) => {
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown')

    await expect(arrowUp).toHaveAttribute('aria-label', 'Increase by 2')
    await expect(arrowDown).toHaveAttribute('aria-label', 'Decrease by 2')
  }
}

export const WithMinMax: Story = {
  ...Template,
  args: {
    ...Template.args,
    min: 10,
    max: 100,
    modelValue: 50
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveValue('50,00')

    // Set value below min
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    await userEvent.click(document.body) // Trigger blur
    // Clamping happens on blur
    await waitFor(async () => {
      await expect(input).toHaveValue('10,00')
    }, { timeout: 1000 })

    // Set value above max
    await userEvent.clear(input)
    await userEvent.type(input, '150')
    await userEvent.click(document.body) // Trigger blur
    // Clamping happens on blur
    await waitFor(async () => {
      await expect(input).toHaveValue('100,00')
    }, { timeout: 1000 })
  }
}

export const WithForceStep: Story = {
  ...Template,
  args: {
    ...Template.args,
    step: 4,
    forceStep: true,
    modelValue: 5
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    // Value should be rounded to nearest step (4) on blur
    await userEvent.click(input)
    await userEvent.click(document.body) // Trigger blur
    await waitFor(async () => {
      await expect(input).toHaveValue('4,00')
    }, { timeout: 1000 })
  }
}

export const WithValid: Story = {
  ...Template,
  args: {
    ...Template.args,
    valid: true,
    modelValue: 100
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveValue('100,00')

    // Verify valid icon is displayed
    const validIcon = canvasElement.querySelector('.fa-check')
    await expect(validIcon).toBeInTheDocument()
    await expect(validIcon).toHaveAttribute('aria-hidden', 'true')

    // Verify step controls are still visible
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    await expect(arrowUp).toBeInTheDocument()
  }
}

export const WithError: Story = {
  ...Template,
  args: {
    ...Template.args,
    error: true,
    modelValue: 50
  },
  render: (args) => ({
    components: { FzCurrencyInput },
    setup() {
      const initialValue = typeof args.modelValue === 'number' ? args.modelValue : undefined
      const modelValue = ref<number | undefined>(initialValue)
      return { args, modelValue }
    },
    template: `
      <div>
        <FzCurrencyInput v-bind="args" v-model="modelValue">
          <template #errorMessage>Please enter a valid amount</template>
        </FzCurrencyInput>
        <p style="margin-top: 60px; font-size: 14px;">
          Raw value (v-model): {{ modelValue === undefined ? 'undefined' : modelValue }}
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveAttribute('aria-invalid', 'true')

    // Verify error message
    const errorMessage = canvas.getByText('Please enter a valid amount')
    await expect(errorMessage).toBeInTheDocument()
    await expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument()
  }
}

export const WithHelpText: Story = {
  ...Template,
  render: (args) => ({
    components: { FzCurrencyInput },
    setup() {
      const initialValue = typeof args.modelValue === 'number' ? args.modelValue : undefined
      const modelValue = ref<number | undefined>(initialValue)
      return { args, modelValue }
    },
    template: `
      <div>
        <FzCurrencyInput v-bind="args" v-model="modelValue">
          <template #helpText>Enter amount in euros</template>
        </FzCurrencyInput>
        <p style="margin-top: 60px; font-size: 14px;">
          Raw value (v-model): {{ modelValue === undefined ? 'undefined' : modelValue }}
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const helpText = canvas.getByText('Enter amount in euros')
    await expect(helpText).toBeInTheDocument()
  }
}

export const Readonly: Story = {
  ...Template,
  args: {
    ...Template.args,
    readonly: true,
    modelValue: 123.45
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveAttribute('readonly')
    await expect(input).toHaveAttribute('aria-disabled', 'true')

    // Verify step controls are disabled
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown')
    await expect(arrowUp).toHaveAttribute('aria-disabled', 'true')
    await expect(arrowDown).toHaveAttribute('aria-disabled', 'true')
    await expect(arrowUp).not.toHaveAttribute('tabindex')
    await expect(arrowDown).not.toHaveAttribute('tabindex')

    await expect(input).toHaveValue('123,45')
  }
}

export const Disabled: Story = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true,
    modelValue: 123.45
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toBeDisabled()
    await expect(input).toHaveAttribute('aria-disabled', 'true')

    // Verify step controls are disabled
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown')
    await expect(arrowUp).toHaveAttribute('aria-disabled', 'true')
    await expect(arrowDown).toHaveAttribute('aria-disabled', 'true')
  }
}

export const NullOnEmpty: Story = {
  ...Template,
  args: {
    ...Template.args,
    nullOnEmpty: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toHaveValue('')

    // Type and clear
    await userEvent.type(input, '100')
    await userEvent.clear(input)
    await userEvent.click(document.body) // Trigger blur
    // With nullOnEmpty, empty should remain empty (not 0)
    await waitFor(async () => {
      await expect(input).toHaveValue('')
    }, { timeout: 1000 })
  }
}

export const KeyboardNavigation: Story = {
  ...Template,
  args: {
    ...Template.args,
    step: 2,
    modelValue: 10
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup') as HTMLElement

    await expect(input).toHaveValue('10,00')

    // Test keyboard navigation on step controls
    await userEvent.click(arrowUp) // Focus first
    await userEvent.keyboard('{Enter}')
    await waitFor(async () => {
      await expect(input).toHaveValue('12,00')
    }, { timeout: 1000 })

    await userEvent.keyboard(' ')
    await waitFor(async () => {
      await expect(input).toHaveValue('14,00')
    }, { timeout: 1000 })
  }
}

export const FloatingLabel: Story = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'floating-label',
    placeholder: '1.234,56'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    
    // When empty and not focused, placeholder should be visible above
    await expect(input).toHaveValue('')

    // Focus input
    await userEvent.click(input)
    // Placeholder should move above
    await expect(input).toHaveAttribute('placeholder', '')
  }
}

export const EnvironmentBackoffice: Story = {
  ...Template,
  args: {
    ...Template.args,
    environment: 'backoffice'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toBeInTheDocument()

    // Verify backoffice styling (height 32px)
    const container = input.closest('.fz-input > div')
    await expect(container).toBeInTheDocument()
  }
}

export const WithLeftIcon: Story = {
  ...Template,
  args: {
    ...Template.args,
    leftIcon: 'euro-sign'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox', { name: /Amount/i })
    await expect(input).toBeInTheDocument()

    // Verify euro icon is displayed on the left
    const euroIcon = canvasElement.querySelector('.fa-euro-sign')
    await expect(euroIcon).toBeInTheDocument()

    // Verify step controls are still visible on the right
    const arrowUp = canvasElement.querySelector('.fz__currencyinput__arrowup')
    const arrowDown = canvasElement.querySelector('.fz__currencyinput__arrowdown')
    await expect(arrowUp).toBeInTheDocument()
    await expect(arrowDown).toBeInTheDocument()
  }
}
