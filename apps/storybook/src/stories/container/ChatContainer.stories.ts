import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzChatContainer } from '@fiscozen/chat-container'

const meta = {
  title: 'Layout/FzChatContainer',
  component: FzChatContainer,
  tags: ['autodocs'],
  argTypes: {
    messages: { control: { type: 'object' } },
    emptyMessage: { control: { type: 'text' } },
    emptyMessageDescription: { control: { type: 'text' } },
    waitingForResponseMessage: { control: { type: 'text' } }
  },
  args: {},
  decorators: [
    () => ({
      template:
        '<div style="width: 700px; height: 200px; padding: 40px; margin: 0 auto;"><story/></div>'
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
        variant: 'primary',
        timestamp: new Date().toISOString(),
        user: { firstName: 'John', lastName: 'Doe', avatar: '' },
        attachments: []
      }
    ],
    emptyMessage: 'No messages yet',
    emptyMessageDescription: 'Start a conversation',
    waitingForResponseMessage: 'Please wait...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const container = canvasElement.querySelector('.grow.overflow-y-auto')
      await expect(container).toBeInTheDocument()
      await expect(container).toBeVisible()
    })

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Hello, world!/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
    })

    await step('Verify scroll container has correct structure', async () => {
      const container = canvasElement.querySelector('.grow.overflow-y-auto.pb-8')
      await expect(container).toBeInTheDocument()
    })

    await step('Verify no duplicate IDs (accessibility)', async () => {
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
// EMPTY STATE STORY
// ============================================

export const Empty: Story = {
  args: {
    messages: [],
    emptyMessage: 'No messages yet',
    emptyMessageDescription: 'Start a conversation'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify empty state heading is accessible', async () => {
      const heading = canvas.getByRole('heading', { level: 2, name: 'No messages yet' })
      await expect(heading).toBeInTheDocument()
    })

    await step('Verify empty state description is visible', async () => {
      const description = canvas.getByText('Start a conversation')
      await expect(description).toBeVisible()
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
      variant: index % 2 !== 0 ? 'primary' : 'invisible',
      timestamp: new Date(Date.now() + index * 100000).toISOString(),
      user: { firstName: 'John', lastName: 'Doe', avatar: '' },
      attachments: []
    })),
    emptyMessage: 'No messages yet',
    emptyMessageDescription: 'Start a conversation',
    waitingForResponseMessage: 'Please wait...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Lorem ipsum/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
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
      variant: index % 2 === 0 ? 'primary' : 'invisible',
      timestamp: new Date(Date.now() + index * 100000).toISOString(),
      user: { firstName: 'John', lastName: 'Doe', avatar: '' },
      attachments: []
    })),
    emptyMessage: 'No messages yet',
    emptyMessageDescription: 'Start a conversation',
    waitingForResponseMessage: 'Please wait...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify messages are displayed', async () => {
      const messages = canvas.getAllByText(/Lorem ipsum/)
      await expect(messages.length).toBeGreaterThanOrEqual(1)
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
        message: 'Here is the invoices you requested.',
        variant: 'primary' as const,
        timestamp: new Date().toISOString(),
        user: { firstName: 'John', lastName: 'Doe', avatar: '' },
        attachments: [
          {
            name: 'invoice_1.pdf',
            url: 'https://example.com/document.pdf'
          },
          {
            name: 'invoice_2.pdf',
            url: 'https://example.com/document.pdf'
          },
          {
            name: 'invoice_3.pdf',
            url: 'https://example.com/document.pdf'
          }
        ]
      }
    ],
    emptyMessage: 'No messages yet',
    emptyMessageDescription: 'Start a conversation',
    waitingForResponseMessage: 'Please wait...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify download button is accessible', async () => {
      const downloadButtons = canvas.getAllByRole('button', {
        name: /Scarica invoice_\d\.pdf/
      })
      await expect(downloadButtons.length).toBeGreaterThanOrEqual(1)
      await expect(downloadButtons[0]).toBeVisible()
    })
  }
}
