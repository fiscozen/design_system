import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FzIconButton, IconButtonVariant } from '@fiscozen/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Button/FzIconButton',
  component: FzIconButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'notification', 'invisible'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    iconVariant: {
      control: 'select',
      options: ['fas', 'far', 'fal', 'fat', 'fad', 'fass', 'fasr', 'fasl', 'fast']
    }
  },
  args: { variant: 'primary', disabled: false, iconName: 'bell', iconVariant: 'far' } // default value
} satisfies Meta<typeof FzIconButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    tooltip: 'Button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    tooltip: 'Secondary button'
  }
}

export const Notification: Story = {
  args: {
    variant: 'notification',
    tooltip: 'Notification button'
  }
}

export const Invisible: Story = {
  args: {
    variant: 'invisible',
    tooltip: 'Invisible button'
  }
}
