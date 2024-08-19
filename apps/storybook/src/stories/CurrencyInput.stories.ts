
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCurrencyInput } from '@fiscozen/input'
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
  },
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const data = ref(1.23)

      setTimeout(() => {
        data.value = 23.34
      }, 2000)

      const onSet = () => {
        data.value = 1234.56
      }

      return {
        data,
        onSet
      }
    },
    template: `
      <FzCurrencyInput v-model:amount="data" label="currency input"/>
      <pre>{{data}}</pre>
      <button @click="onSet">SET</button>
    `,
  })
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
