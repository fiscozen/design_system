import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTypeahead, FzTypeaheadProps } from '@fiscozen/typeahead'
import { ref } from 'vue'

const meta: Meta<typeof FzTypeahead> = {
  title: '@fiscozen/typeahead/FzTypeahead',
  component: FzTypeahead,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    selectProps: {
      options: [],
      isOpen: false
    },
    inputProps: {
      label: 'This is a label'
    }
  } satisfies FzTypeaheadProps,
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
        <FzTypeahead v-bind="args" v-model="text" />
      </div>
    `
  }),
}

const options = [{label: 'one', value: '1'}, {label: 'two', value: '2'}, {label: 'three', value: '3'}]
const Default: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    }
  }
}

const hundredOptionsRepeated = Array.from({length: 100}, (_, i) => ({label: `option ${i % 3}`, value: `${i}`}))
const HundredOptions: Story = {
  ...Template,
  args: {
    selectProps: {
      options: hundredOptionsRepeated,
      isOpen:false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    }
  }
}

export { Default, HundredOptions }

export default meta
