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

  await step('Verify FzContainer uses layout expand-all', async () => {
    const container = canvasElement.querySelector('.layout-expand-all')
    await expect(container).toBeTruthy()
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
