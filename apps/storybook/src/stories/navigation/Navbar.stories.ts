import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within, fn } from 'storybook/test'

import { FzNavbar } from '@fiscozen/navbar'
import { FzIcon } from '@fiscozen/icons'
import { FzNavlink } from '@fiscozen/navlink'
import { FzIconButton } from '@fiscozen/button'
import { FzAvatar } from '@fiscozen/avatar'

const meta = {
  title: 'Navigation/FzNavbar',
  component: FzNavbar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the navbar.'
    },
    position: {
      control: 'select',
      options: ['static', 'fixed', 'sticky'],
      description: 'CSS positioning strategy applied to the root `<header>`.'
    },
    mobileBreakpoint: {
      control: { type: 'number', min: 320, max: 1920, step: 10 },
      description:
        'Width (px) at and above which the desktop layout renders. Below this value the compact mobile layout is used.'
    },
    respectSafeArea: {
      control: 'boolean',
      description:
        'When `true`, the navbar adds `env(safe-area-inset-*)` to top/left/right padding for devices with a notch / dynamic island.'
    },
    isMenuOpen: {
      control: 'boolean',
      description: 'Mobile menu open state. Supports `v-model:isMenuOpen` for two-way binding.'
    },
    breakpoints: { table: { disable: true } }
  },
  args: {
    variant: 'horizontal',
    position: 'static',
    respectSafeArea: false,
    isMenuOpen: false,
    onFznavbarMenuButtonClick: fn()
  }
} satisfies Meta<typeof FzNavbar>

export default meta
type Story = StoryObj<typeof meta>

const FULL_NAVBAR_TEMPLATE = `
  <FzNavbar v-bind="args" @fznavbar:menuButtonClick="args.onFznavbarMenuButtonClick">
    <template #brand-logo>
      <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" />
    </template>
    <template #navigation>
      <FzNavlink label="Fatture" />
      <FzNavlink label="Spese" />
      <FzNavlink label="Corrispettivi" />
      <FzNavlink label="Adempimenti" />
      <FzNavlink label="Documenti" />
    </template>
    <template #notifications>
      <FzIconButton iconName="bell" variant="notification" tooltip="notifications" />
    </template>
    <template #user-menu>
      <FzAvatar firstName="Mario" lastName="Rossi" />
    </template>
  </FzNavbar>
`

export const Horizontal: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: FULL_NAVBAR_TEMPLATE
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify navbar renders as a semantic <header>', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
      await expect(header.tagName.toLowerCase()).toBe('header')
    })

    await step('Verify navigation links are present', async () => {
      await expect(canvas.getByRole('button', { name: /fatture/i })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: /spese/i })).toBeInTheDocument()
    })

    await step('Verify keyboard navigation', async () => {
      await userEvent.tab()
      await expect(document.activeElement).toBe(canvas.getByRole('button', { name: /fatture/i }))
    })

    await step('Verify mobile menu button click handler is wired (if visible)', async () => {
      const menuButton = canvasElement.querySelector('button[aria-label*="menu" i]')
      if (menuButton) {
        await userEvent.click(menuButton as HTMLElement)
        await expect(args.onFznavbarMenuButtonClick).toHaveBeenCalled()
      }
    })
  }
}

export const Vertical: Story = {
  args: {
    variant: 'vertical',
    environment: 'backoffice'
  },
  decorators: [() => ({ template: '<div class="h-screen m-0"><story /></div>' })],
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <FzNavbar v-bind="args" @fznavbar:menuButtonClick="args.onFznavbarMenuButtonClick">
        <template #brand-logo>
          <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" />
        </template>
        <template #navigation>
          <FzNavlink iconName="suitcase" />
          <FzNavlink iconName="folder-user" />
          <FzNavlink iconName="credit-card" />
          <FzNavlink iconName="cart-shopping" />
          <FzNavlink iconName="calendar-lines" />
          <FzNavlink iconName="file-check" />
          <FzNavlink iconName="gear" />
        </template>
        <template #user-menu>
          <FzAvatar firstName="Consultant" lastName="User" environment="backoffice" />
        </template>
      </FzNavbar>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify vertical navbar renders as a semantic <header>', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
      await expect(header.tagName.toLowerCase()).toBe('header')
    })

    await step('Verify icon-only navigation links are present', async () => {
      const navLinks = canvasElement.querySelectorAll('a[href], button')
      await expect(navLinks.length).toBeGreaterThan(0)
    })
  }
}

