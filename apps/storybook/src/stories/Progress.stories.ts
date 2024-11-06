import type { Meta, StoryObj } from '@storybook/vue3'
import { FzProgress } from '@fiscozen/progress'

const meta: Meta<typeof FzProgress> = {
  title: '@fiscozen/progress/FzProgress',
  component: FzProgress,
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
