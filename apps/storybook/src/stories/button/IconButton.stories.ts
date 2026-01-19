import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, within, userEvent } from '@storybook/test'
import { FzIconButton } from '@fiscozen/button'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all buttons render', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(8)
    })

    await step('Verify backoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      // First 4 buttons are backoffice
      for (let i = 0; i < 4; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-32')).toBe(true)
      }
    })

    await step('Verify frontoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      // Last 4 buttons are frontoffice
      for (let i = 4; i < 8; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-44')).toBe(true)
      }
    })

    await step('Verify notification badges', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      // Should have 4 badges (2nd and 4th button in each row)
      await expect(badges.length).toBe(4)
    })

    await step('Verify disabled states', async () => {
      const buttons = canvas.getAllByRole('button')
      // 3rd and 4th button in each row should be disabled
      await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
    })

    await step('Verify enabled buttons call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Enabled buttons are at indices 0, 1, 4, 5
      const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each enabled button
      for (const button of enabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy WAS called 4 times (once per enabled button)
      await expect(args.onClick).toHaveBeenCalledTimes(4)
    })

    await step('Verify disabled buttons do NOT call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Disabled buttons are at indices 2, 3, 6, 7
      const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each disabled button
      for (const button of disabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy was NOT called when clicking disabled buttons
      await expect(args.onClick).not.toHaveBeenCalled()
    })
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all buttons render', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(8)
    })

    await step('Verify primary variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-blue-500')).toBe(true)
        expect(button.classList.contains('text-core-white')).toBe(true)
      })
    })

    await step('Verify backoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 0; i < 4; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-32')).toBe(true)
      }
    })

    await step('Verify frontoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 4; i < 8; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-44')).toBe(true)
      }
    })

    await step('Verify notification badges', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      await expect(badges.length).toBe(4)
      
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

    await step('Verify disabled states', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
    })

    await step('Verify enabled buttons call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Enabled buttons are at indices 0, 1, 4, 5
      const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each enabled button
      for (const button of enabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy WAS called 4 times (once per enabled button)
      await expect(args.onClick).toHaveBeenCalledTimes(4)
    })

    await step('Verify disabled buttons do NOT call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Disabled buttons are at indices 2, 3, 6, 7
      const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each disabled button
      for (const button of disabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy was NOT called when clicking disabled buttons
      await expect(args.onClick).not.toHaveBeenCalled()
    })

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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all buttons render', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(8)
    })

    await step('Verify secondary variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-core-white')).toBe(true)
        expect(button.classList.contains('text-grey-500')).toBe(true)
      })
    })

    await step('Verify backoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 0; i < 4; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-32')).toBe(true)
      }
    })

    await step('Verify frontoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 4; i < 8; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-44')).toBe(true)
      }
    })

    await step('Verify notification badges', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      await expect(badges.length).toBe(4)
      
      // Secondary variant should have blue badges
      badges.forEach(badge => {
        const button = badge?.closest('button')
        if (button && !button.hasAttribute('disabled')) {
          expect(badge?.classList.contains('bg-blue-500')).toBe(true)
        }
      })
    })

    await step('Verify disabled states', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
    })

    await step('Verify enabled buttons call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Enabled buttons are at indices 0, 1, 4, 5
      const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each enabled button
      for (const button of enabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy WAS called 4 times (once per enabled button)
      await expect(args.onClick).toHaveBeenCalledTimes(4)
    })

    await step('Verify disabled buttons do NOT call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Disabled buttons are at indices 2, 3, 6, 7
      const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each disabled button
      for (const button of disabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy was NOT called when clicking disabled buttons
      await expect(args.onClick).not.toHaveBeenCalled()
    })
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
  play: async ({ args, canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify all buttons render', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(8)
    })

    await step('Verify invisible variant classes', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.classList.contains('bg-transparent')).toBe(true)
      })
    })

    await step('Verify backoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 0; i < 4; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-32')).toBe(true)
      }
    })

    await step('Verify frontoffice buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      for (let i = 4; i < 8; i++) {
        const button = buttons[i]
        await expect(button.classList.contains('h-44')).toBe(true)
      }
    })

    await step('Verify notification badges', async () => {
      const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
      await expect(badges.length).toBe(4)
      
      // Invisible variant should have blue badges
      badges.forEach(badge => {
        const button = badge?.closest('button')
        if (button && !button.hasAttribute('disabled')) {
          expect(badge?.classList.contains('bg-blue-500')).toBe(true)
        }
      })
    })

    await step('Verify disabled states', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
      await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
    })

    await step('Verify enabled buttons call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Enabled buttons are at indices 0, 1, 4, 5
      const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each enabled button
      for (const button of enabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy WAS called 4 times (once per enabled button)
      await expect(args.onClick).toHaveBeenCalledTimes(4)
    })

    await step('Verify disabled buttons do NOT call click handler', async () => {
      const buttons = canvas.getAllByRole('button')
      // Disabled buttons are at indices 2, 3, 6, 7
      const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
      
      // Reset spy call count
      args.onClick.mockClear()
      
      // Click each disabled button
      for (const button of disabledButtons) {
        await userEvent.click(button)
      }
      
      // ROBUST CHECK: Verify the click spy was NOT called when clicking disabled buttons
      await expect(args.onClick).not.toHaveBeenCalled()
    })
  }
}