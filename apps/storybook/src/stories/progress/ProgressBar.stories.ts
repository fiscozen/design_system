import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzProgressBar } from '@fiscozen/progress'

const meta: Meta<typeof FzProgressBar> = {
  title: 'Progress/FzProgressBar',
  component: FzProgressBar,
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    name: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    min: 0,
    max: 100,
    current: 50,
    name: 'progress-bar',
    size: 'md',
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: {
      FzProgressBar
    },
    setup() {
      return {
        args
      }
    },
    template: `<FzProgressBar v-bind="args"/>`
  })
}

const Default: Story = {
  ...Template,
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar).toBeTruthy()
    })

    await step('Verify progress bar has correct classes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.classList.contains('w-full')).toBe(true)
      await expect(progressBar?.classList.contains('h-[20px]')).toBe(true)
      await expect(progressBar?.classList.contains('rounded-[4px]')).toBe(true)
      await expect(progressBar?.classList.contains('bg-grey-100')).toBe(true)
    })

    await step('Verify progress indicator has correct width', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      await expect(indicator).toBeTruthy()
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 50%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('50')
      await expect(progressBar?.getAttribute('aria-valuemin')).toBe('0')
      await expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
    })
  }
}

const Zero: Story = {
  ...Template,
  args: {
    current: 0,
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify progress indicator shows 0%', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 0%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('0')
      await expect(progressBar?.getAttribute('aria-valuemin')).toBe('0')
      await expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
    })
  }
}

const Half: Story = {
  ...Template,
  args: {
    current: 50,
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify progress indicator shows 50%', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 50%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('50')
      await expect(progressBar?.getAttribute('aria-valuemin')).toBe('0')
      await expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
    })
  }
}

const Full: Story = {
  ...Template,
  args: {
    current: 100,
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify progress indicator shows 100%', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 100%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('100')
      await expect(progressBar?.getAttribute('aria-valuemin')).toBe('0')
      await expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
    })
  }
}

const CustomRange: Story = {
  ...Template,
  args: {
    current: 30,
    min: -25,
    max: 75
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify progress indicator calculates custom range correctly', async () => {
      // (30 - (-25)) / (75 - (-25)) * 100 = 55/100 * 100 = 55%
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 55%')
    })

    await step('Verify accessibility attributes with custom range', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('30')
      await expect(progressBar?.getAttribute('aria-valuemin')).toBe('-25')
      await expect(progressBar?.getAttribute('aria-valuemax')).toBe('75')
    })
  }
}

const SizeSm: Story = {
  ...Template,
  args: {
    current: 50,
    min: 0,
    max: 100,
    size: 'sm',
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify small size renders with 8px height', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.classList.contains('h-[8px]')).toBe(true)
      await expect(progressBar?.classList.contains('h-[20px]')).toBe(false)
    })

    await step('Verify progress indicator renders correctly', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 50%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('50')
    })
  }
}

const SizeMd: Story = {
  ...Template,
  args: {
    current: 50,
    min: 0,
    max: 100,
    size: 'md',
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify medium size renders with 20px height', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.classList.contains('h-[20px]')).toBe(true)
      await expect(progressBar?.classList.contains('h-[8px]')).toBe(false)
    })

    await step('Verify progress indicator renders correctly', async () => {
      const indicator = canvasElement.querySelector('.fz-progress-bar__progress-indicator')
      const style = indicator?.getAttribute('style')
      await expect(style).toContain('width: 50%')
    })

    await step('Verify accessibility attributes', async () => {
      const progressBar = canvasElement.querySelector('.fz-progress-bar')
      await expect(progressBar?.getAttribute('role')).toBe('progressbar')
      await expect(progressBar?.getAttribute('aria-valuenow')).toBe('50')
    })
  }
}

export { Default, Full, Half, Zero, CustomRange, SizeSm, SizeMd }

export default meta
