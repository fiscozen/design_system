import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzTooltip } from '@fiscozen/tooltip'
import { FzButton } from '@fiscozen/button'
import { FzLink } from '@fiscozen/link'
import { expect, userEvent, within, waitFor } from '@storybook/test'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Overlay/FzTooltip',
  component: FzTooltip,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['neutral', 'informative', 'positive', 'alert', 'error']
    },
    position: {
      control: { type: 'select' },
      options: [
        'auto',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ]
    },
    text: { control: { type: 'text' } },
    withIcon: { control: { type: 'boolean' } },
    interactive: { 
      control: { type: 'select' },
      options: [undefined, 'auto', true, false],
      description: 'Controls interactive behavior: undefined/"auto" (auto-detect FzButton/FzLink), true (force interactive), false (force non-interactive)'
    }
  },
  args: {
    position: 'auto'
  }
} satisfies Meta<typeof FzTooltip>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

const gridClasses = {
  tl: 'col-start-1 row-start-1',
  t: 'col-start-2 row-start-1 justify-center',
  tr: 'col-start-3 row-start-1 justify-end',
  r: 'col-start-3 row-start-2 justify-end items-center',
  br: 'col-start-3 row-start-3 justify-end items-end',
  b: 'col-start-2 row-start-3 justify-center items-end',
  bl: 'col-start-1 row-start-3 items-end',
  l: 'col-start-1 row-start-2 items-center'
}

const simpletemplate = `
  <div class="h-11/12 w-11/12" :class="args.classes"> 
    <FzTooltip :text="args.text" :status="args.status">
      <span>hover</span>
    </FzTooltip>
  </div>
`
const template = `
  <div class="h-[200vh] w-[100vw]" :class="['grid', 'grid-cols-3', 'grid-rows-3', 'grow-0', args.classes]"> 
    <div v-for="(gridClass, key) in gridClasses" :class="['container', 'flex', 'flex-row', gridClass]">
      <FzTooltip :text="args.text" :status="args.status">
        <span>hover</span>
      </FzTooltip>
      <FzTooltip :text="args.text" :status="args.status" class="ml-12" :withIcon="true">
          <span>hover, with icon</span>
      </FzTooltip>
    </div>
  </div>
`

export const NeutralTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template: simpletemplate
  }),
  args: {
    status: 'neutral',
    text: 'this is a informative tooltip with a very long text that lets us test overflow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test 1: Verify trigger element is rendered
    const trigger = canvas.getByText('hover')
    expect(trigger).toBeInTheDocument()
    
    // Test 2: Verify no visible tooltips initially
    const visibleTooltipsBefore = document.querySelectorAll('[role="tooltip"][aria-hidden="false"]')
    expect(visibleTooltipsBefore.length).toBe(0)
    
    // Test 3: Show tooltip on hover
    const wrapper = trigger.closest('span[tabindex="0"]') || trigger
    await userEvent.hover(wrapper)
    
    // Wait for tooltip to be teleported and rendered
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"][aria-hidden="false"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toBeVisible()
      expect(tooltip).toHaveTextContent('this is a informative tooltip')
    })
    
    // Test 4: Hide tooltip on unhover
    await userEvent.unhover(wrapper)
    
    await waitFor(async () => {
      const visibleTooltips = document.querySelectorAll('[role="tooltip"][aria-hidden="false"]')
      expect(visibleTooltips.length).toBe(0)
    }, { timeout: 500 })
  }
}

export const InformativeTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'informative',
    text: 'this is a informative tooltip with a very long text that lets us test overflow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find first tooltip trigger
    const trigger = canvas.getAllByText('hover')[0]
    expect(trigger).toBeInTheDocument()
    
    // Hover to show tooltip
    const wrapper = trigger.closest('span[tabindex="0"]') || trigger
    await userEvent.hover(wrapper)
    
    // Wait for tooltip to be teleported and rendered
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toHaveTextContent('this is a informative tooltip')
    })
  }
}

export const PositiveTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'positive',
    text: 'this is a positive tooltip with a very long text that lets us test overflow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getAllByText('hover')[0]
    
    const wrapper = trigger.closest('span[tabindex="0"]') || trigger
    await userEvent.hover(wrapper)
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveTextContent('this is a positive tooltip')
    })
  }
}

export const AlertTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'alert',
    text: 'this is a alert tooltip with a very long text that lets us test overflow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getAllByText('hover')[0]
    
    const wrapper = trigger.closest('span[tabindex="0"]') || trigger
    await userEvent.hover(wrapper)
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveTextContent('this is a alert tooltip')
    })
  }
}

export const ErrorTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'error',
    text: 'this is a error tooltip with a very long text that lets us test overflow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getAllByText('hover')[0]
    
    const wrapper = trigger.closest('span[tabindex="0"]') || trigger
    await userEvent.hover(wrapper)
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveTextContent('this is a error tooltip')
    })
  }
}

