import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzAction } from '@fiscozen/action'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzAction> = {
  title: 'Navigation/FzAction',
  component: FzAction,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['action', 'link'],
      description: 'Type of action component'
    },
    environment: {
      control: { type: 'select' },
      options: ['backoffice', 'frontoffice'],
      description: 'Environment variant'
    },
    variant: {
      control: { type: 'select' },
      options: ['textLeft', 'textCenter', 'onlyIcon'],
      description: 'Layout variant'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the action is disabled'
    },
    isTextTruncated: {
      control: { type: 'boolean' },
      description: 'Whether text should be truncated'
    },
    iconName: {
      control: { type: 'text' },
      description: 'Name of the icon'
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Position of the icon'
    },
    iconVariant: {
      description: 'Variant of the icon'
    },
    label: {
      control: { type: 'text' },
      description: 'Main label text'
    },
    subLabel: {
      control: { type: 'text' },
      description: 'Sub-label text'
    },
    // FzLink specific props
    to: {
      control: { type: 'text' },
      description: 'Target of the link'
    },
    replace: {
      control: { type: 'boolean' },
      description: 'Calls router.replace instead of router.push'
    },
    target: {
      control: { type: 'text' },
      description: 'Target of the link'
    },
    external: {
      control: { type: 'boolean' },
      description: 'Whether the link is for an external page or not'
    },
  },
  args: {
    type: 'action',
    environment: 'backoffice',
    variant: 'textLeft',
    disabled: false,
    isTextTruncated: false,
    iconName: 'face-smile',
    label: 'Label',
    subLabel: 'SubLabel'
  },
  decorators: [vueRouter()]
}

type Story = StoryObj<typeof meta>

// Default story
const Default: Story = {
  args: {}
}

// TextLeft variant
const TextLeft: Story = {
  args: {
    variant: 'textLeft',
    label: 'Text Left Action',
    subLabel: 'With sub-label'
  }
}

// TextCenter variant
const TextCenter: Story = {
  args: {
    variant: 'textCenter',
    label: 'Text Center Action',
    subLabel: 'With sub-label'
  }
}

// OnlyIcon variant
const OnlyIcon: Story = {
  args: {
    variant: 'onlyIcon',
    iconName: 'face-smile'
  }
}

// Disabled state
const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Action',
    subLabel: 'This action is disabled'
  }
}

// Text truncated
const TextTruncated: Story = {
  args: {
    isTextTruncated: true,
    label: 'Very Long Label That Should Be Truncated',
    subLabel: 'Very Long Sub Label That Should Also Be Truncated'
  },
  globals: {
    viewport: {
      value: "xs",
      isRotated: false
    }
  }
}

// Frontoffice environment
const Frontoffice: Story = {
  args: {
    environment: 'frontoffice',
    label: 'Frontoffice Action',
    subLabel: 'Different padding'
  }
}

// Link type
const Link: Story = {
  args: {
    type: 'link',
    to: '/example',
    label: 'Navigation Link',
    subLabel: 'Click to navigate'
  }
}

// External link
const ExternalLink: Story = {
  args: {
    type: 'link',
    to: 'https://example.com',
    label: 'External Link',
    subLabel: 'Opens in new tab',
    external: true,
    target: '_blank'
  }
}

// Icon position to the right
const IconPositionLeft: Story = {
  args: {
    iconPosition: 'left',
    label: 'Icon Position Right',
    subLabel: 'Icon position to the right'
  }
}

export {
  Default,
  TextLeft,
  TextCenter,
  IconPositionLeft,
  OnlyIcon,
  Disabled,
  TextTruncated,
  Frontoffice,
  Link,
  ExternalLink
}

export default meta
