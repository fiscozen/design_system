import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzListTemplate, FzListTemplateProps } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'
import { FzAlert } from '@fiscozen/alert'
import { FzCard } from '@fiscozen/card'
import { FzSelect } from '@fiscozen/select'
import { FzInput } from '@fiscozen/input'
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'

/**
 * `FzListTemplate` is the presentation-only backoffice list-page layout: an
 * optional full-width `banner`, an optional `filters` rail, an optional `header`
 * toolbar (title/search/actions) and the list content itself (typically an
 * `FzTable`). It extracts the shape the backoffice list pages hand-roll today so
 * they converge on one responsive layout (RFC §4, LIB-2694).
 *
 * It composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) and — being
 * a *page-content* template meant to render inside a shell's main region — does
 * not force a viewport height or apply root safe-area insets. Set `mainAs="div"`
 * when composing it inside a shell that already renders a `<main>` (e.g.
 * `FzAppTemplate`) to avoid nested `main` landmarks.
 *
 * The example content is composed entirely from design-system components
 * (`FzAlert` banner, `FzCard` + `FzSelect` filters, `FzInput` search,
 * `FzSimpleTable` + `FzColumn` list) rather than hand-rolled `<div>`/`<table>`/
 * `<select>`/`<input>` markup.
 */
const meta: Meta<typeof FzListTemplate> = {
  title: 'Templates/FzListTemplate',
  component: FzListTemplate,
  tags: ['autodocs'],
  argTypes: {
    filtersPosition: { control: 'radio', options: ['left', 'top'] },
    filtersLabel: { control: 'text' },
    mainAs: { control: 'radio', options: ['main', 'div'] }
  },
  args: {
    filtersPosition: 'left',
    mainAs: 'main'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FzListTemplate>

export default meta

type Story = StoryObj<typeof meta>

const anni = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' }
]
const stati = [
  { value: 'all', label: 'Tutti' },
  { value: 'sent', label: 'Inviata' },
  { value: 'draft', label: 'In bozza' }
]
const dichiarazioni = [
  { utente: 'Mario Rossi', anno: '2026', stato: 'Inviata' },
  { utente: 'Luigi Verdi', anno: '2026', stato: 'In bozza' }
]

const fullPage = (args: FzListTemplateProps) => ({
  setup() {
    return { args, anni, stati, dichiarazioni }
  },
  components: {
    FzListTemplate,
    FzButton,
    FzAlert,
    FzCard,
    FzSelect,
    FzInput,
    FzSimpleTable,
    FzColumn
  },
  template: `
    <FzListTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <template #banner>
        <FzAlert tone="warning" variant="background" :showButtonAction="false">
          Il periodo di elaborazione delle dichiarazioni non è ancora aperto.
        </FzAlert>
      </template>

      <template #filters>
        <FzCard title="Filtri">
          <div class="flex flex-col gap-12">
            <FzSelect label="Anno" placeholder="Seleziona" :options="anni" />
            <FzSelect label="Stato" placeholder="Tutti" :options="stati" />
            <FzButton class="mt-8">Nuova dichiarazione</FzButton>
          </div>
        </FzCard>
      </template>

      <template #header>
        <div class="flex items-center justify-between gap-16">
          <h1 class="text-lg font-medium">Dichiarazioni IVA</h1>
          <FzInput type="search" placeholder="Ricerca utente" class="max-w-[300px]" />
        </div>
      </template>

      <FzCard>
        <FzSimpleTable :value="dichiarazioni">
          <FzColumn field="utente" header="Utente" />
          <FzColumn field="anno" header="Anno" />
          <FzColumn field="stato" header="Stato" />
        </FzSimpleTable>
      </FzCard>
    </FzListTemplate>
  `
})

export const WithFilters: Story = {
  render: fullPage,
  args: { filtersPosition: 'left', filtersLabel: 'Filtri dichiarazioni' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the list as the main landmark', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(canvas.getByText('Mario Rossi')).toBeVisible()
    })

    await step('Renders the filter rail as a named complementary landmark', async () => {
      await expect(
        canvas.getByRole('complementary', { name: 'Filtri dichiarazioni' })
      ).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Nuova dichiarazione' })).toBeVisible()
    })

    await step('Renders the banner and the header toolbar', async () => {
      await expect(canvas.getByText(/periodo di elaborazione/)).toBeVisible()
      await expect(canvas.getByText('Dichiarazioni IVA')).toBeVisible()
    })

    await step('Places the filter rail beside the content (left)', async () => {
      await expect(canvasElement.querySelector('.fz-list-template__body')).toHaveClass(
        'fz-list-template__body--left'
      )
      await expect(canvasElement.querySelector('.fz-list-template__filters')).toHaveClass(
        'fz-list-template__filters--left'
      )
    })
  }
}

export const FiltersTop: Story = {
  render: fullPage,
  args: { filtersPosition: 'top' },
  play: async ({ canvasElement, step }) => {
    await step('Stacks the filters full-width above the content', async () => {
      await expect(canvasElement.querySelector('.fz-list-template__body')).toHaveClass(
        'fz-list-template__body--top'
      )
      await expect(canvasElement.querySelector('.fz-list-template__filters')).toHaveClass(
        'fz-list-template__filters--top'
      )
    })
  }
}

const utenti = [{ nome: 'Anna Bianchi', ruolo: 'Operatore' }]

const listOnly = (args: FzListTemplateProps) => ({
  setup() {
    return { args, utenti }
  },
  components: { FzListTemplate, FzCard, FzSimpleTable, FzColumn },
  template: `
    <FzListTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <FzCard>
        <FzSimpleTable :value="utenti">
          <FzColumn field="nome" header="Nome" />
          <FzColumn field="ruolo" header="Ruolo" />
        </FzSimpleTable>
      </FzCard>
    </FzListTemplate>
  `
})

export const ListOnly: Story = {
  render: listOnly,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the main region with no filter rail', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(canvas.queryByRole('complementary')).toBeNull()
      await expect(canvas.getByText('Anna Bianchi')).toBeVisible()
    })
  }
}

/**
 * Composed inside a shell that already renders a `<main>` (e.g. `FzAppTemplate`'s
 * default slot). Set `mainAs="div"` so the content region is a plain `<div>` and
 * the page does not expose two `main` landmarks.
 */
export const NestedInShell: Story = {
  render: listOnly,
  args: { mainAs: 'div' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the content region as a plain div (no nested main landmark)', async () => {
      await expect(canvas.queryByRole('main')).toBeNull()
      await expect(canvasElement.querySelector('div.fz-layout-main')).toBeInTheDocument()
      await expect(canvas.getByText('Anna Bianchi')).toBeVisible()
    })
  }
}
