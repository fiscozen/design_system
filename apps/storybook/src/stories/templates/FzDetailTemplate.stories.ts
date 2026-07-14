import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzDetailTemplate, FzDetailTemplateProps } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'
import { FzAlert } from '@fiscozen/alert'
import { FzBadge } from '@fiscozen/badge'
import { FzCard } from '@fiscozen/card'
import { FzDivider } from '@fiscozen/divider'
import { FzTab, FzTabs } from '@fiscozen/tab'

/**
 * `FzDetailTemplate` is the presentation-only backoffice detail-page layout: a
 * persistent `sidebar` summary/context rail (the record's identity, status, meta
 * and actions) beside the detail body, plus an optional full-width `banner` and
 * an optional `header` toolbar. It extracts the shape the backoffice detail pages
 * hand-roll today so they converge on one responsive layout (RFC §4, LIB-2695).
 *
 * It is the sibling of `FzListTemplate` (LIB-2694): a list page pairs a *filter*
 * rail with a table, a detail page pairs a *summary/context* rail with the
 * record's content. Both compose the region molecules (`FzLayoutAside` +
 * `FzLayoutMain`) and — being *page-content* templates meant to render inside a
 * shell's main region — do not force a viewport height or apply root safe-area
 * insets. Set `mainAs="div"` when composing it inside a shell that already
 * renders a `<main>` (e.g. `FzAppTemplate`) to avoid nested `main` landmarks.
 *
 * The example content is composed entirely from design-system components
 * (`FzAlert` banner, `FzCard` + `FzBadge` + `FzDivider` + `FzButton` summary
 * rail, `FzTabs` + `FzCard` body) rather than hand-rolled markup.
 */
const meta: Meta<typeof FzDetailTemplate> = {
  title: 'Templates/FzDetailTemplate',
  component: FzDetailTemplate,
  tags: ['autodocs'],
  argTypes: {
    sidebarLabel: { control: 'text' },
    mainAs: { control: 'radio', options: ['main', 'div'] }
  },
  args: {
    mainAs: 'main'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzDetailTemplate>

export default meta

type Story = StoryObj<typeof meta>

const detailPage = (args: FzDetailTemplateProps) => ({
  setup() {
    return { args }
  },
  components: {
    FzDetailTemplate,
    FzButton,
    FzAlert,
    FzBadge,
    FzCard,
    FzDivider,
    FzTabs,
    FzTab
  },
  template: `
    <FzDetailTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <template #banner>
        <FzAlert tone="warning" variant="background" :showButtonAction="false">
          La dichiarazione non è ancora stata inviata.
        </FzAlert>
      </template>

      <template #sidebar>
        <FzCard title="Riepilogo">
          <div class="flex flex-col gap-12">
            <FzBadge tone="info">Anno di riferimento: 2026</FzBadge>
            <FzBadge tone="success">Inviata</FzBadge>
            <FzDivider />
            <div class="flex flex-col gap-4">
              <span class="text-lg font-medium">Mario Rossi</span>
              <span class="text-sm text-core-black">Forfettario · Gestione Separata</span>
            </div>
            <FzDivider />
            <FzButton iconName="arrows-rotate" iconPosition="before">
              Sincronizza cassetto fiscale
            </FzButton>
            <FzButton variant="danger">Escludi dall'invio</FzButton>
          </div>
        </FzCard>
      </template>

      <template #header>
        <div class="flex items-center justify-between gap-16">
          <h1 class="text-lg font-medium">Dichiarazione IVA 2026</h1>
          <FzButton variant="primary">Genera output</FzButton>
        </div>
      </template>

      <FzTabs>
        <FzTab title="Dichiarazione" :initialSelected="true">
          <FzCard class="mt-16" title="Quadro VA">
            <p>Compilazione dei quadri della dichiarazione.</p>
          </FzCard>
        </FzTab>
        <FzTab title="F24">
          <FzCard class="mt-16" title="Deleghe F24">
            <p>Elenco delle deleghe F24 collegate.</p>
          </FzCard>
        </FzTab>
      </FzTabs>
    </FzDetailTemplate>
  `
})

export const Default: Story = {
  render: detailPage,
  args: { sidebarLabel: 'Riepilogo dichiarazione' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the detail body (tabs) as the main landmark', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      // The initially-selected tab's content is inside the main region.
      await expect(canvas.getByText(/Compilazione dei quadri/)).toBeVisible()
    })

    await step('Renders the summary rail as a named complementary landmark', async () => {
      await expect(
        canvas.getByRole('complementary', { name: 'Riepilogo dichiarazione' })
      ).toBeInTheDocument()
      await expect(canvas.getByText('Mario Rossi')).toBeVisible()
      await expect(
        canvas.getByRole('button', { name: /Sincronizza cassetto fiscale/ })
      ).toBeVisible()
    })

    await step('Renders the banner and the header toolbar', async () => {
      await expect(canvas.getByText(/non è ancora stata inviata/)).toBeVisible()
      await expect(canvas.getByText('Dichiarazione IVA 2026')).toBeVisible()
    })
  }
}

const bodyOnly = (args: FzDetailTemplateProps) => ({
  setup() {
    return { args }
  },
  components: { FzDetailTemplate, FzCard },
  template: `
    <FzDetailTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <FzCard title="Dettaglio">
        <p>Contenuto del dettaglio senza barra laterale.</p>
      </FzCard>
    </FzDetailTemplate>
  `
})

/**
 * Without a `sidebar` slot the body fills the full width — a detail page that has
 * no persistent summary rail.
 */
export const WithoutSidebar: Story = {
  render: bodyOnly,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the main region with no summary rail', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(canvas.queryByRole('complementary')).toBeNull()
      await expect(canvas.getByText(/senza barra laterale/)).toBeVisible()
    })
  }
}

/**
 * Composed inside a shell that already renders a `<main>` (e.g. `FzAppTemplate`'s
 * default slot). Set `mainAs="div"` so the content region is a plain `<div>` and
 * the page does not expose two `main` landmarks.
 */
export const NestedInShell: Story = {
  render: bodyOnly,
  args: { mainAs: 'div' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the content region as a plain div (no nested main landmark)', async () => {
      await expect(canvas.queryByRole('main')).toBeNull()
      await expect(canvasElement.querySelector('div.fz-layout-main')).toBeInTheDocument()
      await expect(canvas.getByText(/senza barra laterale/)).toBeVisible()
    })
  }
}
