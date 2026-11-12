import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzInputLabel } from '@fiscozen/input'
import { expect, within, waitFor } from 'storybook/test'
import { LABEL_ASIDE, LONG_FIELD_LABEL } from '../test-utils'

const meta = {
  title: 'Form/FzInputLabel',
  component: FzInputLabel,
  tags: ['autodocs'],
  args: {
    label: LONG_FIELD_LABEL,
    labelId: 'amount-label',
    controlId: 'amount',
    aside: LABEL_ASIDE,
    asideId: 'amount-aside',
    required: true,
    truncate: true
  }
} satisfies Meta<typeof FzInputLabel>

export default meta
type Story = StoryObj<typeof meta>

const shownTooltipTexts = () =>
  Array.from(document.querySelectorAll('[role="tooltip"][aria-hidden="false"]')).map(
    (tooltip) => tooltip.textContent ?? ''
  )

/**
 * A field of your own, 160px wide: the label row names the input and describes it
 * with the aside. Both texts are cut, and show in full while the input has focus.
 */
export const Default: Story = {
  render: (args) => ({
    components: { FzInputLabel },
    setup: () => ({ args }),
    template: `
      <div class="flex w-[160px] flex-col gap-8">
        <FzInputLabel v-bind="args" class="text-base text-grey-500" />
        <input
          :id="args.controlId"
          :aria-labelledby="args.labelId"
          :aria-describedby="args.asideId"
          required
          class="rounded border-1 border-grey-200 px-10 h-44"
        />
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const input = within(canvasElement).getByRole('textbox')

    await step('the input is named by the label and described by the aside', async () => {
      await expect(input).toHaveAccessibleName(LONG_FIELD_LABEL)
      await expect(input).toHaveAccessibleDescription(LABEL_ASIDE)
    })

    await step('focusing the input shows the full label and the full aside', async () => {
      input.focus()
      await waitFor(() =>
        expect(shownTooltipTexts()).toEqual(
          expect.arrayContaining([
            expect.stringContaining(LONG_FIELD_LABEL),
            expect.stringContaining(LABEL_ASIDE)
          ])
        )
      )
    })

    await step('leaving the input hides both', async () => {
      input.blur()
      await waitFor(() => expect(shownTooltipTexts()).toEqual([]))
    })
  }
}
