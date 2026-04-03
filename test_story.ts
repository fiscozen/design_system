import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { FzButton } from '@fiscozen/button'

const meta = {
  title: 'Button/FzButton',
  component: FzButton,
} satisfies Meta<typeof FzButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Test', async () => {
      const element = canvas.getByRole('button')
      await expect(element).toBeInTheDocument()
    })
  }
}
