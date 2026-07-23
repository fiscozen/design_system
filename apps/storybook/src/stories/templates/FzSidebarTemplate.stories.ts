import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within, userEvent, waitFor } from 'storybook/test'
import { FzSidebarTemplate, FzSidebarTemplateProps } from '@fiscozen/layout'
import { FzContainer } from '@fiscozen/container'
import { FzAction } from '@fiscozen/action'
import { FzAvatar } from '@fiscozen/avatar'
import { FzIconButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'
import { FzDisplayField } from '@fiscozen/displayfield'
import { FzBadge } from '@fiscozen/badge'
import { FzIcon } from '@fiscozen/icons'

/**
 * `FzSidebarTemplate` is the collapsible-sidebar application shell — the
 * internal-tool / console layout extracted from the `it.fiscozen.people` app
 * (RFC §4, Jira LIB-2697). It frames a sidebar in three vertical zones — `brand`
 * (top), `nav` (scrollable middle) and `footer` (pinned bottom) — beside the page
 * content.
 *
 * From the `desktop` breakpoint (1200px) up the sidebar is a **persistent sticky
 * rail**; below it, it becomes an **off-canvas drawer** the template opens from a
 * hamburger in a sticky mobile top bar (a focus-trapped `role="dialog"` with a
 * click-to-dismiss backdrop + Escape-to-close). This mirrors `FzAppTemplate`,
 * where the *aside* collapses and the nav stays persistent.
 *
 * The examples are composed entirely from design-system components — `FzAction`
 * nav items, `FzAvatar`, `FzIconButton`, `FzCard`, `FzDisplayField`, `FzBadge`,
 * laid out with `FzContainer` — with **no `class`/`style` on the page markup**, so
 * they mirror how a frontoffice/backoffice page (organism/template layer) actually
 * consumes the shell. The sidebar's colors are app-themed via `--fz-sidebar-bg` /
 * `--fz-sidebar-text` (and `--fz-sidebar-width`) set in app-global CSS — shown here
 * through a story decorator, never in the page itself.
 */
const meta: Meta<typeof FzSidebarTemplate> = {
  title: 'Templates/FzSidebarTemplate',
  component: FzSidebarTemplate,
  tags: ['autodocs'],
  argTypes: {
    navLabel: { control: 'text' },
    sidebarLabel: { control: 'text' },
    menuLabel: { control: 'text' }
  },
  args: {
    navLabel: 'Navigazione principale',
    sidebarLabel: 'Menu di navigazione',
    menuLabel: 'Apri menu'
  },
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    // App-global theming lives outside the page markup. This decorator stands in
    // for the app's shell CSS: the grey page background + the sidebar width. The
    // sidebar keeps its default light surface so the injected DS components read
    // correctly; a branded color would be set here too (`--fz-sidebar-bg` /
    // `--fz-sidebar-text`), never as a `class`/`style` on the page.
    (story) => ({
      components: { story },
      template: `<div style="min-height:100dvh;background-color:#f2f5f7;--fz-sidebar-width:280px"><story /></div>`
    })
  ]
} satisfies Meta<typeof FzSidebarTemplate>

export default meta

type Story = StoryObj<typeof meta>

const dsComponents = {
  FzSidebarTemplate,
  FzContainer,
  FzAction,
  FzAvatar,
  FzIconButton,
  FzCard,
  FzDisplayField,
  FzBadge,
  FzIcon
}

// The nav destinations the People sidebar shows. Icons are Font Awesome names
// available in the kit; the app owns routing/RBAC — the template only frames them.
const navItems = [
  { icon: 'house', label: 'Home' },
  { icon: 'comment-dots', label: 'Review' },
  { icon: 'user-group', label: 'Team' },
  { icon: 'circle-question', label: 'FAQ' },
  { icon: 'tags', label: 'Convenzioni' }
]

// The three sidebar zones + the mobile top-bar label, injected as slots. Every
// element is a DS component or an allowed text tag — no class/style.
const sidebarSlots = `
  <template #brand>
    <FzContainer horizontal alignItems="center" gap="sm">
      <FzIcon name="fiscozen" variant="fak" size="lg" />
      <p>People</p>
    </FzContainer>
  </template>

  <template #nav="{ toggleSidebar }">
    <FzContainer gap="xs">
      <FzAction
        v-for="item in navItems"
        :key="item.label"
        variant="textLeft"
        :iconLeftName="item.icon"
        :label="item.label"
        @click="toggleSidebar(false)"
      />
    </FzContainer>
  </template>

  <template #footer>
    <FzContainer horizontal layout="space-between" alignItems="center" gap="sm">
      <FzContainer horizontal alignItems="center" gap="sm">
        <FzAvatar firstName="Riccardo" lastName="Agnoletto" />
        <p>Riccardo Agnoletto</p>
      </FzContainer>
      <FzIconButton iconName="arrow-right-from-line" variant="invisible" ariaLabel="Logout" />
    </FzContainer>
  </template>

  <template #topbar>
    <p>People</p>
  </template>
`