export const WithInteractiveElements: Story = {
  render: (args) => ({
    setup() {
      const handleClick = (label: string) => alert(`Clicked: ${label}`)
      return { args, handleClick, FzButton, FzLink }
    },
    components: { FzTooltip, FzButton, FzLink },
    template: `
      <div class="flex flex-col gap-16 p-16">
        <div>
          <h3 class="text-lg font-semibold mb-8">Auto-detection (Recommended)</h3>
          <div class="flex gap-16 mb-12">
            <FzTooltip text="Save your changes">
              <FzButton @click="handleClick('Auto FzButton')">Save</FzButton>
            </FzTooltip>
            
            <FzTooltip text="Go to settings" status="informative">
              <FzLink to="/settings" @click.prevent="handleClick('Auto FzLink')">Settings</FzLink>
            </FzTooltip>
          </div>
          <div class="flex gap-16">
            <FzTooltip text="This is an icon with tooltip">
              <span class="text-2xl">⚙️</span>
            </FzTooltip>
            
            <FzTooltip text="Text with tooltip" status="informative" :withIcon="true">
              <span class="text-sm font-medium">Hover me</span>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            FzButton and FzLink are automatically detected as interactive (no wrapper tabindex).<br/>
            Non-interactive elements get tabindex="0" for keyboard accessibility.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">Native HTML elements (not auto-detected)</h3>
          <div class="flex gap-16">
            <FzTooltip text="Native button with tooltip">
              <button @click="handleClick('Native Button')" class="px-12 py-6 bg-orange-500 text-white rounded">
                Native Button
              </button>
            </FzTooltip>
            
            <FzTooltip text="Native link with tooltip" status="informative">
              <a href="#" @click.prevent="handleClick('Native Link')" class="text-orange-600 underline">
                Native Link
              </a>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            Warning: Double tab stops (wrapper + native element).<br/>
            Use FzButton/FzLink for auto-detection or set :interactive="true" to fix.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">Manual Override</h3>
          <div class="flex gap-16 mb-12">
            <FzTooltip text="Custom interactive element" :interactive="true">
              <span @click="handleClick('Custom')" class="cursor-pointer px-12 py-6 bg-purple-500 text-white rounded inline-block">
                Custom Interactive
              </span>
            </FzTooltip>
            
            <FzTooltip text="Native button optimized" :interactive="true">
              <button @click="handleClick('Native Optimized')" class="px-12 py-6 bg-green-500 text-white rounded">
                Native Optimized
              </button>
            </FzTooltip>
          </div>
          <div class="flex gap-16">
            <FzTooltip text="Disabled button info" :interactive="false">
              <FzButton disabled>Disabled</FzButton>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            :interactive="true" forces interactive behavior (removes wrapper tabindex).<br/>
            :interactive="false" forces non-interactive behavior (adds wrapper tabindex).<br/>
            Useful for disabled buttons that need to show tooltip on focus.
          </p>
        </div>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test 1: Auto-detected FzButton should NOT have wrapper tabindex
    const autoButton = canvas.getByRole('button', { name: 'Save' })
    const autoButtonWrapper = autoButton.parentElement
    expect(autoButtonWrapper).toBeInTheDocument()
    expect(autoButtonWrapper).not.toHaveAttribute('tabindex')
    
    // Test 2: Non-interactive span should have wrapper tabindex="0"
    const iconWrapper = canvas.getByText('⚙️').closest('span[tabindex="0"]')
    expect(iconWrapper).toBeInTheDocument()
    expect(iconWrapper).toHaveAttribute('tabindex', '0')
    
    // Test 3: Native button (not auto-detected) should have wrapper tabindex="0"
    const nativeButton = canvas.getByRole('button', { name: 'Native Button' })
    const nativeButtonWrapper = nativeButton.closest('span[tabindex="0"]')
    expect(nativeButtonWrapper).toBeInTheDocument()
    expect(nativeButtonWrapper).toHaveAttribute('tabindex', '0')
    
    // Test 4: Native button with :interactive="true" should NOT have wrapper tabindex
    const nativeOptimized = canvas.getByRole('button', { name: 'Native Optimized' })
    const nativeOptimizedWrapper = nativeOptimized.parentElement
    expect(nativeOptimizedWrapper).toBeInTheDocument()
    expect(nativeOptimizedWrapper).not.toHaveAttribute('tabindex')
    
    // Test 5: FzButton with :interactive="false" should have wrapper tabindex="0"
    const disabledButton = canvas.getByRole('button', { name: 'Disabled' })
    const disabledButtonWrapper = disabledButton.closest('span[tabindex="0"]')
    expect(disabledButtonWrapper).toBeInTheDocument()
    expect(disabledButtonWrapper).toHaveAttribute('tabindex', '0')
  }
}
