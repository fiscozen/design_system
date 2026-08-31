import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { FzPopover } from '@fiscozen/popover'
import { FzButton } from '@fiscozen/button'

/**
 * FzPopover picks between two engines: a native `[popover]` placed in CSS
 * (`position-anchor` + `position-area`) where the browser supports anchor
 * positioning, and `FzFloating` — the design system's measured-rect
 * implementation — everywhere else, for `auto` placements, or on `forceFallback`.
 */
const meta = {
  title: 'Overlay/FzPopover',
  component: FzPopover,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'bottom-start',
        'bottom',
        'bottom-end',
        'top-start',
        'top',
        'top-end',
        'left',
        'right',
        'auto',
        'auto-vertical-start'
      ],
      description:
        'Same vocabulary as FzFloating. The `auto` variants always take the JS engine: "the side with the most space" needs measuring.'
    },
    offset: { control: 'number', description: 'Gap between anchor and content, in px' },
    matchOpenerWidth: {
      control: 'boolean',
      description: "Give the content at least the anchor's width"
    },
    forceFallback: {
      control: 'boolean',
      description: 'Force the JS engine even where the browser could do it in CSS'
    }
  }
} satisfies Meta<typeof FzPopover>
export default meta

type PopoverStory = StoryObj<typeof FzPopover>

const template = `
  <div class="flex justify-center p-32">
    <FzPopover v-bind="args" @fzpopover:toggle="args['onFzpopover:toggle']">
      <template #opener="{ toggle }">
        <FzButton @click="toggle">Apri</FzButton>
      </template>
      <div class="rounded border border-grey-200 bg-core-white p-12 shadow-md min-w-[200px]">
        <p>Contenuto del popover</p>
      </div>
    </FzPopover>
  </div>`

const render = (args: Record<string, unknown>) => ({
  components: { FzPopover, FzButton },
  setup() {
    return { args }
  },
  template
})

export const Default: PopoverStory = {
  render,
  args: {
    position: 'bottom-start',
    'onFzpopover:toggle': fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Contenuto del popover')).not.toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Apri' }))
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).toBeVisible())
    await expect(args['onFzpopover:toggle']).toHaveBeenCalledWith(true)

    // Closing goes through the opener, not Esc: light dismiss and Esc are platform
    // behaviours that only trusted input triggers, and userEvent dispatches
    // synthetic events. They are covered by a Playwright probe with real keys.
    await userEvent.click(canvas.getByRole('button', { name: 'Apri' }))
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).not.toBeVisible())
    await expect(args['onFzpopover:toggle']).toHaveBeenCalledWith(false)
  }
}

/** Same component, same assertions, JS engine — the fallback must behave alike. */
export const ForcedFallback: PopoverStory = {
  render,
  args: {
    position: 'bottom-start',
    forceFallback: true,
    'onFzpopover:toggle': fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Contenuto del popover')).not.toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Apri' }))
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).toBeVisible())
    await expect(args['onFzpopover:toggle']).toHaveBeenCalledWith(true)

    // Here Esc *is* assertable: dismissal in the JS engine is our own keydown
    // listener, which a synthetic event reaches just fine.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).not.toBeVisible())
  }
}

/** `auto` is not expressible in CSS, so this story runs on the JS engine too. */
export const AutoPosition: PopoverStory = {
  render,
  args: {
    position: 'auto-vertical-start',
    'onFzpopover:toggle': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Apri' }))
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).toBeVisible())
  }
}

/**
 * Both engines, open on mount, so a visual snapshot covers them side by side: the
 * left one is the native popover placed in CSS, the right one is `FzFloating`. They
 * should look the same — same offset from the opener, same alignment.
 */
export const BothEnginesOpen: PopoverStory = {
  render: (args) => ({
    components: { FzPopover, FzButton },
    setup() {
      return { args }
    },
    template: `
    <div class="flex justify-center gap-[220px] p-32 pb-[220px]">
      <FzPopover v-bind="args" :open="true">
        <template #opener="{ toggle }">
          <FzButton @click="toggle">Motore CSS</FzButton>
        </template>
        <div class="rounded border border-grey-200 bg-core-white p-12 shadow-md min-w-[200px]">
          <p data-engine="css">Stesso contenuto, stesso offset</p>
        </div>
      </FzPopover>

      <FzPopover v-bind="args" :open="true" :force-fallback="true">
        <template #opener="{ toggle }">
          <FzButton @click="toggle">Motore JS</FzButton>
        </template>
        <div class="rounded border border-grey-200 bg-core-white p-12 shadow-md min-w-[200px]">
          <p data-engine="js">Stesso contenuto, stesso offset</p>
        </div>
      </FzPopover>
    </div>`
  }),
  args: {
    position: 'bottom-start'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Both are open without anyone clicking: `open` was already true at mount.
    const content = (engine: string) =>
      canvasElement.querySelector<HTMLElement>(`[data-engine="${engine}"]`)!
    await waitFor(() => expect(content('css')).toBeVisible())
    await expect(content('js')).toBeVisible()

    // And they agree on where the content sits relative to its opener.
    const offsetFromOpener = (openerName: string, engine: string) => {
      const opener = canvas.getByRole('button', { name: openerName })
      const box = content(engine).closest('div')!
      return Math.round(box.getBoundingClientRect().top - opener.getBoundingClientRect().bottom)
    }
    await expect(offsetFromOpener('Motore CSS', 'css')).toBe(offsetFromOpener('Motore JS', 'js'))
  }
}

export const MatchOpenerWidth: PopoverStory = {
  render,
  args: {
    position: 'bottom-start',
    matchOpenerWidth: true,
    'onFzpopover:toggle': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const opener = canvas.getByRole('button', { name: 'Apri' })
    await userEvent.click(opener)
    await waitFor(() => expect(canvas.getByText('Contenuto del popover')).toBeVisible())
    // The content is at least as wide as the thing it hangs off.
    const content = canvas.getByText('Contenuto del popover').closest('div')!
    await expect(content.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      opener.getBoundingClientRect().width
    )
  }
}
