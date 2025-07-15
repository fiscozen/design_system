import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { FzCheckbox } from '@fiscozen/checkbox'
import { FzIcon } from '@fiscozen/icons'

const meta = {
  title: 'Form/FzCheckbox',
  component: FzCheckbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzCheckbox>
export default meta

type CheckboxStory = StoryObj<typeof FzCheckbox>

const Template: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<FzCheckbox v-bind="args" @update:modelValue="console.log('update model value', $event)" />`
  }),
  args: {
    size: 'sm',
    label: 'Checkbox'
  }
}

export const Medium: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox'
  }
}

export const Small: CheckboxStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Checkbox'
  }
}

export const MediumWithLongLabel: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus nec nisl fermentum aliquam.'
  },
  globals: {
    viewport: {
      value: "xs",
      isRotated: false
    }
  }
}

export const Emphasized: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    emphasis: true
  }
}

export const Indeterminate: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    indeterminate: true
  }
}

export const Disabled: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    disabled: true
  }
}

export const CheckedDefault: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    modelValue: true
  }
}

export const Error: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<FzCheckbox v-bind="args">
            <template #error>
                Error
            </template>
        </FzCheckbox>`
  }),
  args: {
    size: 'sm',
    label: 'Checkbox',
    error: true
  }
}
