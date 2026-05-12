import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { vueRouter } from 'storybook-vue3-router'
import { useRoute } from 'vue-router'
import { FzRouterBreadcrumbs } from '@fiscozen/breadcrumbs'
import type { Breadcrumb, CustomRouteLocation } from '@fiscozen/breadcrumbs'

const ROUTER_READY_TIMEOUT = 2000

/**
 * Nested route structure: home > products > detail.
 * Used both for automatic generation and manual stories.
 */
const routes = [
  {
    name: 'home',
    path: '/',
    component: { template: '<router-view />' },
    children: [
      {
        name: 'products',
        path: '/products',
        component: { template: '<router-view />' },
        children: [
          {
            name: 'detail',
            path: '/products/detail',
            component: { template: '<div />' }
          }
        ]
      }
    ]
  }
]

const breadcrumbs: Breadcrumb<CustomRouteLocation>[] = [
  { id: 'home', label: 'Home', metadata: { path: '/', name: 'home' } },
  { id: 'products', label: 'Products', metadata: { path: '/products', name: 'products' } },
  { id: 'detail', label: 'Detail', metadata: { path: '/products/detail', name: 'detail' } }
]

/** Used only in ClickNavigation to show the active route after navigation. */
const CurrentPage = {
  setup() {
    const route = useRoute()
    return { route }
  },
  template:
    '<p class="mt-8 text-sm text-grey-500">Current page: <strong>{{ route.name }}</strong></p>'
}

const getBreadcrumbsContainer = (canvasElement: HTMLElement): HTMLElement => {
  const nav = canvasElement.querySelector('nav[aria-label]')
  if (!nav) throw new Error('Breadcrumbs <nav> landmark not found')
  return nav as HTMLElement
}

const waitForBreadcrumbs = async (canvasElement: HTMLElement): Promise<HTMLElement> =>
  waitFor(
    () => {
      const nav = canvasElement.querySelector('nav[aria-label]')
      expect(nav).toBeInTheDocument()
      // Wait until route.matched has been resolved and at least one item is rendered
      expect(nav!.querySelectorAll('li').length).toBeGreaterThan(0)
      return nav as HTMLElement
    },
    { timeout: ROUTER_READY_TIMEOUT }
  )

const meta: Meta<typeof FzRouterBreadcrumbs> = {
  title: 'Navigation/FzBreadcrumbs/FzRouterBreadcrumbs',
  component: FzRouterBreadcrumbs,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * No props required: breadcrumbs are generated automatically from `route.matched`.
 * At `/products/detail` this produces: home › products › detail.
 */
export const Automatic: Story = {
  render: () => ({
    components: { FzRouterBreadcrumbs },
    template: `<FzRouterBreadcrumbs />`
  }),
  decorators: [vueRouter(routes, { initialRoute: '/products/detail' })],
  play: async ({ canvasElement, step }) => {
    await step('Wait for breadcrumb rendering', async () => {
      await waitForBreadcrumbs(canvasElement)
    })

    await step('Verify automatic generation from route.matched', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const canvas = within(nav)
      await expect(canvas.getByText('home')).toBeInTheDocument()
      await expect(canvas.getByText('products')).toBeInTheDocument()
      await expect(canvas.getByText('detail')).toBeInTheDocument()
    })

    await step('Verify non-active links are clickable', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const links = nav.querySelectorAll('a')
      // home and products are links; detail is a <span>
      await expect(links.length).toBe(2)
    })

    await step("Verify aria-current='page' on the last item", async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current).toBeInTheDocument()
      await expect(current!.tagName.toLowerCase()).toBe('span')
      await expect(current!.textContent?.trim()).toBe('detail')
    })
  }
}

/**
 * Breadcrumbs passed manually via the `breadcrumbs` prop.
 * Useful when the trail does not follow the route hierarchy.
 */
export const Manual: Story = {
  args: { breadcrumbs },
  decorators: [vueRouter(routes, { initialRoute: '/products/detail' })],
  play: async ({ canvasElement, step }) => {
    await step('Wait for breadcrumb rendering', async () => {
      await waitForBreadcrumbs(canvasElement)
    })

    await step('Verify labels passed via prop', async () => {
      const nav = within(getBreadcrumbsContainer(canvasElement))
      await expect(nav.getByText('Home')).toBeInTheDocument()
      await expect(nav.getByText('Products')).toBeInTheDocument()
      await expect(nav.getByText('Detail')).toBeInTheDocument()
    })

    await step('Verify non-active links have correct href attributes', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const links = nav.querySelectorAll('a')
      await expect(links.length).toBe(breadcrumbs.length - 1)
      await expect(links[0]).toHaveAttribute('href', '#/')
      await expect(links[1]).toHaveAttribute('href', '#/products')
    })

    await step("Verify aria-current='page' on the last non-interactive item", async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current).toBeInTheDocument()
      await expect(current!.tagName.toLowerCase()).toBe('span')
      await expect(current!.textContent?.trim()).toBe('Detail')
    })
  }
}

