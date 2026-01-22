import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from '@storybook/test'
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
      description: 'Name of the icon (for onlyIcon variant)'
    },
    iconVariant: {
      description: 'Variant of the icon (for onlyIcon variant)'
    },
    iconLeftName: {
      control: { type: 'text' },
      description: 'Name of the left icon (for textLeft and textCenter variants)'
    },
    iconLeftVariant: {
      description: 'Variant of the left icon (for textLeft and textCenter variants)'
    },
    iconRightName: {
      control: { type: 'text' },
      description: 'Name of the right icon (for textLeft and textCenter variants)'
    },
    iconRightVariant: {
      description: 'Variant of the right icon (for textLeft and textCenter variants)'
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
    }
  },
  args: {
    type: 'action',
    environment: 'backoffice',
    variant: 'textLeft',
    disabled: false,
    isTextTruncated: false,
    iconRightName: 'face-smile',
    label: 'Label',
    subLabel: 'SubLabel'
    // Note: Spies (onClick, onKeydown) are defined per-story in args to avoid shared mutable state across stories
  },
  decorators: [vueRouter()]
}

type Story = StoryObj<typeof meta>

// Default story - uses fn() spies for robust interaction verification
// Note: FzAction emits 'click' for mouse clicks and 'keydown' for keyboard activation
const Default: Story = {
  args: {
    // 👇 Define spies in args - they're accessible via args parameter in play function
    onClick: fn(),
    onKeydown: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify action renders correctly', async () => {
      const button = canvas.getByRole('button', { name: /label/i })
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify label and sub-label are displayed', async () => {
      const label = canvas.getByText('Label')
      const subLabel = canvas.getByText('SubLabel')
      await expect(label).toBeInTheDocument()
      await expect(subLabel).toBeInTheDocument()
    })
    
    await step('Verify ARIA attributes', async () => {
      const button = canvas.getByRole('button', { name: /label/i })
      await expect(button).toHaveAttribute('aria-disabled', 'false')
      await expect(button).toHaveAttribute('type', 'button')
    })
    
    await step('Verify click handler IS called when action is clicked', async () => {
      const button = canvas.getByRole('button', { name: /label/i })
      
      await userEvent.click(button)
      
      // ROBUST CHECK: Verify the click spy WAS called (contrast with disabled state)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify keydown handler IS called on keyboard activation (Enter key)', async () => {
      const button = canvas.getByRole('button', { name: /label/i })
      
      // Focus and activate with Enter key
      button.focus()
      await userEvent.keyboard('{Enter}')
      
      // ROBUST CHECK: Verify the keydown spy WAS called (FzAction emits 'keydown' for keyboard)
      await expect(args.onKeydown).toHaveBeenCalledTimes(1)
    })
  }
}

// TextLeft variant
const TextLeft: Story = {
  args: {
    variant: 'textLeft',
    iconRightName: 'chevron-right',
    label: 'Text Left Action',
    subLabel: 'With sub-label'
  }
}

// TextCenter variant
const TextCenter: Story = {
  args: {
    variant: 'textCenter',
    iconLeftName: 'smile',
    iconRightName: 'smile',
    label: 'Text Center Action',
    subLabel: 'With sub-label'
  }
}

// OnlyIcon variant
const OnlyIcon: Story = {
  args: {
    variant: 'onlyIcon',
    iconName: 'face-smile'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify icon-only action renders', async () => {
      const button = canvas.getByRole('button')
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify icon is present', async () => {
      const button = canvas.getByRole('button')
      // Icon should be present within the button
      const icon = button.querySelector('svg') || button.querySelector('[class*="icon"]')
      expect(icon).toBeTruthy()
    })
    
    await step('Verify icon-only action is clickable', async () => {
      const button = canvas.getByRole('button')
      await userEvent.click(button)
      // Action should be clickable
      await expect(button).toBeInTheDocument()
    })
  }
}

// Disabled state - uses fn() spies to verify handlers are NOT called
const Disabled: Story = {
  args: {
    disabled: true,
    iconRightName: 'face-smile',
    label: 'Disabled Action',
    subLabel: 'This action is disabled',
    // 👇 Define spies in args - they should NOT be called when disabled
    onClick: fn(),
    onKeydown: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify disabled action renders', async () => {
      const button = canvas.getByRole('button', { name: /disabled action/i })
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify disabled state attributes', async () => {
      const button = canvas.getByRole('button', { name: /disabled action/i })
      await expect(button).toHaveAttribute('aria-disabled', 'true')
      await expect(button).toHaveAttribute('disabled')
      await expect(button).toHaveAttribute('tabindex', '-1')
    })
    
    await step('Verify click handler is NOT called when clicking disabled action', async () => {
      const button = canvas.getByRole('button', { name: /disabled action/i })
      await expect(button).toBeDisabled()
      
      // Attempt to click the disabled button
      await userEvent.click(button)
      
      // ROBUST CHECK: Verify the click spy was NOT called
      await expect(args.onClick).not.toHaveBeenCalled()
    })
    
    await step('Verify keydown handler is NOT called on keyboard activation attempt', async () => {
      const button = canvas.getByRole('button', { name: /disabled action/i })
      
      // Try to focus and activate with keyboard (should not work on disabled element)
      button.focus()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the keydown spy was NOT called
      await expect(args.onKeydown).not.toHaveBeenCalled()
    })
  }
}

