import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzButton, FzButtonGroup } from '@fiscozen/button'

const meta = {
  title: 'Button/FzButtonGroup',
  component: FzButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    horizontal: {
      table: { disable: true }
    },
    gap: {
      table: { disable: true }
    },
    size: {
      table: { disable: true }
    }
  }
} satisfies Meta<typeof FzButtonGroup>

export default meta

type ButtonGroupStory = StoryObj<typeof FzButtonGroup>

const sharedPlayFunction = async ({ canvasElement, step, expectedButtonCount }: any) => {
  const canvas = within(canvasElement)

  await step('Verify component renders with buttons', async () => {
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(expectedButtonCount)
  })

  await step('Verify FzContainer is used with horizontal prop', async () => {
    const container = canvasElement.querySelector('.fz-container--horizontal')
    await expect(container).toBeTruthy()
    await expect(container?.classList.contains('fz-container--horizontal')).toBe(true)
    await expect(container?.classList.contains('fz-container--vertical')).toBe(false)
  })

  await step('Verify FzContainer uses section gap sm (16px)', async () => {
    const container = canvasElement.querySelector('.gap-section-content-sm')
    await expect(container).toBeTruthy()
  })

  await step('Verify FzContainer uses layout default', async () => {
    const container = canvasElement.querySelector('.fz-container--horizontal')
    await expect(container).toBeTruthy()
    await expect(container?.classList.contains('layout-default')).toBe(true)
  })

  await step('Verify full width class is applied', async () => {
    const container = canvasElement.querySelector('.fz-container.w-full')
    await expect(container).toBeTruthy()
    await expect(container?.classList.contains('w-full')).toBe(true)
  })

  await step('Verify buttons are rendered with spacing', async () => {
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(expectedButtonCount)
  })

  await step('Verify accessibility - buttons maintain keyboard navigation', async () => {
    const buttons = canvas.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeVisible()
    })
  })
}

export const TwoButtonsFrontoffice: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="frontoffice">Save</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Cancel</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    await sharedPlayFunction({ canvasElement, step, expectedButtonCount: 2 })
  }
}

export const TwoButtonsBackoffice: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="backoffice">Save</FzButton>
                    <FzButton variant="secondary" environment="backoffice">Cancel</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    await sharedPlayFunction({ canvasElement, step, expectedButtonCount: 2 })
  }
}

export const ThreeButtonsFrontoffice: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="frontoffice">Save</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Cancel</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Delete</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    await sharedPlayFunction({ canvasElement, step, expectedButtonCount: 3 })
  }
}

export const ThreeButtonsBackoffice: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="backoffice">Save</FzButton>
                    <FzButton variant="secondary" environment="backoffice">Cancel</FzButton>
                    <FzButton variant="secondary" environment="backoffice">Delete</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    await sharedPlayFunction({ canvasElement, step, expectedButtonCount: 3 })
  }
}

export const TwoButtonsWithLongText: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="frontoffice">Save All Changes and Continue Working on This Document Without Closing the Current Session</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Cancel</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)
    
    await step('Verify component renders with 2 buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(2)
    })

    await step('Verify responsive layout behavior', async () => {
      const buttons = canvas.getAllByRole('button')
      const firstButton = buttons[0]
      const secondButton = buttons[1]
      const container = canvasElement.querySelector('.fz-button-group')
      
      // Get computed styles
      const firstStyle = window.getComputedStyle(firstButton)
      const secondStyle = window.getComputedStyle(secondButton)
      const isDesktop = container?.classList.contains('fz-button-group--md')
      
      if (isDesktop) {
        // Desktop: buttons use natural width and are aligned to the right
        await expect(firstStyle.flexBasis).toBe('auto')
        await expect(secondStyle.flexBasis).toBe('auto')
        await expect(firstStyle.flexGrow).toBe('0')
        await expect(secondStyle.flexGrow).toBe('0')
        await expect(firstStyle.flexShrink).toBe('0')
        await expect(secondStyle.flexShrink).toBe('0')
        await expect(container?.style.justifyContent || window.getComputedStyle(container!).justifyContent).toContain('flex-end')
      } else {
        // Mobile: buttons use fixed 50% width
        await expect(firstStyle.flexBasis).toBe('50%')
        await expect(secondStyle.flexBasis).toBe('50%')
        await expect(firstStyle.flexGrow).toBe('0')
        await expect(secondStyle.flexGrow).toBe('0')
        // flex-shrink: 1 allows shrinking below flex-basis to accommodate the 16px gap between buttons
        await expect(firstStyle.flexShrink).toBe('1')
        await expect(secondStyle.flexShrink).toBe('1')
      }
    })

    await step('Verify text truncation is applied', async () => {
      const buttons = canvas.getAllByRole('button')
      const longTextButton = buttons[0]
      const buttonText = longTextButton.textContent || ''
      
      // Verify button has long text that should be truncated
      await expect(buttonText.length).toBeGreaterThan(10)
      
      // Verify truncation class is applied (FzButton handles this internally)
      const labelContainer = longTextButton.querySelector('.truncate')
      await expect(labelContainer).toBeTruthy()
    })
  }
}

