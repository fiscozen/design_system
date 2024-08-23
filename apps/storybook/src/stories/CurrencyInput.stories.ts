
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCurrencyInput } from '@fiscozen/input'
import { all } from '@awesome.me/kit-8137893ad3/icons'
import { ref } from 'vue';

const meta = {
  title: '@fiscozen/input/FzCurrencyInput',
  component: FzCurrencyInput,
  tags: ['autodocs'],
  args: {
    label: 'Input Label',
    placeholder: 'Value'
  },
  decorators: [() => ({ template: '<div style="max-width: 300px; padding:10px;"><story/></div>' })]
} satisfies Meta<typeof FzCurrencyInput>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const ModelValue: Story = {
  args: {
    modelValue: 1.23
  }
}

const modelValue = ref(null);

const NullOnEmpty: Story = {
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const value = ref();
      return {
        value,
        args
      }
    },
    template: `<FzCurrencyInput v-bind="args" v-model="value" />`
  }),
  args: {
    nullOnEmpty: true
  }
}

export {
  Default,
  ModelValue,
  NullOnEmpty
}

export default meta