/**
 * Clicking a link triggers router navigation and updates the current page indicator.
 */
export const ClickNavigation: Story = {
  render: () => ({
    components: { FzRouterBreadcrumbs, CurrentPage },
    setup: () => ({ breadcrumbs }),
    template: `
      <FzRouterBreadcrumbs :breadcrumbs="breadcrumbs" />
      <CurrentPage />
    `
  }),
  decorators: [vueRouter(routes, { initialRoute: '/products/detail' })],
  play: async ({ canvasElement, step }) => {
    await step('Wait for breadcrumbs', async () => {
      await waitForBreadcrumbs(canvasElement)
    })

    await step('Click Home and verify navigation', async () => {
      const nav = within(getBreadcrumbsContainer(canvasElement))
      await userEvent.click(nav.getByRole('link', { name: /home/i }))
      await waitFor(
        () => {
          expect(canvasElement.querySelector('strong')?.textContent).toBe('home')
        },
        { timeout: ROUTER_READY_TIMEOUT }
      )
    })
  }
}

/**
 * Links are keyboard-navigable (Enter / Tab).
 */
export const KeyboardNavigation: Story = {
  args: { breadcrumbs },
  decorators: [vueRouter(routes, { initialRoute: '/products/detail' })],
  play: async ({ canvasElement, step }) => {
    await step('Wait for breadcrumbs', async () => {
      await waitForBreadcrumbs(canvasElement)
    })

    await step('Focus the first link and activate with Enter', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const firstLink = nav.querySelector('a') as HTMLElement
      firstLink.focus()
      await expect(document.activeElement).toBe(firstLink)
      await userEvent.keyboard('{Enter}')
    })

    await step('Tab to the second link', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const links = nav.querySelectorAll('a')
      if (links.length > 1) {
        await userEvent.tab()
        await expect(document.activeElement).toBe(links[1])
      }
    })
  }
}

/**
 * With 0 or 1 items the component renders nothing — intentional behaviour.
 */
export const EmptyOrSingle: Story = {
  render: () => ({
    components: { FzRouterBreadcrumbs },
    setup: () => ({
      one: [{ id: 'home', label: 'Home', metadata: { path: '/', name: 'home' } }]
    }),
    template: `
      <div id="fz-router-breadcrumbs-wrapper">
        <p class="text-grey-500 text-sm mb-4 italic">
          The component renders nothing with fewer than 2 items. The space below is intentionally empty.
        </p>
        <p class="text-grey-300 text-xs mb-1">1 item →</p>
        <FzRouterBreadcrumbs :breadcrumbs="one" />
      </div>
    `
  }),
  decorators: [vueRouter(routes, { initialRoute: '/' })],
  play: async ({ canvasElement, step }) => {
    await step('Wait for component mounting', async () => {
      await waitFor(
        () => {
          expect(canvasElement.querySelector('#fz-router-breadcrumbs-wrapper')).toBeInTheDocument()
        },
        { timeout: ROUTER_READY_TIMEOUT }
      )
    })

    await step('Verify nothing is rendered with 1 item', async () => {
      await expect(canvasElement.querySelector('nav')).toBeNull()
    })
  }
}

/**
 * Verifies ARIA structure: nav landmark, ol list, aria-current, and aria-hidden separators.
 */
export const Accessibility: Story = {
  args: { breadcrumbs },
  decorators: [vueRouter(routes, { initialRoute: '/products/detail' })],
  play: async ({ canvasElement, step }) => {
    await step('Verify <nav> landmark with aria-label', async () => {
      const nav = await waitForBreadcrumbs(canvasElement)
      await expect(nav.getAttribute('aria-label')).toBe('Breadcrumb')
      await expect(nav.querySelector('ol')).toBeInTheDocument()
    })

    await step("Verify aria-current='page' on the last item", async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current).toBeInTheDocument()
      await expect(current!.textContent?.trim()).toBe('Detail')
    })

    await step('Verify separators are hidden from AT via aria-hidden', async () => {
      const nav = getBreadcrumbsContainer(canvasElement)
      const hidden = nav.querySelectorAll('[aria-hidden="true"]')
      await expect(hidden.length).toBe(breadcrumbs.length - 1)
    })
  }
}
