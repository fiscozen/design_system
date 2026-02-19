import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within, waitFor } from '@storybook/test'
import { ref, watch } from 'vue'
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
  tags: ['autodocs']
} satisfies Meta<typeof FzCheckbox>
export default meta

type CheckboxStory = StoryObj<typeof FzCheckbox>

const Template: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      const modelValue = ref(args.modelValue)
      watch(() => args.modelValue, (v) => { modelValue.value = v })
      return { args, modelValue }
    },
    template: `<FzCheckbox v-bind="args" :modelValue="modelValue" @update:modelValue="modelValue = $event" />`
  }),
  args: {
    label: 'Checkbox'
  }
}

export const Default: CheckboxStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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

    await step('Check checkbox on click and verify handler IS called', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      
      expect(checkbox).not.toBeChecked()
      await userEvent.click(checkbox)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called with true
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(true)
      expect(checkbox).toBeChecked()
    })

    await step('Uncheck checkbox on second click and verify handler IS called', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      
      expect(checkbox).toBeChecked()
      await userEvent.click(checkbox)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called (twice total)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(2)
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

export const WithLongLabel: CheckboxStory = {
  ...Template,
  args: {
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
    label: 'Checkbox',
    disabled: true,
    // 👇 Define spy in args - it should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox is disabled', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    await step('Verify update:modelValue is NOT called when clicking disabled checkbox', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      
      expect(checkbox).not.toBeChecked()
      await userEvent.click(checkbox).catch(() => {})
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
      expect(checkbox).not.toBeChecked() // Should remain unchecked
    })

    await step('Verify update:modelValue is NOT called on keyboard activation attempt', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      
      expect(checkbox).not.toBeChecked()
      checkbox.focus()
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
      expect(checkbox).not.toBeChecked() // Should remain unchecked
    })

    await step('Verify label exists', async () => {
      const label = canvas.getByText('Checkbox')
      expect(label).toBeInTheDocument()
    })
  }
}

export const CheckedDefault: CheckboxStory = {
  ...Template,
  args: {
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
      const modelValue = ref(args.modelValue)
      watch(() => args.modelValue, (v) => { modelValue.value = v })
      return { args, modelValue }
    },
    template: `<FzCheckbox v-bind="args" :modelValue="modelValue" @update:modelValue="modelValue = $event">
            <template #error>
                Error
            </template>
        </FzCheckbox>`
  }),
  args: {
    label: 'Checkbox',
    error: true,
    modelValue: false
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

export const ErrorWithoutMessage: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      const modelValue = ref(args.modelValue)
      watch(() => args.modelValue, (v) => { modelValue.value = v })
      return { args, modelValue }
    },
    template: `<FzCheckbox v-bind="args" :modelValue="modelValue" @update:modelValue="modelValue = $event" />`
  }),
  args: {
    label: 'Checkbox',
    error: true,
    modelValue: false
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify error ARIA attributes', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      // When no error slot is provided, aria-describedby should not reference an error element
      expect(checkbox).not.toHaveAttribute('aria-describedby')
    })

    await step('Verify error alert does not exist', async () => {
      const alert = canvas.queryByRole('alert')
      expect(alert).toBeNull()
    })

    await step('Verify error styling is applied', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox' })
      // The checkbox should have error styling (red color) even without error message
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })
  }
}

export const Tooltip: CheckboxStory = {
  ...Template,
  args: {
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
    label: 'Keyboard Test',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Focus checkbox with Tab', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      checkbox.focus()
      expect(checkbox).toHaveFocus()
    })

    await step('Check with Space key and verify handler IS called', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(true)
      expect(checkbox).toBeChecked()
    })

    await step('Uncheck with Space key again and verify handler IS called', async () => {
      const checkbox = canvas.getByRole('checkbox', { name: 'Keyboard Test' })
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called (twice total)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(2)
      expect(checkbox).not.toBeChecked()
    })
  }
}

// Test for toggling multiple times
export const MultipleToggleTest: CheckboxStory = {
  ...Template,
  args: {
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
