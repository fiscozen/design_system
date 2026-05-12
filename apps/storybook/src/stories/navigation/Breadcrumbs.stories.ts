import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzBreadcrumbs } from '@fiscozen/breadcrumbs'

const meta = {
  title: 'Navigation/FzBreadcrumbs/FzBreadcrumbs',
  component: FzBreadcrumbs,
  tags: ['autodocs']
} satisfies Meta

export default meta
type Story = StoryObj

const defaultBreadcrumbs = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'current', label: 'Current page' }
]

/**
 * Default rendering: non-active labels are styled divs.
 * Use the `bread-label` slot to inject navigable links (see `WithCustomLinks`).
 */
export const Default: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({ breadcrumbs: defaultBreadcrumbs }),
    template: `<FzBreadcrumbs :breadcrumbs="breadcrumbs" />`
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify nav landmark and ol/li structure', async () => {
      const nav = canvasElement.querySelector('nav[aria-label="Breadcrumb"]')
      await expect(nav).toBeInTheDocument()
      await expect(nav!.querySelector('ol')).toBeInTheDocument()
      await expect(nav!.querySelectorAll('li').length).toBe(defaultBreadcrumbs.length)
    })

    await step('Verify breadcrumb labels', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Home')).toBeInTheDocument()
      await expect(canvas.getByText('Products')).toBeInTheDocument()
      await expect(canvas.getByText('Current page')).toBeInTheDocument()
    })

    await step('Verify aria-current="page" on the last item', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current).toBeInTheDocument()
      await expect(current!.textContent?.trim()).toBe('Current page')
    })

    await step('Verify separators between items (not after the last)', async () => {
      const separators = canvasElement.querySelectorAll('[aria-hidden="true"]')
      await expect(separators.length).toBe(defaultBreadcrumbs.length - 1)
    })
  }
}

/**
 * Custom separator via the `separator` prop.
 */
export const CustomSeparator: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({ breadcrumbs: defaultBreadcrumbs }),
    template: `<FzBreadcrumbs :breadcrumbs="breadcrumbs" separator="›" />`
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify breadcrumb labels', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Home')).toBeInTheDocument()
      await expect(canvas.getByText('Current page')).toBeInTheDocument()
    })

    await step('Verify custom separator "›"', async () => {
      const separators = canvasElement.querySelectorAll('.text-grey-300')
      await expect(separators.length).toBe(defaultBreadcrumbs.length - 1)
      await expect(separators[0].textContent?.trim()).toBe('›')
    })

    await step('Verify separators are hidden from AT', async () => {
      const hidden = canvasElement.querySelectorAll('[aria-hidden="true"]')
      await expect(hidden.length).toBe(defaultBreadcrumbs.length - 1)
    })
  }
}

/**
 * `bread-label` slot with `<a>` tags: the most common use case for
 * applications that do not use Vue Router.
 */
export const WithCustomLinks: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({
      breadcrumbs: [
        { id: 'home', label: 'Home', metadata: '/' },
        { id: 'products', label: 'Products', metadata: '/products' },
        { id: 'current', label: 'Current page', metadata: '/products/123' }
      ]
    }),
    template: `
      <FzBreadcrumbs :breadcrumbs="breadcrumbs">
        <template #bread-label="{ bread, isActive }">
          <a
            v-if="!isActive"
            :href="bread.metadata"
            class="text-blue-500 hover:underline"
          >{{ bread.label }}</a>
          <span v-else class="text-grey-500" aria-current="page">{{ bread.label }}</span>
        </template>
      </FzBreadcrumbs>
    `
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify links and their href attributes', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      const links = nav.querySelectorAll('a')
      await expect(links.length).toBe(2)
      await expect(links[0]).toHaveAttribute('href', '/')
      await expect(links[1]).toHaveAttribute('href', '/products')
    })

    await step('Verify aria-current="page" on the last non-interactive item', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current).toBeInTheDocument()
      await expect(current!.tagName.toLowerCase()).toBe('span')
      await expect(current!.textContent?.trim()).toBe('Current page')
    })

    await step('Verify separators are present and hidden from AT', async () => {
      const hidden = canvasElement.querySelectorAll('[aria-hidden="true"]')
      await expect(hidden.length).toBe(2)
    })
  }
}

/**
 * With 0 or 1 items the component renders nothing — intentional behaviour.
 */
