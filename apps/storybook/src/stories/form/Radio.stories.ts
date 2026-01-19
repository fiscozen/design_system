import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadio } from '@fiscozen/radio'
import { expect, fn, within, userEvent } from '@storybook/test'
import { ref } from 'vue'

const meta = {
  title: 'Form/FzRadio',
  component: FzRadio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['md'],
      control: {
        type: 'select'
      }
    },
    tone: {
      options: ['neutral', 'emphasis', 'error'],
      control: {
        type: 'select'
      }
    },
    tooltipStatus: {
      options: ['neutral', 'informative', 'positive', 'alert', 'error'],
      control: {
        type: 'select'
      }
    }
  },
  decorators: [() => ({ template: '<div style="padding:10px;"><story/></div>' })]
} satisfies Meta<typeof FzRadio>

export default meta

type RadioStory = StoryObj<typeof FzRadio>

const Template: RadioStory = {
  render: (args) => ({
    components: { FzRadio },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const modelValue = ref(initialValue)
      const handleUpdate = (value: string) => {
        modelValue.value = value
        if (onUpdateModelValue) {
          onUpdateModelValue(value)
        }
      }
      return {
        restArgs,
        modelValue,
        handleUpdate
      }
    },
    // Use :modelValue and @update:modelValue instead of v-model to avoid double-calling
    template: `<FzRadio v-bind="restArgs" :modelValue="modelValue" @update:modelValue="handleUpdate" />`
  }),
  args: {
    label: 'Radio',
    value: 'test'
  }
}

export const Medium: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    value: 'test',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify radio renders correctly', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()
      await expect(radio).not.toBeChecked()
      await expect(canvas.getByText('Radio')).toBeInTheDocument()
    })
    
    await step('Click radio and verify update:modelValue IS called', async () => {
      const radio = canvas.getByRole('radio')
      
      await userEvent.click(radio)
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('test')
      await expect(radio).toBeChecked()
    })
  }
}

export const CheckedDefault: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeChecked()
  }
}

export const Disabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    value: 'test',
    disabled: true,
    // 👇 Use fn() to spy on update:modelValue - should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify disabled state attributes', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeDisabled()
      await expect(radio).not.toBeChecked()
      await expect(radio).toHaveAttribute('aria-disabled', 'true')
    })
    
    await step('Verify update:modelValue is NOT called when clicking disabled radio', async () => {
      const radio = canvas.getByRole('radio')
      
      await userEvent.click(radio)
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

export const CheckedDisabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    value: 'test',
    checked: true,
    disabled: true,
    // 👇 Use fn() to spy on update:modelValue - should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify checked disabled state', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()
      await expect(radio).toBeChecked()
      await expect(radio).toBeDisabled()
      await expect(radio).toHaveAttribute('aria-disabled', 'true')
    })
    
    await step('Verify update:modelValue is NOT called when clicking checked disabled radio', async () => {
      const radio = canvas.getByRole('radio')
      
      await userEvent.click(radio)
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

export const ToneNeutral: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'neutral'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('text-core-black')
  }
}

export const ToneEmphasis: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'emphasis'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('peer-checked:before:border-blue-500')
  }
}

export const ToneError: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'error'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('text-semantic-error')
  }
}

export const WithTooltip: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tooltip: 'This is an informative tooltip'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parentElement = within(canvasElement.parentElement as HTMLElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const tooltip = parentElement.getByText('This is an informative tooltip')
    await expect(tooltip).toBeInTheDocument()
  }
}

export const KeyboardNavigation: RadioStory = {
  ...Template,
  render: (args) => ({
    components: { FzRadio },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const modelValue = ref(initialValue)
      const handleUpdate = (value: string) => {
        modelValue.value = value
        if (onUpdateModelValue) {
          onUpdateModelValue(value)
        }
      }
      return {
        restArgs,
        modelValue,
        handleUpdate
      }
    },
    // Use :modelValue and @update:modelValue instead of v-model to avoid double-calling
    template: `<FzRadio v-bind="restArgs" :modelValue="modelValue" @update:modelValue="handleUpdate" />`
  }),
  args: {
    size: 'md',
    label: 'Radio',
    value: 'test',
    modelValue: undefined, // Start unchecked
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus radio element', async () => {
      const radio = canvas.getByRole('radio')
      radio.focus()
      await expect(document.activeElement).toBe(radio)
      await expect(radio).not.toBeChecked()
    })
    
    await step('Activate radio with Space key and verify handler IS called', async () => {
      const radio = canvas.getByRole('radio')
      radio.focus()
      await expect(document.activeElement).toBe(radio)
      await expect(radio).not.toBeChecked()
      
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('test')
      await expect(radio).toBeChecked()
    })
    
    await step('Verify keyboard navigation support', async () => {
      const radio = canvas.getByRole('radio')
      // Radio button should be focusable for keyboard navigation
      radio.focus()
      await expect(document.activeElement).toBe(radio)
      
      // Verify radio supports keyboard activation (Space key is standard for radio buttons)
      await expect(radio).toBeInTheDocument()
    })
  }
}

export const VeryLongLabel: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  globals: {
    viewport: {
      value: 'xs',
      isRotated: false
    }
  }
}
