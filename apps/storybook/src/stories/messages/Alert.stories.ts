import type { Meta, StoryObj } from '@storybook/vue3'
import { FzAlert } from '@fiscozen/alert'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzAlert> = {
  title: 'Messages/FzAlert',
  component: FzAlert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'error', 'danger', 'warning', 'success']
    },
    alertStyle: {
      control: 'select',
      options: ['default', 'collapsable', 'simple']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  },
  args: {
    buttonActionLabel: 'This is a button',
    buttonActionTooltip: 'Action tooltip',
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
    alertStyle: 'simple'
  }
}

const Collapsable: Story = {
  args: {
    type: 'info',
    alertStyle: 'collapsable'
  }
}

const CollapsableDefaultClosed: Story = {
  args: {
    type: 'info',
    alertStyle: 'collapsable',
    defaultOpen: false
  }
}

const LinkAndButton: Story = {
  args: {
    type: 'info',
    showLinkAction: true,
    linkActionLocation: 'example',
    linkActionLabel: 'This is a link'
  },
  decorators: [vueRouter()]
}

const LinkExternal: Story = {
  args: {
    type: 'info',
    showLinkAction: true,
    linkActionLocation: 'https://example.com',
    linkActionLabel: 'This is an external link',
    linkActionTarget: '_blank',
    linkActionExternal: true
  }
}

const OnlyLink: Story = {
  args: {
    type: 'info',
    showButtonAction: false,
    showLinkAction: true,
    linkActionLocation: 'example',
    linkActionLabel: 'This is a link'
  },
  decorators: [vueRouter()]
}

const WithoutAction: Story = {
  args: {
    type: 'info',
    showButtonAction: false
  }
}

export {
  Info,
  Error,
  Danger,
  Warning,
  Success,
  Simple,
  Collapsable,
  CollapsableDefaultClosed,
  LinkAndButton,
  LinkExternal,
  OnlyLink,
  WithoutAction
}

export default meta
