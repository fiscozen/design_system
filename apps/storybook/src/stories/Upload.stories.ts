import type { Meta, StoryObj } from '@storybook/vue3'
import { FzUpload } from '@fiscozen/upload'

const meta: Meta<typeof FzUpload> = {
  title: '@fiscozen/upload/FzUpload',
  component: FzUpload,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md']
    }
  },
  args: {
    id: 'example-id'
  },
  decorators: [() => ({
    template: '<div class="p-16 max-w-[400px]"><story/></div>'
  })]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {}
}

export { Default }

export default meta
