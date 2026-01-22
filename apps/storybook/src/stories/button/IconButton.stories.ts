import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, within, userEvent } from '@storybook/test'
import { FzIconButton } from '@fiscozen/button'
import type { PlayFunctionContext } from '../test-utils'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifies the IconButton grid layout with backoffice/frontoffice rows.
 * This helper reduces duplication across variant stories by encapsulating
 * common verification steps for the 8-button grid (4 backoffice + 4 frontoffice).
 */
async function verifyIconButtonGridLayout(
  { canvasElement, step }: Pick<PlayFunctionContext, 'canvasElement' | 'step'>
) {
  const canvas = within(canvasElement)

  await step('Verify all buttons render', async () => {
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(8)
  })

  await step('Verify backoffice buttons', async () => {
    const buttons = canvas.getAllByRole('button')
    for (let i = 0; i < 4; i++) {
      await expect(buttons[i].classList.contains('h-32')).toBe(true)
    }
  })

  await step('Verify frontoffice buttons', async () => {
    const buttons = canvas.getAllByRole('button')
    for (let i = 4; i < 8; i++) {
      await expect(buttons[i].classList.contains('h-44')).toBe(true)
    }
  })

  await step('Verify notification badges', async () => {
    const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
    await expect(badges.length).toBe(4)
  })

  await step('Verify disabled states', async () => {
    const buttons = canvas.getAllByRole('button')
    await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
  })
}

/**
 * Verifies click handlers for enabled/disabled buttons in the grid.
 * Implements robust verification per testing-standards.mdc:
 * - Enabled buttons SHOULD call handler
 * - Disabled buttons should NOT call handler
 */
async function verifyIconButtonClickHandlers(
  { args, canvasElement, step }: PlayFunctionContext
) {
  const canvas = within(canvasElement)

  await step('Verify enabled buttons call click handler', async () => {
    const buttons = canvas.getAllByRole('button')
    const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
    
    args.onClick.mockClear()
    
    for (const button of enabledButtons) {
      await userEvent.click(button)
    }
    
    await expect(args.onClick).toHaveBeenCalledTimes(4)
  })

  await step('Verify disabled buttons do NOT call click handler', async () => {
    const buttons = canvas.getAllByRole('button')
    const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
    
    args.onClick.mockClear()
    
    for (const button of disabledButtons) {
      await userEvent.click(button)
    }
    
    await expect(args.onClick).not.toHaveBeenCalled()
  })
}

const meta = {
  title: 'Button/FzIconButton',
  component: FzIconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'invisible'] },
    environment: { control: 'select', options: ['backoffice', 'frontoffice'] },
    iconVariant: {
      control: 'select',
      options: ['fas', 'far']
    },
    iconName: { control: 'text' },
    disabled: { control: 'boolean' },
    hasNotification: { control: 'boolean' },
    ariaLabel: { control: 'text' }
  },
  args: {
    variant: 'primary',
    disabled: false,
    hasNotification: false,
    iconName: 'bell',
    iconVariant: 'far',
    ariaLabel: 'Notifications'
  }
} satisfies Meta<typeof FzIconButton>

export default meta

type IconButtonStory = StoryObj<typeof FzIconButton>

const Template: IconButtonStory = {
  render: (args) => ({
    components: { FzIconButton },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-col gap-16">
        <!-- Backoffice row -->
        <div class="flex gap-16 items-center">
          <div class="flex flex-col gap-8">
            <span class="text-sm text-grey-500">Backoffice</span>
            <div class="flex gap-8 items-center">
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: false, hasNotification: false }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: false, hasNotification: true }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: true, hasNotification: false }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: true, hasNotification: true }"
                @click="args.onClick"
              />
            </div>
          </div>
        </div>
        
        <!-- Frontoffice row -->
        <div class="flex gap-16 items-center">
          <div class="flex flex-col gap-8">
            <span class="text-sm text-grey-500">Frontoffice</span>
            <div class="flex gap-8 items-center">
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: false, hasNotification: false }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: false, hasNotification: true }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: true, hasNotification: false }"
                @click="args.onClick"
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: true, hasNotification: true }"
                @click="args.onClick"
              />
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    iconName: 'bell',
    ariaLabel: 'Notifications',
    // 👇 Use fn() to spy on click - accessible via args in play function
    onClick: fn()
  },
  play: async (context: PlayFunctionContext) => {
    // Use extracted helper functions for cleaner, more maintainable tests
    await verifyIconButtonGridLayout(context)
    await verifyIconButtonClickHandlers(context)
  }
}

