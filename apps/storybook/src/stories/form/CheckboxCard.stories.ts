import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzCheckboxCard } from '@fiscozen/checkbox'
import { ref, watch } from 'vue'
import { expect, fn, within, userEvent } from '@storybook/test'

const sampleImage = 'consultant.jpg'

const meta = {
  title: 'Form/FzCheckboxCard',
  component: FzCheckboxCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    emphasis: {
      control: { type: 'boolean' }
    },
    error: {
      control: { type: 'boolean' }
    },
    hasCheckbox: {
      control: { type: 'boolean' }
    },
    imageUrl: {
      control: { type: 'text' }
    }
  }
} satisfies Meta<typeof FzCheckboxCard>

export default meta

type CheckboxCardStory = StoryObj<typeof FzCheckboxCard>

const Template: CheckboxCardStory = {
  render: (args) => ({
    components: { FzCheckboxCard },
    setup() {
      const modelValue = ref(args.modelValue || [])
      watch(() => args.modelValue, (v) => { modelValue.value = v || [] })
      return { args, modelValue }
    },
    template: `<FzCheckboxCard v-bind="args" :modelValue="modelValue" @update:modelValue="modelValue = $event" />`
  }),
  args: {
    label: 'Checkbox',
    value: 'test',
    title: 'CheckboxCard',
    subtitle: 'This is a description',
    tooltip: 'this is a tooltip'
  },
  decorators: [() => ({ template: '<div style="padding:10px; width: 360px;"><story/></div>' })]
}

export const Vertical: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'vertical',
    title: 'CheckboxCard',
    imageUrl: sampleImage,
    subtitle: 'This is a CheckboxCard label',
    tooltip: 'this is a tooltip',
    value: 'test1',
    modelValue: [],
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox card renders correctly', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await expect(checkbox).toBeInTheDocument()
      await expect(checkbox).not.toBeChecked()
      await expect(canvas.getByText('CheckboxCard')).toBeInTheDocument()
      await expect(canvas.getByText('This is a CheckboxCard label')).toBeInTheDocument()

      const label = canvas.getByText('CheckboxCard').closest('label')
      await expect(label).toHaveClass('flex-col')
    })

    await step('Click label and verify update:modelValue IS called', async () => {
      const checkbox = canvas.getByRole('checkbox')
      const label = canvas.getByText('CheckboxCard').closest('label')

      await userEvent.click(label!)

      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(['test1'])
      await expect(checkbox).toBeChecked()
    })
  }
}

export const Horizontal: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    imageUrl: sampleImage,
    subtitle: 'This is a CheckboxCard label',
    tooltip: 'this is a tooltip',
    value: 'test2',
    modelValue: [],
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify checkbox card renders correctly', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await expect(checkbox).toBeInTheDocument()
      await expect(checkbox).not.toBeChecked()

      const label = canvas.getByText('CheckboxCard').closest('label')
      await expect(label).toHaveClass('flex-row')
    })

    await step('Click label and verify update:modelValue IS called', async () => {
      const checkbox = canvas.getByRole('checkbox')
      const label = canvas.getByText('CheckboxCard').closest('label')

      await userEvent.click(label!)

      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(['test2'])
      await expect(checkbox).toBeChecked()
    })
  }
}

export const HorizontalNoCheckboxNoImage: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: false,
    value: 'test3',
    modelValue: []
  }
}

export const HorizontalCheckboxNoImage: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: true,
    value: 'test4',
    modelValue: []
  }
}

export const HorizontalNoCheckboxWithImage: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    imageUrl: sampleImage,
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: false,
    value: 'test5',
    modelValue: []
  }
}

export const HorizontalNoCheckboxNoImageWithTooltip: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: false,
    value: 'test6',
    modelValue: [],
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoImageWithTooltip: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: true,
    value: 'test7',
    modelValue: [],
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoCheckboxWithImageWithTooltip: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    imageUrl: sampleImage,
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    hasCheckbox: false,
    value: 'test8',
    modelValue: [],
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithImage: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    imageUrl: sampleImage,
    variant: 'vertical',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test9',
    modelValue: []
  }
}

export const VerticalWithCheckboxWithImage: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    imageUrl: sampleImage,
    variant: 'vertical',
    hasCheckbox: true,
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test10',
    modelValue: []
  }
}

export const VerticalWithImageWithTooltip: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    imageUrl: sampleImage,
    variant: 'vertical',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test11',
    modelValue: [],
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithCheckboxWithImageWithTooltip: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    imageUrl: sampleImage,
    variant: 'vertical',
    hasCheckbox: true,
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test12',
    modelValue: [],
    tooltip: 'this is a tooltip'
  }
}

export const EmphasisChecked: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    emphasis: true,
    value: 'test13',
    modelValue: ['test13']
  }
}

export const ErrorState: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    error: true,
    value: 'test14',
    modelValue: []
  }
}

export const Disabled: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test15',
    disabled: true,
    modelValue: [],
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify disabled state attributes', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await expect(checkbox).toBeDisabled()
      await expect(checkbox).not.toBeChecked()
    })

    await step('Verify update:modelValue is NOT called when clicking disabled card', async () => {
      const checkbox = canvas.getByRole('checkbox')

      await userEvent.click(checkbox)

      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
    })
  }
}

export const Focused: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test16',
    modelValue: [],
    'onUpdate:modelValue': fn()
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus checkbox card', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await expect(checkbox).toBeInTheDocument()

      await userEvent.tab()
      await expect(document.activeElement).toBe(checkbox)
    })
  }
}

export const KeyboardNavigation: CheckboxCardStory = {
  ...Template,
  args: {
    label: 'Checkbox',
    variant: 'horizontal',
    title: 'CheckboxCard',
    subtitle: 'This is a CheckboxCard label',
    value: 'test17',
    modelValue: [],
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus checkbox card', async () => {
      const checkbox = canvas.getByRole('checkbox')
      await expect(checkbox).toBeInTheDocument()

      await userEvent.tab()
      await expect(document.activeElement).toBe(checkbox)
    })

    await step('Activate with Space key and verify handler IS called', async () => {
      await userEvent.keyboard(' ')

      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(['test17'])
    })
  }
}
