import type { Meta, StoryObj } from '@storybook/vue3'
import { FzBadge } from '@fiscozen/badge'

const meta: Meta<typeof FzBadge> = {
  title: 'Badge',
  component: FzBadge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['black', 'error', 'warning', 'success', 'info'] },
  },
  args: { default: 'Fiscozen' },
}

export default meta

type Story = StoryObj<typeof meta>

export const Black: Story = {
  args: {
    color: 'black'
  }
}

export const Error: Story = {
  args: {
    color: 'error'
  }
}

export const Warning: Story = {
  args: {
    color: 'warning'
  }
}

export const Success: Story = {
  args: {
    color: 'success'
  }
}

export const Info: Story = {
  args: {
    color: 'info'
  }
}