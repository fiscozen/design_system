import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzLayoutMain, FzLayoutMainProps } from '@fiscozen/layout'
import { FzBadge } from '@fiscozen/badge'

/**
 * `FzLayoutMain` is the "main" region molecule of the layout system: a
 * presentation-only wrapper that renders a semantic `<main>` landmark and owns
 * content alignment + device safe-area insets. It is composed by the page
 * templates (e.g. `FzBlankTemplate`); it is rarely used on its own.
 */
const meta: Meta<typeof FzLayoutMain> = {
  title: 'Templates/Regions/FzLayoutMain',
  component: FzLayoutMain,
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'text' },
    align: { control: 'select', options: ['stretch', 'top', 'center'] },
    safeArea: { control: 'boolean' }
  },
  args: {
    align: 'stretch',
    safeArea: false
  }
} satisfies Meta<typeof FzLayoutMain>

export default meta

type Story = StoryObj<typeof meta>

const render = (args: FzLayoutMainProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayoutMain, FzBadge },
  template: `
    <FzLayoutMain v-bind="args" class="h-[320px] bg-blue-100">
      <div class="bg-blue-50 rounded p-16 flex justify-center items-center">
        <FzBadge color="info">content</FzBadge>
      </div>
    </FzLayoutMain>
  `
})

export const Stretch: Story = {
  render,
  args: { align: 'stretch' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders a main landmark', async () => {
      const main = canvas.getByRole('main')
      await expect(main).toBeInTheDocument()
      await expect(main).toBeVisible()
      await expect(main).toHaveClass('fz-layout-main')
    })

    await step('Applies the stretch alignment', async () => {
      await expect(canvas.getByRole('main')).toHaveClass('fz-layout-main--stretch')
    })

    await step('Renders slot content', async () => {
      await expect(canvas.getByText('content')).toBeVisible()
    })
  }
}

export const Centered: Story = {
  render,
  args: { align: 'center' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Centers content on both axes', async () => {
      await expect(canvas.getByRole('main')).toHaveClass('fz-layout-main--center')
      await expect(canvas.getByText('content')).toBeVisible()
    })
  }
}

export const TopAligned: Story = {
  render,
  args: { align: 'top' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Pins content to the top, inline-centered', async () => {
      await expect(canvas.getByRole('main')).toHaveClass('fz-layout-main--top')
      await expect(canvas.getByText('content')).toBeVisible()
    })
  }
}

export const SafeArea: Story = {
  render,
  args: { align: 'center', safeArea: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Enables safe-area insets', async () => {
      await expect(canvas.getByRole('main')).toHaveClass('fz-layout-main--safe-area')
    })
  }
}

export const AsDiv: Story = {
  render,
  args: { as: 'div', align: 'center' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders as the requested tag without a main landmark', async () => {
      await expect(canvas.queryByRole('main')).toBeNull()
      await expect(canvas.getByText('content')).toBeVisible()
    })
  }
}

export const Labelled: Story = {
  render: (args: FzLayoutMainProps) => ({
    setup() {
      return { args }
    },
    components: { FzLayoutMain, FzBadge },
    template: `
      <FzLayoutMain v-bind="args" aria-label="Main content" class="h-[320px] bg-blue-100">
        <FzBadge color="info">content</FzBadge>
      </FzLayoutMain>
    `
  }),
  args: { align: 'center' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Forwards aria-label onto the main landmark', async () => {
      await expect(canvas.getByRole('main', { name: 'Main content' })).toBeVisible()
    })
  }
}