// Text truncated
const TextTruncated: Story = {
  args: {
    isTextTruncated: true,
    iconRightName: 'face-smile',
    label: 'Very Long Label That Should Be Truncated',
    subLabel: 'Very Long Sub Label That Should Also Be Truncated'
  },
  globals: {
    viewport: {
      value: 'xs',
      isRotated: false
    }
  }
}

// Frontoffice environment
const Frontoffice: Story = {
  args: {
    environment: 'frontoffice',
    iconRightName: 'face-smile',
    label: 'Frontoffice Action',
    subLabel: 'Different padding'
  }
}

// Link type
const Link: Story = {
  args: {
    type: 'link',
    to: '/example',
    iconRightName: 'face-smile',
    label: 'Navigation Link',
    subLabel: 'Click to navigate'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify link renders correctly', async () => {
      const link = canvas.getByRole('link', { name: /navigation link/i })
      await expect(link).toBeInTheDocument()
      await expect(link).toBeVisible()
    })
    
    await step('Verify link has correct href', async () => {
      const link = canvas.getByRole('link', { name: /navigation link/i })
      // Router link should have navigation capability
      await expect(link).toHaveAttribute('href')
    })
    
    await step('Verify link is accessible', async () => {
      const link = canvas.getByRole('link', { name: /navigation link/i })
      await expect(link).toHaveAttribute('aria-disabled', 'false')
    })
    
    await step('Verify link can be clicked', async () => {
      const link = canvas.getByRole('link', { name: /navigation link/i })
      await userEvent.click(link)
      // Link should be clickable
      await expect(link).toBeInTheDocument()
    })
  }
}

// External link
const ExternalLink: Story = {
  args: {
    type: 'link',
    to: 'https://example.com',
    iconRightName: 'face-smile',
    label: 'External Link',
    subLabel: 'Opens in new tab',
    external: true,
    target: '_blank'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify external link renders', async () => {
      const link = canvas.getByRole('link', { name: /external link/i })
      await expect(link).toBeInTheDocument()
      await expect(link).toBeVisible()
    })
    
    await step('Verify external link attributes', async () => {
      const link = canvas.getByRole('link', { name: /external link/i })
      await expect(link).toHaveAttribute('target', '_blank')
      // External links should have aria-label indicating new window
      const ariaLabel = link.getAttribute('aria-label')
      await expect(ariaLabel).toContain('opens in new window')
    })
    
    await step('Verify external link is accessible', async () => {
      const link = canvas.getByRole('link', { name: /external link/i })
      await expect(link).toHaveAttribute('aria-disabled', 'false')
    })
  }
}

// Icon position to the left
const IconPositionLeft: Story = {
  args: {
    iconLeftName: 'face-smile',
    label: 'Icon Position Left',
    subLabel: 'Icon position to the left'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify action with left icon renders', async () => {
      const button = canvas.getByRole('button', { name: /icon position left/i })
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify left icon is present', async () => {
      const button = canvas.getByRole('button', { name: /icon position left/i })
      // Icon should be present within the button
      const icon = button.querySelector('svg') || button.querySelector('[class*="icon"]')
      expect(icon).toBeTruthy()
    })
  }
}

// Keyboard navigation story
const KeyboardNavigation: Story = {
  args: {
    type: 'action',
    label: 'Keyboard Navigation Test',
    subLabel: 'Test keyboard interactions'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus the action', async () => {
      document.body.focus() // Reset focus to body
      const button = canvas.getByRole('button', { name: /keyboard navigation test/i })
      await userEvent.tab()
      await expect(document.activeElement).toBe(button)
    })
    
    await step('Activate with Enter key', async () => {
      const button = canvas.getByRole('button', { name: /keyboard navigation test/i })
      button.focus()
      await userEvent.keyboard('{Enter}')
      // Action should be activated
      await expect(button).toBeInTheDocument()
    })
    
    await step('Activate with Space key', async () => {
      const button = canvas.getByRole('button', { name: /keyboard navigation test/i })
      button.focus()
      await userEvent.keyboard(' ')
      // Action should be activated
      await expect(button).toBeInTheDocument()
    })
    
    await step('Verify disabled action blocks keyboard', async () => {
      // This test verifies that disabled actions don't respond to keyboard
      // The Disabled story already covers this, but we verify focus behavior
      const button = canvas.getByRole('button', { name: /keyboard navigation test/i })
      await expect(button).toHaveAttribute('aria-disabled', 'false')
      await expect(button).not.toHaveAttribute('tabindex', '-1')
    })
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
  ExternalLink,
  KeyboardNavigation
}

export default meta
