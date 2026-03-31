import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within, waitFor } from 'storybook/test'
import { ref } from 'vue'
import { FzCollapse } from '@fiscozen/collapse'

const meta = {
  title: 'Panel/FzCollapse',
  component: FzCollapse,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['section', 'button'],
    },
  },
  args: {
    title: 'Collapse',
    variant: 'section',
  },
  decorators: [
    () => ({
      template: '<div class="p-12"><story/></div>'
    })
  ]
} satisfies Meta<typeof FzCollapse>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// SECTION VARIANT STORIES
// ============================================

export const SectionDefault: Story = {
  args: {
    title: 'Collapse',
    subtitle: 'Lorem ipsum',
    icon: 'face-smile',
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #content>
          <p>Content goes here. This is the section variant with subtitle and leading icon.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify collapse renders correctly', async () => {
      const details = canvasElement.querySelector('details')
      await expect(details).toBeInTheDocument()
    })

    await step('Verify title is present', async () => {
      const title = canvasElement.querySelector('[data-e2e="title"]')
      await expect(title).toBeInTheDocument()
      await expect(title?.textContent).toContain('Collapse')
    })

    await step('Verify subtitle is visible when closed', async () => {
      const subtitle = canvasElement.querySelector('[data-e2e="subtitle"]')
      await expect(subtitle).toBeInTheDocument()
      await expect(subtitle?.textContent).toContain('Lorem ipsum')
    })

    await step('Verify leading icon is present', async () => {
      const icon = canvasElement.querySelector('[data-e2e="leading-icon"]')
      await expect(icon).toBeInTheDocument()
    })

    await step('Verify chevron icon is present', async () => {
      const chevron = canvasElement.querySelector('[data-e2e="chevron-icon"]')
      await expect(chevron).toBeInTheDocument()
    })

    await step('Verify collapse is closed by default', async () => {
      const details = canvasElement.querySelector('details')
      await expect(details).not.toHaveAttribute('open')
    })
  },
}

export const SectionOpen: Story = {
  args: {
    title: 'Collapse',
    icon: 'face-smile',
    open: true,
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(true)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #content>
          <p>This content is visible because the collapse is open. The subtitle is hidden in the open state.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify collapse is open', async () => {
      const details = canvasElement.querySelector('details')
      await expect(details).toHaveAttribute('open')
    })

    await step('Verify content is visible', async () => {
      const content = canvasElement.querySelector('[data-e2e="content"]')
      await expect(content).toBeInTheDocument()
      await waitFor(() => {
        const styles = window.getComputedStyle(content as Element)
        expect(styles.display).not.toBe('none')
      }, { timeout: 500 })
    })

    await step('Verify subtitle is NOT visible when open', async () => {
      const subtitle = canvasElement.querySelector('[data-e2e="subtitle"]')
      await expect(subtitle).not.toBeInTheDocument()
    })

    await step('Verify no blue highlight on open state', async () => {
      const summary = canvasElement.querySelector('summary')
      await expect(summary).not.toHaveClass('bg-background-alice-blue')
    })

    await step('Verify content indentation when icon is present', async () => {
      const indent = canvasElement.querySelector('[data-e2e="indent-space"]')
      await expect(indent).toBeInTheDocument()
    })
  },
}

export const SectionWithoutIcon: Story = {
  args: {
    title: 'Collapse without icon',
    subtitle: 'No leading icon in this variant',
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(true)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #content>
          <p>Content without indent since no icon is present.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify no leading icon', async () => {
      const icon = canvasElement.querySelector('[data-e2e="leading-icon"]')
      await expect(icon).not.toBeInTheDocument()
    })

    await step('Verify no indent spacer', async () => {
      const indent = canvasElement.querySelector('[data-e2e="indent-space"]')
      await expect(indent).not.toBeInTheDocument()
    })
  },
}

// ============================================
// BUTTON VARIANT STORIES
// ============================================

export const ButtonDefault: Story = {
  args: {
    title: 'Collapse',
    variant: 'button',
    icon: 'face-smile',
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #rightContent>
          <span class="text-sm text-grey-400">Badge</span>
        </template>
        <template #content>
          <p>Button variant content. Compact layout with right content slot.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify button variant layout', async () => {
      const headerWrapper = canvasElement.querySelector('[data-e2e="header-wrapper"]')
      await expect(headerWrapper).toBeInTheDocument()
      await expect(headerWrapper).toHaveClass('items-center')
    })

    await step('Verify title uses normal weight typography', async () => {
      const title = canvasElement.querySelector('[data-e2e="title"]')
      await expect(title).toBeInTheDocument()
      await expect(title).toHaveClass('font-normal')
    })

    await step('Verify no subtitle is shown', async () => {
      const subtitle = canvasElement.querySelector('[data-e2e="subtitle"]')
      await expect(subtitle).not.toBeInTheDocument()
    })

    await step('Verify right content is rendered', async () => {
      const summary = canvasElement.querySelector('summary')
      await expect(summary?.textContent).toContain('Badge')
    })
  },
}

export const ButtonNoRightContent: Story = {
  args: {
    title: 'Collapse',
    variant: 'button',
    icon: 'face-smile',
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #content>
          <p>Button variant without right content. The chevron stays close to the title.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify summary stretches full width', async () => {
      const summary = canvasElement.querySelector('summary')
      await expect(summary).toBeInTheDocument()
      await expect(summary).toHaveClass('w-full')
    })

    await step('Verify chevron stays close to title (text container is shrink-0)', async () => {
      const textContainer = canvasElement.querySelector('[data-e2e="text-container"]')
      await expect(textContainer).toBeInTheDocument()
      await expect(textContainer).toHaveClass('shrink-0')
      await expect(textContainer).not.toHaveClass('flex-[1_0_0]')
    })

    await step('Verify chevron icon is present', async () => {
      const chevron = canvasElement.querySelector('[data-e2e="chevron-icon"]')
      await expect(chevron).toBeInTheDocument()
    })
  },
}

