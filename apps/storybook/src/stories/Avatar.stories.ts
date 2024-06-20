import type { Meta, StoryObj } from '@storybook/vue3'
import { FzAvatar } from '@fiscozen/avatar'

const meta: Meta<typeof FzAvatar> = {
  title: '@fiscozen/avatar/FzAvatar',
  component: FzAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    firstName: 'Mario',
    lastName: 'Rossi'
  }
}

type Story = StoryObj<typeof meta>

const Customer: Story = {}

const Consultant: Story = {
  args: {
    src: 'consultant.jpg',
  }
}

export {
  Customer,
  Consultant,
}

export default meta