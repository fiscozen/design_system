import type { Meta, StoryObj } from '@storybook/vue3'
import { FzRadioCard } from '@fiscozen/radio'
import checkrimg from '../../assets/checker.png'

const meta = {
  title: 'Form/FzRadioCard',
  component: FzRadioCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
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
    template: `<FzRadioCard v-bind="args" />`
  }),
  args: {
    size: 'sm',
    label: 'Radio',
    modelValue: '',
    value: ''
  },
  decorators: [() => ({ template: '<div style="padding:10px;"><story/></div>' })]
}

export const Vertical: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'vertical',
    title: 'RadioCard',
    imageUrl: checkrimg,
    subtitle: 'This is a Radioccard label'
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
    subtitle: 'This is a Radioccard label'
  }
}
