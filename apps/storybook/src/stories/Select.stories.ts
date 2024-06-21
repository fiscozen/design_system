import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { FzSelect } from '@fiscozen/select'

const meta = {
  title: '@fiscozen/select/FzSelect',
  component: FzSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzSelect>
export default meta

type SelectStory = StoryObj<typeof FzSelect>

const Template: SelectStory = {
  render: (args) => ({
    components: { FzSelect },
    setup() {
      const model = ref('')
      return {
        args,
        model
      }
    },
    template: `<div class="p-8 relative" style='width:200px; overflow:hidden; height:800px'>
                    <FzSelect v-bind="args" v-model="model"> 
                        <template #error>Custom error message</template>
                        <template #help>Custom help message</template>
                    </FzSelect>
                   </div>`
  }),
  args: {
    size: 'md',
    label: 'Select',
    placeholder: 'Custom placeholder',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { value: '3', label: 'Options with a very long text' }
    ]
  }
}

export const Medium: SelectStory = {
  ...Template
}

export const Small: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'sm'
  }
}

export const Large: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'lg'
  }
}

export const Error: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    error: true
  }
}

export const Disabled: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true
  }
}

export const Required: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    required: true
  }
}
