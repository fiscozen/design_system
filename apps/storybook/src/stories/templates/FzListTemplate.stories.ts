import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzListTemplate, FzListTemplateProps } from '@fiscozen/layout'
import { FzButton } from '@fiscozen/button'

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

const card = 'bg-core-white rounded-lg shadow p-16'

const fullPage = (args: FzListTemplateProps) => ({
  setup() {
    return { args, card }
  },
  components: { FzListTemplate, FzButton },
  template: `
    <FzListTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <template #banner>
        <div class="rounded-lg bg-semantic-warning-100 text-semantic-warning-700 p-16 text-sm">
          Il periodo di elaborazione delle dichiarazioni non è ancora aperto.
        </div>
      </template>

      <template #filters>
        <div :class="card">
          <div class="flex flex-col gap-12">
            <span class="text-sm font-medium text-grey-500">Filtri</span>
            <label class="flex flex-col gap-4 text-sm">Anno
              <select class="rounded border border-grey-200 p-8"><option>2026</option></select>
            </label>
            <label class="flex flex-col gap-4 text-sm">Stato
              <select class="rounded border border-grey-200 p-8"><option>Tutti</option></select>
            </label>
            <FzButton class="mt-8">Nuova dichiarazione</FzButton>
          </div>
        </div>
      </template>

      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-medium">Dichiarazioni IVA</h1>
          <input class="rounded border border-grey-200 p-8 text-sm max-w-[300px]" placeholder="Ricerca utente" />
        </div>
      </template>

      <div :class="card">
        <table class="w-full text-left text-sm">
          <thead class="text-grey-500">
            <tr><th class="p-8">Utente</th><th class="p-8">Anno</th><th class="p-8">Stato</th></tr>
          </thead>
          <tbody>
            <tr class="border-t border-grey-100"><td class="p-8">Mario Rossi</td><td class="p-8">2026</td><td class="p-8">Inviata</td></tr>
            <tr class="border-t border-grey-100"><td class="p-8">Luigi Verdi</td><td class="p-8">2026</td><td class="p-8">In bozza</td></tr>
          </tbody>
        </table>
      </div>
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

const listOnly = (args: FzListTemplateProps) => ({
  setup() {
    return { args, card }
  },
  components: { FzListTemplate },
  template: `
    <FzListTemplate v-bind="args" class="bg-background-alice-blue p-16">
      <div :class="card">
        <table class="w-full text-left text-sm">
          <thead class="text-grey-500"><tr><th class="p-8">Nome</th><th class="p-8">Ruolo</th></tr></thead>
          <tbody>
            <tr class="border-t border-grey-100"><td class="p-8">Anna Bianchi</td><td class="p-8">Operatore</td></tr>
          </tbody>
        </table>
      </div>
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
