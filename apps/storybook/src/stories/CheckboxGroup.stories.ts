import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { FzCheckbox, FzCheckboxGroup } from '@fiscozen/checkbox'
import { FzIcon } from '@fiscozen/icons'
const meta = {
  title: '@fiscozen/checkbox/FzCheckboxGroup',
  component: FzCheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
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
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"/>`
  }),
  args: {
    size: 'sm',
    label: 'Field label',
    options
  }
}

export const Medium: CheckboxGroupStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Field label',
    options
  }
}

export const Small: CheckboxGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Field label',
    options
  }
}

export const Emphasis: CheckboxGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Field label',
    emphasis: true,
    options
  }
}

export const Disabled: CheckboxGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Field label',
    disabled: true,
    options
  }
}

export const Error: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"><template #error> Error message </template></FzCheckboxGroup>`
  }),
  args: {
    size: 'md',
    label: 'Field label',
    error: true,
    options
  }
}

export const WithHelpText: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `<FzCheckboxGroup v-bind="args" v-model="model"><template #help> Description of help text </template></FzCheckboxGroup>`
  }),
  args: {
    size: 'md',
    label: 'Field label',
    options
  }
}

export const Required: CheckboxGroupStory = {
  render: (args) => ({
    components: { FzCheckboxGroup, FzCheckbox, FzIcon },
    setup() {
      const model = ref([])
      return {
        args,
        model
      }
    },
    watch: {
      model(val) {
        console.log(val)
      }
    },
    template: `
    <form action="#">
      <FzCheckboxGroup v-bind="args" v-model="model"/>
      <input type="submit" value="Submit" />
    </form>`
  }),
  args: {
    size: 'md',
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
            value: 'option3'
          }
        ]
      }
    ]
  }
}
