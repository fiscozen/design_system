import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
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
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify badge renders correctly', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify black color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-core-black')
      await expect(badge).toHaveClass('text-core-white')
    })
    
    await step('Verify base classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('flex')
      await expect(badge).toHaveClass('items-center')
      await expect(badge).toHaveClass('justify-center')
      await expect(badge).toHaveClass('font-medium')
    })
  }
}

export const Error: Story = {
  args: {
    color: 'error'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify error color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-semantic-error')
      await expect(badge).toHaveClass('text-core-white')
    })
  }
}

export const Warning: Story = {
  args: {
    color: 'warning'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify warning color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-semantic-warning')
    })
  }
}

export const Success: Story = {
  args: {
    color: 'success'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify success color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-semantic-success')
      await expect(badge).toHaveClass('text-core-white')
    })
  }
}

export const Info: Story = {
  args: {
    color: 'info'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify info color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-semantic-info')
      await expect(badge).toHaveClass('text-core-white')
    })
  }
}

export const Dark: Story = {
  args: {
    color: 'dark'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify dark color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-grey-500')
      await expect(badge).toHaveClass('text-core-white')
    })
  }
}

export const Light: Story = {
  args: {
    color: 'light'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify light color classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('bg-grey-100')
      await expect(badge).toHaveClass('text-core-black')
    })
  }
}

export const OneNumberSmall: Story = {
  args: {
    default: 1,
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single character badge renders', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify small size classes are applied', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('text-xs')
      await expect(badge).toHaveClass('size-20')
    })
  }
}

export const OneNumberMedium: Story = {
  args: {
    default: 1,
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single number badge renders', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify medium size classes are applied', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('text-sm')
      await expect(badge).toHaveClass('size-24')
    })
  }
}

export const OneNumberLarge: Story = {
  args: {
    default: 1,
    size: 'lg'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single number badge renders', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify large size classes are applied', async () => {
      const badge = canvas.getByText('1')
      await expect(badge).toHaveClass('text-base')
      await expect(badge).toHaveClass('size-28')
    })
  }
}

export const OneLetterSmall: Story = {
  args: {
    default: 'A',
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single letter badge renders', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify small size classes are applied', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('text-xs')
      await expect(badge).toHaveClass('size-20')
    })
  }
}

export const OneLetterMedium: Story = {
  args: {
    default: 'A',
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single letter badge renders', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify medium size classes are applied', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('text-sm')
      await expect(badge).toHaveClass('size-24')
    })
  }
}

export const OneLetterLarge: Story = {
  args: {
    default: 'A',
    size: 'lg'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify single letter badge renders', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
    
    await step('Verify single character gets rounded-full class', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('rounded-full')
      await expect(badge).toHaveClass('!px-0')
    })
    
    await step('Verify large size classes are applied', async () => {
      const badge = canvas.getByText('A')
      await expect(badge).toHaveClass('text-base')
      await expect(badge).toHaveClass('size-28')
    })
  }
}

export const Small: Story = {
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify small size classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('text-xs')
      await expect(badge).toHaveClass('px-8')
      await expect(badge).toHaveClass('size-20')
    })
  }
}

export const Medium: Story = {
  args: {
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify medium size classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('text-sm')
      await expect(badge).toHaveClass('px-12')
      await expect(badge).toHaveClass('size-24')
    })
  }
}

export const Large: Story = {
  args: {
    size: 'lg'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify large size classes are applied', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('text-base')
      await expect(badge).toHaveClass('px-14')
      await expect(badge).toHaveClass('size-28')
    })
    
    await step('Verify multi-character content gets rounded-2xl class', async () => {
      const badge = canvas.getByText('Fiscozen')
      await expect(badge).toHaveClass('rounded-2xl')
      await expect(badge).toHaveClass('!w-fit')
    })
  }
}