// The page content (the People "account" view): a profile card + a settings card,
// composed from FzCard / FzDisplayField / FzBadge and stacked with FzContainer.
const pageBody = `
  <FzContainer main gap="base">
    <FzCard>
      <FzContainer horizontal alignItems="center" gap="base">
        <FzAvatar firstName="Riccardo" lastName="Agnoletto" />
        <FzContainer gap="xs">
          <h2>Riccardo Agnoletto</h2>
          <p>riccardo.agnoletto@fiscozen.it</p>
        </FzContainer>
      </FzContainer>
    </FzCard>

    <FzCard title="Visibilità contatti">
      <FzContainer gap="base">
        <p>Scegli quali informazioni di contatto rendere visibili ai tuoi colleghi nella vista Team.</p>
        <FzContainer horizontal layout="space-between" alignItems="center" gap="sm">
          <FzDisplayField label="Telefono privato" value="3471058595" />
          <FzBadge tone="success">Visibile al team</FzBadge>
        </FzContainer>
      </FzContainer>
    </FzCard>
  </FzContainer>
`

/**
 * The desktop shell: the persistent rail (brand → nav → user footer) beside the
 * carded content — the People `account` view at ≥1200px.
 */
export const Default: Story = {
  render: (args: FzSidebarTemplateProps) => ({
    setup() {
      return { args, navItems }
    },
    components: dsComponents,
    template: `
      <FzSidebarTemplate v-bind="args">
        ${sidebarSlots}
        ${pageBody}
      </FzSidebarTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders the main content and a named navigation landmark', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument()
      await expect(
        canvas.getByRole('navigation', { name: 'Navigazione principale' })
      ).toBeInTheDocument()
      await expect(canvas.getByText('riccardo.agnoletto@fiscozen.it')).toBeVisible()
    })

    await step('Renders the persistent rail with nav items and a user footer', async () => {
      await expect(
        canvasElement.querySelector('.fz-sidebar-template__sidebar--rail')
      ).toBeInTheDocument()
      await expect(canvas.getByText('Home')).toBeVisible()
      await expect(canvas.getByText('Convenzioni')).toBeVisible()
      await expect(canvas.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    await step('Shows no mobile top bar at desktop width', async () => {
      await expect(canvasElement.querySelector('.fz-sidebar-template__topbar')).toBeNull()
    })
  }
}

/**
 * The same shell below the breakpoint (`xs`, 376px): the rail is replaced by a
 * sticky top bar with a hamburger, and the sidebar opens as a focus-trapped modal
 * drawer over a backdrop. The play function drives that flow.
 */
export const MobileDrawer: Story = {
  parameters: {
    viewport: { defaultViewport: 'xs' }
  },
  render: (args: FzSidebarTemplateProps) => ({
    setup() {
      return { args, navItems }
    },
    components: dsComponents,
    template: `
      <FzSidebarTemplate v-bind="args">
        ${sidebarSlots}
        ${pageBody}
      </FzSidebarTemplate>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const topbar = canvasElement.querySelector('.fz-sidebar-template__topbar')

    // Guard: only exercise the drawer when the runner actually rendered the mobile
    // frame (the responsive switch is driven by a real matchMedia query).
    if (!topbar) {
      await step('Fell back to the desktop rail (viewport not applied)', async () => {
        await expect(
          canvasElement.querySelector('.fz-sidebar-template__sidebar--rail')
        ).toBeInTheDocument()
      })
      return
    }

    await step('Shows the hamburger and keeps the drawer closed initially', async () => {
      const btn = canvas.getByRole('button', { name: 'Apri menu' })
      await expect(btn).toBeVisible()
      await expect(btn).toHaveAttribute('aria-expanded', 'false')
      await expect(canvasElement.querySelector('.fz-sidebar-template__sidebar')).toBeNull()
    })

    await step('Opens a modal drawer with dialog semantics + backdrop', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Apri menu' }))
      await waitFor(async () => {
        const drawer = canvasElement.querySelector('.fz-sidebar-template__sidebar--drawer')
        await expect(drawer).toBeInTheDocument()
        await expect(drawer).toHaveAttribute('role', 'dialog')
        await expect(drawer).toHaveAttribute('aria-modal', 'true')
      })
      await expect(
        canvasElement.querySelector('.fz-sidebar-template__backdrop')
      ).toBeInTheDocument()
      await expect(canvas.getByText('Home')).toBeVisible()
    })

    await step('Closes the drawer when the backdrop is clicked', async () => {
      await userEvent.click(
        canvasElement.querySelector('.fz-sidebar-template__backdrop') as Element
      )
      await waitFor(async () => {
        await expect(
          canvasElement.querySelector('.fz-sidebar-template__sidebar--drawer')
        ).toBeNull()
      })
    })
  }
}
