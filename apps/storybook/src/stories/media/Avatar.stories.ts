import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzAvatar } from '@fiscozen/avatar'

const avatar = 'consultant.jpg'
const meta: Meta<typeof FzAvatar> = {
  title: 'Media/FzAvatar',
  component: FzAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Deprecated - use environment instead'
    },
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice']
    },
    variant: {
      control: 'select',
      options: ['default', 'square']
    },
    title: {
      control: 'text'
    },
    subtitle: {
      control: 'text'
    }
  },
  args: {
    firstName: 'Mario',
    lastName: 'Rossi'
  }
}

type Story = StoryObj<typeof meta>

export const Customer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const avatar = canvas.getByTitle('Mario Rossi')
    await expect(avatar).toBeInTheDocument()
    await expect(avatar.textContent).toContain('MR')
  }
}

export const Consultant: Story = {
  args: {
    src: avatar
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByAltText('Mario Rossi')
    await expect(img).toBeInTheDocument()
    await expect(img.getAttribute('src')).toBe(avatar)
  }
}

export const Backoffice: Story = {
  args: {
    environment: 'backoffice'
  },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('div')
    await expect(container?.classList.contains('gap-8')).toBe(true)

    const avatar = canvasElement.querySelector('img, div[title]')
    await expect(avatar?.classList.contains('size-32')).toBe(true)
  }
}

export const Frontoffice: Story = {
  args: {
    environment: 'frontoffice'
  },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('div')
    await expect(container?.classList.contains('gap-12')).toBe(true)

    const avatar = canvasElement.querySelector('img, div[title]')
    await expect(avatar?.classList.contains('size-44')).toBe(true)
  }
}

export const Square: Story = {
  args: {
    variant: 'square',
    src: avatar
  },
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector('img')
    await expect(avatar?.classList.contains('rounded-[8px]')).toBe(true)
    await expect(avatar?.classList.contains('rounded-full')).toBe(false)
  }
}

export const WithTitle: Story = {
  args: {
    title: 'Title'
  },
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector('p')
    await expect(title).toBeInTheDocument()
    await expect(title?.textContent).toBe('Title')
  }
}

export const WithSubtitle: Story = {
  args: {
    subtitle: 'Subtitle'
  },
  play: async ({ canvasElement }) => {
    const paragraphs = canvasElement.querySelectorAll('p')
    await expect(paragraphs.length).toBeGreaterThan(0)
    await expect(Array.from(paragraphs).some((p) => p.textContent === 'Subtitle')).toBe(true)
  }
}

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Mario Rossi',
    subtitle: 'Sales consultant'
  },
  play: async ({ canvasElement }) => {
    const paragraphs = canvasElement.querySelectorAll('p')
    await expect(paragraphs.length).toBe(2)
    await expect(paragraphs[0].textContent).toBe('Mario Rossi')
    await expect(paragraphs[1].textContent).toBe('Sales consultant')

    const textContainer = canvasElement.querySelector('.flex.flex-col')
    await expect(textContainer).toBeInTheDocument()
  }
}

export const BackofficeWithText: Story = {
  args: {
    environment: 'backoffice',
    title: 'Title',
    subtitle: 'Subtitle'
  },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('div')
    await expect(container?.classList.contains('gap-8')).toBe(true)

    const textContainer = canvasElement.querySelector('.flex.flex-col')
    await expect(textContainer?.classList.contains('gap-0')).toBe(true)

    const title = canvasElement.querySelector('p')
    await expect(title?.classList.contains('text-sm')).toBe(true)
    await expect(title?.classList.contains('!leading-[16px]')).toBe(true)
  }
}

export const FrontofficeWithText: Story = {
  args: {
    environment: 'frontoffice',
    title: 'Title',
    subtitle: 'Subtitle'
  },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('div')
    await expect(container?.classList.contains('gap-12')).toBe(true)

    const textContainer = canvasElement.querySelector('.flex.flex-col')
    await expect(textContainer?.classList.contains('gap-[2px]')).toBe(true)

    const title = canvasElement.querySelector('p')
    await expect(title?.classList.contains('text-base')).toBe(true)
    await expect(title?.classList.contains('!leading-[20px]')).toBe(true)
  }
}

export default meta
