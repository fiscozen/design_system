import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { FzCheckbox } from '@fiscozen/checkbox'
import { FzIcon } from '@fiscozen/icons'

const meta = {
  title: 'Checkbox',
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
      const model = ref('')
      return {
        args,
        model
      }
    },
    watch: {
      model: {
        handler(newValue) {
          console.log(newValue)
        }
      }
    },
    template: `<FzCheckbox v-bind="args" v-model="model"/>`
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
  parameters: {
    viewport: {
      defaultViewport: 'xs'
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
    disabled: true,
    checked: false
  }
}

export const CheckedDefault: CheckboxStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Checkbox',
    checked: true
  }
}

export const Error: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      const model = ref('')
      return {
        args,
        model
      }
    },
    template: `<FzCheckbox v-bind="args" v-model="model">
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

export const ModelValueTrue: CheckboxStory = {
  render: (args) => ({
    components: { FzCheckbox, FzIcon },
    setup() {
      const model = ref(true)
      return {
        args,
        model
      }
    },
    watch: {
      model: {
        handler(newValue) {
          console.log(newValue)
        }
      }
    },
    template: `<FzCheckbox v-bind="args" v-model="model"/>`
  }),
  args: {
    size: 'md',
    label: 'Checkbox'
  }
}
