import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzBadge } from '@fiscozen/badge'

const meta: Meta<typeof FzBadge> = {
  title: 'Misc/FzBadge',
  component: FzBadge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['black', 'error', 'warning', 'success', 'info', 'blue', 'dark', 'light']
    }
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

export const OneNumberSmall: Story = {
  args: {
    default: 1,
    size: 'sm'
  }
}

export const OneNumberMedium: Story = {
  args: {
    default: 1,
    size: 'md'
  }
}

export const OneNumberLarge: Story = {
  args: {
    default: 1,
    size: 'lg'
  }
}

export const OneLetterSmall: Story = {
  args: {
    default: 'A',
    size: 'sm'
  }
}

export const OneLetterMedium: Story = {
  args: {
    default: 'A',
    size: 'md'
  }
}

export const OneLetterLarge: Story = {
  args: {
    default: 'A',
    size: 'lg'
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
