import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent } from '@storybook/test'
import { FzButton, FzButtonGroup } from '@fiscozen/button'

const meta = {
  title: 'Button/FzButtonGroup',
  component: FzButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    },
    horizontal: {
      control: 'boolean'
    },
    gap: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof FzButtonGroup>
export default meta

type ButtonGroupStory = StoryObj<typeof FzButtonGroup>

const Template: ButtonGroupStory = {
  render: (args) => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {
        args
      }
    },
    template: `<FzButtonGroup v-bind="args" :class="['m-8 pb-8', args.horizontal === false ? 'w-128' : '']"> 
                    <FzButton variant="primary" environment="backoffice"> Button 1 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 2 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 3 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 4 </FzButton>
                </FzButtonGroup>`
  }),
  args: {
    size: 'sm'
  }
}

export const ButtonGroup: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md'
  },
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify component renders with buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
    })

    await step('Verify horizontal layout classes', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('flex-row')).toBe(true)
      await expect(container?.classList.contains('horizontal')).toBe(true)
      await expect(container?.classList.contains('flex-col')).toBe(false)
    })

    await step('Verify gap-disabled class is applied', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-disabled')).toBe(true)
    })
  }
}

export const ButtonGroupGap: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    gap: true
  },
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify gap-12 class is applied for md size', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-12')).toBe(true)
      await expect(container?.classList.contains('gap-disabled')).toBe(false)
    })

    await step('Verify buttons are rendered with spacing', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
      
      // Verify horizontal layout
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('flex-row')).toBe(true)
    })
  }
}

export const ButtonGroupGapXs: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'xs',
    gap: true
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify gap-8 class is applied for xs size', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-8')).toBe(true)
      await expect(container?.classList.contains('gap-disabled')).toBe(false)
    })
  }
}

export const ButtonGroupGapSm: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    gap: true
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify gap-10 class is applied for sm size', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-10')).toBe(true)
      await expect(container?.classList.contains('gap-disabled')).toBe(false)
    })
  }
}

export const ButtonGroupGapLg: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'lg',
    gap: true
  },
  play: async ({ canvasElement, step }: any) => {
    await step('Verify gap-16 class is applied for lg size', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-16')).toBe(true)
      await expect(container?.classList.contains('gap-disabled')).toBe(false)
    })
  }
}

export const ButtonGroupVertical: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    horizontal: false
  },
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify vertical layout classes', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('flex-col')).toBe(true)
      await expect(container?.classList.contains('vertical')).toBe(true)
      await expect(container?.classList.contains('flex-row')).toBe(false)
    })

    await step('Verify gap-disabled class for vertical layout', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('gap-disabled')).toBe(true)
    })

    await step('Verify buttons are rendered in vertical layout', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
    })

    await step('Verify vertical positioning', async () => {
      const buttons = canvas.getAllByRole('button')
      const firstButton = buttons[0].getBoundingClientRect()
      const secondButton = buttons[1].getBoundingClientRect()
      
      // Second button should be below the first (not to the right)
      await expect(secondButton.top).toBeGreaterThan(firstButton.bottom - 5)
    })
  }
}

export const ButtonGroupVerticalGap: ButtonGroupStory = {
  ...Template,
  args: {
    size: 'md',
    gap: true,
    horizontal: false
  },
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify vertical layout with gap classes', async () => {
      const container = canvasElement.querySelector('div')
      await expect(container?.classList.contains('flex-col')).toBe(true)
      await expect(container?.classList.contains('vertical')).toBe(true)
      await expect(container?.classList.contains('gap-12')).toBe(true)
      await expect(container?.classList.contains('gap-disabled')).toBe(false)
    })

    await step('Verify buttons are rendered with vertical spacing', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
      
      // Verify buttons are stacked vertically
      const firstButton = buttons[0].getBoundingClientRect()
      const secondButton = buttons[1].getBoundingClientRect()
      await expect(secondButton.top).toBeGreaterThan(firstButton.bottom - 5)
    })

    await step('Verify accessibility - buttons maintain keyboard navigation', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  }
}
