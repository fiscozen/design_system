import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzProgress } from '@fiscozen/progress'

const meta: Meta<typeof FzProgress> = {
  title: 'Progress/FzProgress',
  component: FzProgress,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    },
  },
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  render: (args) => ({
    components: {
      FzProgress
    },
    setup() {
      return {
        args
      }
    },
    template: `
        <div class="flex w-dvw h-dvh justify-center items-center">
          <FzProgress v-bind="args"/>
        </div>
      `
  }),
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const spinner = canvasElement.querySelector('svg')
      await expect(spinner).toBeTruthy()
    })

    await step('Verify spinner icon has spin animation', async () => {
      const spinner = canvasElement.querySelector('svg')
      await expect(spinner?.classList.contains('fa-spin')).toBe(true)
    })

    await step('Verify custom animation styles are applied', async () => {
      const container = canvasElement.querySelector('div[style*="--fa-animation-duration"]')
      await expect(container).toBeTruthy()
      await expect(container?.getAttribute('style')).toContain('--fa-animation-duration: 0.86s')
      await expect(container?.getAttribute('style')).toContain('--fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85)')
    })

    await step('Verify default spinner icon is used', async () => {
      const spinner = canvasElement.querySelector('svg')
      await expect(spinner?.getAttribute('data-icon')).toBe('spinner-third')
    })
  }
}

export { Default }

export default meta
