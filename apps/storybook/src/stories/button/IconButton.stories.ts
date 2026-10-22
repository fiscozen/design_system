import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, within, userEvent } from 'storybook/test'
import { FzIconButton } from '@fiscozen/button'
import { FzThumbnail } from '@fiscozen/thumbnail'
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
    variant: { control: 'select', options: ['primary', 'secondary', 'invisible', 'danger'] },
    environment: { control: 'select', options: ['backoffice', 'frontoffice'] },
    iconVariant: {
      control: 'select',
      options: ['fas', 'far']
    },
    iconName: { control: 'text' },
    disabled: { control: 'boolean' },
    hasNotification: { control: 'boolean' },
    compact: {
      control: 'boolean',
      description: '20×20 box, 12px glyph, 44×44 touch area. `invisible` renders as `secondary`.'
    },
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

export const Danger: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'danger',
    iconName: 'trash',
    ariaLabel: 'Danger button',
    onClick: fn()
  },
  play: async (context: PlayFunctionContext) => {
    const { canvasElement, step } = context
    const canvas = within(canvasElement)

    await verifyIconButtonGridLayout(context)

    await step('Verify danger variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-semantic-error-200')).toBe(true)
        expect(button.classList.contains('text-core-white')).toBe(true)
      })
    })

    await step('Verify notification badge stands out from the red background', async () => {
      const buttons = canvas.getAllByRole('button')
      const enabledWithBadge = [buttons[1], buttons[5]]
      enabledWithBadge.forEach(button => {
        const badge = button.parentElement?.querySelector('div[aria-hidden="true"]')
        expect(badge?.classList.contains('bg-blue-800')).toBe(true)
      })
    })

    await verifyIconButtonClickHandlers(context)
  }
}

/**
 * Returns the 44×44 touch area of a compact button: its 20×20 box grown by 12px per side.
 */
function touchArea(button: HTMLElement) {
  const box = button.getBoundingClientRect()
  return {
    left: box.left - 12,
    top: box.top - 12,
    right: box.right + 12,
    bottom: box.bottom + 12
  }
}

/**
 * `compact` draws a 20×20 control with a 12px glyph, for a control that sits over
 * something small — here, the remove X on a 68px image preview. The clickable area still
 * extends to 44×44, 12px past the visible edge on every side, without taking layout space.
 *
 * Place the box at least 12px from the edge of any container that clips overflow (the
 * image, a scrolling strip), or the extension gets cut; keep two compact buttons at least
 * 24px apart, or their touch areas overlap.
 */
export const CompactOverImage: IconButtonStory = {
  args: {
    compact: true,
    variant: 'secondary',
    iconName: 'xmark',
    ariaLabel: 'Rimuovi allegato',
    onClick: fn()
  },
  parameters: {
    layout: 'padded'
  },
  render: (args) => ({
    components: { FzIconButton, FzThumbnail },
    setup() {
      return { args }
    },
    template: `
      <div class="flex gap-8">
        <div v-for="n in 2" :key="n" class="relative">
          <FzThumbnail src="consultant.jpg" :alt="'Allegato ' + n" width="68px" height="68px" />
          <div class="absolute top-12 right-12 flex">
            <FzIconButton v-bind="args" @click="args.onClick" />
          </div>
        </div>
      </div>
    `
  }),
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)
    const [first, second] = canvas.getAllByRole('button', { name: 'Rimuovi allegato' })

    await step('The visible control and its layout box measure 20×20', async () => {
      const box = first.getBoundingClientRect()
      const root = (first.parentElement as HTMLElement).getBoundingClientRect()
      await expect([box.width, box.height]).toEqual([20, 20])
      await expect([root.width, root.height]).toEqual([20, 20])
    })

    // Before any pointer interaction, so the focus counts as keyboard focus (:focus-visible)
    await step('Keyboard focus draws a ring inside the 20px box', async () => {
      await userEvent.tab()
      await expect(first).toHaveFocus()
      await expect(getComputedStyle(first).boxShadow).toBe('rgb(72, 88, 204) 0px 0px 0px 2px inset')
    })

    await step('Enter activates the focused button', async () => {
      args.onClick.mockClear()
      await userEvent.keyboard('{Enter}')
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })

    await step('A tap anywhere in the 44×44 area reaches the button', async () => {
      const area = touchArea(first)
      const corners = [
        document.elementFromPoint(area.left + 1, area.top + 1),
        document.elementFromPoint(area.right - 1, area.top + 1),
        document.elementFromPoint(area.left + 1, area.bottom - 1),
        document.elementFromPoint(area.right - 1, area.bottom - 1)
      ]
      await expect(corners).toEqual([first, first, first, first])
    })

    await step('A tap outside the 44×44 area does not reach the button', async () => {
      const area = touchArea(first)
      await expect(document.elementFromPoint(area.left - 2, area.bottom + 2)).not.toBe(first)
    })

    await step('Two neighbouring compact buttons have separate touch areas', async () => {
      const a = touchArea(first)
      const b = touchArea(second)
      await expect(a.right <= b.left).toBe(true)
    })
  }
}

/**
 * Compact `danger` with a notification badge. On the red fill the focus ring is white
 * (3.77:1), and the badge is blue-800, since blue-500 does not stand out from the red.
 */
export const CompactDanger: IconButtonStory = {
  args: {
    compact: true,
    variant: 'danger',
    iconName: 'xmark',
    ariaLabel: 'Rimuovi allegato',
    hasNotification: true,
    onClick: fn()
  },
  parameters: {
    layout: 'padded'
  },
  render: (args) => ({
    components: { FzIconButton },
    setup() {
      return { args }
    },
    template: `<FzIconButton v-bind="args" @click="args.onClick" />`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Before any pointer interaction, so the focus counts as keyboard focus (:focus-visible)
    await step('Keyboard focus draws a white ring inside the 20px box', async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
      await expect(getComputedStyle(button).boxShadow).toBe(
        'rgb(255, 255, 255) 0px 0px 0px 2px inset'
      )
    })

    await step('The notification badge is blue-800 on the red box', async () => {
      const badge = button.parentElement?.querySelector('div[aria-hidden="true"]')
      await expect(badge?.classList.contains('bg-blue-800')).toBe(true)
    })
  }
}
