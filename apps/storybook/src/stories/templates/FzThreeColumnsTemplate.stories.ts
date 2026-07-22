import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent, waitFor } from 'storybook/test'
import { ref } from 'vue'
import { FzThreeColumnsTemplate } from '@fiscozen/layout'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzBadge } from '@fiscozen/badge'
import { FzInput } from '@fiscozen/input'

/**
 * `FzThreeColumnsTemplate` is the **backoffice three-column workspace layout**: a
 * full-width header bar, a collapsible list/navigation `sidebar`, and two
 * equal-width content columns — a left column (e.g. a document preview) and a
 * right column with its own header row and an independently scrollable body (e.g.
 * the record being edited). It was extracted from the app-internal `@fzp/shared`
 * `FzLayoutThreeColumns` so the shape lives in the design system (RFC §4,
 * LIB-2696).
 *
 * It is **presentation-only and chrome-free**: it owns the structural scaffold
 * (the flex regions, the collapsible sidebar's width animation +
 * `v-model:sidebarCollapsed`, the independent-scroll regions, the borders and the
 * `aside`/`main` landmarks) but bakes in no back button, title, badge, filters or
 * toggle icon. Those are injected through slots — the examples below compose them
 * from real DS components (`FzIconButton` back/collapse controls, `FzBadge`,
 * `FzButton`, `FzInput`), exactly as the `@fzp/shared` wrapper does for the
 * backoffice.
 *
 * ### Height contract
 * Unlike `FzListTemplate`/`FzDetailTemplate` (which grow with their content), this
 * template **fills the height of its parent** and gives each region its own
 * scroll, so it must be mounted inside a **bounded-height** ancestor (here a
 * `600px` box). It deliberately does not own `min-h-dvh`: it is meant to fill the
 * space below an app header, not the whole viewport.
 *
 * > Not to be confused with `FzLayout`'s `layout="threeColumns"` variant, a
 * > CSS-grid primitive (menu/header/chat/main/footer). This is a standalone page
 * > template.
 */
const meta: Meta<typeof FzThreeColumnsTemplate> = {
  title: 'Templates/FzThreeColumnsTemplate',
  component: FzThreeColumnsTemplate,
  tags: ['autodocs'],
  argTypes: {
    mainAs: { control: 'radio', options: ['main', 'div'] },
    sidebarLabel: { control: 'text' }
  },
  args: {
    mainAs: 'main',
    sidebarLabel: 'Lista documenti'
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        // Give the full-height template a bounded height in the docs panel.
        height: '640px'
      }
    }
  }
} satisfies Meta<typeof FzThreeColumnsTemplate>

export default meta

type Story = StoryObj<typeof meta>

const documenti = [
  { id: 1, nome: 'Fattura 001/2026', tipo: 'Fattura passiva' },
  { id: 2, nome: 'Fattura 002/2026', tipo: 'Fattura passiva' },
  { id: 3, nome: 'Nota di credito 004', tipo: 'Nota di credito' },
  { id: 4, nome: 'Autofattura 012', tipo: 'Autofattura' }
]

