import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTypeahead } from '@fiscozen/typeahead'
import { ref } from 'vue'

const meta: Meta<typeof FzTypeahead> = {
  title: '@fiscozen/typeahead/FzTypeahead',
  component: FzTypeahead,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const text = ref();
      return {
        text,
        args
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="text" label="This is a typeahead"/>
      </div>
    `
  }),
}

const options = [{label: 'one', value: '1'}, {label: 'two', value: '2'}, {label: 'three', value: '3'}]
const Default: Story = {
  ...Template,
  args: {
    options
  }
}


export { Default }

export default meta