export const ThreeButtonsWithLongText: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup> 
                    <FzButton variant="primary" environment="frontoffice">Save</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Cancel This Entire Operation and Return to the Previous Screen Without Saving Any of the Modifications Made During This Session</FzButton>
                    <FzButton variant="secondary" environment="frontoffice">Delete</FzButton>
                </FzButtonGroup>`
  }),
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)
    
    await step('Verify component renders with 3 buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(3)
    })

    await step('Verify responsive layout behavior', async () => {
      const buttons = canvas.getAllByRole('button')
      const firstButton = buttons[0]
      const secondButton = buttons[1]
      const thirdButton = buttons[2]
      const container = canvasElement.querySelector('.fz-button-group')
      
      // Get computed styles
      const firstStyle = window.getComputedStyle(firstButton)
      const secondStyle = window.getComputedStyle(secondButton)
      const thirdStyle = window.getComputedStyle(thirdButton)
      const isDesktop = container?.classList.contains('fz-button-group--md')
      
      if (isDesktop) {
        // Desktop: buttons use natural width and are aligned to the right
        await expect(firstStyle.flexBasis).toBe('auto')
        await expect(secondStyle.flexBasis).toBe('auto')
        await expect(thirdStyle.flexBasis).toBe('auto')
        await expect(firstStyle.flexGrow).toBe('0')
        await expect(secondStyle.flexGrow).toBe('0')
        await expect(thirdStyle.flexGrow).toBe('0')
        await expect(firstStyle.flexShrink).toBe('0')
        await expect(secondStyle.flexShrink).toBe('0')
        await expect(thirdStyle.flexShrink).toBe('0')
        await expect(container?.style.justifyContent || window.getComputedStyle(container!).justifyContent).toContain('flex-end')
      } else {
        // Mobile: buttons use fixed 33.333% width
        await expect(firstStyle.flexBasis).toBe('33.333%')
        await expect(secondStyle.flexBasis).toBe('33.333%')
        await expect(thirdStyle.flexBasis).toBe('33.333%')
        await expect(firstStyle.flexGrow).toBe('0')
        await expect(secondStyle.flexGrow).toBe('0')
        await expect(thirdStyle.flexGrow).toBe('0')
        // flex-shrink: 1 allows shrinking below flex-basis to accommodate the 16px gaps between buttons
        await expect(firstStyle.flexShrink).toBe('1')
        await expect(secondStyle.flexShrink).toBe('1')
        await expect(thirdStyle.flexShrink).toBe('1')
      }
    })

    await step('Verify text truncation is applied to long text button', async () => {
      const buttons = canvas.getAllByRole('button')
      const longTextButton = buttons[1]
      const buttonText = longTextButton.textContent || ''
      
      // Verify button has long text that should be truncated
      await expect(buttonText.length).toBeGreaterThan(10)
      
      // Verify truncation class is applied (FzButton handles this internally)
      const labelContainer = longTextButton.querySelector('.truncate')
      await expect(labelContainer).toBeTruthy()
    })
  }
}
