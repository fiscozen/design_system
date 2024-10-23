import type { Meta, StoryObj } from '@storybook/vue3'
import { FzLayout, FzLayoutProps } from '@fiscozen/layout'

const meta: Meta<typeof FzLayout> = {
  title: '@fiscozen/layout/FzLayout',
  component: FzLayout,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    () => ({
      template: `
      <div class="opacity">
        <div>
          <story /> 
        </div>
      </div>
      `
    })
  ]
}

type Story = StoryObj<typeof meta>

const twoColumns = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full h-full bg-red-100"></div>
      <div class="w-full h-full bg-green-100"></div>
    </FzLayout>
  `
})

export const TwoColumns = {
  render: twoColumns,
  args: {
    layout: 'twoColumns'
  }
}


const multipleRows = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full bg-red-100"></div>
      <div class="w-full bg-green-100"></div>
      <div class="w-full bg-orange-200"></div>
      <div class="w-full bg-cyan-100"></div>
    </FzLayout>
  `
})


export const MultipleRows = {
  render: multipleRows,
  args: {
    layout: 'multipleRows'
  }
}
export default meta
