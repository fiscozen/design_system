import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from '@storybook/test'

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
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice'],
      description: 'Button environment determining size and spacing',
      table: {
        defaultValue: { summary: 'frontoffice' }
      }
    },
    size: { table: { disable: true } },
    tooltip: { table: { disable: true } }
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
      :environment="args.environment"
      :variant="args.variant"
      iconName="bell"
      iconPosition="before">
    </FzButton>
    <FzButton
      class="m-12"
      :disabled="args.disabled"
      :label="args.label"
      :environment="args.environment"
      :variant="args.variant"
      iconName="bell"
      iconPosition="after">
    </FzButton>
    <FzButton
      class="m-12"
      :disabled="args.disabled"
      :label="args.label"
      :environment="args.environment"
      :variant="args.variant">
      <template #before>
        <FzIcon name="bell" size="md" />
      </template>
      <template #after>
        <FzIcon name="bell" size="md" />
      </template>
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
    label: 'Primary Button',
    // 👇 Use fn() to spy on click - accessible via args in play function
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    await step('Verify button exists and has correct role', async () => {
      await expect(button).toBeInTheDocument()
    })
    
    await step('Verify primary variant default state classes', async () => {
      await expect(button.classList.contains('bg-blue-500')).toBe(true)
      await expect(button.classList.contains('text-core-white')).toBe(true)
    })
    
    await step('Verify hover state class', async () => {
      await expect(button.classList.contains('hover:bg-blue-600')).toBe(true)
    })
    
    await step('Verify focus state classes', async () => {
      await expect(button.classList.contains('focus:bg-blue-500')).toBe(true)
      await expect(button.classList.contains('focus:!border-blue-600')).toBe(true)
    })
    
    await step('Verify disabled state class exists (for styling)', async () => {
      await expect(button.classList.contains('disabled:bg-blue-200')).toBe(true)
    })
    
    await step('Verify button is not disabled', async () => {
      await expect(button).toBeEnabled()
    })
    
    await step('Verify label is rendered', async () => {
      await expect(button.textContent).toContain('Primary Button')
    })
    
    await step('Verify default environment (frontoffice)', async () => {
      await expect(button.classList.contains('h-44')).toBe(true)
    })
    
    await step('Verify border and gap', async () => {
      await expect(button.classList.contains('border-1')).toBe(true)
      await expect(button.classList.contains('gap-8')).toBe(true)
    })
    
    await step('Verify accessibility attributes', async () => {
      // Verify button is focusable (tabindex)
      await expect(button.getAttribute('tabindex')).not.toBe('-1')
      
      // Verify button type
      await expect(button.getAttribute('type')).toBe('button')
      
      // Verify aria-disabled is set to "false" when enabled
      await expect(button.getAttribute('aria-disabled')).toBe('false')
    })
    
    await step('Verify click handler IS called when button is clicked', async () => {
      await userEvent.click(button)
      
      // ROBUST CHECK: Verify the click spy WAS called (contrast with disabled state)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify click handler IS called on keyboard activation', async () => {
      // Focus and activate with Enter key
      button.focus()
      await userEvent.keyboard('{Enter}')
      
      // ROBUST CHECK: Verify the click spy WAS called (twice total: click + Enter)
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
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
    
    // Verify all 3 buttons exist (icon before, icon after, both icons)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
    
    // Verify icons are present (3 buttons with icons: 1 + 1 + 2 = 4 icons total)
    const icons = canvasElement.querySelectorAll('svg')
    await expect(icons.length).toBe(4)
    
    // Verify all buttons have primary variant classes
    buttons.forEach(button => {
      expect(button.classList.contains('bg-blue-500')).toBe(true)
      expect(button.classList.contains('text-core-white')).toBe(true)
    })
    
    // Verify gap-8 for icon spacing
    buttons.forEach(button => {
      expect(button.classList.contains('gap-8')).toBe(true)
    })
    
    // Icon alignment: Verify icons are in flex containers with proper alignment
    const iconContainers = canvasElement.querySelectorAll('.flex.items-center.justify-items-center')
    await expect(iconContainers.length).toBeGreaterThan(0)
    
    // Verify icon size consistency (all icons should be 16px - md size)
    icons.forEach(icon => {
      const height = icon.getAttribute('class')?.includes('h-[16px]')
      expect(height).toBe(true)
    })
    
    // Multiple buttons spacing: Verify buttons have margin between them
    buttons.forEach(button => {
      expect(button.classList.contains('m-12')).toBe(true)
    })
  }
}

