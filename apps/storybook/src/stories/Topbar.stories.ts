import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTopbar } from '@fiscozen/topbar'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzTopbar> = {
  title: '@fiscozen/topbar/FzTopbar',
  component: FzTopbar,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'danger']
    },
    style: {
      control: 'select',
      options: ['none', 'button', 'icon-button', 'hybrid', 'link']
    }
  },
  args: {
    actionLabel: 'This is the action',
    actionTooltip: 'Action tooltip',
    default: 'This is a Topbar'
  }
}

type Story = StoryObj<typeof meta>

const DefaultNone: Story = {
  args: {
    style: 'none'
  }
}

const DefaultButton: Story = {
  args: {
    style: 'button'
  }
}

const DefaultIconButton: Story = {
  args: {
    style: 'icon-button',
    actionIcon: 'bell'
  }
}

const DefaultHybrid: Story = {
  args: {
    style: 'hybrid',
    actionIcon: 'bell'
  }
}

const DefaultLink: Story = {
  args: {
    style: 'link',
    actionLink: 'example'
  },
  decorators: [vueRouter()]
}

const DangerNone: Story = {
  args: {
    type: 'danger',
    style: 'none'
  }
}

const DangerButton: Story = {
  args: {
    type: 'danger',
    style: 'button'
  }
}

const DangerIconButton: Story = {
  args: {
    type: 'danger',
    style: 'icon-button',
    actionIcon: 'bell'
  }
}

const DangerHybrid: Story = {
  args: {
    type: 'danger',
    style: 'hybrid',
    actionIcon: 'bell'
  }
}

const DangerLink: Story = {
  args: {
    type: 'danger',
    style: 'link',
    actionLink: 'example'
  },
  decorators: [vueRouter()]
}

export {
  DefaultNone,
  DefaultButton,
  DefaultIconButton,
  DefaultHybrid,
  DefaultLink,
  DangerNone,
  DangerButton,
  DangerIconButton,
  DangerHybrid,
  DangerLink
}

export default meta
