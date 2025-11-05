import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent } from '@storybook/test'
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
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: false, hasNotification: true }" 
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: true, hasNotification: false }" 
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'backoffice', disabled: true, hasNotification: true }" 
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
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: false, hasNotification: true }" 
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: true, hasNotification: false }" 
              />
              <FzIconButton 
                v-bind="{ ...args, environment: 'frontoffice', disabled: true, hasNotification: true }" 
              />
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    iconName: 'bell',
    ariaLabel: 'Notifications'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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
  }
}

export const Primary: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'primary',
    ariaLabel: 'Primary button'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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
  }
}

export const Secondary: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'secondary',
    ariaLabel: 'Secondary button'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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
  }
}

export const Invisible: IconButtonStory = {
  ...Template,
  args: {
    ...Template.args,
    variant: 'invisible',
    ariaLabel: 'Invisible button'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
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
  }
}