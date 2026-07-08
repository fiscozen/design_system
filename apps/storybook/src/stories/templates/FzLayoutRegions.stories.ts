import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { FzLayoutHeader, FzLayoutAside, FzLayoutFooter } from '@fiscozen/layout'

/**
 * The thin semantic region wrappers (`FzLayoutHeader`, `FzLayoutAside`,
 * `FzLayoutFooter`) each render a landmark element and a stable class hook, and
 * are composed by the page templates. Layout-specific sizing/padding is applied
 * by the composing template via fall-through attributes — on their own they are
 * intentionally unstyled. The `AsDiv` variants exercise the single-landmark
 * escape hatch (`as="div"`), which drops the landmark role for pages that must
 * not expose it twice.
 */
const meta: Meta = {
  title: 'Templates/Regions/FzLayoutRegions',
  tags: ['autodocs']
}

export default meta

type Story = StoryObj

export const Header: Story = {
  render: () => ({
    components: { FzLayoutHeader },
    template: `
      <FzLayoutHeader aria-label="Top bar" class="p-16 bg-core-white">
        <span class="font-medium">Top bar</span>
      </FzLayoutHeader>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a banner landmark that forwards aria-label', async () => {
      const header = canvas.getByRole('banner', { name: 'Top bar' })
      await expect(header).toBeInTheDocument()
      await expect(header).toHaveClass('fz-layout-header')
      await expect(canvas.getByText('Top bar')).toBeVisible()
    })
  }
}

export const HeaderAsDiv: Story = {
  render: () => ({
    components: { FzLayoutHeader },
    template: `
      <FzLayoutHeader as="div" class="p-16 bg-core-white">
        <span class="font-medium">Top bar</span>
      </FzLayoutHeader>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Drops the banner landmark when rendered as a div', async () => {
      await expect(canvas.queryByRole('banner')).toBeNull()
      await expect(canvas.getByText('Top bar')).toBeVisible()
    })
  }
}

export const Aside: Story = {
  render: () => ({
    components: { FzLayoutAside },
    template: `
      <FzLayoutAside aria-label="Support panel" class="p-16 bg-core-white">
        <span class="font-medium">Complementary panel</span>
      </FzLayoutAside>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a complementary landmark that forwards aria-label', async () => {
      const aside = canvas.getByRole('complementary', { name: 'Support panel' })
      await expect(aside).toBeInTheDocument()
      await expect(aside).toHaveClass('fz-layout-aside')
      await expect(canvas.getByText('Complementary panel')).toBeVisible()
    })
  }
}

export const AsideAsDiv: Story = {
  render: () => ({
    components: { FzLayoutAside },
    template: `
      <FzLayoutAside as="div" class="p-16 bg-core-white">
        <span class="font-medium">Complementary panel</span>
      </FzLayoutAside>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Drops the complementary landmark when rendered as a div', async () => {
      await expect(canvas.queryByRole('complementary')).toBeNull()
      await expect(canvas.getByText('Complementary panel')).toBeVisible()
    })
  }
}

export const Footer: Story = {
  render: () => ({
    components: { FzLayoutFooter },
    template: `
      <FzLayoutFooter aria-label="Page footer" class="p-16 bg-core-white">
        <span class="text-sm text-grey-500">© Fiscozen</span>
      </FzLayoutFooter>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Renders a contentinfo landmark that forwards aria-label', async () => {
      const footer = canvas.getByRole('contentinfo', { name: 'Page footer' })
      await expect(footer).toBeInTheDocument()
      await expect(footer).toHaveClass('fz-layout-footer')
      await expect(canvas.getByText('© Fiscozen')).toBeVisible()
    })
  }
}

export const FooterAsDiv: Story = {
  render: () => ({
    components: { FzLayoutFooter },
    template: `
      <FzLayoutFooter as="div" class="p-16 bg-core-white">
        <span class="text-sm text-grey-500">© Fiscozen</span>
      </FzLayoutFooter>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Drops the contentinfo landmark when rendered as a div', async () => {
      await expect(canvas.queryByRole('contentinfo')).toBeNull()
      await expect(canvas.getByText('© Fiscozen')).toBeVisible()
    })
  }
}
