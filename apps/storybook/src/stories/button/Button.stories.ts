import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'

import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Button/FzButton',
  component: FzButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'invisible']
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] }
  },
  args: { variant: 'primary', disabled: false, label: 'This is a label' } // default value,
} satisfies Meta<typeof FzButton>

export default meta

const iconTemplate = `
  <div class="flex flex-row">
    <FzButton
      class="m-12"
      :disabled="args.disabled"
      :label="args.label"
      :size="args.size"
      :tooltip="args.tooltip"
      :variant="args.variant"
      iconName="bell"
      iconPosition="before">
    </FzButton>
    <FzButton
      class="m-12"
      :disabled="args.disabled"
      :label="args.label"
      :size="args.size"
      :tooltip="args.tooltip"
      :variant="args.variant"
      iconName="bell"
      iconPosition="after">
    </FzButton>
  </div>
`

type Story = StoryObj<typeof FzButton>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    tooltip: 'Button',
    label: 'Primary Button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify button exists and has correct role
    const button = canvas.getByRole('button')
    await expect(button).toBeInTheDocument()
    
    // Verify primary variant classes
    await expect(button.classList.contains('bg-blue-500')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
    
    // Verify button is not disabled
    await expect(button).toBeEnabled()
    
    // Verify label is rendered
    await expect(button.textContent).toContain('Primary Button')
  }
}

const TemplateIcon: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzIcon, FzButton },
    template: iconTemplate
  })
}
export const PrimaryWithIcon: Story = {
  ...TemplateIcon,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify both buttons exist
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(2)
    
    // Verify icons are present
    const icons = canvasElement.querySelectorAll('svg')
    await expect(icons.length).toBe(2)
    
    // Verify first button has icon before label (mr-6 class on icon container)
    const firstButton = buttons[0]
    const iconContainerBefore = firstButton.querySelector('.mr-6')
    await expect(iconContainerBefore).toBeTruthy()
    
    // Verify second button has icon after label (ml-6 class on icon container)
    const secondButton = buttons[1]
    const iconContainerAfter = secondButton.querySelector('.ml-6')
    await expect(iconContainerAfter).toBeTruthy()
  }
}

export const SecondaryWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'secondary',
    tooltip: 'Secondary button',
    label: 'Secondary button'
  }
}

export const InvisibleWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'invisible',
    tooltip: 'Invisible button',
    label: 'Invisible button'
  }
}

export const DangerWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'danger',
    tooltip: 'Danger button',
    label: 'Danger button'
  }
}

export const SuccessWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'success',
    tooltip: 'Success button',
    label: 'Success button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    tooltip: 'Secondary button',
    label: 'Secondary button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify secondary variant classes
    await expect(button.classList.contains('bg-core-white')).toBe(true)
    await expect(button.classList.contains('text-grey-500')).toBe(true)
  }
}

export const Invisible: Story = {
  args: {
    variant: 'invisible',
    tooltip: 'Invisible button',
    label: 'Invisible button'
  }
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    tooltip: 'Danger button',
    label: 'Danger button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify danger variant uses semantic error colors
    await expect(button.classList.contains('bg-semantic-error')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
  }
}

export const Success: Story = {
  args: {
    variant: 'success',
    tooltip: 'Success button',
    label: 'Success button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify success variant uses semantic success colors
    await expect(button.classList.contains('bg-semantic-success')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
  }
}

export const ButtonWithLongTextOverflowing: Story = {
  args: {
    label: 'This is a very long text that should overflow the button',
    class: 'w-full'
  },
  globals: {
    viewport: {
      value: "xs",
      isRotated: false
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify button has full width
    await expect(button.classList.contains('w-full')).toBe(true)
    
    // Verify text container has truncate class for overflow handling
    const textContainer = button.querySelector('.truncate')
    await expect(textContainer).toBeTruthy()
  }
}
