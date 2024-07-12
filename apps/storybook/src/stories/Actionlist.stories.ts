import type { Meta, StoryObj } from '@storybook/vue3'
import { FzActionlist } from '@fiscozen/actionlist'
import { vueRouter } from 'storybook-vue3-router';

const actions =  [{
  type: 'link' as const,
  label: 'This is a router-nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
},{
  type: 'link' as const,
  label: 'This is a router-nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
},{
  type: 'link' as const,
  label: 'This is a router-nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
},{
  type: 'button' as const,
  label: 'This is a nav-link'
}];

const meta: Meta<typeof FzActionlist> = {
  title: '@fiscozen/actionlist/FzActionlist',
  component: FzActionlist,
  tags: ['autodocs'],
  args: {
    items: actions,
    label: 'This is a label'
  },
  decorators: [vueRouter([{
    path: '/foo',
    name: 'foo',
    component: () => {}
  }])]
}

type Story = StoryObj<typeof meta>

const Default: Story = {}

export {
  Default,
}

export default meta