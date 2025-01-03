import type { Meta, StoryObj } from '@storybook/vue3'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzLink> = {
  title: 'Navigation/FzLink',
  component: FzLink,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'danger']
    },
    style: {
      control: 'select',
      options: ['default', 'underline']
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    }
  },
  args: {
    to: 'example',
    default: 'This is a link'
  },
  decorators: [vueRouter()]
}

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Danger: Story = {
  args: {
    type: 'danger'
  }
}

const DefaultUnderline: Story = {
  args: {
    linkStyle: 'underline'
  }
}

const DangerUnderline: Story = {
  args: {
    type: 'danger',
    linkStyle: 'underline'
  }
}

const DefaultExternal: Story = {
  args: {
    external: true,
    to: 'https://example.com',
    target: '_blank'
  }
}

export { Default, Danger, DefaultUnderline, DangerUnderline, DefaultExternal }

export default meta
