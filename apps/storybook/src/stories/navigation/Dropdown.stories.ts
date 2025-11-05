import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent, waitFor } from '@storybook/test'
import { FzDropdown } from '@fiscozen/dropdown'
import { vueRouter } from 'storybook-vue3-router'
import { FzActionProps, FzActionSectionProps } from '@fiscozen/action'

const actions: (FzActionProps | FzActionSectionProps & { type: 'section' })[] = [
  {
    type: 'link',
    label: 'This is a router-nav-link to /foo',
    to: '/foo',
    meta: {
      path: '/foo',
      name: 'foo'
    }
  },
  {
    type: 'link',
    label: 'This is a router-nav-link to /bar',
    to: '/bar',
    meta: {
      path: '/bar',
      name: 'bar'
    }
  },
  {
    type: 'link',
    label: 'This is a router-nav-link to /baz',
    to: '/baz',
    meta: {
      path: '/baz',
      name: 'baz'
    }
  },
  {
    type: 'action' as const,
    label: 'This is a action'
  }
]

const meta: Meta<typeof FzDropdown> = {
  title: 'Navigation/FzDropdown',
  component: FzDropdown,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size of the dropdown button (deprecated)'
    },
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Alignment of the dropdown menu'
    },
    buttonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'invisible'],
      description: 'Visual style variant of the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled'
    },
    closeOnActionClick: {
      control: 'boolean',
      description: 'Whether to close dropdown when an action is clicked'
    }
  },
  args: {
    actions,
    default: 'This is a dropdown',
    closeOnActionClick: true,
    disabled: false
  },
  decorators: [
    vueRouter(),
    () => ({
      template: '<div class="h-screen flex justify-center items-start pt-20"><story/></div>'
    })
  ]
}

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find the dropdown button
    const dropdownButton = canvas.getByRole('button')
    await expect(dropdownButton).toBeInTheDocument()

    // Verify button has correct text
    await expect(dropdownButton).toHaveTextContent('This is a dropdown')

    // Click to open dropdown
    await userEvent.click(dropdownButton)

    // Wait for dropdown content to appear
    await waitFor(async () => {
      const dropdownContent = canvas.queryByText('This is a router-nav-link to /foo')
      await expect(dropdownContent).toBeVisible()
    })
  }
}

export const AlignLeft: Story = {
  args: {
    align: 'left'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dropdownButton = canvas.getByRole('button')

    await userEvent.click(dropdownButton)

    await waitFor(async () => {
      const dropdownContent = canvas.queryByText('This is a router-nav-link to /foo')
      await expect(dropdownContent).toBeVisible()
    })
  }
}

export const AlignRight: Story = {
  args: {
    align: 'right'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dropdownButton = canvas.getByRole('button')

    await userEvent.click(dropdownButton)

    await waitFor(async () => {
      const dropdownContent = canvas.queryByText('This is a router-nav-link to /baz')
      await expect(dropdownContent).toBeVisible()
    })
  }
}

export const Primary: Story = {
  args: {
    buttonVariant: 'primary'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify primary variant classes
    await expect(button.classList.contains('bg-blue-500')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
  }
}

export const Secondary: Story = {
  args: {
    buttonVariant: 'secondary'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify secondary variant classes
    await expect(button.classList.contains('bg-core-white')).toBe(true)
    await expect(button.classList.contains('!border-grey-200')).toBe(true)
    await expect(button.classList.contains('text-grey-500')).toBe(true)
  }
}

export const Danger: Story = {
  args: {
    buttonVariant: 'danger'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify danger variant classes
    await expect(button.classList.contains('bg-semantic-error-200')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
  }
}

export const Success: Story = {
  args: {
    buttonVariant: 'success'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify success variant classes
    await expect(button.classList.contains('bg-semantic-success-200')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
  }
}

export const Invisible: Story = {
  args: {
    buttonVariant: 'invisible'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify invisible variant classes
    await expect(button.classList.contains('bg-transparent')).toBe(true)
    await expect(button.classList.contains('border-transparent')).toBe(true)
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify button is disabled
    await expect(button).toBeDisabled()

    // Try to click (should not work)
    await userEvent.click(button)

    // Verify dropdown did not open
    const dropdownContent = canvas.queryByText('This is a action')
    await expect(dropdownContent).not.toBeVisible()
  }
}

export const WithSections: Story = {
  args: {
    actions: [
      {
        type: 'section',
        label: 'Navigation'
      } as FzActionSectionProps & { type: 'section' },
      {
        type: 'link',
        label: 'Home',
        to: '/home',
        meta: { path: '/home', name: 'home' }
      },
      {
        type: 'link',
        label: 'About',
        to: '/about',
        meta: { path: '/about', name: 'about' }
      },
      {
        type: 'section',
        label: 'Actions'
      } as FzActionSectionProps & { type: 'section' },
      {
        type: 'action',
        label: 'Logout'
      }
    ]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dropdownButton = canvas.getByRole('button')

    await userEvent.click(dropdownButton)

    await waitFor(async () => {
      const navigationSection = canvas.queryByText('Navigation')
      await expect(navigationSection).toBeInTheDocument()

      const actionsSection = canvas.queryByText('Actions')
      await expect(actionsSection).toBeInTheDocument()
    })
  }
}

export default meta
