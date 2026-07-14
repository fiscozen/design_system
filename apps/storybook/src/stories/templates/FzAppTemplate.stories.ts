import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, inject } from 'vue'
import { expect, within } from 'storybook/test'
import { FzAppTemplate, FzAppTemplateProps, FZ_BOTTOM_BAR_TARGET } from '@fiscozen/layout'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { FzNavbar } from '@fiscozen/navbar'
import { FzAction } from '@fiscozen/action'
import { FzAvatar } from '@fiscozen/avatar'
import { FzCard } from '@fiscozen/card'
import { FzInput } from '@fiscozen/input'
import { FzLink } from '@fiscozen/link'

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
 *
 * The example content is composed entirely from design-system components
 * (`FzNavbar` + `FzAction` rail, `FzCard`, `FzButton`/`FzIconButton`, `FzInput`,
 * `FzLink`) so the story doubles as a reference for building the frontoffice
 * shell without hand-rolled markup.
 */
const meta: Meta<typeof FzAppTemplate> = {
  title: 'Templates/FzAppTemplate',
  component: FzAppTemplate,
  tags: ['autodocs'],
  argTypes: {
    chrome: { control: 'radio', options: ['card', 'flat'] },
    contentWidth: { control: 'radio', options: ['standard', 'wide', 'full'] },
    hasAside: { control: 'boolean' },
    hasBottomBar: { control: 'boolean' },
    navLabel: { control: 'text' }
  },
  args: {
    chrome: 'card',
    contentWidth: 'standard',
    hasAside: false,
    hasBottomBar: true,
    navLabel: 'Navigazione principale'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzAppTemplate>

export default meta

type Story = StoryObj<typeof meta>

// The set of design-system components every story registers so the shared
// `navSlot` / `pageBody` template fragments resolve. A superset is harmless —
// Vue ignores registered-but-unused components.
const dsComponents = {
  FzAppTemplate,
  FzButton,
  FzIconButton,
  FzIcon,
  FzNavbar,
  FzAction,
  FzAvatar,
  FzCard,
  FzInput,
  FzLink
}

// The nav is the *injected* organism — the real `FzNavbar`, which owns its own
// responsiveness: a vertical rail from the template's `desktop` breakpoint
// (1200px) up, and a full-width top bar (brand + hamburger + avatar) below it.
// `mobileBreakpoint` is synced to the template's 1200px so the two collapse in
// lockstep. This is why the template renders no nav drawer of its own, and why
// resizing to mobile fills the top region edge-to-edge instead of leaving a
// fixed-width column with the page background bleeding beside it.
//
// The navigation landmark + its accessible name live on the template's own
// `<nav>` wrapper (via the `navLabel` prop). Each destination is an `FzAction`
// (`variant="textLeft"`) — the non-deprecated navigation atom — so the rail is
// labelled (icon **and** text, with a `chevron-down` on the expandable sections),
// matching the frontoffice design rather than a row of unnamed icons.
const navSlot = `
  <FzNavbar
    variant="vertical"
    :mobileBreakpoint="1200"
    :class="isDesktop ? '!items-stretch' : ''"
    style="--fz-navbar-bg: #fff; --fz-navbar-width: 256px">
    <template #brand-logo>
      <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] cursor-pointer" />
    </template>
    <template #navigation>
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="house" label="Dashboard" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="file-invoice" iconRightName="chevron-down" label="Fatture" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="receipt" iconRightName="chevron-down" label="Spese" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="circle-check" iconRightName="chevron-down" label="Adempimenti" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="paperclip" label="Documenti" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="bell" label="Notifiche" />
      <FzAction class="w-full" type="action" variant="textLeft" iconLeftName="user" iconRightName="chevron-down" label="Profilo" />
    </template>
    <template #user-menu>
      <FzAvatar firstName="Mario" lastName="Rossi" />
    </template>
  </FzNavbar>
`

// The in-card page header the frontoffice design documents as part of
// `.main__content`: a back control + page title on the left and a primary action
// on the right (the design's `header__container` — `hasBackButton` +
// `hasActionButton`). It lives inside the content, not in the template's sticky
// `#header` slot — the standard frontoffice shell has no separate top bar over
// the content (the nav rail is the chrome).
const pageBody = `
  <div class="flex flex-col gap-24">
    <div class="flex items-center justify-between gap-16">
      <div class="flex items-center gap-8">
        <FzIconButton iconName="chevron-left" variant="invisible" aria-label="Indietro" />
        <h1 class="text-2xl font-semibold text-core-black">Dashboard</h1>
      </div>
      <FzIconButton iconName="plus" variant="primary" aria-label="Nuovo" />
    </div>
    <p class="text-sm text-grey-500">Il contenuto principale della pagina vive qui.</p>
    <div class="grid grid-cols-1 gap-16 sm:grid-cols-2">
      <FzCard><div class="h-[88px]"></div></FzCard>
      <FzCard><div class="h-[88px]"></div></FzCard>
    </div>
  </div>
`

// The in-card footer the frontoffice design shows at the bottom of
// `.main__content`: a copyright line and legal links (rendered with `FzLink`).
const footerSlot = `
  <template #footer>
    <div class="flex flex-wrap items-center justify-between gap-12 pt-16 text-sm text-grey-500">
      <span>© 2017-2026 Fiscozen</span>
      <div class="flex gap-16">
        <FzLink to="#" external>Privacy e cookie policy</FzLink>
        <FzLink to="#" external>Licenze</FzLink>
      </div>
    </div>
  </template>
`

/**
 * The default desktop shell, matching the frontoffice standard layout: the
 * persistent `FzNavbar` rail, a carded content column with the back/title/action
 * page header and an in-card footer, and a bottom action bar (filled via the
 * `#bottomBar` slot). The page title lives in the content — the frontoffice shell
 * has no separate sticky top bar over the content (the nav rail is the chrome).
 * The optional `#header` slot still exists for pages that need a sticky
 * page-title/action bar; it just isn't part of the standard shell.
 */
export const Default: Story = {
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: dsComponents,
    template: `
      <FzAppTemplate v-bind="args" class="bg-background-white-smoke">
        <template #nav="{ isDesktop }">${navSlot}</template>
        ${pageBody}
        ${footerSlot}
        <template #bottomBar>
          <div class="mx-auto flex w-full max-w-[1024px] items-center justify-end gap-12 bg-core-white px-24 py-16">
            <FzButton variant="invisible">Annulla</FzButton>
            <FzButton>Salva</FzButton>
          </div>
        </template>
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the main content and a named navigation landmark', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      // The template wraps the nav slot in a `<nav>` landmark named via `navLabel`.
      await expect(
        canvas.getByRole('navigation', { name: 'Navigazione principale' })
      ).toBeInTheDocument()
      // Each nav item is a labelled FzAction (not an unnamed icon button).
      await expect(canvas.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Fatture' })).toBeInTheDocument()
      await expect(canvas.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    })

    await step('Frames the content in a card', async () => {
      await expect(
        canvasElement.querySelector('.fz-app-template__content--card')
      ).toBeInTheDocument()
    })

    await step('Renders no sticky top bar over the content (nav rail is the chrome)', async () => {
      await expect(canvasElement.querySelector('.fz-app-template__header')).toBeNull()
    })

    await step('Renders the in-card footer with legal links', async () => {
      await expect(canvas.getByRole('contentinfo')).toBeInTheDocument()
      await expect(canvas.getByRole('link', { name: 'Privacy e cookie policy' })).toBeVisible()
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
 * becomes a modal drawer on mobile). Here it stands in for the frontoffice
 * support-chat panel — a title, a prompt and an `FzInput` composer.
 *
 * This story also fills the optional `#header` slot — a sticky **action bar**
 * over the content — to demonstrate the `toggleAside` slot prop: its
 * "Assistenza" button opens the aside drawer below the `desktop` breakpoint. The
 * page title still lives once in the content (the `<h1>`), so the bar carries the
 * action only, not a duplicate title.
 */
export const WithAside: Story = {
  args: { hasAside: true, asideLabel: 'Assistenza' },
  render: (args: FzAppTemplateProps) => ({
    setup() {
      return { args }
    },
    components: dsComponents,
    template: `
      <FzAppTemplate v-bind="args" class="bg-background-white-smoke">
        <template #nav="{ isDesktop }">${navSlot}</template>
        <template #header="{ toggleAside }">
          <div class="flex items-center justify-end gap-16 bg-core-white px-24 py-12">
            <FzButton variant="secondary" @click="toggleAside(true)">Assistenza</FzButton>
          </div>
        </template>
        ${pageBody}
        <template #aside>
          <div class="flex h-full w-[320px] flex-col bg-core-white">
            <div class="px-24 pt-24">
              <span class="text-lg font-semibold text-core-black">Chat</span>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center gap-4 px-24 text-center">
              <span class="text-base font-semibold text-core-black">Come possiamo aiutarti?</span>
              <p class="text-sm text-grey-500">
                Scrivici qui sotto al supporto. Altrimenti, manda un messaggio o fissa un
                incontro con la tua commercialista.
              </p>
            </div>
            <div class="p-16">
              <FzInput placeholder="Scrivi un messaggio..." leftIcon="face-smile" rightIcon="paperclip" />
            </div>
          </div>
        </template>
      </FzAppTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the sticky header slot over the content', async () => {
      const header = canvasElement.querySelector('.fz-app-template__header')
      await expect(header).toBeInTheDocument()
      await expect(header).toHaveClass('sticky')
      await expect(canvas.getByRole('button', { name: 'Assistenza' })).toBeVisible()
    })

    await step('Renders the complementary chat panel beside the content', async () => {
      const aside = canvas.getByRole('complementary')
      await expect(aside).toBeInTheDocument()
      await expect(aside).toHaveClass('fz-app-template__aside--panel')
      await expect(canvas.getByText('Come possiamo aiutarti?')).toBeVisible()
      await expect(canvas.getByPlaceholderText('Scrivi un messaggio...')).toBeVisible()
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
    components: dsComponents,
    template: `
      <FzAppTemplate v-bind="args" class="bg-background-white-smoke">
        <template #nav="{ isDesktop }">${navSlot}</template>
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
  components: { FzButton, FzIconButton },
  setup() {
    const bottomBarTarget = inject(FZ_BOTTOM_BAR_TARGET, null)
    return { bottomBarTarget }
  },
  template: `
    <div class="flex flex-col gap-16">
      <div class="flex items-center gap-8">
        <FzIconButton iconName="chevron-left" variant="invisible" aria-label="Indietro" />
        <h1 class="text-2xl font-semibold text-core-black">Nuova fattura</h1>
      </div>
      <p class="text-sm text-grey-500">Compila i campi e salva dalla barra in basso.</p>
      <Teleport v-if="bottomBarTarget" :to="bottomBarTarget" defer>
        <div class="mx-auto flex w-full max-w-[1024px] items-center justify-end gap-12 bg-core-white px-24 py-16">
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
    components: { ...dsComponents, DeepPageWithBar },
    template: `
      <FzAppTemplate v-bind="args" class="bg-background-white-smoke">
        <template #nav="{ isDesktop }">${navSlot}</template>
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
