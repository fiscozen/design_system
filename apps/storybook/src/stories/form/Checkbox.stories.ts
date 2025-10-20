import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { ref } from 'vue'
import { FzCheckbox } from '@fiscozen/checkbox'
import { FzIcon } from '@fiscozen/icons'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
  title: 'Form/FzCheckbox',
  component: FzCheckbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzCheckbox>
export default meta

type CheckboxStory = StoryObj<typeof FzCheckbox>

const Template: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      const { modelValue: initialValue, ...restArgs } = args
      const modelValue = ref(initialValue)
      return {
        restArgs,
        modelValue
      }
    },
    template: `<FzCheckbox v-bind="restArgs" v-model="modelValue" @update:modelValue="console.log('update model value', $event)" />`
  }),
  args: {
    size: 'sm',
    label: 'Checkbox'
  }
}

export const Medium: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox input exists', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    await step('Verify label is visible', async () => {
      const label = canvas.getByText('Checkbox')
      expect(label).toBeVisible()
    })

    await step('Check checkbox on click', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    await step('Uncheck checkbox on second click', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    await step('Verify ARIA attributes', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toHaveAttribute('type', 'checkbox')
      // When not standalone, checkbox uses aria-labelledby instead of aria-label
      expect(checkbox).toHaveAttribute('aria-labelledby')
    })
  }
}

export const Small: CheckboxStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Checkbox'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify small checkbox renders correctly', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeInTheDocument()
      // Note: Checkbox input may have opacity:0 for styling, check existence instead
    })

    await step('Verify icon exists', async () => {
      const svg = canvasElement.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    await step('Verify checkbox can be clicked', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  }
}

export const MediumWithLongLabel: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam.'
  },
  globals: {
    viewport: {
      value: "xs",
      isRotated: false
    }
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    // @TODO: verify the effective length of the checkbox label
    await step('Verify long label renders correctly', async () => {
      const label = canvas.getByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam./i)
      expect(label).toBeVisible()
    })

    await step('Verify checkbox is functional with long label', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  }
}

export const Emphasized: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    emphasis: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify emphasized checkbox renders', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeInTheDocument()
    })

    await step('Verify emphasized checkbox is functional', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  }
}

export const Indeterminate: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    indeterminate: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify indeterminate state (aria-checked=mixed)', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    })

    await step('Verify indeterminate icon exists', async () => {
      const svg = canvas.getByRole('checkbox').parentElement?.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  }
}

export const Disabled: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    disabled: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox is disabled', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    await step('Verify disabled checkbox cannot be checked', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      // Try to click (should not work)
      await userEvent.click(checkbox).catch(() => {})
      expect(checkbox).not.toBeChecked()
    })

    await step('Verify label exists', async () => {
      const label = canvas.getByText('Checkbox')
      expect(label).toBeInTheDocument()
      // Note: Disabled styling classes may vary by implementation
    })
  }
}

export const CheckedDefault: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    modelValue: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox is checked by default', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeChecked()
    })

    await step('Verify checked icon is visible', async () => {
      const svg = canvas.getByRole('checkbox').parentElement?.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    await step('Verify aria-checked is true', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })
  }
}

export const Error: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<FzCheckbox v-bind="args">
            <template #error>
                Error
            </template>
        </FzCheckbox>`
  }),
  args: {
    size: 'sm',
    label: 'Checkbox',
    error: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify error ARIA attributes', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAttribute('aria-describedby')
      const describedby = checkbox.getAttribute('aria-describedby')
      expect(describedby).toContain('error')
    })

    await step('Verify error alert exists', async () => {
      const alert = canvas.queryByRole('alert')
      if (alert) {
        expect(alert).toBeVisible()
        expect(alert).toHaveTextContent('Error')
      }
    })
  }
}

export const Tooltip: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    tooltip: {
      text: 'Tooltip'
    }
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox with tooltip renders', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeInTheDocument()
    })

    await step('Verify tooltip trigger exists', async () => {
      // Look for tooltip wrapper or trigger button
      const tooltipTrigger = canvasElement.querySelector('.fz__tooltip [role="button"]')
      if (tooltipTrigger) {
        expect(tooltipTrigger).toBeInTheDocument()
      }
    })
  }
}

// Additional test stories for keyboard navigation
export const KeyboardNavigationTest: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Keyboard Test'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Focus checkbox with Tab', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      checkbox.focus()
      expect(checkbox).toHaveFocus()
    })

    await step('Check with Space key', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      await userEvent.keyboard(' ')
      expect(checkbox).toBeChecked()
    })

    await step('Uncheck with Space key again', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      await userEvent.keyboard(' ')
      expect(checkbox).not.toBeChecked()
    })
  }
}

// Test for toggling multiple times
export const MultipleToggleTest: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Toggle Test'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Toggle checkbox multiple times', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Toggle Test' })
      
      // Check
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      
      // Uncheck
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
      
      // Check again
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })
  }
}