export const SecondaryWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'secondary',
    label: 'Secondary button'
  }
}

export const InvisibleWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'invisible',
    label: 'Invisible button'
  }
}

export const DangerWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'danger',
    label: 'Danger button'
  }
}

export const SuccessWithIcon: Story = {
  ...TemplateIcon,
  args: {
    variant: 'success',
    label: 'Success button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify secondary variant default state classes
    await expect(button.classList.contains('bg-core-white')).toBe(true)
    await expect(button.classList.contains('text-grey-500')).toBe(true)
    await expect(button.classList.contains('!border-grey-200')).toBe(true)
    
    // Verify hover state classes
    await expect(button.classList.contains('hover:bg-grey-100')).toBe(true)
    await expect(button.classList.contains('hover:!border-grey-200')).toBe(true)
    
    // Verify focus state classes
    await expect(button.classList.contains('focus:bg-core-white')).toBe(true)
    await expect(button.classList.contains('focus:!border-blue-600')).toBe(true)
    
    // Verify disabled state classes
    await expect(button.classList.contains('disabled:bg-grey-50')).toBe(true)
    await expect(button.classList.contains('disabled:text-grey-200')).toBe(true)
    await expect(button.classList.contains('disabled:!border-grey-200')).toBe(true)
  }
}

export const Invisible: Story = {
  args: {
    variant: 'invisible',
    label: 'Invisible button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify invisible variant default state classes
    await expect(button.classList.contains('bg-transparent')).toBe(true)
    await expect(button.classList.contains('text-grey-500')).toBe(true)
    await expect(button.classList.contains('!border-transparent')).toBe(true)
    
    // Verify hover state classes
    await expect(button.classList.contains('hover:bg-grey-100')).toBe(true)
    await expect(button.classList.contains('hover:!border-grey-100')).toBe(true)
    
    // Verify focus state classes
    await expect(button.classList.contains('focus:bg-transparent')).toBe(true)
    await expect(button.classList.contains('focus:!border-blue-600')).toBe(true)
    
    // Verify disabled state classes (same as secondary)
    await expect(button.classList.contains('disabled:bg-grey-50')).toBe(true)
    await expect(button.classList.contains('disabled:text-grey-200')).toBe(true)
    await expect(button.classList.contains('disabled:!border-grey-200')).toBe(true)
  }
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Danger button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify danger variant default state classes
    await expect(button.classList.contains('bg-semantic-error-200')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
    
    // Verify hover state class
    await expect(button.classList.contains('hover:bg-semantic-error-300')).toBe(true)
    
    // Verify focus state classes
    await expect(button.classList.contains('focus:bg-semantic-error-200')).toBe(true)
    await expect(button.classList.contains('focus:!border-semantic-error-300')).toBe(true)
    
    // Verify disabled state class
    await expect(button.classList.contains('disabled:bg-semantic-error-100')).toBe(true)
  }
}

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Success button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify success variant default state classes
    await expect(button.classList.contains('bg-semantic-success-200')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
    
    // Verify hover state class
    await expect(button.classList.contains('hover:bg-semantic-success-300')).toBe(true)
    
    // Verify focus state classes
    await expect(button.classList.contains('focus:bg-semantic-success-200')).toBe(true)
    await expect(button.classList.contains('focus:!border-semantic-success-300')).toBe(true)
    
    // Verify disabled state class
    await expect(button.classList.contains('disabled:bg-semantic-success-100')).toBe(true)
  }
}

export const BackofficeEnvironment: Story = {
  args: {
    environment: 'backoffice',
    label: 'Backoffice Button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify backoffice environment classes
    await expect(button.classList.contains('h-32')).toBe(true)
    await expect(button.classList.contains('text-lg')).toBe(false)
  }
}

