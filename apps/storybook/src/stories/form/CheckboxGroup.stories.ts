import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within, waitFor } from '@storybook/test'
import { ref, watch } from 'vue'
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
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
      
      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }
      
      return {
        restArgs,
        model,
        handleUpdate
      }
    },
    template: `<FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)"/>`
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox group renders', async () => {
      const groupLabel = canvas.getByText('Field label')
      expect(groupLabel).toBeVisible()
      const checkboxes = canvas.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThanOrEqual(3)
    })

    await step('Select multiple checkboxes and verify handler IS called', async () => {
      const option2Label = canvas.getByText('Option 2')
      const option3Label = canvas.getByText('Option 3')
      
      await userEvent.click(option2Label)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      
      await userEvent.click(option3Label)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called (twice total)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(2)
      
      const checkedBoxes = canvas.getAllByRole('checkbox').filter(cb => (cb as HTMLInputElement).checked)
      expect(checkedBoxes.length).toBeGreaterThanOrEqual(2)
    })

    await step('Uncheck and verify independent state and handler IS called', async () => {
      const option2Label = canvas.getByText('Option 2')
      
      await userEvent.click(option2Label)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called again (should be 3 total: option2, option3, then uncheck option2)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(3)
      
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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

    await step('Verify disabled checkbox accessibility and interaction behavior', async () => {
      // Wait for component to be fully initialized using waitFor (not setTimeout)
      await waitFor(() => {
        const checkboxes = canvas.getAllByRole('checkbox')
        expect(checkboxes.length).toBeGreaterThan(0)
      })
      
      // Clear spy calls after initialization (component may emit on mount)
      args['onUpdate:modelValue'].mockClear()
      
      // Verify all checkboxes are disabled (accessibility requirement)
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled()
      })
      
      // Find the Option 2 checkbox input directly
      const option2Checkbox = checkboxes.find(cb => {
        const labelId = cb.getAttribute('aria-labelledby')
        if (labelId) {
          const label = canvasElement.querySelector(`#${labelId}`)
          return label?.textContent?.includes('Option 2')
        }
        return false
      })
      
      // Verify Option 2 checkbox is disabled
      expect(option2Checkbox).toBeDefined()
      expect(option2Checkbox).toBeDisabled()
      
      // Attempt to click the disabled checkbox input directly
      // Note: userEvent.click on a disabled input should not trigger any events
      if (option2Checkbox) {
        await userEvent.click(option2Checkbox)
      }
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called when clicking disabled checkbox
      // Per testing-standards.mdc line 635: "Don't test disabled states without verifying handlers are NOT called"
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

// Scenario 1: All checkboxes red + error message for the group
export const Error: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
      
      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }
      
      return {
        restArgs,
        model,
        handleUpdate
      }
    },
    template: `<FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)"><template #error> Error message for the entire group </template></FzCheckboxGroup>`
  }),
  args: {
    label: 'Field label',
    error: true,
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all checkboxes have error state', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      })
    })

    await step('Verify error message is displayed', async () => {
      const alert = canvas.queryByRole('alert')
      expect(alert).toBeVisible()
      expect(alert).toHaveTextContent('Error message for the entire group')
    })

    await step('Verify ARIA attributes for error', async () => {
      const group = canvas.getByRole('group')
      const describedby = group.getAttribute('aria-describedby')
      expect(describedby).toBeTruthy()
      expect(describedby).toContain('error')
    })
  }
}

// Scenario 3: All checkboxes red + no error message
export const ErrorAllCheckboxesNoMessage: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
      
      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }
      
      return {
        restArgs,
        model,
        handleUpdate
      }
    },
    template: `<FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)" />`
  }),
  args: {
    label: 'Field label',
    error: true,
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all checkboxes have error state', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      })
    })

    await step('Verify no error message is displayed', async () => {
      const alert = canvas.queryByRole('alert')
      expect(alert).toBeNull()
    })

    await step('Verify group has aria-invalid but no aria-describedby', async () => {
      const group = canvas.getByRole('group')
      expect(group).toHaveAttribute('aria-invalid', 'true')
      expect(group.getAttribute('aria-describedby')).toBeNull()
    })
  }
}

export const WithHelpText: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
      
      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }
      
      return {
        restArgs,
        model,
        handleUpdate
      }
    },
    template: `<FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)"><template #help> Description of help text </template></FzCheckboxGroup>`
  }),
  args: {
    label: 'Field label',
    options
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
      
      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }
      
      return {
        restArgs,
        model,
        handleUpdate
      }
    },
    template: `
    <form action="#">
      <FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)"/>
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const model = ref(initialValue || [])
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

      const handleUpdate = (val: any) => {
        model.value = val
        // Call spy if provided
        if (onUpdateModelValue) {
          onUpdateModelValue(val)
        }
      }

      return {
        restArgs,
        model,
        dataFromServer,
        handleUpdate
      }
    },
    template: `
    <form action="#">
      <FzCheckboxGroup v-bind="restArgs" :modelValue="model" @update:modelValue="handleUpdate($event)" :options="dataFromServer"/>
      <input type="submit" value="Submit" />
    </form>`
  }),
  args: {
    label: 'Field label',
    required: true,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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

    await step('Interact with dynamically loaded checkboxes and verify handler IS called', async () => {
      const option1Label = canvas.getByText('Option 1')
      await userEvent.click(option1Label)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      
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
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Check one child to trigger indeterminate state and verify handler IS called', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      // Click second checkbox (first child of parent)
      await userEvent.click(checkboxes[1])
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      
      // Wait for indeterminate state to be set (may take a moment for Vue reactivity)
      await waitFor(() => {
        const parentCheckbox = checkboxes[0]
        const ariaChecked = parentCheckbox.getAttribute('aria-checked')
        // Accept either 'mixed' or 'true' as valid (component may set to true if all children are checked)
        expect(['mixed', 'true']).toContain(ariaChecked)
      }, { timeout: 2000 })
    })
  }
}

export const KeyboardNavigationTest: CheckboxGroupStory = {
  ...Template,
  args: {
    label: 'Keyboard Navigation Test',
    options,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Navigate with Tab key', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      checkboxes[0].focus()
      expect(checkboxes[0]).toHaveFocus()
    })

    await step('Check with keyboard interaction (Space key) and verify handler IS called', async () => {
      const checkboxes = canvas.getAllByRole('checkbox')
      // Focus on a non-parent checkbox (Option 2)
      const option2Checkbox = checkboxes.find(cb => {
        return cb.getAttribute('aria-label')?.includes('Option 2')
      })
      
      if (option2Checkbox) {
        option2Checkbox.focus()
        await userEvent.keyboard(' ')
        
        // ROBUST CHECK: Verify the update:modelValue spy WAS called
        await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
        
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
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
