import type { Meta, StoryObj } from '@storybook/vue3'
import { FzAlert } from '@fiscozen/alert'

const meta: Meta<typeof FzAlert> = {
  title: '@fiscozen/alert/FzAlert',
  component: FzAlert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'error', 'danger', 'warning', 'success']
    },
    style: {
      control: 'select',
      options: ['default', 'collapsable', 'simple']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  },
  args: {
    actionLabel: 'This is the action',
    actionTooltip: 'Action tooltip',
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    title: 'Title',
    type: 'info'
  },
  decorators: [
    () => ({
      template: '<div class="p-12"><story/></div>'
    })
  ]
}

type Story = StoryObj<typeof meta>

const Info: Story = {
  args: {
    type: 'info'
  }
}

const Error: Story = {
  args: {
    type: 'error'
  }
}

const Danger: Story = {
  args: {
    type: 'danger'
  }
}

const Warning: Story = {
  args: {
    type: 'warning'
  }
}

const Success: Story = {
  args: {
    type: 'success'
  }
}

const Simple: Story = {
  args: {
    type: 'info',
    style: 'simple'
  }
}

const Collapsable: Story = {
  args: {
    type: 'info',
    style: 'collapsable'
  }
}

export { Info, Error, Danger, Warning, Success, Simple, Collapsable }

export default meta
