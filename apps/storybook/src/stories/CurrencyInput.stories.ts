
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCurrencyInput } from '@fiscozen/input'
import { all } from '@awesome.me/kit-8137893ad3/icons'

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

export {
  Default,
  ModelValue
}

export default meta
