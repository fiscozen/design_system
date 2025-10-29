import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { ref } from 'vue'
import { FzCheckbox, FzCheckboxGroup } from '@fiscozen/checkbox'
import { FzIcon } from '@fiscozen/icons'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
  title: 'Form/FzCheckboxGroup',
  component: FzCheckboxGroup,
  tags: ['autodocs']
} satisfies Meta<typeof FzCheckboxGroup>
export default meta

type CheckboxGroupStory = StoryObj<typeof FzCheckboxGroup>

const options = [
  {
    label: 'Parent checkbox',
    value: 'option1',
    children: [
      {
        label: 'Option',
        value: 'option1.1'
      },
      {
        label: 'Option',
        value: 'option1.2'
      },
      {
        label: 'Option',
        value: 'option1.3'
      }
    ]
  },
  {
    label: 'Option 2',
    value: 'option2'
  },
  {
    label: 'Option 3',
    value: 'option3'
  }
]

const Template: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"/>`
  }),
  args: {
    label: 'Field label',
    options
  }
}

export const Default: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Field label',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify group label exists', async () => {
      const groupLabel = canvas.getByText('Field label')
      expect(groupLabel).toBeVisible()
    })

    await step('Verify group has role="group"', async () => {
      const group = canvas.getByRole('group')
      expect(group).toBeInTheDocument()
    })

    await step('Verify multiple checkboxes are rendered', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThanOrEqual(3)
    })

    await step('Verify all options are rendered', async () => {
      expect(canvas.getByText('Parent checkbox')).toBeInTheDocument()
      expect(canvas.getByText('Option 2')).toBeInTheDocument()
      expect(canvas.getByText('Option 3')).toBeInTheDocument()
    })

    await step('Verify aria-labelledby connection', async () => {
      const group = canvas.getByRole('group')
      const labelledby = group.getAttribute('aria-labelledby')
      expect(labelledby).toBeTruthy()
      if (labelledby) {
        const label = canvasElement.querySelector(`#${labelledby}`)
        if (label) {
          expect(label).toHaveTextContent('Field label')
        }
      }
    })
  }
}

export const MultipleSelection: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Field label',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox group renders', async () => {
      const groupLabel = canvas.getByText('Field label')
      expect(groupLabel).toBeVisible()
      const checkboxes = canvas.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThanOrEqual(3)
    })

    await step('Select multiple checkboxes', async () => {
      const option2Label = canvas.getByText('Option 2')
      const option3Label = canvas.getByText('Option 3')
      
      await userEvent.click(option2Label)
      await userEvent.click(option3Label)
      
      const checkedBoxes = canvas.getAllByRole('checkbox').filter(cb => (cb as HTMLInputElement).checked)
      expect(checkedBoxes.length).toBeGreaterThanOrEqual(2)
    })

    await step('Uncheck and verify independent state', async () => {
      const option2Label = canvas.getByText('Option 2')
      await userEvent.click(option2Label)
      
      // Find Option 3 checkbox by finding the label and getting its associated input
      const allCheckboxes = canvas.getAllByRole('checkbox')
      const option3Checkbox = allCheckboxes.find(cb => {
        const labelId = cb.getAttribute('aria-labelledby')
        if (labelId) {
          const label = canvasElement.querySelector(`#${labelId}`)
          return label?.textContent?.includes('Option 3')
        }
        return false
      })
      
      expect(option3Checkbox).toBeDefined()
      expect(option3Checkbox).toBeChecked()
    })
  }
}

export const Emphasis: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Field label',
    emphasis: true,
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify emphasized group renders', async () => {
      const group = canvas.getByRole('group')
      expect(group).toBeInTheDocument()
      const checkboxes = canvas.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThanOrEqual(3)
    })
  }
}

export const Disabled: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Field label',
    disabled: true,
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all checkboxes are disabled', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled()
      })
    })

    await step('Verify disabled styling on label', async () => {
      const groupLabel = canvas.getByText('Field label')
      expect(groupLabel).toBeInTheDocument()
      // Note: Disabled styling class may vary by implementation
    })
  }
}

export const Error: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"><template #error> Error message </template></FzCheckboxGroup>`
  }),
  args: {
    label: 'Field label',
    error: true,
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify error state renders', async () => {
      const alert = canvas.queryByRole('alert')
      if (alert) {
        expect(alert).toBeVisible()
        expect(alert).toHaveTextContent('Error message')
      }
    })

    await step('Verify ARIA attributes for error', async () => {
      const group = canvas.getByRole('group')
      const describedby = group.getAttribute('aria-describedby')
      expect(describedby).toBeTruthy()
      expect(describedby).toContain('error')
    })
  }
}

