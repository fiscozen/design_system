import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, waitFor } from '@storybook/test'
import { FzChatContainer, Message } from '@fiscozen/chat-container'
import { onMounted, ref } from 'vue'

const avatar = 'consultant.jpg'
const fetchMessages = (messages: Message[]): Promise<Message[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages)
    }, 100)
  })

const messagesFactory = (
  length: number = 1,
  page: number = 1,
  numberOfAttachments: number = 0
): Message[] =>
  Array.from({ length }, (_, index) => ({
    message: `Prova messaggio ${index + 1} della pagina ${page}`,
    variant: index % 2 !== 0 ? 'primary' : 'invisible',
    timestamp: new Date(1997, 2, 24, 12, 30 - page * index).toISOString(),
    user: { firstName: 'John', lastName: 'Doe', avatar },
    attachments: Array.from({ length: numberOfAttachments }, (_, index) => ({
      name: `attachment_${index + 1}.pdf`,
      url: ''
    }))
  }))

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
        'La variante serve ad indicare se il messaggio è stato inviato (`primary`) o ricevuto (`invisible`). ' +
        'I messaggi devono essere ordinati per timestamp in ordine decrescente.'
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
      template: `<div style="width: 70%; height: 300px; margin: 0 auto; display: flex; flex-direction: column; overflow: hidden; border: 10px solid #ccc;"><story /></div>`
    })
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Un componente per visualizzare una chat con messaggi e allegati. ' +
          'Il componente supporta infinite scrolling per caricare messaggi più vecchi, ' +
          'a patto che il container superiore abbia una dimensione definita per permettere ' +
          'overflow verticale e contestuale scroll.'
      }
    }
  }
} satisfies Meta<typeof FzChatContainer>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// DEFAULT STORY
// ============================================

export const Default: Story = {
  args: {
    messages: messagesFactory(),
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
      const messages = canvas.getAllByText(/Prova messaggio/)
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
      const msg = canvas.getByText(/Prova messaggio/)
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
    messages: messagesFactory(0),
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
      const idValues = Array.from(ids)
        .map((el) => el.id)
        .filter(Boolean)
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
    messages: messagesFactory(2),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  render: (args) => ({
    components: { FzChatContainer },
    setup() {
      const messages = ref([...args.messages!])

      onMounted(async () => {
        messages.value = await fetchMessages(messagesFactory())
      })

      return { args, messages }
    },
    template: `<FzChatContainer v-bind="args" :messages="messages" />`
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      await waitFor(() => {
        const messages = canvas.getAllByText(/Prova messaggio/)
        expect(messages.length).toBeGreaterThanOrEqual(1)
      })
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids)
        .map((el) => el.id)
        .filter(Boolean)
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
    messages: messagesFactory(),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  render: (args) => ({
    components: { FzChatContainer },
    setup() {
      const messages = ref([...args.messages!])

      onMounted(async () => {
        messages.value = await fetchMessages(messagesFactory(3, 1))
        messages.value[0].variant = 'primary'
      })

      return { args, messages }
    },
    template: `<FzChatContainer v-bind="args" :messages="messages" />`
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      await waitFor(() => {
        const messages = canvas.getAllByText(/Prova messaggio/)
        expect(messages.length).toBeGreaterThanOrEqual(1)
      })
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids)
        .map((el) => el.id)
        .filter(Boolean)
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
    messages: messagesFactory(),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione',
    waitingForResponseMessage: 'Attendi...'
  },
  render: (args) => ({
    components: { FzChatContainer },
    setup() {
      const messages = ref([...args.messages!])

      onMounted(async () => {
        messages.value = await fetchMessages(messagesFactory(1, 1, 3))
      })

      return { args, messages }
    },
    template: `<FzChatContainer v-bind="args" :messages="messages" />`
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify download button is accessible', async () => {
      await waitFor(() => {
        const downloadButtons = canvas.getAllByRole('button', {
          name: /Scarica attachment_\d\.pdf/
        })
        expect(downloadButtons.length).toBeGreaterThanOrEqual(1)
        expect(downloadButtons[0]).toBeVisible()
      })
    })

    await step('Accessibility: download buttons have aria-label', async () => {
      await waitFor(() => {
        const btn1 = canvas.getByRole('button', { name: 'Scarica attachment_1.pdf' })
        const btn2 = canvas.getByRole('button', { name: 'Scarica attachment_2.pdf' })
        expect(btn1).toHaveAttribute('aria-label', 'Scarica attachment_1.pdf')
        expect(btn2).toHaveAttribute('aria-label', 'Scarica attachment_2.pdf')
      })
    })

    await step('Accessibility: no duplicate IDs', async () => {
      const ids = canvasElement.querySelectorAll('[id]')
      const idValues = Array.from(ids)
        .map((el) => el.id)
        .filter(Boolean)
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
    messages: messagesFactory(),
    emptyMessage: 'Nessun messaggio',
    emptyMessageDescription: 'Inizia una conversazione'
  },
  render: (args) => ({
    components: { FzChatContainer },
    setup() {
      const messages = ref([...args.messages!])
      const page = ref(1)

      onMounted(async () => {
        messages.value = await fetchMessages(messagesFactory(6, page.value))
      })

      const onLoadMore = async () => {
        if (page.value === 3) return
        page.value++
        messages.value = [
          ...messages.value,
          ...(await fetchMessages(messagesFactory(6, page.value)))
        ]
      }

      return { args, messages, onLoadMore }
    },
    template: `<FzChatContainer v-bind="args" :messages="messages" @load-more="onLoadMore" />`
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify initial messages are rendered', async () => {
      await waitFor(() => {
        const canvas = within(canvasElement)
        const messages = canvas.getAllByText(/della pagina 1/)
        expect(messages.length).toBe(6)
      })
    })

    const scrollContainer = canvasElement.querySelector(
      '.fz-chat-container'
    ) as HTMLElement

    await step('Scroll to top triggers load-more and loads older messages', async () => {
      scrollContainer.scrollTop = -scrollContainer.scrollHeight
      scrollContainer.dispatchEvent(new Event('scroll'))

      await waitFor(() => {
        const canvas = within(canvasElement)
        const messages = canvas.getAllByText(/della pagina 2/)
        expect(messages.length).toBeGreaterThanOrEqual(1)
      })
    })

    await step(
      'Scroll to top again loads another batch (guard was reset by new messages)',
      async () => {
        scrollContainer.scrollTop = -scrollContainer.scrollHeight
        scrollContainer.dispatchEvent(new Event('scroll'))

        await waitFor(() => {
          const canvas = within(canvasElement)
          const messages = canvas.getAllByText(/della pagina 3/)
          expect(messages.length).toBeGreaterThanOrEqual(1)
        })
      }
    )
  }
}
