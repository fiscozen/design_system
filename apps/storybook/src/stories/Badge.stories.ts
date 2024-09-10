import type { Meta, StoryObj } from '@storybook/vue3'
import { FzBadge } from '@fiscozen/badge'

const meta: Meta<typeof FzBadge> = {
  title: '@fiscozen/badge/FzBadge',
  component: FzBadge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['black', 'error', 'warning', 'success', 'info', 'blue', 'dark', 'light'] }
  },
  args: { default: 'Fiscozen' }
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

export const Dark: Story = {
  args: {
    color: 'dark'
  }
}

export const Light: Story = {
  args: {
    color: 'light'
  }
}

export const Number: Story = {
  args: {
    default: 1,
    variant: 'rounded'
  }
}

export const TwoNumber: Story = {
  args: {
    default: 12,
    variant: 'rounded'
  }
}

export const ThreeNumber: Story = {
  args: {
    default: 123,
    variant: 'rounded'
  }
}

export const FourNumber: Story = {
  args: {
    default: 1234,
    variant: 'rounded'
  }
}

export const Small: Story = {
  args: {
    size: 'sm'
  }
}

export const Medium: Story = {
  args: {
    size: 'md'
  }
}

export const Large: Story = {
  args: {
    size: 'lg'
  }
}