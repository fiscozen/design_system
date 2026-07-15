import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzBlankTemplate, FzBlankTemplateProps } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'

/**
 * `FzBlankTemplate` is the full-bleed, no-chrome page template: a single
 * full-height content region and nothing else. It is selected at the
 * `<router-view>` level for auth/login screens and standalone tools that render
 * their own self-contained UI. It owns a full-height root, so it does not depend
 * on app-global `height`/`overflow` CSS (RFC §6.2).
 */
const meta: Meta<typeof FzBlankTemplate> = {
  title: 'Templates/FzBlankTemplate',
  component: FzBlankTemplate,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'radio', options: ['center', 'top'] }
  },
  args: {
    align: 'center'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzBlankTemplate>

export default meta

type Story = StoryObj<typeof meta>

const render = (args: FzBlankTemplateProps) => ({
  setup() {
    return { args }
  },
  components: { FzBlankTemplate, FzButton, FzCard },
  template: `
    <FzBlankTemplate v-bind="args" class="bg-background-alice-blue">
      <FzCard class="w-[320px] max-w-full">
        <div class="flex flex-col gap-16">
          <h1 class="text-xl font-medium">Accedi</h1>
          <p class="text-sm text-grey-500">Entra nel tuo spazio Fiscozen.</p>
          <FzButton>Continua</FzButton>
        </div>
      </FzCard>
    </FzBlankTemplate>
  `
})

export const Centered: Story = {
  render,
  args: { align: 'center' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders a single main landmark with the content', async () => {
      const main = canvas.getByRole('main')
      await expect(main).toBeInTheDocument()
      await expect(main).toBeVisible()
      await expect(canvas.getByRole('heading', { name: 'Accedi' })).toBeVisible()
    })

    await step('Owns a full-height root and centers its content', async () => {
      const main = canvas.getByRole('main')
      await expect(main).toHaveClass('min-h-dvh')
      await expect(main).toHaveClass('fz-layout-main--center')
    })

    await step('Renders no navigation chrome', async () => {
      await expect(canvasElement.querySelector('nav')).toBeNull()
      await expect(canvasElement.querySelector('header')).toBeNull()
      await expect(canvasElement.querySelector('aside')).toBeNull()
      await expect(canvasElement.querySelector('footer')).toBeNull()
    })
  }
}

export const TopAligned: Story = {
  render,
  args: { align: 'top' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Pins content to the top of the page', async () => {
      await expect(canvas.getByRole('main')).toHaveClass('fz-layout-main--top')
      await expect(canvas.getByRole('heading', { name: 'Accedi' })).toBeVisible()
    })
  }
}
