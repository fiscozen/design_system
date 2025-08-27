import type { Meta, StoryObj } from '@storybook/vue3'
import { FzContainer } from '@fiscozen/container'

const meta: Meta<typeof FzContainer> = {
  title: 'Container/FzContainer',
  component: FzContainer,
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
