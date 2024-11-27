
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCurrencyInput } from '@fiscozen/input'
import { ref } from 'vue';
import { useCurrency } from '@fiscozen/composables';

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

const Default: Story = {
  args: {
  },
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const data = ref(1.23)

      const {format, parse} = useCurrency({
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      const onSet = () => {
        data.value = 0
      }

      return {
        data,
        onSet,
        args,
        format,
        parse
      }
    },
    template: `
      <FzCurrencyInput v-bind="args" v-model:amount="data" label="currency input"/>
      <pre>{{format(data)}}</pre>
      <button @click="onSet">SET</button>
    `,
  })
}

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
    template: `<FzCurrencyInput v-bind="args" v-model:amount="value" />`
  }),
  args: {
    nullOnEmpty: true
  }
}

const MinMax: Story = {
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const value = ref();
      return {
        value,
        args
      }
    },
    template: `<FzCurrencyInput v-bind="args" v-model:amount="value" />`
  }),
  args: {
    min: 3,
    max: 20
  }
}

const Step: Story = {
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const value = ref();
      return {
        value,
        args
      }
    },
    template: `<FzCurrencyInput v-bind="args" v-model:amount="value" />`
  }),
  args: {
    step: 4
  }
}

const ForcedStep: Story = {
  render: (args) => ({
    components: {FzCurrencyInput},
    setup() {
      const value = ref();
      return {
        value,
        args
      }
    },
    template: `<FzCurrencyInput v-bind="args" v-model:amount="value" />`
  }),
  args: {
    step: 4,
    forceStep: true
  }
}

export {
  Default,
  NullOnEmpty,
  MinMax,
  Step,
  ForcedStep
}

export default meta
