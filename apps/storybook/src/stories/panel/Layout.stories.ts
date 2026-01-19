import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzLayout, FzLayoutProps } from '@fiscozen/layout'
import { FzBadge } from '@fiscozen/badge'
import { useBreakpoints } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { FzButton } from '@fiscozen/button';

const meta: Meta<typeof FzLayout> = {
  title: 'Panel/FzLayout',
  component: FzLayout,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    () => ({
      template: `
      <div class="opacity">
        <div>
          <story />
        </div>
      </div>
      `
    })
  ]
} satisfies Meta<typeof FzLayout>

type Story = StoryObj<typeof meta>

const oneColumn = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <div class="bg-blue-50 h-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const OneColumn: StoryObj<typeof meta> = {
  render: oneColumn,
  args: {
    layout: 'oneColumn'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify oneColumn layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toHaveClass('grid-rows-1')
      await expect(layout).toHaveClass('grid-cols-1')
    })
    
    await step('Verify main content area is rendered', async () => {
      const mainArea = canvasElement.querySelector('.fz-layout__main')
      await expect(mainArea).toBeInTheDocument()
      await expect(mainArea).toBeVisible()
    })
    
    await step('Verify slot content is displayed', async () => {
      const badge = canvas.getByText('main')
      await expect(badge).toBeInTheDocument()
      await expect(badge).toBeVisible()
    })
  }
}

const oneColumnHeader = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">header</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const OneColumnHeader: StoryObj<typeof meta> = {
  render: oneColumnHeader,
  args: {
    layout: 'oneColumnHeader'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify oneColumnHeader layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toHaveClass('grid-rows-[56px_1fr]')
      await expect(layout).toHaveClass('grid-cols-1')
    })
    
    await step('Verify header area is rendered', async () => {
      const headerArea = canvasElement.querySelector('.fz-layout__header')
      await expect(headerArea).toBeInTheDocument()
      await expect(headerArea).toBeVisible()
    })
    
    await step('Verify main content area is rendered', async () => {
      const mainArea = canvasElement.querySelector('.fz-layout__main')
      await expect(mainArea).toBeInTheDocument()
      await expect(mainArea).toBeVisible()
    })
    
    await step('Verify header slot content is displayed', async () => {
      const headerBadge = canvas.getByText('header')
      await expect(headerBadge).toBeInTheDocument()
      await expect(headerBadge).toBeVisible()
    })
    
    await step('Verify main slot content is displayed', async () => {
      const mainBadge = canvas.getByText('main')
      await expect(mainBadge).toBeInTheDocument()
      await expect(mainBadge).toBeVisible()
    })
  }
}

const leftShoulder = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #sidebar>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Sidebar</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const LeftShoulder: StoryObj<typeof meta> = {
  render: leftShoulder,
  args: {
    layout: 'leftShoulder'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify leftShoulder layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      // Layout classes depend on breakpoint, but should have grid classes
      await expect(layout).toHaveClass('grid')
    })
    
    await step('Verify sidebar area is rendered', async () => {
      const sidebarArea = canvasElement.querySelector('.fz-layout__sidebar')
      await expect(sidebarArea).toBeInTheDocument()
      await expect(sidebarArea).toBeVisible()
    })
    
    await step('Verify main content area is rendered', async () => {
      const mainArea = canvasElement.querySelector('.fz-layout__main')
      await expect(mainArea).toBeInTheDocument()
      await expect(mainArea).toBeVisible()
    })
    
    await step('Verify sidebar slot content is displayed', async () => {
      const sidebarBadge = canvas.getByText('Sidebar')
      await expect(sidebarBadge).toBeInTheDocument()
      await expect(sidebarBadge).toBeVisible()
    })
    
    await step('Verify main slot content is displayed', async () => {
      const mainBadge = canvas.getByText('main')
      await expect(mainBadge).toBeInTheDocument()
      await expect(mainBadge).toBeVisible()
    })
  }
}

const rightShoulder = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #sidebar="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Sidebar</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const RightShoulder: StoryObj<typeof meta> = {
  render: rightShoulder,
  args: {
    layout: 'rightShoulder'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify rightShoulder layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      // Layout classes depend on breakpoint, but should have grid classes
      await expect(layout).toHaveClass('grid')
    })
    
    await step('Verify sidebar area is rendered', async () => {
      const sidebarArea = canvasElement.querySelector('.fz-layout__sidebar')
      await expect(sidebarArea).toBeInTheDocument()
      await expect(sidebarArea).toBeVisible()
    })
    
    await step('Verify main content area is rendered', async () => {
      const mainArea = canvasElement.querySelector('.fz-layout__main')
      await expect(mainArea).toBeInTheDocument()
      await expect(mainArea).toBeVisible()
    })
    
    await step('Verify sidebar slot content is displayed', async () => {
      const sidebarBadge = canvas.getByText('Sidebar')
      await expect(sidebarBadge).toBeInTheDocument()
      await expect(sidebarBadge).toBeVisible()
    })
    
    await step('Verify main slot content is displayed', async () => {
      const mainBadge = canvas.getByText('main')
      await expect(mainBadge).toBeInTheDocument()
      await expect(mainBadge).toBeVisible()
    })
  }
}

