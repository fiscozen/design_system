import type { Meta, StoryObj } from '@storybook/vue3'
import { FzDropdown } from '@fiscozen/dropdown'

const actions =  [{
  label: 'This is a nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
},{
  label: 'This is a nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
},{
  label: 'This is a nav-link',
  meta: {
     path: '/foo',
     name: 'foo'
  }
}];

const meta: Meta<typeof FzDropdown> = {
  title: 'Dropdown',
  component: FzDropdown,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    },
  },
  args: {
    actions,
    default: 'This is a dropdown'
  },
}

type Story = StoryObj<typeof meta>

const AlignLeft: Story = {
  decorators: [
    () => ({
      template: '<div class="h-screen"><story/></div>'
    })
  ]
}

const AlignRight: Story = {
  decorators: [
    () => ({
      template: '<div class="h-screen flex justify-end"><story/></div>'
    })
  ]
}

export {
  AlignLeft,
  AlignRight
}

export default meta