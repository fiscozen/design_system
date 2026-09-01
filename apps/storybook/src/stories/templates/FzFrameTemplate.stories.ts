import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent, waitFor } from 'storybook/test'
import { ref } from 'vue'
import { FzFrameTemplate, FzThreeColumnsTemplate } from '@fiscozen/layout'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzBadge } from '@fiscozen/badge'
import { FzInput } from '@fiscozen/input'

/**
 * `FzFrameTemplate` is the **backoffice application frame**: a persistent icon
 * `nav` rail, a slim app-level `header` toolbar, the page, and an optional 400px
 * `aside` holding tools available everywhere (AI chat, user messages). Page
 * layouts nest *inside* the default slot.
 *
 * ### The height contract is the point
 * Every other shell in `@fiscozen/layout` is `min-h-dvh` + document scroll — an
 * ancestor with an **indefinite** height. A `fills-parent` layout mounted inside
 * one (`FzThreeColumnsTemplate`) collapses to zero and its regions never scroll.
 * This shell inverts the model: the root is `h-dvh` and **clips**, and
 * `contentHeight` picks which contract the content region offers.
 *
 * | `contentHeight` | The region | For |
 * | --- | --- | --- |
 * | `scroll` *(default)* | is the app's **single scroll container** — document scroll moves from the window into it | a page that grows and scrolls as one (`FzListTemplate`, `FzDetailTemplate`, any legacy page) |
 * | `bounded` | has a **definite height and clips** | a page that fills the frame and scrolls its own regions (`FzThreeColumnsTemplate`) |
 *
 * Because the switch is per page, a migration is incremental: a page opts into
 * `bounded` when it is ported, and every other page keeps the scrolling region.
 *
 * ### Scroll ownership
 * Under `scroll` the **window no longer scrolls** — `window.scrollTo(0, 0)` is a
 * no-op and browser scroll restoration on back/forward stops reaching the page.
 * Inject `FZ_PAGE_SCROLL_TARGET` to get the region element and scroll the page,
 * and wire the router's `scrollBehavior` against it.
 *
 * `chrome` is deliberately **orthogonal** to `contentHeight`, not one "is
 * migrated" flag: a page ported to `FzListTemplate` still scrolls with the region
 * (`scroll`) but should let the frame own its container (`card`). A page that
 * draws its own containers stays `flat`, or the two white boxes stack.
 */
const meta: Meta<typeof FzFrameTemplate> = {
  title: 'Templates/FzFrameTemplate',
  component: FzFrameTemplate,
  tags: ['autodocs'],
  argTypes: {
    contentHeight: { control: 'radio', options: ['scroll', 'bounded'] },
    chrome: { control: 'radio', options: ['card', 'flat'] },
    background: { control: 'radio', options: ['page', 'transparent'] },
    hasAside: { control: 'boolean' },
    navLabel: { control: 'text' },
    asideLabel: { control: 'text' }
  },
  args: {
    contentHeight: 'scroll',
    chrome: 'card',
    background: 'page',
    hasAside: true,
    navLabel: 'Navigazione principale',
    asideLabel: 'Strumenti'
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        // The shell is `h-dvh`: rendered inline it would take the whole docs
        // page. An iframe gives it a viewport of its own to fill.
        inline: false,
        height: '640px'
      }
    }
  }
} satisfies Meta<typeof FzFrameTemplate>

export default meta

type Story = StoryObj<typeof meta>

/** The rail and the toolbar the backoffice injects, reduced to their shape. */
const chromeSlots = `
  <template #nav>
    <div class="flex flex-col items-center gap-8 p-8 lg:h-full lg:w-64">
      <FzIconButton iconName="house" iconVariant="far" variant="invisible" ariaLabel="Home" />
      <FzIconButton iconName="user" iconVariant="far" variant="invisible" ariaLabel="Utenti" />
      <FzIconButton iconName="file-invoice" iconVariant="far" variant="invisible" ariaLabel="Documenti" />
    </div>
  </template>

  <template #header="{ asideOpen, toggleAside }">
    <div class="flex items-center justify-between gap-8 px-8">
      <div class="flex min-w-0 items-center gap-4">
        <FzIconButton iconName="arrow-left" iconVariant="far" variant="invisible" environment="backoffice" ariaLabel="Indietro" />
        <span class="text-sm text-grey-500">Home / Approvazioni</span>
      </div>
      <div class="flex shrink-0 items-center gap-4">
        <FzIconButton iconName="magnifying-glass" iconVariant="far" variant="invisible" environment="backoffice" ariaLabel="Ricerca utente" />
        <FzIconButton
          iconName="sparkles"
          iconVariant="far"
          environment="backoffice"
          :variant="asideOpen ? 'secondary' : 'invisible'"
          :ariaLabel="asideOpen ? 'Chiudi strumenti' : 'Apri strumenti'"
          @click="toggleAside()" />
      </div>
    </div>
  </template>
`

