import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { ref } from 'vue'
import { FzViewFlag } from '@fiscozen/view-flag'
import { FzBadge } from '@fiscozen/badge'
import type { PlayFunctionContext } from '../test-utils'
import { FzIconButton } from '@fiscozen/button'

const meta: Meta<typeof FzViewFlag> = {
  title: 'Overlay/FzViewFlag',
  component: FzViewFlag,
  tags: ['autodocs'],
  argTypes: {}
}

export default meta

type Story = StoryObj<typeof meta>

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets the bottom banner element.
 * Uses .rounded-t-base selector because the ViewFlag component renders
 * its slot banner with rounded top corners to visually distinguish
 * it from the warning border around the viewport edges.
 */
const getBanner = (canvasElement: HTMLElement): HTMLElement | null => {
  return canvasElement.querySelector('.rounded-t-base') as HTMLElement | null
}

/**
 * Gets the outer border wrapper element (the fixed inset-0 div with the warning border).
 */
const getBorderWrapper = (canvasElement: HTMLElement): HTMLElement => {
  const wrapper = canvasElement.querySelector('.border-semantic-warning.fixed')
  if (!wrapper) {
    throw new Error('Border wrapper (.border-semantic-warning.fixed) not found')
  }
  return wrapper as HTMLElement
}

// ============================================
// BASIC STORIES
// ============================================

export const Primary: Story = {
  render: () => ({
    components: { FzViewFlag, FzBadge },
    template: `
      <FzViewFlag>
        <div class="flex items-center gap-16">
          <FzBadge>staging.D</FzBadge>
          <p>Operatore: Mario R.</p>
        </div>
      </FzViewFlag>
    `
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify border wrapper renders correctly', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      await expect(borderWrapper).toBeInTheDocument()
      await expect(borderWrapper).toBeVisible()
    })

    await step('Verify slot content is displayed', async () => {
      await expect(canvas.getByText('Operatore: Mario R.')).toBeInTheDocument()
    })

    await step('Verify banner positioning', async () => {
      const banner = getBanner(canvasElement)
      await expect(banner).toBeInTheDocument()
      const computedStyles = window.getComputedStyle(banner!)

      await expect(computedStyles.position).toBe('fixed')

      const rect = banner!.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const distanceFromBottom = viewportHeight - rect.bottom
      await expect(distanceFromBottom).toBeLessThan(100)
    })

    await step('Verify banner is centered horizontally', async () => {
      const banner = getBanner(canvasElement)
      const rect = banner!.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      const centerX = viewportWidth / 2
      const bannerCenterX = rect.left + rect.width / 2

      const centerDistance = Math.abs(bannerCenterX - centerX)
      await expect(centerDistance).toBeLessThan(50)
    })
  }
}

export const WithCustomSlot: Story = {
  render: () => ({
    components: { FzViewFlag },
    template: `
      <FzViewFlag>
        <div class="flex flex-col gap-8">
          <div>Slot content</div>
          <div>More slot content</div>
        </div>
      </FzViewFlag>
    `
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify border wrapper renders with slot content', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      await expect(borderWrapper).toBeInTheDocument()
      await expect(borderWrapper).toBeVisible()
    })

    await step('Verify slot content is displayed', async () => {
      await expect(canvas.getByText('Slot content')).toBeInTheDocument()
      await expect(canvas.getByText('More slot content')).toBeInTheDocument()
    })
  }
}

// ============================================
// VARIANT STORIES
// ============================================

