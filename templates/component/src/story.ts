import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Fz{{pascalCase component}} } from '@fiscozen/{{kebabCase component}}'

const meta = {
  title: '{{pascalCase component}}/Fz{{pascalCase component}}',
  component: Fz{{pascalCase component}},
  tags: ['autodocs'],
  argTypes: {
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice'],
      description: 'Component environment determining size and spacing',
      table: {
        defaultValue: { summary: 'frontoffice' }
      }
    },
    disabled: { control: 'boolean' }
  },
  args: {
    disabled: false
  },
  decorators: [
    () => ({
      template: '<div style="max-width: 400px; padding: 16px;"><story/></div>'
    })
  ]
} satisfies Meta<typeof Fz{{pascalCase component}}>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// DEFAULT STORY
// ============================================

export const Default: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      // Adjust selector based on your component's role
      const element = canvas.getByRole('button')
      await expect(element).toBeInTheDocument()
      await expect(element).toBeVisible()
    })

    await step('Verify default ARIA attributes', async () => {
      const element = canvas.getByRole('button')
      await expect(element).toHaveAttribute('aria-disabled', 'false')
    })

    await step('Verify click handler IS called', async () => {
      const element = canvas.getByRole('button')
      await userEvent.click(element)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  }
}

// ============================================
// STATE STORIES
// ============================================

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')

    await step('Verify disabled state', async () => {
      await expect(element).toBeDisabled()
      await expect(element).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify click handler is NOT called when disabled', async () => {
      await userEvent.click(element)
      await expect(args.onClick).not.toHaveBeenCalled()
    })
  }
}

// ============================================
// INTERACTION STORIES
// ============================================

export const UserInteraction: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')

    await step('Click the component', async () => {
      await userEvent.click(element)
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  }
}

export const KeyboardNavigation: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus element', async () => {
      await userEvent.tab()
      const focusedElement = document.activeElement
      await expect(focusedElement).toBe(canvas.getByRole('button'))
    })

    await step('Activate with Enter key', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })

    await step('Activate with Space key', async () => {
      await userEvent.keyboard(' ')
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  }
}

// ============================================
// ADDITIONAL STORIES TO ADD (as needed)
// ============================================
//
// - Variant stories (Primary, Secondary, etc.): Add a story for each variant
//   with play function verifying variant-specific behavior.
//
// - Error state: If component supports error prop, add Error story with
//   #errorMessage slot and verify aria-invalid="true" and role="alert".
//
// - V-Model: If component supports v-model, add WithVModel story using
//   render function with ref() and verify two-way binding with:
//   args: { 'onUpdate:modelValue': fn() }
//
// See existing stories in apps/storybook/src/stories/ for examples.

// ============================================
// ALL STATES STORY
// ============================================

export const AllStates: Story = {
  render: () => ({
    components: { Fz{{pascalCase component}} },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-grey-500 mb-2">Default</p>
          <Fz{{pascalCase component}} />
        </div>
        <div>
          <p class="text-sm text-grey-500 mb-2">Disabled</p>
          <Fz{{pascalCase component}} :disabled="true" />
        </div>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify all states render', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  }
}