/** The tools panel: a header row and an independently scrollable body. */
const asideSlot = `
  <template #aside="{ toggleAside }">
    <div class="flex shrink-0 items-center justify-between gap-8 border-b-1 border-solid border-grey-200 p-16">
      <h2 class="m-0 text-[17px] font-semibold leading-[24px]">Strumenti</h2>
      <FzIconButton
        iconName="xmark"
        iconVariant="far"
        variant="invisible"
        environment="backoffice"
        ariaLabel="Chiudi strumenti"
        @click="toggleAside(false)" />
    </div>
    <div tabindex="0" class="flex min-h-0 flex-1 flex-col gap-16 overflow-y-auto p-16">
      <p class="m-0 text-sm text-grey-500">
        Chat AI e messaggi utente vivono qui. Montati nel frame, accanto alla pagina,
        conservano il proprio stato attraverso i cambi di rotta e le chiusure del pannello.
      </p>
      <FzInput v-model="draft" placeholder="Scrivi un messaggio" />
    </div>
  </template>
`

const listPage = (args: Record<string, unknown>) => ({
  components: { FzFrameTemplate, FzButton, FzIconButton, FzBadge, FzInput },
  setup() {
    const asideOpen = ref(false)
    const draft = ref('')
    return { args, asideOpen, draft }
  },
  template: `
    <FzFrameTemplate v-bind="args" v-model:asideOpen="asideOpen">
      ${chromeSlots}

      <div class="flex flex-col gap-16 p-16">
        <div class="flex items-center justify-between gap-8">
          <h1 class="m-0 text-[20px] font-semibold leading-[28px]">Utenti</h1>
          <FzButton variant="primary">Nuovo utente</FzButton>
        </div>
        <div v-for="n in 24" :key="n" class="rounded-lg bg-background-alice-blue p-16">
          Riga {{ n }}
        </div>
      </div>

      ${asideSlot}
    </FzFrameTemplate>
  `
})

/**
 * The default contract: the content region is the app's single scroll container.
 * The window does not scroll — the page grows inside the region and the region
 * scrolls it, which is what lets a page that was written against document scroll
 * keep working untouched.
 */
export const Default: Story = {
  render: listPage,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('.fz-frame-template__main')!

    await step('Renders the chrome landmarks', async () => {
      await expect(
        canvas.getByRole('navigation', { name: 'Navigazione principale' })
      ).toBeInTheDocument()
      await expect(canvas.getByRole('banner')).toBeInTheDocument()
      await expect(canvas.getByRole('main')).toBeInTheDocument()
    })

    await step('The region scrolls, and the window does not', async () => {
      // The claim this shell is built on, measured rather than asserted through
      // classes: the page is taller than its region, and the scroll that moves
      // it belongs to the region.
      await waitFor(() => expect(region.scrollHeight).toBeGreaterThan(region.clientHeight))

      region.scrollTop = 200
      await waitFor(() => expect(region.scrollTop).toBeGreaterThan(0))

      expect(window.scrollY).toBe(0)
      // The document itself has nothing to scroll: the root clips at the viewport.
      expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(
        document.documentElement.clientHeight + 1
      )
    })

    await step('The tools panel keeps its state while closed', async () => {
      const openTools = canvas.getByRole('button', { name: 'Apri strumenti' })
      await userEvent.click(openTools)

      const draft = await canvas.findByPlaceholderText('Scrivi un messaggio')
      await userEvent.type(draft, 'bozza')
      await expect(draft).toHaveValue('bozza')

      // Scoped to the panel: the toolbar trigger reads "Chiudi strumenti" too
      // while the panel is open, so a canvas-wide query matches both.
      const tools = within(canvas.getByRole('complementary', { name: 'Strumenti' }))
      await userEvent.click(tools.getByRole('button', { name: 'Chiudi strumenti' }))

      // `v-show`, not `v-if`: the panel is hidden but still mounted, so what the
      // user typed survives. With `v-if` this input would be a new element.
      await waitFor(() =>
        expect(canvas.getByPlaceholderText('Scrivi un messaggio')).not.toBeVisible()
      )
      await expect(canvas.getByPlaceholderText('Scrivi un messaggio')).toHaveValue('bozza')
    })
  }
}

