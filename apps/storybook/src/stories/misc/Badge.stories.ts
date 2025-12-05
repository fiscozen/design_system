import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzBadge } from '@fiscozen/badge'

const meta: Meta<typeof FzBadge> = {
  title: 'Misc/FzBadge',
  component: FzBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'number']
    },
    tone: {
      control: 'select',
      options: ['dark', 'light', 'info', 'blue', 'success', 'warning', 'error']
    },
    leftIcon: {
      control: 'text',
      description: 'Name of the icon to display on the left'
    },
    rightIcon: {
      control: 'text',
      description: 'Name of the icon to display on the right'
    },
    leftIconVariant: {
      control: 'select',
      options: ['fas', 'far', 'fal', 'fat', 'fad']
    },
    rightIconVariant: {
      control: 'select',
      options: ['fas', 'far', 'fal', 'fat', 'fad']
    },
    // Deprecated props
    color: {
      control: 'select',
      options: ['black', 'error', 'warning', 'success', 'info', 'blue', 'dark', 'light'],
      table: {
        category: 'Deprecated'
      }
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Deprecated'
      }
    }
  },
  args: {
    variant: 'text',
    tone: 'dark',
    default: 'Fiscozen'
  }
}

export default meta

type Story = StoryObj<typeof meta>

// Text variant stories
export const TextDark: Story = {
  args: {
    variant: 'text',
    tone: 'dark'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('p')!.closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-grey-500')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
    await expect(badge?.classList.contains('rounded-2xl')).toBe(true)
    await expect(badge?.classList.contains('h-24')).toBe(true)
    await expect(badge?.classList.contains('py-4')).toBe(true)
    await expect(badge?.classList.contains('px-12')).toBe(true)
  }
}

export const TextLight: Story = {
  args: {
    variant: 'text',
    tone: 'light'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('p')!.closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-grey-100')).toBe(true)
    await expect(badge?.classList.contains('text-core-black')).toBe(true)
  }
}

export const TextInfo: Story = {
  args: {
    variant: 'text',
    tone: 'info'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-semantic-info-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const TextBlue: Story = {
  args: {
    variant: 'text',
    tone: 'blue'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-blue-500')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const TextSuccess: Story = {
  args: {
    variant: 'text',
    tone: 'success'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-semantic-success-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const TextWarning: Story = {
  args: {
    variant: 'text',
    tone: 'warning'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-semantic-warning-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-black')).toBe(true)
  }
}

export const TextError: Story = {
  args: {
    variant: 'text',
    tone: 'error'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('bg-semantic-error-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

// Number variant stories
export const NumberDark: Story = {
  args: {
    variant: 'number',
    tone: 'dark',
    default: '2'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('2').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-grey-500')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const NumberLight: Story = {
  args: {
    variant: 'number',
    tone: 'light',
    default: '5'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('5').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-grey-100')).toBe(true)
    await expect(badge?.classList.contains('text-core-black')).toBe(true)
  }
}

export const NumberInfo: Story = {
  args: {
    variant: 'number',
    tone: 'info',
    default: '3'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('3').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-semantic-info-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const NumberBlue: Story = {
  args: {
    variant: 'number',
    tone: 'blue',
    default: '7'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('7').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-blue-500')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const NumberSuccess: Story = {
  args: {
    variant: 'number',
    tone: 'success',
    default: '9'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('9').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-semantic-success-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

export const NumberWarning: Story = {
  args: {
    variant: 'number',
    tone: 'warning',
    default: '1'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('1').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-semantic-warning-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-black')).toBe(true)
  }
}

export const NumberError: Story = {
  args: {
    variant: 'number',
    tone: 'error',
    default: '4'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('4').closest('div')

    await expect(badge).toBeInTheDocument()
    await expect(badge?.classList.contains('size-24')).toBe(true)
    await expect(badge?.classList.contains('bg-semantic-error-200')).toBe(true)
    await expect(badge?.classList.contains('text-core-white')).toBe(true)
  }
}

// Icon stories
export const WithLeftIcon: Story = {
  args: {
    variant: 'text',
    tone: 'dark',
    leftIcon: 'face-smile'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()

    // Check for icon (should be an SVG element)
    const icons = badge?.querySelectorAll('svg')
    await expect(icons?.length).toBeGreaterThan(0)

    // Check gap between icon and text
    await expect(badge?.classList.contains('gap-4')).toBe(true)
  }
}

export const WithRightIcon: Story = {
  args: {
    variant: 'text',
    tone: 'dark',
    rightIcon: 'face-smile'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()

    const icons = badge?.querySelectorAll('svg')
    await expect(icons?.length).toBeGreaterThan(0)
    await expect(badge?.classList.contains('gap-4')).toBe(true)
  }
}

export const WithBothIcons: Story = {
  args: {
    variant: 'text',
    tone: 'dark',
    leftIcon: 'face-smile',
    rightIcon: 'face-smile'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()

    const icons = badge?.querySelectorAll('svg')
    await expect(icons?.length).toBe(2)
    await expect(badge?.classList.contains('gap-4')).toBe(true)
  }
}

export const WithIconVariants: Story = {
  args: {
    variant: 'text',
    tone: 'dark',
    leftIcon: 'bell',
    leftIconVariant: 'far',
    rightIcon: 'bell',
    rightIconVariant: 'fas'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('Fiscozen').closest('div')

    await expect(badge).toBeInTheDocument()

    const icons = badge?.querySelectorAll('svg')
    await expect(icons?.length).toBe(2)
  }
}

// All tones showcase
export const AllTextTones: Story = {
  render: () => ({
    components: { FzBadge },
    template: `
      <div class="flex flex-wrap gap-16 p-16">
        <FzBadge variant="text" tone="dark">Dark</FzBadge>
        <FzBadge variant="text" tone="light">Light</FzBadge>
        <FzBadge variant="text" tone="info">Info</FzBadge>
        <FzBadge variant="text" tone="blue">Blue</FzBadge>
        <FzBadge variant="text" tone="success">Success</FzBadge>
        <FzBadge variant="text" tone="warning">Warning</FzBadge>
        <FzBadge variant="text" tone="error">Error</FzBadge>
      </div>
    `
  })
}

export const AllNumberTones: Story = {
  render: () => ({
    components: { FzBadge },
    template: `
      <div class="flex flex-wrap gap-16 p-16">
        <FzBadge variant="number" tone="dark">1</FzBadge>
        <FzBadge variant="number" tone="light">2</FzBadge>
        <FzBadge variant="number" tone="info">3</FzBadge>
        <FzBadge variant="number" tone="blue">4</FzBadge>
        <FzBadge variant="number" tone="success">5</FzBadge>
        <FzBadge variant="number" tone="warning">6</FzBadge>
        <FzBadge variant="number" tone="error">7</FzBadge>
      </div>
    `
  })
}

// Auto-detect number variant
export const AutoDetectNumber: Story = {
  args: {
    default: '5',
    variant: undefined
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText('5').closest('div')

    await expect(badge).toBeInTheDocument()
    // Should auto-detect as number variant
    await expect(badge?.classList.contains('size-24')).toBe(true)
  }
}
