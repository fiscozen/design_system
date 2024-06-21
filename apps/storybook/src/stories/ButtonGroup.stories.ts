import type { Meta, StoryObj } from '@storybook/vue3'
import { FzButton, FzButtonGroup } from '@fiscozen/button'

const meta = {
  title: '@fiscozen/button/FzButtonGroup',
  component: FzButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzButtonGroup>
export default meta

type ButtonGroupStory = StoryObj<typeof FzButtonGroup>

const Template: ButtonGroupStory = {
  render: (args) => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {
        args
      }
    },
    template: `<FzButtonGroup v-bind="args" :class="['m-8 pb-8', args.horizontal === false ? 'w-128' : '']"> 
                    <FzButton variant="primary" :size="args.size"> Button 1 </FzButton>
                    <FzButton variant="secondary" :size="args.size"> Button 2 </FzButton>
                    <FzButton variant="secondary" :size="args.size"> Button 3 </FzButton>
                    <FzButton variant="secondary" :size="args.size"> Button 4 </FzButton>
                </FzButtonGroup>`
  }),
  args: {
    size: 'sm'
  }
}

export const ButtonGroup: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md'
  }
}

export const ButtonGroupGap: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    gap: true
  }
}

export const ButtonGroupGapXs: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'xs',
    gap: true
  }
}

export const ButtonGroupGapSm: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    gap: true
  }
}

export const ButtonGroupGapLg: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'lg',
    gap: true
  }
}

export const ButtonGroupVertical: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    horizontal: false
  }
}

export const ButtonGroupVerticalGap: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    gap: true,
    horizontal: false
  }
}
