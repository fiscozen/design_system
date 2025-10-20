import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzTooltip } from '@fiscozen/tooltip'
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
    isInteractive: { 
      control: { type: 'boolean' },
      description: 'Set to true when wrapping interactive elements to prevent double tab stops'
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
      return { args, handleClick }
    },
    components: { FzTooltip },
    template: `
      <div class="flex flex-col gap-16 p-16">
        <div>
          <h3 class="text-lg font-semibold mb-8">Recommended: Non-interactive elements</h3>
          <div class="flex gap-16">
            <FzTooltip text="This is an icon with tooltip">
              <span class="text-2xl">⚙️</span>
            </FzTooltip>
            
            <FzTooltip text="Text with tooltip" status="informative" :withIcon="true">
              <span class="text-sm font-medium">Hover me</span>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            Clean tab order: only the wrapper is focusable
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">Without isInteractive (not recommended)</h3>
          <div class="flex gap-16">
            <FzTooltip text="Button with tooltip">
              <button @click="handleClick('Save')" class="px-12 py-6 bg-blue-500 text-white rounded">
                Save
              </button>
            </FzTooltip>
            
            <FzTooltip text="Link with tooltip" status="informative">
              <a href="#" @click.prevent="handleClick('Link')" class="text-blue-600 underline">
                Click me
              </a>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            Double tab stops: wrapper (tabindex="0") + button/link
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">With isInteractive (recommended)</h3>
          <div class="flex gap-16">
            <FzTooltip text="Button with tooltip" isInteractive>
              <button @click="handleClick('Save Optimized')" class="px-12 py-6 bg-green-500 text-white rounded">
                Save
              </button>
            </FzTooltip>
            
            <FzTooltip text="Link with tooltip" status="informative" isInteractive>
              <a href="#" @click.prevent="handleClick('Link Optimized')" class="text-green-600 underline">
                Click me
              </a>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            Single tab stop: only the button/link (no wrapper tabindex)
          </p>
        </div>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test 1: Non-interactive element (icon) should have tabindex="0"
    const iconWrapper = canvas.getByText('⚙️').closest('span[tabindex="0"]')
    expect(iconWrapper).toBeInTheDocument()
    expect(iconWrapper).toHaveAttribute('tabindex', '0')
    
    // Test 2: Button WITHOUT isInteractive should have wrapper with tabindex="0"
    const allButtons = canvas.getAllByRole('button', { name: /Save/i })
    const buttonWithoutInteractive = allButtons[0] // First Save button (without isInteractive)
    const buttonWrapperOld = buttonWithoutInteractive.closest('span[tabindex="0"]')
    expect(buttonWrapperOld).toBeInTheDocument()
    expect(buttonWrapperOld).toHaveAttribute('tabindex', '0')
    
    // Test 3: Button WITH isInteractive should NOT have wrapper with tabindex
    const buttonWithInteractive = allButtons[1] // Second Save button (with isInteractive)
    const buttonWrapperNew = buttonWithInteractive.parentElement
    expect(buttonWrapperNew).toBeInTheDocument()
    expect(buttonWrapperNew).not.toHaveAttribute('tabindex')
    
    // Test 4: Links - verify both behaviors
    const allLinks = canvas.getAllByRole('link', { name: /Click me/i })
    
    // First link WITHOUT isInteractive should have wrapper with tabindex
    const linkWithoutInteractive = allLinks[0]
    const linkWrapperOld = linkWithoutInteractive.closest('span[tabindex="0"]')
    expect(linkWrapperOld).toBeInTheDocument()
    
    // Second link WITH isInteractive should NOT have wrapper with tabindex
    const linkWithInteractive = allLinks[1]
    const linkWrapperNew = linkWithInteractive.parentElement
    expect(linkWrapperNew).not.toHaveAttribute('tabindex')
  }
}
