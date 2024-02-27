import type { Meta, StoryObj } from '@storybook/vue3'

import { FzIconButton, IconButtonVariant } from '@fiscozen/icon-button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Icon Button',
  component: FzIconButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    onClick: { action: 'clicked' }
  },
  args: { variant:  IconButtonVariant.primary} // default value
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
    variant: IconButtonVariant.secondary,
    tooltip: 'Secondary button'
  }
}

export const Large: Story = {
  args: {
    size: 'lg',
    tooltip: 'Large button'
  }
}

export const Small: Story = {
  args: {
    size: 'sm',
    tooltip: 'Small button'
  }
}
