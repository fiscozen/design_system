import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { expect, within } from 'storybook/test'
import { FzLayoutHeader, FzLayoutMain, FzLayoutAside, FzLayoutFooter } from '@fiscozen/layout'
import { FzIcon } from '@fiscozen/icons'
import { FzLink } from '@fiscozen/link'
import { FzAvatar } from '@fiscozen/avatar'

/**
 * The thin semantic region wrappers — `FzLayoutHeader`, `FzLayoutMain`,
 * `FzLayoutAside` and `FzLayoutFooter` — are the building blocks the page
 * templates compose into a page. Each renders one **landmark** element and a
 * stable class hook, and nothing else: on their own they are intentionally
 * unstyled. The layout-specific sizing, padding and background you see below are
 * applied by the composing template through fall-through attributes.
 *
 * | Region | Element | Landmark |
 * | --- | --- | --- |
 * | `FzLayoutHeader` | `<header>` | `banner` |
 * | `FzLayoutMain` | `<main>` | `main` |
 * | `FzLayoutAside` | `<aside>` | `complementary` |
 * | `FzLayoutFooter` | `<footer>` | `contentinfo` |
 *
 * Start with **Anatomy** for the whole picture, then see each region on its own
 * — shown in page context, with its neighbours dimmed. Every region also accepts
 * an `as="div"` escape hatch (see **Escape hatch**) that drops the landmark role
 * for pages that would otherwise expose it twice.
 */
const meta: Meta = {
  title: 'Templates/Regions/FzLayoutRegions',
  tags: ['autodocs']
}

export default meta

type Story = StoryObj

/**
 * A muted, dashed placeholder standing in for a region that is not the focus of
 * the current story — so the highlighted region reads against the rest of the
 * page without competing for attention (or introducing extra landmarks).
 */
const Placeholder = defineComponent({
  props: { label: { type: String, default: '' } },
  template: `
    <div class="flex items-center justify-center rounded border-2 border-dashed border-grey-200 bg-grey-100 p-16 text-center text-xs font-medium uppercase tracking-wide text-grey-300">
      {{ label }}
    </div>
  `
})

/**
 * A small label chip naming a region and its element (e.g. "FzLayoutMain ·
 * &lt;main&gt;"), tinted per region so the areas stay legible in the anatomy map.
 */
const RegionTag = defineComponent({
  props: { tone: { type: String, default: 'neutral' } },
  computed: {
    toneClass(): string {
      const tones: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700',
        grey: 'bg-grey-200 text-grey-500',
        neutral: 'bg-grey-100 text-grey-500'
      }
      return tones[this.tone] ?? tones.neutral
    }
  },
  template: `
    <span
      class="inline-block self-start rounded px-8 py-2 text-xs font-medium"
      :class="toneClass"
    >
      <slot />
    </span>
  `
})

/**
 * The whole picture: the four region molecules assembled into a page, each area
 * colour-coded and labelled with its component and landmark. This is the mental
 * model the page templates are built from — header on top, a body row of main +
 * complementary aside, footer at the bottom.
 */