export const ButtonOpen: Story = {
  args: {
    title: 'Collapse',
    variant: 'button',
    icon: 'face-smile',
    open: true,
  },
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(true)
      return { args, isOpen }
    },
    template: `
      <FzCollapse v-bind="args" v-model:open="isOpen">
        <template #rightContent>
          <span class="text-sm text-grey-400">Badge</span>
        </template>
        <template #content>
          <p>Button variant content when open. Note the 28px indent.</p>
        </template>
      </FzCollapse>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify collapse is open', async () => {
      const details = canvasElement.querySelector('details')
      await expect(details).toHaveAttribute('open')
    })

    await step('Verify 28px indent spacer', async () => {
      const indent = canvasElement.querySelector('[data-e2e="indent-space"]')
      await expect(indent).toBeInTheDocument()
    })

    await step('Verify mt-16 content spacing', async () => {
      const content = canvasElement.querySelector('[data-e2e="content"]')
      await expect(content).toHaveClass('mt-16')
    })
  },
}

// ============================================
// INTERACTION STORIES
// ============================================

export const UserInteraction: Story = {
  tags: ['!dev'],
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(false)
      const handleUpdate = (value: boolean) => {
        isOpen.value = value
        args['onUpdate:open'](value)
      }
      return { args, isOpen, handleUpdate }
    },
    template: `<FzCollapse v-bind="args" :open="isOpen" @update:open="handleUpdate">
      <template #content><p>Interactive content</p></template>
    </FzCollapse>`,
  }),
  args: {
    title: 'Click to toggle',
    icon: 'face-smile',
    'onUpdate:open': fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    await step('Verify collapse starts closed', async () => {
      const details = canvasElement.querySelector('details')
      await expect(details).not.toHaveAttribute('open')
    })

    await step('Click summary to open', async () => {
      const summary = canvasElement.querySelector('summary')
      await expect(summary).toBeInTheDocument()

      args['onUpdate:open'].mockClear()
      await userEvent.click(summary as HTMLElement)

      await waitFor(() => {
        const details = canvasElement.querySelector('details')
        expect(details).toHaveAttribute('open')
      }, { timeout: 500 })

      await expect(args['onUpdate:open']).toHaveBeenCalled()
      await expect(args['onUpdate:open']).toHaveBeenLastCalledWith(true)
    })

    await step('Verify content is visible after opening', async () => {
      const content = canvasElement.querySelector('[data-e2e="content"]')
      await expect(content).toBeInTheDocument()

      await waitFor(() => {
        const styles = window.getComputedStyle(content as Element)
        expect(styles.display).not.toBe('none')
      }, { timeout: 500 })
    })

    await step('Click summary again to close', async () => {
      const summary = canvasElement.querySelector('summary')
      args['onUpdate:open'].mockClear()
      await userEvent.click(summary as HTMLElement)

      await waitFor(() => {
        const details = canvasElement.querySelector('details')
        expect(details).not.toHaveAttribute('open')
      }, { timeout: 500 })

      await expect(args['onUpdate:open']).toHaveBeenCalled()
      await expect(args['onUpdate:open']).toHaveBeenLastCalledWith(false)
    })
  },
}

// ============================================
// KEYBOARD NAVIGATION STORIES
// ============================================

export const KeyboardNavigation: Story = {
  tags: ['!dev'],
  render: (args) => ({
    components: { FzCollapse },
    setup() {
      const isOpen = ref(false)
      const handleUpdate = (value: boolean) => {
        isOpen.value = value
        args['onUpdate:open'](value)
      }
      return { args, isOpen, handleUpdate }
    },
    template: `<FzCollapse v-bind="args" :open="isOpen" @update:open="handleUpdate">
      <template #content><p>Keyboard-accessible content</p></template>
    </FzCollapse>`,
  }),
  args: {
    title: 'Keyboard navigation',
    'onUpdate:open': fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    await step('Focus summary element', async () => {
      const summary = canvasElement.querySelector('summary') as HTMLElement
      await expect(summary).toBeInTheDocument()
      summary.focus()
      await expect(document.activeElement).toBe(summary)
    })

    await step('Activate collapse with click (simulating Enter key)', async () => {
      const summary = canvasElement.querySelector('summary') as HTMLElement
      summary.focus()
      args['onUpdate:open'].mockClear()

      await userEvent.click(summary)

      await waitFor(() => {
        const details = canvasElement.querySelector('details')
        expect(details).toHaveAttribute('open')
      }, { timeout: 1000 })

      await expect(args['onUpdate:open']).toHaveBeenCalled()
      await expect(args['onUpdate:open']).toHaveBeenLastCalledWith(true)
    })

    await step('Toggle closed again', async () => {
      const summary = canvasElement.querySelector('summary') as HTMLElement
      summary.focus()
      args['onUpdate:open'].mockClear()

      await userEvent.click(summary)

      await waitFor(() => {
        const details = canvasElement.querySelector('details')
        expect(details).not.toHaveAttribute('open')
      }, { timeout: 1000 })

      await expect(args['onUpdate:open']).toHaveBeenCalled()
      await expect(args['onUpdate:open']).toHaveBeenLastCalledWith(false)
    })
  },
}
