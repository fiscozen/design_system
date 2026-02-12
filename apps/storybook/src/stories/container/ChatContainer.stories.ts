import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, waitFor } from '@storybook/test'
import { FzChatContainer } from '@fiscozen/chat-container'
import { ref } from 'vue'

const meta = {
  title: 'Layout/FzChatContainer',
  component: FzChatContainer,
  tags: ['autodocs'],
  argTypes: {
    messages: {
      control: { type: 'object' },
      description:
        'Insieme di messaggi da visualizzare. ' +
        'Ogni messaggio è un oggetto con le seguenti proprietà: message, variant, timestamp, user, attachments. ' +
        'La variante serve ad indicare se il messaggio è stato inviato (`primary`) o ricevuto (`invisible`).'
    },
    emptyMessage: {
      control: { type: 'text' },
      description: 'Messaggio da visualizzare quando non ci sono messaggi.'
    },
    emptyMessageDescription: {
      control: { type: 'text' },
      description: 'Descrizione da visualizzare quando non ci sono messaggi.'
    },
    waitingForResponseMessage: {
      control: { type: 'text' },
      description:
        'Messaggio da visualizzare quando si sta aspettando una risposta. ' +
        "Se non presente, non verrà visualizzato nulla quando l'ultimo messaggio è un messaggio inviato."
    }
  },
  args: {},
  decorators: [
    () => ({
      template: `<div style="width: 100%; height: 500px; margin: 0 auto; display: flex; flex-direction: column; overflow: hidden;"><story /></div>`
    })
  ]
} satisfies Meta<typeof FzChatContainer>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// DEFAULT STORY
// ============================================

export const Default: Story = {
  args: {
    messages: [
      {
        message: 'Hello, world!',
        variant: 'invisible',
        timestamp: new Date().toISOString(),
        user: { firstName: 'John', lastName: 'Doe', avatar: '' },
        attachments: []
      }
    ],
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const container = canvasElement.querySelector('.fz-chat-container')
      await expect(container).toBeInTheDocument()
      await expect(container).toBeVisible()
    })

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Hello, world!/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
    })

    await step('Verify scroll container has correct structure', async () => {
      const container = canvasElement.querySelector('.fz-chat-container')
      await expect(container).toBeInTheDocument()
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids)
        .map((el) => el.id)
        .filter(Boolean)
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      await expect(duplicates).toHaveLength(0)
    })

    await step('Accessibility: messages are in document and visible', async () => {
      const msg = canvas.getByText(/Hello, world!/)
      await expect(msg).toBeInTheDocument()
      await expect(msg).toBeVisible()
    })
  }
}

// ============================================
// EMPTY STATE STORY
// ============================================

export const Empty: Story = {
  args: {
    messages: [],
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify empty state heading is accessible', async () => {
      const heading = canvas.getByRole('heading', { level: 2, name: 'Nessun messaggio' })
      await expect(heading).toBeInTheDocument()
    })

    await step('Verify empty state description is visible', async () => {
      const description = canvas.getByText('Inizia una conversazione')
      await expect(description).toBeVisible()
    })

    await step('Accessibility: single h2 for empty state', async () => {
      const headings = canvasElement.querySelectorAll('h2')
      await expect(headings.length).toBe(1)
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids).map((el) => el.id).filter(Boolean)
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      await expect(duplicates).toHaveLength(0)
    })
  }
}

// ============================================
// LAST MESSAGE FROM RECEIVER STORY
// ============================================

export const LastMessageFromReceiver: Story = {
  args: {
    messages: Array.from({ length: 6 }, (_, index) => ({
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      variant: index % 2 === 0 ? 'primary' : 'invisible',
      timestamp: new Date(Date.now() + index * 100000).toISOString(),
      user: { firstName: 'John', lastName: 'Doe', avatar: '' },
      attachments: []
    })),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Lorem ipsum/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids).map((el) => el.id).filter(Boolean)
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      await expect(duplicates).toHaveLength(0)
    })

    await step('Accessibility: scroll container is visible', async () => {
      const container = canvasElement.querySelector('.fz-chat-container')
      await expect(container).toBeInTheDocument()
      await expect(container).toBeVisible()
    })
  }
}

// ============================================
// LAST MESSAGE FROM SENDER STORY
// ============================================

