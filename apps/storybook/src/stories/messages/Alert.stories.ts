import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzAlert } from '@fiscozen/alert'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzAlert> = {
  title: 'Messages/FzAlert',
  component: FzAlert,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'error', 'danger', 'warning', 'success']
    },
    alertStyle: {
      control: 'select',
      options: ['background', 'accordion']
    },
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice']
    }
  },
  args: {
    buttonActionLabel: 'This is a button',
    buttonActionTooltip: 'Action tooltip',
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    title: 'Title',
    tone: 'info'
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
    tone: 'info'
  }
}

const Error: Story = {
  args: {
    tone: 'error'
  }
}

const Danger: Story = {
  args: {
    tone: 'danger'
  }
}

const Warning: Story = {
  args: {
    tone: 'warning'
  }
}

const Success: Story = {
  args: {
    tone: 'success'
  }
}

const Collapsable: Story = {
  args: {
    tone: 'info',
    alertStyle: 'collapsable'
  }
}

const CollapsableDefaultClosed: Story = {
  args: {
    tone: 'info',
    alertStyle: 'collapsable',
    defaultOpen: false
  }
}

const LinkAndButton: Story = {
  args: {
    tone: 'info',
    showLinkAction: true,
    linkActionLocation: 'example',
    linkActionLabel: 'This is a link'
  },
  decorators: [vueRouter()]
}

const LinkExternal: Story = {
  args: {
    tone: 'info',
    showLinkAction: true,
    linkActionLocation: 'https://example.com',
    linkActionLabel: 'This is an external link',
    linkActionTarget: '_blank',
    linkActionExternal: true
  }
}

const OnlyLink: Story = {
  args: {
    tone: 'info',
    showButtonAction: false,
    showLinkAction: true,
    linkActionLocation: 'example',
    linkActionLabel: 'This is a link'
  },
  decorators: [vueRouter()]
}

const WithoutAction: Story = {
  args: {
    tone: 'info',
    showButtonAction: false
  }
}

const Dismissible: Story = {
  args: {
    tone: 'info',
    isDismissible: true
  }
}

const NoTitleWithButtonAction: Story = {
  args: {
    tone: 'info',
    title: undefined
  }
}

const NoTitleWithLinkAction: Story = {
  args: {
    tone: 'info',
    title: undefined,
    showButtonAction: false,
    showLinkAction: true,
    linkActionLocation: 'example',
    linkActionLabel: 'This is a link'
  },
  decorators: [vueRouter()]
}

export {
  Info,
  Error,
  Danger,
  Warning,
  Success,
  Collapsable,
  CollapsableDefaultClosed,
  LinkAndButton,
  LinkExternal,
  OnlyLink,
  WithoutAction,
  Dismissible,
  NoTitleWithButtonAction,
  NoTitleWithLinkAction
}

export default meta