export const Anatomy: Story = {
  render: () => ({
    components: { FzLayoutHeader, FzLayoutMain, FzLayoutAside, FzLayoutFooter, RegionTag },
    template: `
      <div class="mx-auto w-full max-w-[900px]">
        <p class="mb-16 text-sm text-grey-500">
          How the region molecules assemble into a page. Each coloured area is a
          semantic landmark; the sizing, padding and background are owned by the
          composing template.
        </p>

        <div class="overflow-hidden rounded-lg border border-grey-200 shadow-sm">
          <FzLayoutHeader
            aria-label="Top bar"
            class="flex items-center justify-between gap-16 border-b border-blue-200 bg-blue-50 px-20 py-12"
          >
            <span class="text-base font-semibold text-core-black">Fiscozen</span>
            <RegionTag tone="blue">FzLayoutHeader · &lt;header&gt; · banner</RegionTag>
          </FzLayoutHeader>

          <div class="flex min-h-[300px] flex-col sm:flex-row">
            <FzLayoutMain aria-label="Main content" class="flex-1 gap-12 bg-core-white p-20">
              <RegionTag tone="neutral">FzLayoutMain · &lt;main&gt; · main</RegionTag>
              <p class="text-sm text-grey-500">The page's primary content lives here.</p>
              <div class="h-8 w-3/4 rounded bg-grey-100"></div>
              <div class="h-8 w-2/3 rounded bg-grey-100"></div>
              <div class="h-8 w-1/2 rounded bg-grey-100"></div>
            </FzLayoutMain>

            <FzLayoutAside
              aria-label="Support panel"
              class="flex flex-col gap-12 border-t border-purple-200 bg-background-pale-purple p-20 sm:w-[260px] sm:border-l sm:border-t-0"
            >
              <RegionTag tone="purple">FzLayoutAside · &lt;aside&gt; · complementary</RegionTag>
              <p class="text-sm text-grey-500">Secondary, related content.</p>
            </FzLayoutAside>
          </div>

          <FzLayoutFooter
            aria-label="Page footer"
            class="flex items-center justify-between gap-16 border-t border-grey-200 bg-grey-100 px-20 py-12"
          >
            <span class="text-xs text-grey-500">© 2026 Fiscozen S.r.l.</span>
            <RegionTag tone="grey">FzLayoutFooter · &lt;footer&gt; · contentinfo</RegionTag>
          </FzLayoutFooter>
        </div>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders each region as its own landmark', async () => {
      await expect(canvas.getByRole('banner', { name: 'Top bar' })).toHaveClass('fz-layout-header')
      await expect(canvas.getByRole('main', { name: 'Main content' })).toHaveClass('fz-layout-main')
      await expect(canvas.getByRole('complementary', { name: 'Support panel' })).toHaveClass(
        'fz-layout-aside'
      )
      await expect(canvas.getByRole('contentinfo', { name: 'Page footer' })).toHaveClass(
        'fz-layout-footer'
      )
    })

    await step('Labels each area with its component and element', async () => {
      await expect(canvas.getByText(/FzLayoutHeader/)).toBeVisible()
      await expect(canvas.getByText(/FzLayoutMain/)).toBeVisible()
      await expect(canvas.getByText(/FzLayoutAside/)).toBeVisible()
      await expect(canvas.getByText(/FzLayoutFooter/)).toBeVisible()
    })
  }
}

/**
 * `FzLayoutHeader` renders the page's top bar as a `<header>` — a `banner`
 * landmark. Shown in context: a real top bar above a dimmed content area.
 */
export const Header: Story = {
  render: () => ({
    components: { FzLayoutHeader, FzIcon, FzAvatar, Placeholder },
    template: `
      <div class="mx-auto w-full max-w-[760px]">
        <div class="overflow-hidden rounded-lg border border-grey-200 shadow-sm">
          <FzLayoutHeader
            aria-label="Top bar"
            class="flex items-center justify-between gap-16 border-b border-blue-200 bg-blue-50 px-20 py-12"
          >
            <span class="text-lg font-semibold text-core-black">Fiscozen</span>
            <div class="flex items-center gap-16 text-grey-400">
              <FzIcon name="magnifying-glass" size="md" />
              <FzIcon name="bell" size="md" />
              <FzAvatar firstName="Riccardo" lastName="Agnoletto" />
            </div>
          </FzLayoutHeader>
          <div class="bg-core-white p-16">
            <Placeholder label="Main content area" class="min-h-[160px]" />
          </div>
        </div>
        <p class="mt-12 text-sm text-grey-500">
          <code>FzLayoutHeader</code> renders a <code>&lt;header&gt;</code> — a
          <strong>banner</strong> landmark — as the page's top bar.
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a banner landmark that forwards aria-label', async () => {
      const header = canvas.getByRole('banner', { name: 'Top bar' })
      await expect(header).toBeInTheDocument()
      await expect(header).toHaveClass('fz-layout-header')
      await expect(canvas.getByText('Fiscozen')).toBeVisible()
    })
  }
}

/**
 * `FzLayoutAside` renders secondary, related content as an `<aside>` — a
 * `complementary` landmark. Templates place it beside the main region (and stack
 * it below the content on narrow viewports).
 */