export const hasWarning: Story = {
  render: () => ({
    components: { FzViewFlag, FzBadge, FzIconButton },
    setup() {
      const showErrors = ref(false)
      const toggleShowError = () => {
        showErrors.value = !showErrors.value
      }
      return { showErrors, toggleShowError }
    },
    template: `
      <FzViewFlag>
        <div class="w-full">
          <div class="flex justify-between gap-80 items-center w-auto">
            <div class="flex items-center gap-16">
              <FzBadge>staging.D</FzBadge>
              <p class="m-0">Operatore: Mario R.</p>
            </div>
            <div class="flex items-center gap-8">
            <FzBadge color="error"> 3 criticità </FzBadge>
            <FzIconButton
                  :iconName="showErrors ? 'chevron-up' : 'chevron-down'"
                  variant="invisible"
                  @click="toggleShowError" />
            </div>
          </div>
          <ul v-if="showErrors" class="py-24 pl-16 pr-8 w-min min-w-full break-word list-disc list-inside">
            <li>Utente insolvente: l'utente non ha pagato l'abbonamento</li>
            <li class="mt-4">Privacy & Policy: l'utente deve accettare i nuovi termini e condizioni</li>
            <li class="mt-4">Deleghe: l’utente deve attivare la delega a fatture e corrispettivi.</li>
          </ul>
        </div>
      </FzViewFlag>`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify border wrapper is present', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      await expect(borderWrapper).toBeInTheDocument()
      await expect(borderWrapper).toBeVisible()
    })

    await step('Verify banner is visible when slot has content', async () => {
      const banner = getBanner(canvasElement)
      await expect(banner).toBeInTheDocument()
      await expect(banner).toBeVisible()
    })
  }
}

export const EmptySlot: Story = {
  render: () => ({
    components: { FzViewFlag },
    template: `<FzViewFlag />`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify border wrapper is still present with empty slot', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      await expect(borderWrapper).toBeInTheDocument()
      await expect(borderWrapper).toBeVisible()
    })

    await step('Verify banner is hidden when slot is empty', async () => {
      const banner = getBanner(canvasElement)
      // Banner uses empty:hidden — it should not be visible when slot is empty
      if (banner) {
        const computedStyles = window.getComputedStyle(banner)
        await expect(computedStyles.display).toBe('none')
      }
    })
  }
}

// ============================================
// ACCESSIBILITY STORIES
// ============================================

export const Accessibility: Story = {
  render: () => ({
    components: { FzViewFlag },
    template: `
      <FzViewFlag>
        <span>Ambiente: staging.D</span>
        <span>Operatore: Mario R.</span>
      </FzViewFlag>
    `
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify semantic HTML structure', async () => {
      const banner = getBanner(canvasElement)
      await expect(banner!.tagName.toLowerCase()).toBe('div')
    })

    await step('Verify visible text content for screen readers', async () => {
      await expect(canvas.getByText('Ambiente: staging.D')).toBeInTheDocument()
      await expect(canvas.getByText('Operatore: Mario R.')).toBeInTheDocument()
    })

    await step('Verify border wrapper does not contain meaningful text', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      const banner = getBanner(canvasElement)
      // The wrapper itself (excluding the banner child) should not hold text
      const wrapperOwnText =
        Array.from(borderWrapper.childNodes)
          .filter((n) => n !== banner && n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent?.trim())
          .join('') || ''
      await expect(wrapperOwnText).toBe('')
    })
  }
}

// ============================================
// VISUAL POSITIONING STORIES
// ============================================

export const BorderWrapper: Story = {
  render: () => ({
    components: { FzViewFlag },
    template: `<FzViewFlag />`
  }),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify border wrapper covers the full viewport', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      await expect(borderWrapper).toBeInTheDocument()

      const computedStyles = window.getComputedStyle(borderWrapper)
      await expect(computedStyles.position).toBe('fixed')

      const rect = borderWrapper.getBoundingClientRect()
      await expect(rect.top).toBeLessThanOrEqual(0)
      await expect(rect.left).toBeLessThanOrEqual(0)
      await expect(rect.width).toBeGreaterThanOrEqual(window.innerWidth)
      await expect(rect.height).toBeGreaterThanOrEqual(window.innerHeight)
    })

    await step('Verify component is rendered on top of other elements', async () => {
      const borderWrapper = getBorderWrapper(canvasElement)
      const computedStyles = window.getComputedStyle(borderWrapper)
      const zIndex = parseInt(computedStyles.zIndex, 10)

      // z-50 in Tailwind maps to z-index: 50; the component must stack above regular content
      await expect(zIndex).toBeGreaterThanOrEqual(50)

      // Verify the banner inside also stacks above regular content
      const banner = getBanner(canvasElement)
      if (banner) {
        const bannerStyles = window.getComputedStyle(banner)
        const bannerZIndex = parseInt(bannerStyles.zIndex, 10)
        await expect(isNaN(bannerZIndex) || bannerZIndex >= 0).toBe(true)
      }
    })
  }
}