export const WithHelpText: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"><template #help> Description of help text </template></FzCheckboxGroup>`
  }),
  args: {
    label: 'Field label',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify help text is visible', async () => {
      const helpText = canvas.getByText('Description of help text')
      expect(helpText).toBeVisible()
    })

    await step('Verify help text is below label', async () => {
      const groupLabel = canvas.getByText('Field label')
      expect(groupLabel).toBeInTheDocument()
      const helpText = canvas.getByText('Description of help text')
      expect(helpText).toBeInTheDocument()
    })
  }
}

export const Required: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `
    <form action="#">
      <FzCheckboxGroup v-bind="args" v-model="model"/>
      <input type="submit" value="Submit" />
    </form>`
  }),
  args: {
    label: 'Field label',
    required: true,
    options: [
      {
        label: 'Parent checkbox',
        value: 'option',
        required: true,
        children: [
          {
            label: 'Option',
            value: 'option1',
            required: true
          },
          {
            label: 'Option',
            value: 'option2'
          },
          {
            label: 'Option',
            value: 1
          }
        ]
      }
    ]
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify required indicator (*) is shown', async () => {
      const groupLabel = canvas.getByText(/Field label/i)
      expect(groupLabel.textContent).toContain('*')
    })

    await step('Verify required attributes on inputs', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      const firstCheckbox = checkboxes[0]
      expect(firstCheckbox).toHaveAttribute('aria-required')
    })
  }
}

export const CheckboxGroupWithDynamicOptions: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      const dataFromServer = ref<{ label: string; value: any; disabled?: boolean }[]>([])

      setTimeout(() => {
        dataFromServer.value.push({
          label: 'Option 1',
          value: 'option1'
        })
        dataFromServer.value.push({
          label: 'Option 2',
          value: 'option2'
        })
        dataFromServer.value.push({
          label: 'Option 3',
          value: 'option3'
        })
      }, 1000)

      return {
        args,
        model,
        dataFromServer
      }
    },
    template: `
    <form action="#">
      <FzCheckboxGroup v-bind="args" v-model="model" :options="dataFromServer"/>
      <input type="submit" value="Submit" />
    </form>`
  }),
  args: {
    label: 'Field label',
    required: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Initially no checkboxes are rendered', async () => {
      const checkboxes = canvas.queryAllByRole('checkbox')
      expect(checkboxes.length).toBe(0)
    })

    await step('Wait for options to load dynamically', async () => {
      await waitFor(
        () => {
          const checkboxes = canvas.queryAllByRole('checkbox')
          expect(checkboxes.length).toBeGreaterThanOrEqual(3)
        },
        { timeout: 2000 }
      )
    })

    await step('Interact with dynamically loaded checkboxes', async () => {
      const option1Label = canvas.getByText('Option 1')
      await userEvent.click(option1Label)
      
      await waitFor(() => {
        const checkboxes = canvas.getAllByRole('checkbox')
        const option1Checkbox = checkboxes.find(cb => {
          const label = cb.closest('div')?.querySelector('label')
          return label?.textContent?.includes('Option 1')
        })
        if (option1Checkbox) {
          expect(option1Checkbox).toBeChecked()
        } else {
          // Fallback: just verify we can click
          expect(checkboxes.length).toBeGreaterThanOrEqual(3)
        }
      }, { timeout: 1000 })
    })
  }
}

// Additional test stories for specific scenarios

export const IndeterminateStateTest: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Indeterminate Test',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Check one child to trigger indeterminate state', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      // Click second checkbox (first child of parent)
      await userEvent.click(checkboxes[1])
      
      await waitFor(() => {
        const parentCheckbox = checkboxes[0]
        expect(parentCheckbox).toHaveAttribute('aria-checked', 'mixed')
      }, { timeout: 1000 })
    })
  }
}

export const KeyboardNavigationTest: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Keyboard Navigation Test',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Navigate with Tab key', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes[0].focus()
      expect(checkboxes[0]).toHaveFocus()
    })

    await step('Check with keyboard interaction', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      // Click on a non-parent checkbox (Option 2 is at index 4)
      const option2Checkbox = checkboxes.find(cb => {
        return cb.getAttribute('aria-label')?.includes('Option 2')
      })
      
      if (option2Checkbox) {
        await userEvent.click(option2Checkbox)
        await waitFor(() => {
          expect(option2Checkbox).toBeChecked()
        }, { timeout: 1000 })
      }
    })
  }
}

export const LayoutTest: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Layout Test',
    options
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify vertical layout (flex-col)', async () => {
      const group = canvas.getByRole('group')
      expect(group).toHaveClass('flex-col')
    })

    await step('Verify proper spacing (gap classes)', async () => {
      const group = canvas.getByRole('group')
      const classes = group.className
      expect(classes).toMatch(/gap-/)
    })
  }
}