export const Primary: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'primary',
    ariaLabel: 'Primary button',
    // 👇 Use fn() to spy on click - accessible via args in play function
    onClick: fn()
  },
  play: async (context: PlayFunctionContext) => {
    const { args, canvasElement, step } = context
    const canvas = within(canvasElement)

    // Use shared helper for common grid verification
    await verifyIconButtonGridLayout(context)

    await step('Verify primary variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-blue-500')).toBe(true)
        expect(button.classList.contains('text-core-white')).toBe(true)
      })
    })

    await step('Verify notification badge styling', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      
      badges.forEach(badge => {
        expect(badge?.classList.contains('rounded-full')).toBe(true)
        expect(badge?.classList.contains('w-8')).toBe(true)
        expect(badge?.classList.contains('h-8')).toBe(true)
        expect(badge?.classList.contains('absolute')).toBe(true)
        expect(badge?.classList.contains('-top-[2px]')).toBe(true)
        expect(badge?.classList.contains('-right-[2px]')).toBe(true)
      })
      
      // Primary variant should have orange badges
      badges.forEach(badge => {
        const button = badge?.closest('button')
        if (button && !button.hasAttribute('disabled')) {
          expect(badge?.classList.contains('bg-orange-500')).toBe(true)
        }
      })
    })

    // Use shared helper for click handler verification
    await verifyIconButtonClickHandlers(context)

    await step('Verify keyboard activation calls click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Focus and activate first enabled button with Enter key
      buttons[0].focus()
      await userEvent.keyboard('{Enter}')
      
      // ROBUST CHECK: Verify the click spy WAS called on keyboard activation
      await expect(args.onClick).toHaveBeenCalledTimes(1)
      
      // Focus and activate second enabled button with Space key
      buttons[1].focus()
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Verify the click spy WAS called again (twice total)
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  }
}

export const Secondary: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'secondary',
    ariaLabel: 'Secondary button',
    // 👇 Use fn() to spy on click - accessible via args in play function
    onClick: fn()
  },
  play: async (context: PlayFunctionContext) => {
    const { canvasElement, step } = context
    const canvas = within(canvasElement)

    // Use shared helper for common grid verification
    await verifyIconButtonGridLayout(context)

    await step('Verify secondary variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-core-white')).toBe(true)
        expect(button.classList.contains('text-grey-500')).toBe(true)
      })
    })

    await step('Verify notification badge color', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      
      // Secondary variant should have blue badges
      badges.forEach(badge => {
        const button = badge?.closest('button')
        if (button && !button.hasAttribute('disabled')) {
          expect(badge?.classList.contains('bg-blue-500')).toBe(true)
        }
      })
    })

    // Use shared helper for click handler verification
    await verifyIconButtonClickHandlers(context)
  }
}

export const Invisible: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'invisible',
    ariaLabel: 'Invisible button',
    // 👇 Use fn() to spy on click - accessible via args in play function
    onClick: fn()
  },
  play: async (context: PlayFunctionContext) => {
    const { canvasElement, step } = context
    const canvas = within(canvasElement)

    // Use shared helper for common grid verification
    await verifyIconButtonGridLayout(context)

    await step('Verify invisible variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-transparent')).toBe(true)
      })
    })

    await step('Verify notification badge color', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      
      // Invisible variant should have blue badges
      badges.forEach(badge => {
        const button = badge?.closest('button')
        if (button && !button.hasAttribute('disabled')) {
          expect(badge?.classList.contains('bg-blue-500')).toBe(true)
        }
      })
    })

    // Use shared helper for click handler verification
    await verifyIconButtonClickHandlers(context)
  }
}