const workspacePage = (args: Record<string, unknown>) => ({
  components: {
    FzFrameTemplate,
    FzThreeColumnsTemplate,
    FzButton,
    FzIconButton,
    FzBadge,
    FzInput
  },
  setup() {
    const asideOpen = ref(false)
    const draft = ref('')
    const collapsed = ref(false)
    return { args, asideOpen, draft, collapsed }
  },
  template: `
    <FzFrameTemplate v-bind="args" v-model:asideOpen="asideOpen">
      ${chromeSlots}

      <FzThreeColumnsTemplate
        v-model:sidebarCollapsed="collapsed"
        mainAs="div"
        sidebarLabel="Lista documenti">
        <template #header-left>
          <h2 class="m-0 text-[20px] font-semibold leading-[28px]">Registrazione contabile</h2>
          <FzBadge tone="light" variant="text">Mario Rossi</FzBadge>
        </template>
        <template #header-right>
          <FzButton variant="success">Registra</FzButton>
        </template>

        <template #sidebar-header="{ collapsed, toggle }">
          <h3 v-show="!collapsed" class="m-0 truncate text-[17px] font-semibold leading-[24px]">Lista</h3>
          <FzIconButton
            variant="invisible"
            iconVariant="far"
            :iconName="collapsed ? 'table-layout' : 'chevrons-left'"
            :ariaLabel="collapsed ? 'Espandi lista' : 'Comprimi lista'"
            @click="toggle()" />
        </template>
        <template #sidebar-content>
          <div v-for="n in 20" :key="n" class="p-8 text-sm">Documento {{ n }}</div>
        </template>

        <template #column-left>
          <div class="flex h-full items-center justify-center text-sm text-grey-500">
            Anteprima documento
          </div>
        </template>

        <template #column-right-header>
          <FzBadge tone="info">Da registrare</FzBadge>
        </template>
        <template #column-right-content>
          <div class="flex flex-col gap-16">
            <div v-for="n in 20" :key="n" class="rounded-lg bg-background-alice-blue p-16">
              Sezione {{ n }}
            </div>
          </div>
        </template>
      </FzThreeColumnsTemplate>

      ${asideSlot}
    </FzFrameTemplate>
  `
})

/**
 * `contentHeight="bounded"` — the region clips and hands a **definite** height
 * down, which is the ancestor a `fills-parent` layout requires. This is the pair
 * `layouts.json` records as verified: `FzThreeColumnsTemplate` with
 * `mainAs="div"` (the shell already owns the `main` landmark) inside a frame with
 * `contentHeight="bounded"`.
 *
 * Set `contentHeight` back to `scroll` in the controls to see the failure this
 * prop exists to prevent: the region's height goes indefinite again and the
 * nested layout has nothing to fill.
 */
export const BoundedWorkspace: Story = {
  render: workspacePage,
  args: { contentHeight: 'bounded' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const region = canvasElement.querySelector<HTMLElement>('.fz-frame-template__main')!
    const nested = canvasElement.querySelector<HTMLElement>('.fz-three-columns-template')!

    await step('The shell owns the single main landmark', async () => {
      await expect(canvas.getAllByRole('main')).toHaveLength(1)
      await expect(
        canvas.getByRole('complementary', { name: 'Lista documenti' })
      ).toBeInTheDocument()
    })

    await step('The nested layout resolves to a definite, non-zero height', async () => {
      // Without a clipping ancestor this is 0 — the collapse the whole shell
      // exists to prevent, and the reason the app used to measure
      // `window.innerHeight - rect.top` by hand.
      await waitFor(() => expect(nested.clientHeight).toBeGreaterThan(0))
      // It fills the region rather than overflowing it.
      expect(nested.clientHeight).toBeLessThanOrEqual(region.clientHeight)
      expect(region.scrollHeight).toBeLessThanOrEqual(region.clientHeight + 1)
    })

    await step('Its regions scroll independently, and the window still does not', async () => {
      const column = canvasElement.querySelector<HTMLElement>(
        '.fz-three-columns-template__column-right-content'
      )!

      await waitFor(() => expect(column.scrollHeight).toBeGreaterThan(column.clientHeight))
      column.scrollTop = 120
      await waitFor(() => expect(column.scrollTop).toBeGreaterThan(0))

      expect(window.scrollY).toBe(0)
      expect(region.scrollTop).toBe(0)
    })
  }
}

/**
 * `chrome="flat"` — the frame draws no container, for a page that draws its own.
 * Putting a card here too stacks a second white box inside the first, with a
 * strip of page background showing between them; the design's single-card look
 * needs the *page* to stop drawing its own, which is the page-layout migration,
 * not the frame's job.
 */
export const FlatChrome: Story = {
  render: listPage,
  args: { chrome: 'flat', hasAside: false }
}
