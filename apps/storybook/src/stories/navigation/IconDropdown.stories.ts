import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, within, userEvent, waitFor } from '@storybook/test'
import { FzIconDropdown } from '@fiscozen/dropdown'
import { vueRouter } from 'storybook-vue3-router'
import { FzAction, FzActionList, FzActionProps, FzActionSection, FzActionSectionProps } from '@fiscozen/action'

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
    type: 'action',
    label: 'This is a action'
  }
]

const meta: Meta<typeof FzIconDropdown> = {
  title: 'Navigation/FzIconDropdown',
  component: FzIconDropdown,
  tags: ['autodocs'],
  argTypes: {
    environment: {
      control: 'select',
      options: ['frontoffice', 'backoffice'],
      description: 'Size of the dropdown button based on the environment'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size of the dropdown button (deprecated)'
    },
    align: {
      control: 'select',
      options: ['left', 'right', 'center'],
      description: 'Alignment of the dropdown menu'
    },
    buttonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'invisible', 'notification'],
      description: 'Visual style variant of the icon button'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled'
    },
    closeOnActionClick: {
      control: 'boolean',
      description: 'Whether to close dropdown when an action is clicked'
    },
    iconName: {
      control: 'text',
      description: 'FontAwesome icon name'
    }
  },
  args: {
    actions,
    iconName: 'bars',
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
  args: {
    // 👇 Use fn() to spy on fzaction:click - accessible via args in play function
    onFzactionClick: fn(),
    // 👇 Use fn() to spy on isOpen v-model updates
    'onUpdate:isOpen': fn()
  },
  render: (args) => ({
    components: { FzIconDropdown },
    setup: () => ({ args }),
    template: `<FzIconDropdown v-bind="args" @fzaction:click="args.onFzactionClick" @update:isOpen="args['onUpdate:isOpen']" />`
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)

    await step('Verify icon button exists', async () => {
      const iconButton = canvas.getByRole('button')
      await expect(iconButton).toBeInTheDocument()
    })

    await step('Click to open dropdown and verify isOpen handler IS called', async () => {
      const iconButton = canvas.getByRole('button')
      await userEvent.click(iconButton)

      // ROBUST CHECK: Verify the isOpen spy WAS called with true
      await expect(args['onUpdate:isOpen']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:isOpen']).toHaveBeenCalledWith(true)

      // Wait for dropdown content to appear
      await waitFor(async () => {
        const dropdownContent = parentCanvas.getByText('This is a action')
        await expect(dropdownContent).toBeVisible()
      })
    })

    await step('Click action and verify fzaction:click handler IS called', async () => {
      // Find the action button (the last one is type 'action')
      const actionButton = parentCanvas.getByRole('button', { name: 'This is a action' })
      await userEvent.click(actionButton)

      // ROBUST CHECK: Verify the fzaction:click spy WAS called
      await expect(args.onFzactionClick).toHaveBeenCalledTimes(1)
      // Verify it was called with action index (3) and action object
      await expect(args.onFzactionClick).toHaveBeenCalledWith(
        3,
        expect.objectContaining({
          type: 'action',
          label: 'This is a action'
        })
      )
    })
  }
}

export const AlignLeft: Story = {
  args: {
    align: 'left'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)
    const iconButton = canvas.getByRole('button')

    await userEvent.click(iconButton)

    await waitFor(async () => {
      const dropdownContent = parentCanvas.queryByText('This is a router-nav-link to /foo')
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
    const parentCanvas = within(canvasElement.parentElement!)
    const iconButton = canvas.getByRole('button')

    await userEvent.click(iconButton)

    await waitFor(async () => {
      const dropdownContent = parentCanvas.queryByText('This is a router-nav-link to /baz')
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
    disabled: true,
    // 👇 For disabled state, verify handlers are NOT called
    onFzactionClick: fn(),
    'onUpdate:isOpen': fn()
  },
  render: (args) => ({
    components: { FzIconDropdown },
    setup: () => ({ args }),
    template: `<FzIconDropdown v-bind="args" @fzaction:click="args.onFzactionClick" @update:isOpen="args['onUpdate:isOpen']" />`
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)
    const button = canvas.getByRole('button')

    await step('Verify button is disabled', async () => {
      await expect(button).toBeDisabled()
    })

    await step('Verify update:isOpen is NOT called when clicking disabled button', async () => {
      // Try to click (should not work)
      await userEvent.click(button)

      // ROBUST CHECK: Verify the isOpen spy was NOT called
      await expect(args['onUpdate:isOpen']).not.toHaveBeenCalled()

      // Verify dropdown did not open
      const dropdownContent = parentCanvas.queryByText('This is a action')
      await expect(dropdownContent).not.toBeVisible()
    })
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
    ],
    // 👇 Use fn() to spy on fzaction:click
    onFzactionClick: fn()
  },
  render: (args) => ({
    components: { FzIconDropdown },
    setup: () => ({ args }),
    template: `<FzIconDropdown v-bind="args" @fzaction:click="args.onFzactionClick" />`
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)
    const iconButton = canvas.getByRole('button')

    await step('Open dropdown and verify sections are displayed', async () => {
      await userEvent.click(iconButton)

      await waitFor(async () => {
        const navigationSection = parentCanvas.queryByText('Navigation')
        await expect(navigationSection).toBeInTheDocument()

        const actionsSection = parentCanvas.queryByText('Actions')
        await expect(actionsSection).toBeInTheDocument()
      })
    })

    await step('Click action and verify fzaction:click handler IS called', async () => {
      // Find the Logout action button
      const logoutButton = parentCanvas.getByRole('button', { name: 'Logout' })
      await userEvent.click(logoutButton)

      // ROBUST CHECK: Verify the fzaction:click spy WAS called
      await expect(args.onFzactionClick).toHaveBeenCalledTimes(1)
      // Verify it was called with action index (4) and action object
      await expect(args.onFzactionClick).toHaveBeenCalledWith(
        4,
        expect.objectContaining({
          type: 'action',
          label: 'Logout'
        })
      )
    })
  }
}

export const DifferentIcons: Story = {
  args: {
    iconName: 'ellipsis-vertical'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)
    const iconButton = canvas.getByRole('button')

    // Verify button renders with different icon
    await expect(iconButton).toBeInTheDocument()

    await userEvent.click(iconButton)

    await waitFor(async () => {
      const dropdownContent = parentCanvas.queryByText('This is a router-nav-link to /foo')
      await expect(dropdownContent).toBeVisible()
    })
  }
}

export const Frontoffice: Story = {
  args: {
    environment: 'frontoffice'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify button has frontoffice size
    await expect(button).toBeInTheDocument()
  }
}

export const Backoffice: Story = {
  args: {
    environment: 'backoffice'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify button has backoffice size
    await expect(button).toBeInTheDocument()
  }
}

export const WithCustomActionListSlot: Story = {
  render: (args) => ({
    components: { FzIconDropdown, FzActionList, FzAction, FzActionSection },
    setup() {
      return { args }
    },
    template: `
      <FzIconDropdown v-bind="args">
        <template #actionList>
          <FzActionList>
            <FzActionSection label="Custom Action List">
              <FzAction label="Custom Action 1" iconName="smile" @click="() => console.log('Custom Action 1')" />
              <FzAction label="Custom Action 2" iconName="smile" @click="() => console.log('Custom Action 2')" />
              <FzAction label="Custom Action 3" iconName="smile" @click="() => console.log('Custom Action 3')" />
            </FzActionSection>
          </FzActionList>
        </template>
      </FzIconDropdown>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parentCanvas = within(canvasElement.parentElement!)
    const iconButton = canvas.getByRole('button')

    await userEvent.click(iconButton)

    await waitFor(async () => {
      const customContent = parentCanvas.queryByText('Custom Action List')
      await expect(customContent).toBeVisible()
    })
  }
}

export default meta
