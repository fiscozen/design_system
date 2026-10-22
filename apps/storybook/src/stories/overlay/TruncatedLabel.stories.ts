import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzTruncatedLabel } from '@fiscozen/tooltip'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { LONG_FIELD_LABEL } from '../test-utils'

const meta = {
  title: 'Overlay/FzTruncatedLabel',
  component: FzTruncatedLabel,
  tags: ['autodocs'],
  args: {
    label: LONG_FIELD_LABEL,
    labelId: 'payment-date-label',
    controlId: 'payment-date',
    required: true
  }
} satisfies Meta<typeof FzTruncatedLabel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A label too long for its 200px field: cut with an ellipsis, the asterisk still
 * visible, the full text in a tooltip while the input has focus.
 */
export const Default: Story = {
  render: (args) => ({
    components: { FzTruncatedLabel },
    setup: () => ({ args }),
    template: `
      <div class="flex w-[200px] flex-col gap-8">
        <FzTruncatedLabel v-bind="args" class="text-base text-grey-500" />
        <input :id="args.controlId" :aria-labelledby="args.labelId" required class="rounded border-1 border-grey-200 px-10 h-44" />
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')

    await step('the input is named by the full label', async () => {
      await expect(input).toHaveAccessibleName(LONG_FIELD_LABEL)
    })

    await step('the required marker stays visible inside the field', async () => {
      const marker = canvas.getByText('*')
      await expect(marker.getBoundingClientRect().right).toBeLessThanOrEqual(
        input.getBoundingClientRect().right
      )
    })

    await step('focusing the input shows the full label', async () => {
      await userEvent.tab()

      await expect(input).toHaveFocus()
      await waitFor(() =>
        expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toHaveTextContent(
          LONG_FIELD_LABEL
        )
      )
    })

    await step('leaving the input hides it', async () => {
      await userEvent.tab()

      await waitFor(() =>
        expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toBeNull()
      )
    })
  }
}