export const LastMessageFromSender: Story = {
  args: {
    messages: Array.from({ length: 6 }, (_, index) => ({
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      variant: index % 2 !== 0 ? 'primary' : 'invisible',
      timestamp: new Date(Date.now() + index * 100000).toISOString(),
      user: { firstName: 'John', lastName: 'Doe', avatar: '' },
      attachments: []
    })),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Lorem ipsum/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids).map((el) => el.id).filter(Boolean)
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      await expect(duplicates).toHaveLength(0)
    })
  }
}
// ============================================
// WITH ATTACHMENTS STORY
// ============================================

export const WithAttachments: Story = {
  args: {
    messages: [
      {
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        variant: 'invisible',
        timestamp: new Date().toISOString(),
        user: { firstName: 'John', lastName: 'Doe', avatar: '' },
        attachments: [
          {
            name: 'attachment_1.pdf',
            url: ''
          },
          {
            name: 'attachment_2.pdf',
            url: ''
          },
          {
            name: 'attachment_3.pdf',
            url: ''
          }
        ]
      }
    ],
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify download button is accessible', async () => {
      const downloadButtons = canvas.getAllByRole('button', {
        name: /Scarica attachment_\d\.pdf/
      })
      await expect(downloadButtons.length).toBeGreaterThanOrEqual(1)
      await expect(downloadButtons[0]).toBeVisible()
    })

    await step('Accessibility: download buttons have aria-label', async () => {
      const btn1 = canvas.getByRole('button', { name: 'Scarica attachment_1.pdf' })
      const btn2 = canvas.getByRole('button', { name: 'Scarica attachment_2.pdf' })
      await expect(btn1).toHaveAttribute('aria-label', 'Scarica attachment_1.pdf')
      await expect(btn2).toHaveAttribute('aria-label', 'Scarica attachment_2.pdf')
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids).map((el) => el.id).filter(Boolean)
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      await expect(duplicates).toHaveLength(0)
    })
  }
}

// ============================================
// LOAD MORE STORY
// ============================================

export const LoadMore: Story = {
  args: {
    messages: Array.from({ length: 20 }, (_, index) => ({
      message: `Messaggio ${index + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      variant: index % 2 === 0 ? 'primary' : 'invisible',
      timestamp: new Date(Date.now() + index * 100000).toISOString(),
      user: { firstName: 'John', lastName: 'Doe', avatar: '' },
      attachments: []
    })),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione'
  },
  render: (args) => ({
    components: { FzChatContainer },
    setup() {
      const messages = ref([...args.messages!])
      let batch = 0

      const onLoadMore = () => {
        batch++
        const olderMessages = Array.from({ length: 5 }, (_, i) => ({
          message: `Messaggio più vecchio (batch ${batch}, #${i + 1})`,
          variant: (i % 2 === 0 ? 'invisible' : 'primary') as 'invisible' | 'primary',
          timestamp: new Date(Date.now() - (batch * 5 + i) * 100000).toISOString(),
          user: { firstName: 'Jane', lastName: 'Smith', avatar: '' },
          attachments: [] as { name: string; url: string }[]
        }))
        messages.value = [...olderMessages, ...messages.value]
      }

      return { messages, onLoadMore }
    },
    template: `<FzChatContainer :messages="messages" @load-more="onLoadMore" />`
  }),
  play: async ({ canvasElement, step }) => {
    const scrollContainer = canvasElement.querySelector('.fz-chat-container') as HTMLElement

    await step('Verify initial messages are rendered', async () => {
      const canvas = within(canvasElement)
      const messages = canvas.getAllByText(/Messaggio \d+ -/)
      await expect(messages.length).toBe(20)
    })

    await step('Scroll to top triggers load-more and loads older messages', async () => {
      scrollContainer.scrollTop = 0
      scrollContainer.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        const canvas = within(canvasElement)
        expect(canvas.getByText(/batch 1, #1/)).toBeInTheDocument()
      })
    })

    await step(
      'Scroll to top again loads another batch (guard was reset by new messages)',
      async () => {
        scrollContainer.scrollTop = 0
        scrollContainer.dispatchEvent(new Event('scroll'))

        await waitFor(() => {
          const canvas = within(canvasElement)
          expect(canvas.getByText(/batch 2, #1/)).toBeInTheDocument()
        })
      }
    )
  }
}
