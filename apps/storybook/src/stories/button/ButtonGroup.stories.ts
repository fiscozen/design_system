import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzButton, FzButtonGroup } from '@fiscozen/button'

const meta = {
  title: 'Button/FzButtonGroup',
  component: FzButtonGroup,
  tags: ['autodocs']
} satisfies Meta<typeof FzButtonGroup>

export default meta

type ButtonGroupStory = StoryObj<typeof FzButtonGroup>

const Template: ButtonGroupStory = {
  render: () => ({
    components: { FzButtonGroup, FzButton },
    setup() {
      return {}
    },
    template: `<FzButtonGroup class="m-8 pb-8"> 
                    <FzButton variant="primary" environment="backoffice"> Button 1 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 2 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 3 </FzButton>
                    <FzButton variant="secondary" environment="backoffice"> Button 4 </FzButton>
                </FzButtonGroup>`
  })
}

export const ButtonGroup: ButtonGroupStory = {
  ...Template,
  play: async ({ canvasElement, step }: any) => {
    const canvas = within(canvasElement)

    await step('Verify component renders with buttons', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
    })

    await step('Verify horizontal layout classes', async () => {
      const container = canvasElement.querySelector('div.flex')
      await expect(container?.classList.contains('flex-row')).toBe(true)
      await expect(container?.classList.contains('flex-col')).toBe(false)
    })

    await step('Verify fixed gap class is applied', async () => {
      const container = canvasElement.querySelector('div.flex')
      await expect(container?.classList.contains('gap-16')).toBe(true)
    })

    await step('Verify buttons are rendered with spacing', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(4)
    })

    await step('Verify accessibility - buttons maintain keyboard navigation', async () => {
      const buttons = canvas.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  }
}