const workspace = (args: Record<string, unknown>) => ({
  components: { FzThreeColumnsTemplate, FzButton, FzIconButton, FzBadge, FzInput },
  setup() {
    const collapsed = ref(false)
    const search = ref('')
    const selected = ref(documenti[0])
    return { args, collapsed, search, selected, documenti }
  },
  template: `
    <div class="h-[600px] twp">
      <FzThreeColumnsTemplate v-bind="args" v-model:sidebarCollapsed="collapsed">
        <template #header-left>
          <FzIconButton iconName="chevron-left" iconVariant="far" variant="invisible" ariaLabel="Indietro" />
          <h2 class="font-semibold text-[20px] leading-[28px] m-0">Registrazione contabile</h2>
          <FzBadge tone="light" variant="text">Mario Rossi</FzBadge>
        </template>

        <template #header-right>
          <FzButton variant="danger" iconName="circle-xmark" iconVariant="fas">Rifiuta</FzButton>
          <FzButton variant="success" iconName="circle-check" iconVariant="fas">Registra</FzButton>
        </template>

        <template #sidebar-header="{ collapsed, toggle }">
          <h3 v-show="!collapsed" class="font-semibold text-[17px] leading-[24px] m-0 truncate">
            Lista ({{ documenti.length }})
          </h3>
          <FzIconButton
            variant="invisible"
            iconVariant="far"
            :iconName="collapsed ? 'table-layout' : 'chevrons-left'"
            :ariaLabel="collapsed ? 'Espandi lista' : 'Comprimi lista'"
            :aria-expanded="!collapsed"
            @click="toggle()" />
        </template>

        <template #sidebar-filter>
          <FzInput v-model="search" type="search" placeholder="Cerca documento" />
        </template>

        <template #sidebar-content>
          <div class="flex flex-col gap-8">
            <button
              v-for="doc in documenti"
              :key="doc.id"
              type="button"
              class="text-left rounded-lg border-1 border-solid p-12 bg-core-white cursor-pointer"
              :class="selected.id === doc.id ? 'border-blue-500' : 'border-grey-200'"
              @click="selected = doc">
              <div class="font-medium text-sm">{{ doc.nome }}</div>
              <div class="text-xs text-grey-500">{{ doc.tipo }}</div>
            </button>
          </div>
        </template>

        <template #column-left>
          <div class="flex flex-col items-center justify-center h-full text-grey-500 gap-8">
            <span class="text-sm">Anteprima documento</span>
            <span class="font-medium">{{ selected.nome }}</span>
          </div>
        </template>

        <template #column-right-header>
          <FzBadge tone="info" leftIcon="clock" leftIconVariant="far">Da registrare</FzBadge>
        </template>

        <template #column-right-content>
          <div class="flex flex-col gap-16">
            <h3 class="font-semibold m-0">Dati documento</h3>
            <p class="text-grey-600 m-0">
              Contenuto del modulo di registrazione per <strong>{{ selected.nome }}</strong>.
            </p>
            <div v-for="n in 12" :key="n" class="rounded-lg bg-background-alice-blue p-16">
              Sezione {{ n }}
            </div>
          </div>
        </template>
      </FzThreeColumnsTemplate>
    </div>
  `
})

/**
 * The full workspace: header chrome, a collapsible list sidebar with a filter and
 * a master list, a preview column and a scrollable detail column.
 */
export const Default: Story = {
  render: workspace,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the header chrome, the aside and the main landmark', async () => {
      await expect(canvas.getByText('Registrazione contabile')).toBeVisible()
      await expect(canvas.getByText('Mario Rossi')).toBeVisible()
      await expect(
        canvas.getByRole('complementary', { name: 'Lista documenti' })
      ).toBeInTheDocument()
      await expect(canvas.getByRole('main')).toBeInTheDocument()
    })

    // Scope list-item queries to the sidebar landmark — the selected document's
    // name also renders in the preview and detail columns, so a canvas-wide text
    // query would match multiple elements.
    const sidebar = within(canvas.getByRole('complementary', { name: 'Lista documenti' }))

    await step('Collapsing the sidebar hides its body but keeps it mounted', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Comprimi lista' }))
      // v-show: the list item stays in the DOM, just hidden.
      await waitFor(() => expect(sidebar.getByText('Fattura 001/2026')).not.toBeVisible())
      // The expand control is now the affordance shown in the rail.
      await expect(canvas.getByRole('button', { name: 'Espandi lista' })).toBeVisible()
    })

    await step('Expanding restores the list', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Espandi lista' }))
      await waitFor(() => expect(sidebar.getByText('Fattura 001/2026')).toBeVisible())
    })
  }
}

/**
 * Composed inside a shell that already renders a `<main>` (e.g. `FzAppTemplate`'s
 * default slot). Set `mainAs="div"` so the content columns are a plain `<div>` and
 * the page does not expose two `main` landmarks.
 */
export const NestedInShell: Story = {
  render: workspace,
  args: { mainAs: 'div' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Emits no <main> landmark, keeps the named complementary rail', async () => {
      await expect(canvas.queryByRole('main')).toBeNull()
      await expect(
        canvas.getByRole('complementary', { name: 'Lista documenti' })
      ).toBeInTheDocument()
    })
  }
}
