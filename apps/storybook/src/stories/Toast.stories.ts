import type { Meta, StoryObj } from '@storybook/vue3'
import { FzToast } from '@fiscozen/toast'

const meta: Meta<typeof FzToast> = {
  title: '@fiscozen/toast/FzToast',
  component: FzToast,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'warning', 'error']
    },
  },
  args: {
    default: 'This is a toast.'
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const Success: Story = {
  args: {
    type: 'success'
  }
}

const Warning: Story = {
  args: {
    type: 'warning'
  }
}

const Error: Story = {
  args: {
    type: 'error'
  }
}

export { Success, Warning, Error }

export default meta
