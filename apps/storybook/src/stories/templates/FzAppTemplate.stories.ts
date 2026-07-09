import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h, inject } from 'vue'
import { expect, within } from 'storybook/test'
import { FzAppTemplate, FzAppTemplateProps, FZ_BOTTOM_BAR_TARGET } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'

/**
 * `FzAppTemplate` is the persistent-nav application shell — the frontoffice
 * standard layout (RFC §4). It frames a persistent `nav`, an optional sticky
 * `header`, the primary content, an optional complementary `aside`, an optional
 * sticky bottom action bar and an optional `footer`.
 *
 * From the `desktop` breakpoint (1200px) up, the nav is a sticky **left rail**
 * and the aside a sticky **right panel** — their widths follow the *injected*
 * content, never the template. The **nav is persistent** (a top region on
 * mobile); the injected nav — e.g. `FzNavbar` — owns its own responsive collapse
 * and hamburger, so the template renders no nav drawer. Only the **aside**
 * collapses below the breakpoint, into a **modal drawer** opened via the
 * `toggleAside` slot prop — `role="dialog"` + `aria-modal` + focus trap +
 * Escape-to-close.
 *
 * The bottom bar sits inside the main content column so it aligns to that column
 * automatically and reserves its own space. Deep page components render bar
 * content by injecting `FZ_BOTTOM_BAR_TARGET` and teleporting into it (see
 * **BottomBarViaTeleport**) — or you can fill the `#bottomBar` slot directly.
 */
const meta: Meta<typeof FzAppTemplate> = {
  title: 'Templates/FzAppTemplate',
  component: FzAppTemplate,
  tags: ['autodocs'],
  argTypes: {
    chrome: { control: 'radio', options: ['card', 'flat'] },
    contentWidth: { control: 'radio', options: ['standard', 'wide', 'full'] },
    hasAside: { control: 'boolean' },
    hasBottomBar: { control: 'boolean' }
  },
  args: {
    chrome: 'card',
    contentWidth: 'standard',
    hasAside: false,
    hasBottomBar: true
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzAppTemplate>

export default meta

type Story = StoryObj<typeof meta>

const navMenu = `
  <nav aria-label="Principale" class="flex h-full w-[240px] flex-col gap-8 bg-core-white p-16">
    <span class="mb-16 text-lg font-semibold text-core-black">Fiscozen</span>
    <a href="#" class="rounded px-12 py-8 text-sm font-medium text-blue-600 bg-blue-50">Dashboard</a>
    <a href="#" class="rounded px-12 py-8 text-sm text-grey-500 hover:bg-grey-100">Fatture</a>
    <a href="#" class="rounded px-12 py-8 text-sm text-grey-500 hover:bg-grey-100">Documenti</a>
    <a href="#" class="rounded px-12 py-8 text-sm text-grey-500 hover:bg-grey-100">Impostazioni</a>
  </nav>
`

const pageBody = `
  <div class="flex flex-col gap-24">
    <h1 class="text-2xl font-semibold text-core-black">Dashboard</h1>
    <p class="text-sm text-grey-500">Il contenuto principale della pagina vive qui.</p>
    <div class="grid grid-cols-1 gap-16 sm:grid-cols-2">
      <div class="h-[120px] rounded-lg border border-grey-200 bg-grey-50"></div>
      <div class="h-[120px] rounded-lg border border-grey-200 bg-grey-50"></div>
    </div>
  </div>
`

/**
 * The default desktop shell: persistent nav rail, a sticky header with page
 * chrome, a carded content column, and a bottom action bar (filled via the
 * `#bottomBar` slot). The header's "Assistenza" button uses the `toggleAside`
 * slot prop — it opens the aside drawer below 1200px.
 */
export const Default: Story = {
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: { FzAppTemplate, FzButton },
    template: `
      <FzAppTemplate v-bind="args" class="bg-[#f7f6f3]">
        <template #nav>${navMenu}</template>
        <template #header="{ toggleAside }">
          <div class="flex items-center justify-between gap-16 bg-core-white px-24 py-12">
            <span class="font-medium text-core-black">Dashboard</span>
            <FzButton variant="secondary" @click="toggleAside(true)">Assistenza</FzButton>
          </div>
        </template>
        ${pageBody}
        <template #bottomBar>
          <div class="mx-auto flex w-full max-w-[1024px] items-center justify-end gap-12 bg-core-white px-24 py-16 shadow-[0px_-4px_1px_#f7f6f3]">
            <FzButton variant="invisible">Annulla</FzButton>
            <FzButton>Salva</FzButton>
          </div>
        </template>
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the main content and the navigation landmark', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(canvas.getByRole('navigation', { name: 'Principale' })).toBeVisible()
      await expect(canvas.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    })

    await step('Frames the content in a card', async () => {
      await expect(
        canvasElement.querySelector('.fz-app-template__content--card')
      ).toBeInTheDocument()
    })

    await step('Renders a sticky header banner', async () => {
      const header = canvasElement.querySelector('.fz-app-template__header')
      await expect(header).toHaveClass('sticky')
    })

    await step('Renders the bottom-bar region with its actions', async () => {
      const bar = canvasElement.querySelector('.fz-layout-bottom-bar')
      await expect(bar).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Salva' })).toBeVisible()
    })

    await step('Owns a full-height root', async () => {
      await expect(canvasElement.querySelector('.fz-app-template')).toHaveClass('min-h-dvh')
    })
  }
}

/**
 * With `hasAside`, a complementary panel sits beside the content on desktop (and
 * becomes a modal drawer on mobile). Here it stands in for a support-chat panel.
 */
export const WithAside: Story = {
  args: { hasAside: true, asideLabel: 'Assistenza' },
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: { FzAppTemplate, FzButton, FzIcon },
    template: `
      <FzAppTemplate v-bind="args" class="bg-[#f7f6f3]">
        <template #nav>${navMenu}</template>
        ${pageBody}
        <template #aside>
          <div class="flex h-full w-[320px] flex-col gap-12 bg-core-white p-24">
            <div class="flex items-center gap-8">
              <FzIcon name="comment" size="md" />
              <span class="text-base font-semibold text-core-black">Possiamo aiutarti?</span>
            </div>
            <p class="text-sm text-grey-500">Scrivici e il tuo commercialista ti risponde.</p>
          </div>
        </template>
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the complementary aside panel beside the content', async () => {
      const aside = canvas.getByRole('complementary')
      await expect(aside).toBeInTheDocument()
      await expect(aside).toHaveClass('fz-app-template__aside--panel')
      await expect(canvas.getByText('Possiamo aiutarti?')).toBeVisible()
    })
  }
}