export const EmptyOrSingle: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({
      zero: [],
      one: [{ id: 'home', label: 'Home' }]
    }),
    template: `
      <div>
        <p class="text-grey-500 text-sm mb-4 italic">
          The component renders nothing with fewer than 2 items. The space below is intentionally empty.
        </p>
        <p class="text-grey-300 text-xs mb-1">0 items →</p>
        <FzBreadcrumbs :breadcrumbs="zero" />
        <p class="text-grey-300 text-xs mt-4 mb-1">1 item →</p>
        <FzBreadcrumbs :breadcrumbs="one" />
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify nothing is rendered with 0 items', async () => {
      await expect(canvasElement.querySelectorAll('nav').length).toBe(0)
    })

    await step('Verify nothing is rendered with 1 item', async () => {
      await expect(canvasElement.querySelector('nav')).toBeNull()
    })
  }
}

const tenBreadcrumbs = Array.from({ length: 10 }, (_, i) => ({
  id: `page-${i + 1}`,
  label: `Page ${i + 1}`
}))

/**
 * Frontoffice with 10 items: the component collapses to first / … / penultimate / current.
 */
export const FrontofficeOverflow: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({ breadcrumbs: tenBreadcrumbs }),
    template: `<FzBreadcrumbs :breadcrumbs="breadcrumbs" environment="frontoffice" />`
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify 4 items are displayed (first, ellipsis, penultimate, current)', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      await expect(nav.querySelectorAll('li').length).toBe(4)
    })

    await step('Verify first and last items are present', async () => {
      const nav = within(canvasElement.querySelector('nav[aria-label]') as HTMLElement)
      await expect(nav.getByText('Page 1')).toBeInTheDocument()
      await expect(nav.getByText('Page 10')).toBeInTheDocument()
    })

    await step('Verify blue ellipsis between first and penultimate', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      const ellipsis = nav.querySelector('span.text-blue-500')
      await expect(ellipsis).toBeInTheDocument()
      await expect(ellipsis!.textContent?.trim()).toBe('...')
    })

    await step('Verify aria-current="page" on the last item', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      const current = nav.querySelector('[aria-current="page"]')
      await expect(current!.textContent?.trim()).toBe('Page 10')
    })
  }
}

/**
 * Backoffice with 10 items: all items are displayed without collapsing.
 */
export const BackofficeFullList: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({ breadcrumbs: tenBreadcrumbs }),
    template: `<FzBreadcrumbs :breadcrumbs="breadcrumbs" environment="backoffice" />`
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify all 10 items are visible', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      await expect(nav.querySelectorAll('li').length).toBe(10)
    })

    await step('Verify first and last items are present', async () => {
      const nav = within(canvasElement.querySelector('nav[aria-label]') as HTMLElement)
      await expect(nav.getByText('Page 1')).toBeInTheDocument()
      await expect(nav.getByText('Page 10')).toBeInTheDocument()
    })

    await step('Verify no ellipsis is rendered', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      await expect(nav.querySelector('span.text-blue-500')).toBeNull()
    })

    await step('Verify 9 separators (10 items − 1)', async () => {
      const nav = canvasElement.querySelector('nav[aria-label]')!
      await expect(nav.querySelectorAll('[aria-hidden="true"]').length).toBe(9)
    })
  }
}

/**
 * `bread-separator` slot for a fully custom separator element.
 */
export const CustomSeparatorSlot: Story = {
  render: () => ({
    components: { FzBreadcrumbs },
    setup: () => ({ breadcrumbs: defaultBreadcrumbs }),
    template: `
      <FzBreadcrumbs :breadcrumbs="breadcrumbs">
        <template #bread-separator>
          <span class="text-grey-300 mx-4">•</span>
        </template>
      </FzBreadcrumbs>
    `
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify breadcrumb labels', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Home')).toBeInTheDocument()
      await expect(canvas.getByText('Current page')).toBeInTheDocument()
    })

    await step('Verify custom separator "•"', async () => {
      const separators = canvasElement.querySelectorAll('.text-grey-300')
      await expect(separators.length).toBe(defaultBreadcrumbs.length - 1)
      await expect(separators[0].textContent?.trim()).toBe('•')
    })

    await step('Verify separators are hidden from AT', async () => {
      const hidden = canvasElement.querySelectorAll('[aria-hidden="true"]')
      await expect(hidden.length).toBe(defaultBreadcrumbs.length - 1)
    })
  }
}
