import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, fn, within } from 'storybook/test'
import { FzCardList, FzCardListItemProps } from '@fiscozen/card-list'
import { FzIconButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'
import { FzInput } from '@fiscozen/input'
import { FzActionProps } from '@fiscozen/action'

const meta = {
  title: 'Panel/FzCardList',
  component: FzCardList,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof FzCardList>
export default meta

type CardListStory = StoryObj<typeof FzCardList>

const linkAction = {
  type: 'link' as const,
  to: '/'
}

const multiActions: FzActionProps[] = [
  { type: 'action', variant: 'textLeft', label: 'Apri' },
  { type: 'action', variant: 'textLeft', label: 'Download' },
  { type: 'action', variant: 'textLeft', label: 'Elimina' }
]

const defaultItems: FzCardListItemProps[] = [
  {
    title: 'Fattura #001',
    value: '1.200,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: [linkAction]
  },
  {
    title: 'Fattura #002',
    value: '3.450,00 €',
    badge: { text: 'Inviata', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Bianchi S.p.A.'],
    actions: [linkAction]
  },
  {
    title: 'Fattura #003',
    value: '780,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Verdi & Co.', 'In scadenza oggi'],
    actions: [linkAction]
  }
]

const singleNonLinkActionItems: FzCardListItemProps[] = [
  {
    title: 'Fattura #001',
    value: '1.200,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: [{ type: 'action', variant: 'textLeft', label: 'Apri' }]
  },
  {
    title: 'Fattura #002',
    value: '3.450,00 €',
    badge: { text: 'Inviata', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Bianchi S.p.A.'],
    actions: [{ type: 'action', variant: 'textLeft', label: 'Apri' }]
  },
  {
    title: 'Fattura #003',
    value: '780,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Verdi & Co.', 'In scadenza oggi'],
    actions: [{ type: 'action', variant: 'textLeft', label: 'Apri' }]
  }
]

const noActionItems: FzCardListItemProps[] = [
  {
    title: 'Fattura #001',
    value: '1.200,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024']
  },
  {
    title: 'Fattura #002',
    value: '3.450,00 €',
    badge: { text: 'Inviata', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Bianchi S.p.A.']
  },
  {
    title: 'Fattura #003',
    value: '780,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Verdi & Co.', 'In scadenza oggi']
  }
]

const multiActionsItems: FzCardListItemProps[] = [
  {
    title: 'Fattura #001',
    value: '1.200,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: multiActions
  },
  {
    title: 'Fattura #002',
    value: '3.450,00 €',
    badge: { text: 'Inviata', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Bianchi S.p.A.'],
    actions: multiActions
  },
  {
    title: 'Fattura #003',
    value: '780,00 €',
    badge: { text: 'Bozza', tone: 'dark' },
    showIndicator: false,
    descriptions: ['Cliente: Verdi & Co.', 'In scadenza oggi'],
    actions: multiActions
  }
]

export const DefaultCardList: CardListStory = {
  render: (args) => ({
    components: { FzCardList, FzIconButton, FzCard, FzInput },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <div class="p-8">
        <h2 class="m-0 p-0">Fatture</h2>
      </div>
      <FzCardList v-bind="args" @fzaction:click="args['onFzaction:click']" />
    </div>`
  }),
  args: {
    items: defaultItems,
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const heading = canvas.getByText('Fatture')
    await expect(heading).toBeInTheDocument()

    const firstItem = canvas.getByText('Fattura #001')
    await expect(firstItem).toBeInTheDocument()

    const secondItem = canvas.getByText('Fattura #002')
    await expect(secondItem).toBeInTheDocument()

    const thirdItem = canvas.getByText('Fattura #003')
    await expect(thirdItem).toBeInTheDocument()
  }
}

export const CardListWithMultiActions: CardListStory = {
  render: (args) => ({
    components: { FzCardList },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <div class="p-8">
        <h2 class="m-0 p-0">Fatture</h2>
      </div>
      <FzCardList v-bind="args" @fzaction:click="args['onFzaction:click']" />
    </div>`
  }),
  args: {
    items: multiActionsItems,
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Fattura #001')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #002')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #003')).toBeInTheDocument()
  }
}

export const CardListWithSingleNonLinkActions: CardListStory = {
  render: (args) => ({
    components: { FzCardList },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <div class="p-8">
        <h2 class="m-0 p-0">Fatture</h2>
      </div>
      <FzCardList v-bind="args" @fzaction:click="args['onFzaction:click']" />
    </div>`
  }),
  args: {
    items: singleNonLinkActionItems,
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Fattura #001')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #002')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #003')).toBeInTheDocument()
  }
}

export const CardListWithNoActions: CardListStory = {
  render: (args) => ({
    components: { FzCardList },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <div class="p-8">
        <h2 class="m-0 p-0">Fatture</h2>
      </div>
      <FzCardList v-bind="args" />
    </div>`
  }),
  args: {
    items: noActionItems
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Fattura #001')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #002')).toBeInTheDocument()
    await expect(canvas.getByText('Fattura #003')).toBeInTheDocument()
  }
}

export const CardListWithFilters: CardListStory = {
  render: (args) => ({
    components: { FzCardList, FzIconButton, FzCard, FzInput },
    setup() {
      const searchQuery = ref('')
      const onHeaderPlusClick = fn()
      const onSearchInput = fn()
      const clearSearch = () => {
        searchQuery.value = ''
      }
      return { args, searchQuery, onHeaderPlusClick, onSearchInput, clearSearch }
    },
    template: `
    <div class="mx-12">
      <div class="flex items-center justify-between py-8">
        <h2 class="m-0 p-0">Fatture</h2>
        <FzIconButton
          iconName="plus"
          variant="primary"
          @click="onHeaderPlusClick"
          environment="frontoffice"
        />
      </div>
      <div class="py-8">
        <FzCard
          collapsible
          title="Filtra"
          color="grey"
        />
      </div>
      <div class="py-8">
        <FzInput
          placeholder="Cerca"
          @input="onSearchInput"
          leftIcon="magnifying-glass"
          rightIcon="xmark"
          :rightIconButton="true"
          @fzinput:right-icon-click="clearSearch"
          v-model="searchQuery"
        />
      </div>
      <FzCardList v-bind="args" @fzaction:click="args['onFzaction:click']" />
    </div>`
  }),
  args: {
    items: [
      ...defaultItems,
      { ...defaultItems[0], title: 'Fattura #004' },
      { ...defaultItems[1], title: 'Fattura #005' },
      { ...defaultItems[2], title: 'Fattura #006' }
    ],
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const heading = canvas.getByText('Fatture')
    await expect(heading).toBeInTheDocument()

    const firstItem = canvas.getByText('Fattura #001')
    await expect(firstItem).toBeInTheDocument()

    const secondItem = canvas.getByText('Fattura #002')
    await expect(secondItem).toBeInTheDocument()

    const thirdItem = canvas.getByText('Fattura #003')
    await expect(thirdItem).toBeInTheDocument()
  }
}
