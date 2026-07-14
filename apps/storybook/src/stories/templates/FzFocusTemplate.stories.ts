import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzFocusTemplate, FzFocusTemplateProps } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'
import { FzIcon } from '@fiscozen/icons'

/**
 * `FzFocusTemplate` is the distraction-reduced flow template: a centered,
 * low-chrome page shell for guided flows (onboarding) and auth screens. Optional
 * `topbar`, `aside` and `footer` regions frame a centered main region. The
 * `chrome` prop makes the content frame explicit — `card` for a contained flow,
 * `flat` for full-bleed (today's implicit "auth" branch). It owns a full-height
 * root, so it does not depend on app-global `height`/`overflow` CSS (RFC §6.2).
 */
const meta: Meta<typeof FzFocusTemplate> = {
  title: 'Templates/FzFocusTemplate',
  component: FzFocusTemplate,
  tags: ['autodocs'],
  argTypes: {
    chrome: { control: 'radio', options: ['card', 'flat'] }
  },
  args: {
    chrome: 'card'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzFocusTemplate>

export default meta

type Story = StoryObj<typeof meta>

const flow = (args: FzFocusTemplateProps) => ({
  setup() {
    return { args }
  },
  components: { FzFocusTemplate, FzButton },
  template: `
    <FzFocusTemplate v-bind="args" class="bg-background-alice-blue">
      <div class="flex flex-col gap-16">
        <h1 class="text-xl font-medium">Completa il tuo profilo</h1>
        <p class="text-sm text-grey-500">Ancora un passaggio e sei dentro.</p>
        <FzButton>Continua</FzButton>
      </div>
    </FzFocusTemplate>
  `
})

export const Card: Story = {
  render: flow,
  args: { chrome: 'card' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders a centered main landmark with the flow content', async () => {
      const main = canvas.getByRole('main')
      await expect(main).toBeInTheDocument()
      await expect(main).toHaveClass('fz-layout-main--center')
      await expect(canvas.getByRole('heading', { name: 'Completa il tuo profilo' })).toBeVisible()
    })

    await step('Frames the content in a card', async () => {
      await expect(
        canvasElement.querySelector('.fz-focus-template__content--card')
      ).toBeInTheDocument()
    })

    await step('Owns a full-height root', async () => {
      await expect(canvasElement.querySelector('.fz-focus-template')).toHaveClass('min-h-dvh')
    })
  }
}

export const Flat: Story = {
  render: flow,
  args: { chrome: 'flat' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Uses the full-bleed (flat) frame', async () => {
      await expect(
        canvasElement.querySelector('.fz-focus-template__content--flat')
      ).toBeInTheDocument()
      await expect(canvasElement.querySelector('.fz-focus-template__content--card')).toBeNull()
    })

    await step('Still renders the flow content', async () => {
      await expect(canvas.getByRole('heading', { name: 'Completa il tuo profilo' })).toBeVisible()
    })
  }
}

const withChrome = (args: FzFocusTemplateProps) => ({
  setup() {
    return { args }
  },
  components: { FzFocusTemplate, FzButton, FzCard, FzIcon },
  template: `
    <FzFocusTemplate v-bind="args" class="bg-background-alice-blue">
      <template #topbar>
        <div class="flex items-center justify-between p-16 bg-core-white">
          <FzIcon name="fiscozen" variant="fak" size="lg" class="text-core-black !w-[32px]" />
          <FzButton variant="invisible">Esci</FzButton>
        </div>
      </template>
      <div class="flex flex-col gap-16">
        <h1 class="text-xl font-medium">Onboarding</h1>
        <p class="text-sm text-grey-500">Passo 2 di 4.</p>
        <FzButton>Continua</FzButton>
      </div>
      <template #aside>
        <FzCard class="h-full">
          <p class="text-sm">Serve aiuto? Scrivici.</p>
        </FzCard>
      </template>
      <template #footer>
        <div class="p-16 text-sm text-grey-500 text-center">© Fiscozen</div>
      </template>
    </FzFocusTemplate>
  `
})

export const WithTopbarAsideFooter: Story = {
  render: withChrome,
  args: { chrome: 'card' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders all landmark regions when their slots are provided', async () => {
      await expect(canvas.getByRole('banner')).toBeInTheDocument()
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(canvas.getByRole('complementary')).toBeInTheDocument()
      await expect(canvas.getByRole('contentinfo')).toBeInTheDocument()
    })

    await step('Renders the region content', async () => {
      await expect(canvas.getByText('Serve aiuto? Scrivici.')).toBeVisible()
      await expect(canvas.getByText('© Fiscozen')).toBeVisible()
    })
  }
}