export const Aside: Story = {
  render: () => ({
    components: { FzLayoutAside, FzLink, Placeholder },
    template: `
      <div class="mx-auto w-full max-w-[760px]">
        <div class="flex flex-col gap-16 rounded-lg border border-grey-200 bg-core-white p-16 shadow-sm sm:flex-row">
          <Placeholder label="Main content area" class="min-h-[220px] flex-1" />
          <FzLayoutAside
            aria-label="Support panel"
            class="flex shrink-0 flex-col gap-12 rounded-md border border-purple-200 bg-background-pale-purple p-16 sm:w-[260px]"
          >
            <span class="text-base font-semibold text-core-black">Serve aiuto?</span>
            <p class="text-sm text-grey-500">Il nostro team ti risponde in giornata.</p>
            <FzLink to="#" external>Contatta il supporto</FzLink>
          </FzLayoutAside>
        </div>
        <p class="mt-12 text-sm text-grey-500">
          <code>FzLayoutAside</code> renders an <code>&lt;aside&gt;</code> — a
          <strong>complementary</strong> landmark — for content related to, but
          separable from, the main region.
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a complementary landmark that forwards aria-label', async () => {
      const aside = canvas.getByRole('complementary', { name: 'Support panel' })
      await expect(aside).toBeInTheDocument()
      await expect(aside).toHaveClass('fz-layout-aside')
      await expect(canvas.getByText('Serve aiuto?')).toBeVisible()
    })
  }
}

/**
 * `FzLayoutFooter` renders the page footer as a `<footer>` — a `contentinfo`
 * landmark — typically holding copyright and legal links below the content.
 */
export const Footer: Story = {
  render: () => ({
    components: { FzLayoutFooter, FzLink, Placeholder },
    template: `
      <div class="mx-auto w-full max-w-[760px]">
        <div class="overflow-hidden rounded-lg border border-grey-200 bg-core-white shadow-sm">
          <div class="p-16">
            <Placeholder label="Main content area" class="min-h-[160px]" />
          </div>
          <FzLayoutFooter
            aria-label="Page footer"
            class="flex flex-wrap items-center justify-between gap-12 border-t border-grey-200 bg-grey-100 px-20 py-16"
          >
            <span class="text-sm text-grey-500">© 2026 Fiscozen S.r.l.</span>
            <div class="flex gap-16 text-sm">
              <FzLink to="#" external>Privacy</FzLink>
              <FzLink to="#" external>Termini</FzLink>
              <FzLink to="#" external>Cookie</FzLink>
            </div>
          </FzLayoutFooter>
        </div>
        <p class="mt-12 text-sm text-grey-500">
          <code>FzLayoutFooter</code> renders a <code>&lt;footer&gt;</code> — a
          <strong>contentinfo</strong> landmark — at the bottom of the page.
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a contentinfo landmark that forwards aria-label', async () => {
      const footer = canvas.getByRole('contentinfo', { name: 'Page footer' })
      await expect(footer).toBeInTheDocument()
      await expect(footer).toHaveClass('fz-layout-footer')
      await expect(canvas.getByText('© 2026 Fiscozen S.r.l.')).toBeVisible()
      await expect(canvas.getByText('Privacy')).toBeVisible()
    })
  }
}

/**
 * Every region takes an `as` prop. By default it renders its landmark element;
 * pass `as="div"` to drop the landmark. Use this when a region would otherwise
 * expose the same landmark twice on one page — e.g. a section-level header
 * nested inside a page that already has a top-level `banner`. The same escape
 * hatch applies to `FzLayoutMain`, `FzLayoutAside` and `FzLayoutFooter`.
 */
export const EscapeHatchAsDiv: Story = {
  render: () => ({
    components: { FzLayoutHeader },
    template: `
      <div class="mx-auto w-full max-w-[760px]">
        <div class="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <div class="flex flex-col gap-8">
            <span class="text-xs font-medium uppercase tracking-wide text-grey-400">Default</span>
            <FzLayoutHeader
              aria-label="Page banner"
              class="rounded-md border border-blue-200 bg-blue-50 px-16 py-12"
            >
              <span class="font-medium text-core-black">Section title</span>
            </FzLayoutHeader>
            <span class="text-sm text-grey-500">
              Renders <code>&lt;header&gt;</code> — a <strong>banner</strong> landmark.
            </span>
          </div>

          <div class="flex flex-col gap-8">
            <span class="text-xs font-medium uppercase tracking-wide text-grey-400">as="div"</span>
            <FzLayoutHeader
              as="div"
              class="escape-hatch__div rounded-md border border-grey-200 bg-grey-100 px-16 py-12"
            >
              <span class="font-medium text-core-black">Section title</span>
            </FzLayoutHeader>
            <span class="text-sm text-grey-500">
              Renders <code>&lt;div&gt;</code> — <strong>no landmark</strong>.
            </span>
          </div>
        </div>
        <p class="mt-16 text-sm text-grey-500">
          Both keep the <code>fz-layout-header</code> class hook, so template
          styling still applies; only the landmark role differs. A page must
          expose each landmark at most once.
        </p>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Default renders exactly one banner landmark', async () => {
      const banners = canvas.getAllByRole('banner')
      await expect(banners).toHaveLength(1)
      await expect(banners[0]).toHaveClass('fz-layout-header')
    })

    await step('as="div" drops the landmark but keeps the class hook', async () => {
      const asDiv = canvasElement.querySelector('.escape-hatch__div')
      await expect(asDiv).not.toBeNull()
      await expect(asDiv?.tagName).toBe('DIV')
      await expect(asDiv).toHaveClass('fz-layout-header')
    })
  }
}
