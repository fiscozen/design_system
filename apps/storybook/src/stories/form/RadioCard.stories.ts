import type { Meta, StoryObj } from '@storybook/vue3'
import { FzRadioCard } from '@fiscozen/radio'
import checkrimg from '../../assets/checker.png'
import {ref} from 'vue';

const radioModel = ref('');

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
        args,
      }
    },
    template: `<FzRadioCard v-bind="args" v-model="args.modelValue" />`
  }),
  args: {
    size: 'sm',
    label: 'Radio',
    modelValue: radioModel.value,
    value: 'test',
    tooltip: 'this is a tooltip'
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
    subtitle: 'This is a Radioccard label',
    tooltip: 'this is a tooltip',
    value: 'test1',
    modelValue: radioModel.value,
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
    radioIcon: false,
    value: 'test3',
    modelValue: radioModel.value,
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
    modelValue: radioModel.value,
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
    radioIcon: false,
    value: 'test5',
    modelValue: radioModel.value,
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
    radioIcon: false,
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
    radioIcon: true,
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
    radioIcon: false,
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
    modelValue: radioModel.value,
  }
}

export const VerticalWithIconWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    radioIcon: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test10',
    modelValue: radioModel.value,
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
    radioIcon: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test12',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}