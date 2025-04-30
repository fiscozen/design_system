import type { Meta, StoryObj } from '@storybook/vue3'
import { FzIconDropdown } from '@fiscozen/dropdown'
import { vueRouter } from 'storybook-vue3-router'

const actions = [
  {
    type: 'link' as const,
    label: 'This is a router-nav-link',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'link' as const,
    label: 'This is a disabled router-nav-link',
    disabled: true,
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'link' as const,
    label: 'This is a router-nav-link',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'button' as const,
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
    vueRouter([
      {
        path: '/foo',
        name: 'foo',
        component: () => {}
      }
    ])
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    iconName: 'bars'
  },
  decorators: [
    () => ({
      template: '<div class="h-screen flex justify-center"><story/></div>'
    })
  ]
}

const Disabled: Story = {
  args: {
    iconName: 'bars',
    openerDisabled: true
  },
  decorators: [
    () => ({
      template: '<div class="h-screen flex justify-center"><story/></div>'
    })
  ]
}

export { Default, Disabled }

export default meta
