import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, within } from 'storybook/test'
import { FzCardListItem } from '@fiscozen/card-list'
import { FzActionProps } from '@fiscozen/action'

const meta = {
  title: 'Panel/FzCardListItem',
  component: FzCardListItem,
  tags: ['autodocs'],
  argTypes: {
    badge: {
      control: 'object',
      description: 'Badge at the top-left: `{ text: string, tone: FzBadgeTone }` when set'
    },
    title: {
      control: 'text',
      description: 'Main title of the item, displayed in bold'
    },
    value: {
      control: 'text',
      description: 'Amount or value displayed on the right side of the title row'
    },
    descriptions: {
      control: 'object',
      description: 'Description lines rendered below the title row'
    },
    actions: {
      control: 'object',
      description:
        'Row actions: omit or `[]` for none; one item shows an arrow; more than one shows an overflow menu (`fzaction:click`)'
    },
    showIndicator: {
      control: 'boolean',
      description:
        'Whether to show the status indicator before the title (styled with the design-system blue accent)',
      table: {
        defaultValue: { summary: 'false' }
      }
    }
  }
} satisfies Meta<typeof FzCardListItem>
export default meta

type CardListItemStory = StoryObj<typeof FzCardListItem>

/** FzIcon wraps icons in a span with role="presentation". */
function presentationIconCount(root: HTMLElement): number {
  return root.querySelectorAll('span[role="presentation"]').length
}

export const CardWithBadgeAndAmount: CardListItemStory = {
  render: (args) => ({
    components: { FzCardListItem },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <FzCardListItem
        v-bind="args"
        @fzaction:click="args['onFzaction:click']"
      />
    </div>`
  }),
  args: {
    title: 'Fattura #001',
    value: '1.200,00 €',
    badge: {
      text: 'Bozza',
      tone: 'dark'
    },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: [
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Apri'
      },
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Download'
      },
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Elimina'
      }
    ] as FzActionProps[],
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const title = canvas.getByText('Fattura #001')
    await expect(title).toBeInTheDocument()

    await expect(canvas.getByText('Bozza')).toBeInTheDocument()

    const menuButtons = canvas.getAllByRole('button')
    await expect(menuButtons.length).toBeGreaterThanOrEqual(1)

    await expect(presentationIconCount(canvasElement)).toBeGreaterThanOrEqual(1)
  }
}

export const CardWithTitleAndDescriptions: CardListItemStory = {
  render: (args) => ({
    components: { FzCardListItem },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <FzCardListItem
        v-bind="args"
        @fzaction:click="args['onFzaction:click']"
      />
    </div>`
  }),
  args: {
    title: 'Fattura #001',
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: [
      {
        type: 'link',
        to: '/'
      }
    ] as FzActionProps[],
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Fattura #001')).toBeInTheDocument()
    await expect(canvas.getByText('Cliente: Rossi S.r.l.')).toBeInTheDocument()
    await expect(canvas.getByText('Scadenza: 31/03/2024')).toBeInTheDocument()
  }
}

export const CardWithTitleOnly: CardListItemStory = {
  render: (args) => ({
    components: { FzCardListItem },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <FzCardListItem
        v-bind="args"
        @fzaction:click="args['onFzaction:click']"
      />
    </div>`
  }),
  args: {
    title: 'Fattura #001',
    actions: [
      {
        type: 'link',
        to: '/'
      }
    ] as FzActionProps[],
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Fattura #001')).toBeInTheDocument()
  }
}

export const CardWithLongTitle: CardListItemStory = {
  render: (args) => ({
    components: { FzCardListItem },
    setup() {
      return { args }
    },
    template: `
    <div class="min-w-[355px]">
      <FzCardListItem
        v-bind="args"
        @fzaction:click="args['onFzaction:click']"
      />
    </div>`
  }),
  args: {
    title:
      'Un titolo lungo per vedere come si comporta il card list ancora quando il titolo è lungo ancora più lungo #001',
    value: '1.200,00 €',
    badge: {
      text: 'Bozza',
      tone: 'dark'
    },
    showIndicator: true,
    descriptions: ['Cliente: Rossi S.r.l.', 'Scadenza: 31/03/2024'],
    actions: [
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Apri'
      },
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Download'
      },
      {
        type: 'action',
        variant: 'textLeft',
        label: 'Elimina'
      }
    ] as FzActionProps[],
    'onFzaction:click': fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText(
        'Un titolo lungo per vedere come si comporta il card list ancora quando il titolo è lungo ancora più lungo #001'
      )
    ).toBeInTheDocument()
    await expect(canvas.getByText('1.200,00 €')).toBeInTheDocument()
  }
}