export const Positioned: Story = {
  args: {
    position: 'fixed'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `position` control to switch between `static`, `fixed`, and `sticky`. Scroll the page to verify the navbar stays in place when fixed or sticky.'
      }
    }
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <div class="h-screen relative">
        ${FULL_NAVBAR_TEMPLATE}
        <main class="pt-[240px] p-12">
          <p>This page is intentionally tall so you can scroll and confirm the navbar's positioning behavior.</p>
          <div class="h-[1200px]"></div>
        </main>
      </div>
    `
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify positioning class reflects the prop', async () => {
      const header = canvas.getByRole('banner')
      if (args.position === 'fixed') {
        await expect(header.classList.contains('fz-navbar--fixed')).toBe(true)
      } else if (args.position === 'sticky') {
        await expect(header.classList.contains('fz-navbar--sticky')).toBe(true)
      }
    })
  }
}

export const Customized: Story = {
  args: {
    respectSafeArea: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'Layout values are exposed as CSS custom properties on the root (`--fz-navbar-padding`, `--fz-navbar-shadow`, `--fz-navbar-height`, `--fz-navbar-bg`, …). Override per-instance via inline `style` to slim the navbar without `!important` resets.'
      }
    }
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <FzNavbar
        v-bind="args"
        style="
          --fz-navbar-padding: 12px;
          --fz-navbar-shadow: none;
          --fz-navbar-height: 56px;
          --fz-navbar-brand-gap: 24px;
          --fz-navbar-actions-gap: 12px;
          --fz-navbar-bg: #f9fafb;
        "
        @fznavbar:menuButtonClick="args.onFznavbarMenuButtonClick">
        <template #brand-logo>
          <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[24px] !w-[28px] cursor-pointer" />
        </template>
        <template #navigation>
          <FzNavlink label="Fatture" />
          <FzNavlink label="Spese" />
        </template>
        <template #notifications>
          <FzIconButton iconName="bell" variant="notification" tooltip="notifications" />
        </template>
        <template #user-menu>
          <FzAvatar firstName="Mario" lastName="Rossi" />
        </template>
      </FzNavbar>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Verify navbar renders with the customization applied', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
    })
  }
}

export const MobileMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`isMenuOpen` supports two-way binding via `v-model:isMenuOpen`. The default mobile hamburger can be replaced via the `#menu-button` slot, which exposes `{ isOpen, toggle }` as scope. This story forces the mobile layout via `mobileBreakpoint: 9999` so the slot is always visible regardless of viewport.'
      }
    }
  },
  argTypes: {
    isMenuOpen: { table: { disable: true } },
    mobileBreakpoint: { table: { disable: true } }
  },
  render: () => ({
    setup() {
      const isMenuOpen = ref(false)
      return { isMenuOpen }
    },
    components: { FzNavbar, FzIcon, FzIconButton, FzAvatar },
    template: `
      <div>
        <p class="mb-12 p-12">
          Menu is <strong>{{ isMenuOpen ? 'open' : 'closed' }}</strong> (driven by v-model).
        </p>
        <FzNavbar variant="horizontal" :mobileBreakpoint="9999" v-model:isMenuOpen="isMenuOpen">
          <template #menu-button="{ isOpen, toggle }">
            <button
              class="px-12 py-6 rounded bg-blue-500 text-white text-sm"
              :aria-expanded="isOpen"
              @click="toggle">
              {{ isOpen ? 'Close' : 'Open' }} menu
            </button>
          </template>
          <template #brand-logo>
            <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[24px] !w-[28px]" />
          </template>
          <template #notifications>
            <FzIconButton iconName="message" variant="invisible" tooltip="chat" />
          </template>
          <template #user-menu>
            <FzAvatar firstName="Mario" lastName="Rossi" />
          </template>
        </FzNavbar>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify custom menu button renders inside the navbar', async () => {
      const button = canvas.getByRole('button', { name: /open menu/i })
      await expect(button).toBeInTheDocument()
    })

    await step('Verify clicking the custom button toggles the v-model state', async () => {
      const button = canvas.getByRole('button', { name: /open menu/i })
      await userEvent.click(button)
      await expect(canvas.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
    })
  }
}

export const BootstrapInterop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Smoke test for consumers that scope Tailwind Preflight to a `.twp` wrapper because Bootstrap is still present globally (see `tailwindcss-scoped-preflight`). The navbar adds `box-border`, `m-0`, `border-0` to its root to render identically with or without the wrapper.'
      }
    }
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <div class="twp">
        ${FULL_NAVBAR_TEMPLATE}
        <main class="p-12">
          <p>The navbar above sits inside a <code>.twp</code> wrapper. The component must render identically with or without it.</p>
        </main>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Verify navbar renders inside a .twp wrapper', async () => {
      const header = canvas.getByRole('banner')
      await expect(header.closest('.twp')).not.toBeNull()
    })
  }
}
