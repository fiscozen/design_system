import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from '@storybook/test'
import { ref } from 'vue'
import { FzPagination } from '@fiscozen/pagination'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
  title: 'Navigation/FzPagination',
  component: FzPagination,
  tags: ['autodocs'],
  argTypes: {
    totalPages: {
      control: { type: 'number', min: 0 },
      description: 'Total number of pages'
    },
    currentPage: {
      control: { type: 'number', min: 0 },
      description: 'Currently active page'
    },
    environment: {
      control: { type: 'select' },
      options: ['frontoffice', 'backoffice'],
      description: 'Visual environment for button styling'
    },
    options: {
      table: { disable: true }
    },
    position: {
      table: { disable: true }
    }
  }
} satisfies Meta<typeof FzPagination>

export default meta

type PaginationStory = StoryObj<typeof FzPagination>

export const Default: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 10,
    currentPage: 1
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify component renders with nav', async () => {
      const nav = canvasElement.querySelector('nav')
      await expect(nav).toBeTruthy()
      await expect(nav?.getAttribute('aria-label')).toBe('Paginazione')
    })

    await step('Verify prev/next buttons exist', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      await expect(buttons.length).toBeGreaterThan(2)
    })

    await step('Navigate to next page', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const nextButton = buttons[buttons.length - 1]
      await userEvent.click(nextButton)
    })
  }
}

export const FewPages: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 3,
    currentPage: 1
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify all pages are visible without ellipsis', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const labels = Array.from(buttons).map(b => b.textContent?.trim())
      await expect(labels).toContain('1')
      await expect(labels).toContain('2')
      await expect(labels).toContain('3')
    })
  }
}

export const ManyPages: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 50,
    currentPage: 25
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify ellipsis is present for many pages', async () => {
      const ellipsisIcons = canvasElement.querySelectorAll('[data-icon="ellipsis"], .fa-ellipsis')
      await expect(ellipsisIcons.length).toBeGreaterThan(0)
    })
  }
}

export const FirstPage: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 10,
    currentPage: 1
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify prev button is disabled on first page', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const prevButton = buttons[0]
      await expect(prevButton?.hasAttribute('disabled')).toBe(true)
    })

    await step('Verify next button is enabled', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const nextButton = buttons[buttons.length - 1]
      await expect(nextButton?.hasAttribute('disabled')).toBe(false)
    })
  }
}

export const LastPage: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 10,
    currentPage: 10
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify next button is disabled on last page', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const nextButton = buttons[buttons.length - 1]
      await expect(nextButton?.hasAttribute('disabled')).toBe(true)
    })

    await step('Verify prev button is enabled', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const prevButton = buttons[0]
      await expect(prevButton?.hasAttribute('disabled')).toBe(false)
    })
  }
}

export const Backoffice: PaginationStory = {
  render: (args) => ({
    components: { FzPagination },
    setup() {
      const currentPage = ref(args.currentPage)
      return { args, currentPage }
    },
    template: `<FzPagination v-bind="args" v-model:currentPage="currentPage" />`
  }),
  args: {
    totalPages: 10,
    currentPage: 5,
    environment: 'backoffice'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify component renders in backoffice mode', async () => {
      const nav = canvasElement.querySelector('nav')
      await expect(nav).toBeTruthy()
    })

    await step('Verify navigation works', async () => {
      const buttons = canvasElement.querySelectorAll('button')
      const nextButton = buttons[buttons.length - 1]
      await userEvent.click(nextButton)
    })
  }
}

