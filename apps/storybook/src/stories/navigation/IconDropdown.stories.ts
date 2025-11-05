import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent, waitFor } from '@storybook/test'
import { FzIconDropdown } from '@fiscozen/dropdown'
import { vueRouter } from 'storybook-vue3-router'
import { FzActionProps, FzActionSectionProps } from '@fiscozen/action'

const actions: (FzActionProps | FzActionSectionProps & { type: 'section' })[] = [
  {
    type: 'link',
    label: 'This is a router-nav-link',
    to: '/foo',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'link',
    label: 'This is a disabled router-nav-link',
    disabled: true,
    to: '/foo',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'link',
    label: 'This is a router-nav-link',
    to: '/foo',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'action',
    label: 'This is a disabled nav-link',
    disabled: true
  }
]

const meta: Meta<typeof FzIconDropdown> = {
  title: 'Navigation/FzIconDropdown',
  component: FzIconDropdown,
  tags: ['autodocs'],
  args: {
    actions
  },
  decorators: [
    vueRouter(),
    () => ({
      template: '<div class="h-screen flex justify-center items-start pt-20"><story/></div>'
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    iconName: 'bars'
  }
}

const Disabled: Story = {
  args: {
    iconName: 'bars',
    disabled: true
  }
}

export { Default, Disabled }

export default meta
