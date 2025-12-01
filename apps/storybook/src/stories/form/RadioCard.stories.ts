import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadioCard } from '@fiscozen/radio'
import { ref } from 'vue'
import { expect, within, userEvent } from '@storybook/test'

const checkrimg = 'consultant.jpg'
const radioModel = ref('')

const meta = {
  title: 'Form/FzRadioCard',
  component: FzRadioCard,
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
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    hasRadio: {
      control: {
        type: 'boolean',
        defaultValue: true
      }
    },
    radioIcon: {
      control: {
        type: 'boolean',
      },
      description: 'Deprecated prop, use hasRadio instead'
    }
  }
} satisfies Meta<typeof FzRadioCard>

export default meta

type RadioCardStory = StoryObj<typeof FzRadioCard>

const Template: RadioCardStory = {
  render: (args) => ({
    components: { FzRadioCard },
    setup() {
      return {
        args
      }
    },
    template: `<FzRadioCard v-bind="args" v-model="args.modelValue" />`
  }),
  args: {
    label: 'Radio',
    modelValue: radioModel.value,
    value: 'test',
    tooltip: 'this is a tooltip'
  },
  decorators: [() => ({ template: '<div style="padding:10px; width: 360px;"><story/></div>' })]
}

export const Vertical: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'vertical',
    title: 'RadioCard',
    imageUrl: checkrimg,
    subtitle: 'This is a Radioccard label',
    tooltip: 'this is a tooltip',
    value: 'test1',
    modelValue: radioModel.value
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    await expect(canvas.getByText('RadioCard')).toBeInTheDocument()
    await expect(canvas.getByText('This is a Radioccard label')).toBeInTheDocument()

    const label = canvas.getByText('RadioCard').closest('label')
    await expect(label).toHaveClass('flex-col')

    await userEvent.click(label!)
    await expect(radio).toBeChecked()
  }
}

export const Horizontal: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    imageUrl: checkrimg,
    subtitle: 'This is a Radioccard label',
    tooltip: 'this is a tooltip',
    value: 'test2'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()

    const label = canvas.getByText('RadioCard').closest('label')
    await expect(label).toHaveClass('flex-row')

    await userEvent.click(label!)
    await expect(radio).toBeChecked()
  }
}

export const HorizontalNoIconNoImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test3',
    modelValue: radioModel.value
  }
}

export const HorizontalIconNoImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    radioIcon: true,
    value: 'test4',
    modelValue: radioModel.value
  }
}

export const HorizontalNoIconWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    imageUrl: checkrimg,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test5',
    modelValue: radioModel.value
  }
}

export const HorizontalNoIconNoImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test6',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: true,
    value: 'test7',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoIconWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test8',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test9',
    modelValue: radioModel.value
  }
}

export const VerticalWithIconWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    hasRadio: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test10',
    modelValue: radioModel.value
  }
}

export const VerticalWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test11',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithIconWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    hasRadio: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test12',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const ToneNeutral: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'neutral',
    value: 'test17',
    modelValue: radioModel.value
  }
}

export const ToneEmphasis: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'emphasis',
    value: 'test18',
    modelValue: radioModel.value
  }
}

export const ToneError: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'error',
    value: 'test19',
    modelValue: radioModel.value
  }
}

export const Disabled: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test20',
    disabled: true,
  }
}

export const Focused: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()

    await userEvent.tab()
  }
}