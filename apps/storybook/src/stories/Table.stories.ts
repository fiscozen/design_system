import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTable } from '@fiscozen/table'

const meta: Meta<typeof FzTable> = {
  title: '@fiscozen/table/FzTable',
  component: FzTable,
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
