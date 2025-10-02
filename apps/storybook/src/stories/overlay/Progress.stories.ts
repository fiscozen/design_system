import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzProgress } from '@fiscozen/progress'

const meta: Meta<typeof FzProgress> = {
  title: 'Overlay/FzProgress',
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
  })
}

export { Default }

export default meta