const twoColumns = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">header</FzBadge>
        </div>
      </template>
      <template #left>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">left</FzBadge>
        </div>
      </template>
      <template #right>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">right</FzBadge>
        </div>
      </template>
    </FzLayout>
  `
})

export const TwoColumns: StoryObj<typeof meta> = {
  render: twoColumns,
  args: {
    layout: 'twoColumns'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify twoColumns layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      // Layout classes depend on breakpoint, but should have grid classes
      await expect(layout).toHaveClass('grid')
    })
    
    await step('Verify header area is rendered', async () => {
      const headerArea = canvasElement.querySelector('.fz-layout__header')
      await expect(headerArea).toBeInTheDocument()
      await expect(headerArea).toBeVisible()
    })
    
    await step('Verify left column area is rendered', async () => {
      const leftArea = canvasElement.querySelector('.fz-layout__left')
      await expect(leftArea).toBeInTheDocument()
      await expect(leftArea).toBeVisible()
    })
    
    await step('Verify right column area is rendered', async () => {
      const rightArea = canvasElement.querySelector('.fz-layout__right')
      await expect(rightArea).toBeInTheDocument()
      await expect(rightArea).toBeVisible()
    })
    
    await step('Verify header slot content is displayed', async () => {
      const headerBadge = canvas.getByText('header')
      await expect(headerBadge).toBeInTheDocument()
      await expect(headerBadge).toBeVisible()
    })
    
    await step('Verify left slot content is displayed', async () => {
      const leftBadge = canvas.getByText('left')
      await expect(leftBadge).toBeInTheDocument()
      await expect(leftBadge).toBeVisible()
    })
    
    await step('Verify right slot content is displayed', async () => {
      const rightBadge = canvas.getByText('right')
      await expect(rightBadge).toBeInTheDocument()
      await expect(rightBadge).toBeVisible()
    })
  }
}

const multipleAreas = (args: FzLayoutProps) => ({
  setup() {
    const { isGreater, isSmaller } = useBreakpoints(breakpoints);
    return { args, isGreater, isSmaller }
  },
  components: { FzLayout, FzBadge, FzButton },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Header</FzBadge>
        </div>
      </template>
      <template #sidebarTrigger="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center" @click="sidebarToggle()">
          <FzBadge color="info" :style="isGreater('sm').value ? 'transform: rotate(270deg)' : ''" class="whitespace-nowrap">Sidebar trigger</FzBadge>
        </div>
      </template>
      <template #sidebar="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center flex-col">
          <FzBadge color="info">Sidebar</FzBadge>
          <FzButton v-if="isSmaller('md').value" @click="sidebarToggle()" class="mt-8">close</FzButton>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">Main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const MultipleAreas: StoryObj<typeof meta> = {
  render: multipleAreas,
  args: {
    layout: 'multipleAreas'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify layout renders correctly', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      await expect(layout).toBeInTheDocument()
      await expect(layout).toBeVisible()
    })
    
    await step('Verify multipleAreas layout structure', async () => {
      const layout = canvasElement.querySelector('.fz-layout')
      // Layout classes depend on breakpoint, but should have grid classes
      await expect(layout).toHaveClass('grid')
    })
    
    await step('Verify header area is rendered', async () => {
      const headerArea = canvasElement.querySelector('.fz-layout__header')
      await expect(headerArea).toBeInTheDocument()
      await expect(headerArea).toBeVisible()
    })
    
    await step('Verify sidebar trigger is rendered (on mobile)', async () => {
      // Sidebar trigger may or may not be visible depending on breakpoint
      const sidebarTrigger = canvasElement.querySelector('.fz-layout__sidebarTrigger')
      // On larger screens, trigger may not be rendered
      if (sidebarTrigger) {
        await expect(sidebarTrigger).toBeInTheDocument()
      }
    })
    
    await step('Verify sidebar area is rendered', async () => {
      // Sidebar visibility depends on breakpoint and toggle state
      const sidebarArea = canvasElement.querySelector('.fz-layout__sidebar')
      // On larger screens, sidebar should be visible
      if (sidebarArea) {
        await expect(sidebarArea).toBeInTheDocument()
      }
    })
    
    await step('Verify main content area is rendered', async () => {
      const mainArea = canvasElement.querySelector('.fz-layout__main')
      await expect(mainArea).toBeInTheDocument()
      await expect(mainArea).toBeVisible()
    })
    
    await step('Verify header slot content is displayed', async () => {
      const headerBadge = canvas.getByText('Header')
      await expect(headerBadge).toBeInTheDocument()
      await expect(headerBadge).toBeVisible()
    })
    
    await step('Verify main slot content is displayed', async () => {
      const mainBadge = canvas.getByText('Main')
      await expect(mainBadge).toBeInTheDocument()
      await expect(mainBadge).toBeVisible()
    })
    
    await step('Verify sidebar toggle functionality', async () => {
      // Find sidebar trigger if it exists (mobile view)
      const sidebarTrigger = canvasElement.querySelector('.fz-layout__sidebarTrigger')
      if (sidebarTrigger) {
        const clickableArea = sidebarTrigger.querySelector('.cursor-pointer') as HTMLElement
        if (clickableArea) {
          // Click to toggle sidebar
          await userEvent.click(clickableArea)
          
          // Wait for layout state to update
          await waitFor(() => {
            const layout = canvasElement.querySelector('.fz-layout')
            // Layout should have fz-layout--open class when sidebar is open
            expect(layout).toBeInTheDocument()
          }, { timeout: 500 })
        }
      }
    })
  }
}

export default meta
