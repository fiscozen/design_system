import type { Meta, StoryObj } from '@storybook/vue3'
import { FzLayout } from '@fiscozen/layout'

const meta: Meta<typeof FzLayout> = {
  title: '@fiscozen/layout/FzLayout',
  component: FzLayout,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {}
}

export { Default }

export default meta
