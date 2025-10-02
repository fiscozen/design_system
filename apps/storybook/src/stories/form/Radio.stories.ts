import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadio } from '@fiscozen/radio'
import { FzIcon } from '@fiscozen/icons'

const meta = {
  title: 'Form/FzRadio',
  component: FzRadio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzRadio>

export default meta

type RadioStory = StoryObj<typeof FzRadio>

const Template: RadioStory = {
  render: (args) => ({
    components: { FzRadio, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<FzRadio v-bind="args" />`
  }),
  args: {
    size: 'sm',
    label: 'Radio'
  }
}

export const Medium: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio'
  }
}

export const Small: RadioStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Radio'
  }
}

export const CheckedDefault: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true
  }
}

export const Disabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    disabled: true
  }
}

export const CheckedDisabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true,
    disabled: true
  }
}

export const Error: RadioStory = {
  render: (args) => ({
    components: { FzRadio, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<FzRadio v-bind="args" >
            <template #errorText> Error message </template>
        </FzRadio>`
  }),
  args: {
    size: 'sm',
    label: 'Radio',
    error: true
  }
}

export const Emphasis: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    emphasis: true
  }
}

export const Standalone: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    standalone: true
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
      value: "xs",
      isRotated: false
    }
  }
}
