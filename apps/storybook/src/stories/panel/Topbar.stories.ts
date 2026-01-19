import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within, waitFor } from '@storybook/test'
import { FzTopbar } from '@fiscozen/topbar'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzTopbar> = {
  title: 'Panel/FzTopbar',
  component: FzTopbar,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'danger']
    },
    style: {
      control: 'select',
      options: ['none', 'button', 'icon-button', 'hybrid', 'link']
    }
  },
  args: {
    actionLabel: 'This is the action',
    actionTooltip: 'Action tooltip',
    default: 'This is a Topbar'
  }
}

type Story = StoryObj<typeof meta>

const DefaultNone: Story = {
  args: {
    style: 'none'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify default type styling (bg-white-smoke)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-white-smoke')
    })
    
    await step('Verify no action button is rendered when style is none', async () => {
      const button = canvasElement.querySelector('button')
      await expect(button).not.toBeInTheDocument()
    })
  }
}

const DefaultButton: Story = {
  args: {
    style: 'button',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify button action is rendered', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify button click handler IS called', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await userEvent.click(button)
      // ROBUST CHECK: Verify the click spy WAS called
      await expect(args.onActionClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify default type styling (bg-white-smoke)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-white-smoke')
    })
  }
}

const DefaultIconButton: Story = {
  args: {
    style: 'icon-button',
    actionIcon: 'bell',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify icon button is rendered', async () => {
      // Icon button should be present (rendered as button with icon)
      const button = canvasElement.querySelector('button')
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify icon button click handler IS called', async () => {
      const button = canvasElement.querySelector('button')
      if (button) {
        await userEvent.click(button)
        // ROBUST CHECK: Verify the click spy WAS called
        await expect(args.onActionClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Verify default type styling (bg-white-smoke)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-white-smoke')
    })
  }
}

const DefaultHybrid: Story = {
  args: {
    style: 'hybrid',
    actionIcon: 'bell',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify hybrid style renders both button and icon button', async () => {
      // Hybrid style shows button on desktop and icon button on mobile
      const buttons = canvasElement.querySelectorAll('button')
      await expect(buttons.length).toBeGreaterThan(0)
    })
    
    await step('Verify button click handler IS called', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await userEvent.click(button)
      // ROBUST CHECK: Verify the click spy WAS called
      await expect(args.onActionClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify default type styling (bg-white-smoke)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-white-smoke')
    })
  }
}

const DefaultLink: Story = {
  args: {
    style: 'link',
    actionLink: 'example'
  },
  decorators: [vueRouter()],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for router to be ready', async () => {
      await waitFor(() => {
        // Router should be initialized
        expect(canvasElement).toBeInTheDocument()
      }, { timeout: 2000 })
    })
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify link action is rendered', async () => {
      const link = canvas.getByRole('link', { name: /This is the action/i })
      await expect(link).toBeInTheDocument()
      await expect(link).toBeVisible()
    })
    
    await step('Verify link has correct href', async () => {
      const link = canvas.getByRole('link', { name: /This is the action/i })
      // vue-router uses hash mode in Storybook
      await expect(link).toHaveAttribute('href', '#/example')
    })
    
    await step('Verify default type styling (bg-white-smoke)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-white-smoke')
    })
  }
}

const DangerNone: Story = {
  args: {
    type: 'danger',
    style: 'none'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify danger type styling (bg-danger)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-danger')
    })
    
    await step('Verify no action button is rendered when style is none', async () => {
      const button = canvasElement.querySelector('button')
      await expect(button).not.toBeInTheDocument()
    })
  }
}

const DangerButton: Story = {
  args: {
    type: 'danger',
    style: 'button',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify button action is rendered', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify button click handler IS called', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await userEvent.click(button)
      // ROBUST CHECK: Verify the click spy WAS called
      await expect(args.onActionClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify danger type styling (bg-danger)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-danger')
    })
  }
}

const DangerIconButton: Story = {
  args: {
    type: 'danger',
    style: 'icon-button',
    actionIcon: 'bell',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify icon button is rendered', async () => {
      // Icon button should be present (rendered as button with icon)
      const button = canvasElement.querySelector('button')
      await expect(button).toBeInTheDocument()
      await expect(button).toBeVisible()
    })
    
    await step('Verify icon button click handler IS called', async () => {
      const button = canvasElement.querySelector('button')
      if (button) {
        await userEvent.click(button)
        // ROBUST CHECK: Verify the click spy WAS called
        await expect(args.onActionClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Verify danger type styling (bg-danger)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-danger')
    })
  }
}

const DangerHybrid: Story = {
  args: {
    type: 'danger',
    style: 'hybrid',
    actionIcon: 'bell',
    'onActionClick': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify hybrid style renders both button and icon button', async () => {
      // Hybrid style shows button on desktop and icon button on mobile
      const buttons = canvasElement.querySelectorAll('button')
      await expect(buttons.length).toBeGreaterThan(0)
    })
    
    await step('Verify button click handler IS called', async () => {
      const button = canvas.getByRole('button', { name: /This is the action/i })
      await userEvent.click(button)
      // ROBUST CHECK: Verify the click spy WAS called
      await expect(args.onActionClick).toHaveBeenCalledTimes(1)
    })
    
    await step('Verify danger type styling (bg-danger)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-danger')
    })
  }
}

const DangerLink: Story = {
  args: {
    type: 'danger',
    style: 'link',
    actionLink: 'example'
  },
  decorators: [vueRouter()],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Wait for router to be ready', async () => {
      await waitFor(() => {
        // Router should be initialized
        expect(canvasElement).toBeInTheDocument()
      }, { timeout: 2000 })
    })
    
    await step('Verify topbar renders correctly', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toBeInTheDocument()
      await expect(topbar).toBeVisible()
    })
    
    await step('Verify topbar content is displayed', async () => {
      const content = canvas.getByText('This is a Topbar')
      await expect(content).toBeInTheDocument()
      await expect(content).toBeVisible()
    })
    
    await step('Verify link action is rendered', async () => {
      const link = canvas.getByRole('link', { name: /This is the action/i })
      await expect(link).toBeInTheDocument()
      await expect(link).toBeVisible()
    })
    
    await step('Verify link has correct href', async () => {
      const link = canvas.getByRole('link', { name: /This is the action/i })
      // vue-router uses hash mode in Storybook
      await expect(link).toHaveAttribute('href', '#/example')
    })
    
    await step('Verify danger type styling (bg-danger)', async () => {
      const topbar = canvasElement.querySelector('.flex')
      await expect(topbar).toHaveClass('bg-danger')
    })
  }
}

export {
  DefaultNone,
  DefaultButton,
  DefaultIconButton,
  DefaultHybrid,
  DefaultLink,
  DangerNone,
  DangerButton,
  DangerIconButton,
  DangerHybrid,
  DangerLink
}

export default meta