export const FrontofficeEnvironment: Story = {
  args: {
    environment: 'frontoffice',
    label: 'Frontoffice Button'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const button = canvas.getByRole('button')
    
    // Verify frontoffice environment height
    await expect(button.classList.contains('h-44')).toBe(true)
    
    // Verify padding and min-width
    await expect(button.classList.contains('px-12')).toBe(true)
    await expect(button.classList.contains('min-w-96')).toBe(true)
    
    // Verify no text-lg class (font-size is 16px by default)
    await expect(button.classList.contains('text-lg')).toBe(false)
  }
}

// Disabled state - uses fn() spy to verify handler is NOT called
export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
    // 👇 Define spy in args - it should NOT be called when disabled
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    await step('Verify button is disabled', async () => {
      await expect(button).toBeDisabled()
      await expect(button).toHaveAttribute('aria-disabled', 'true')
    })
    
    await step('Verify click handler is NOT called when clicking disabled button', async () => {
      await userEvent.click(button)
      
      // ROBUST CHECK: Verify the click spy was NOT called
      await expect(args.onClick).not.toHaveBeenCalled()
    })
    
    await step('Verify click handler is NOT called on keyboard activation attempt', async () => {
      button.focus()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the click spy was NOT called
      await expect(args.onClick).not.toHaveBeenCalled()
    })
  }
}

// Visual showcase of all disabled button variants (styling focus)
export const DisabledStates: Story = {
  render: () => ({
    components: { FzButton },
    template: `
      <div class="flex flex-col gap-12">
        <div class="flex flex-row gap-12">
          <FzButton variant="primary" label="Primary Disabled" :disabled="true" />
          <FzButton variant="secondary" label="Secondary Disabled" :disabled="true" />
          <FzButton variant="invisible" label="Invisible Disabled" :disabled="true" />
          <FzButton variant="danger" label="Danger Disabled" :disabled="true" />
          <FzButton variant="success" label="Success Disabled" :disabled="true" />
        </div>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    
    await step('Verify all buttons are disabled', async () => {
      buttons.forEach(button => {
        expect(button).toBeDisabled()
        expect(button.hasAttribute('disabled')).toBe(true)
      })
    })
    
    await step('Verify primary disabled state styling', async () => {
      const primaryBtn = buttons[0]
      await expect(primaryBtn.classList.contains('disabled:bg-blue-200')).toBe(true)
    })
    
    await step('Verify secondary disabled state styling', async () => {
      const secondaryBtn = buttons[1]
      await expect(secondaryBtn.classList.contains('disabled:bg-grey-50')).toBe(true)
      await expect(secondaryBtn.classList.contains('disabled:text-grey-200')).toBe(true)
      await expect(secondaryBtn.classList.contains('disabled:!border-grey-200')).toBe(true)
    })
    
    await step('Verify invisible disabled state styling', async () => {
      const invisibleBtn = buttons[2]
      await expect(invisibleBtn.classList.contains('disabled:bg-grey-50')).toBe(true)
      await expect(invisibleBtn.classList.contains('disabled:text-grey-200')).toBe(true)
      await expect(invisibleBtn.classList.contains('disabled:!border-grey-200')).toBe(true)
    })
    
    await step('Verify danger disabled state styling', async () => {
      const dangerBtn = buttons[3]
      await expect(dangerBtn.classList.contains('disabled:bg-semantic-error-100')).toBe(true)
    })
    
    await step('Verify success disabled state styling', async () => {
      const successBtn = buttons[4]
      await expect(successBtn.classList.contains('disabled:bg-semantic-success-100')).toBe(true)
    })
    
    await step('Verify accessibility attributes on disabled buttons', async () => {
      buttons.forEach(button => {
        expect(button.getAttribute('disabled')).not.toBeNull()
        expect(button.getAttribute('aria-disabled')).toBe('true')
      })
    })
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
    
    // Verify text is actually truncated (ellipsis behavior)
    const containerStyle = window.getComputedStyle(textContainer as Element)
    await expect(containerStyle.overflow).toBe('hidden')
    await expect(containerStyle.textOverflow).toBe('ellipsis')
    await expect(containerStyle.whiteSpace).toBe('nowrap')
  }
}
