import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzIconBackground } from '@fiscozen/icons'
import { byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'

const meta: Meta<typeof FzIconBackground> = {
  title: 'Media/FzIconBackground',
  component: FzIconBackground,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' }
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    },
    variant: {
      control: 'select',
      options: Object.keys(byPrefixAndName)
    },
    backgroundColor: {
      control: 'text',
      description: 'Tailwind background color token (e.g. core-white, grey-100, blue-500)'
    }
  },
  args: {
    name: 'bell',
    size: 'lg',
    backgroundColor: 'core-white'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Verify icon with background renders', async () => {
      const container = canvasElement.querySelector('span.flex')
      await expect(container).toBeInTheDocument()
      await expect(container).toBeVisible()
    })

    await step('Verify background wrapper (rounded, padded, bg)', async () => {
      const container = canvasElement.querySelector('span.flex')
      await expect(container).toHaveClass('rounded-full')
      await expect(container).toHaveClass('box-content')
      await expect(container).toHaveClass('p-[8px]')
      const bgToken = args?.backgroundColor ?? 'core-white'
      await expect(container).toHaveClass(`bg-${bgToken}`)
    })

    await step('Verify icon SVG is present', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
    })
  }
}