/**
 * `contentWidth="wide"` with `chrome="flat"`: a full-bleed content column that
 * stays capped until the largest breakpoint, then goes edge-to-edge. This is the
 * single content-width API that replaces the app's old `wideLayout` flag.
 */
export const WideFlat: Story = {
  args: { contentWidth: 'wide', chrome: 'flat' },
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: { FzAppTemplate },
    template: `
      <FzAppTemplate v-bind="args" class="bg-[#f7f6f3]">
        <template #nav>${navMenu}</template>
        ${pageBody}
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    await step('Uses the flat (full-bleed) frame and the wide content width', async () => {
      const content = canvasElement.querySelector('.fz-app-template__content')
      await expect(content).toHaveClass('fz-app-template__content--flat')
      await expect(content).toHaveClass('3xl:max-w-none')
      await expect(canvasElement.querySelector('.fz-app-template__content--card')).toBeNull()
    })
  }
}

/**
 * The real bottom-bar pattern: a deep page component renders the bar without
 * knowing the shell. It `inject`s `FZ_BOTTOM_BAR_TARGET` and `<Teleport>`s its
 * actions into the template's bottom-bar region — no app-owned DOM id, and the
 * geometry (alignment to the content column) is the template's concern.
 */
const DeepPageWithBar = defineComponent({
  name: 'DeepPageWithBar',
  components: { FzButton },
  setup() {
    const bottomBarTarget = inject(FZ_BOTTOM_BAR_TARGET, null)
    return { bottomBarTarget }
  },
  template: `
    <div class="flex flex-col gap-16">
      <h1 class="text-2xl font-semibold text-core-black">Nuova fattura</h1>
      <p class="text-sm text-grey-500">Compila i campi e salva dalla barra in basso.</p>
      <Teleport v-if="bottomBarTarget" :to="bottomBarTarget" defer>
        <div class="mx-auto flex w-full max-w-[1024px] items-center justify-end gap-12 bg-core-white px-24 py-16 shadow-[0px_-4px_1px_#f7f6f3]">
          <FzButton variant="invisible">Annulla</FzButton>
          <FzButton class="teleported-save">Salva fattura</FzButton>
        </div>
      </Teleport>
    </div>
  `
})

export const BottomBarViaTeleport: Story = {
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: { FzAppTemplate, DeepPageWithBar },
    template: `
      <FzAppTemplate v-bind="args" class="bg-[#f7f6f3]">
        <template #nav>${navMenu}</template>
        <DeepPageWithBar />
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('The deep component teleports its bar into the bottom-bar region', async () => {
      const bar = canvasElement.querySelector('.fz-layout-bottom-bar')
      await expect(bar).toBeInTheDocument()
      const save = canvas.getByRole('button', { name: 'Salva fattura' })
      await expect(save).toBeVisible()
      await expect(bar?.contains(save)).toBe(true)
    })
  }
}
