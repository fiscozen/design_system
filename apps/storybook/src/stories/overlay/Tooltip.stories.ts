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
    withIcon: { control: { type: 'boolean' } }
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
            
            <FzTooltip text="Image with tooltip">
              <img src="https://via.placeholder.com/40" alt="User avatar" class="rounded-full" />
            </FzTooltip>
            
            <FzTooltip text="Text with tooltip" status="informative" :withIcon="true">
              <span class="text-sm font-medium">Hover me</span>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            ✅ Clean tab order: wrapper + content are non-interactive
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">Works but creates extra tab stop</h3>
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
            ⚠️ Nested interactive elements: 2 tab stops (wrapper + button/link)
          </p>
        </div>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test with non-interactive element (icon)
    const iconWrapper = canvas.getByText('⚙️').closest('span[tabindex="0"]')
    expect(iconWrapper).toBeInTheDocument()
    expect(iconWrapper).toHaveAttribute('tabindex', '0')
    
    // Test hover on icon
    await userEvent.hover(iconWrapper!)
    
    // Wait for the icon tooltip to appear - aria-describedby is set when tooltip is shown
    await waitFor(async () => {
      const iconAriaDescribedby = iconWrapper!.getAttribute('aria-describedby')
      expect(iconAriaDescribedby).not.toBeNull()
      
      const tooltip = document.getElementById(iconAriaDescribedby!)
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toHaveTextContent('This is an icon with tooltip')
    })
    
    await userEvent.unhover(iconWrapper!)
    await waitFor(async () => {
      const iconAriaDescribedby = iconWrapper!.getAttribute('aria-describedby')
      if (iconAriaDescribedby) {
        const tooltip = document.getElementById(iconAriaDescribedby)
        expect(tooltip).toHaveAttribute('aria-hidden', 'true')
      }
    }, { timeout: 500 })
    
    // Test with button (nested interactive element)
    const button = canvas.getByRole('button', { name: /save/i })
    const buttonWrapper = button.closest('span[tabindex="0"]')
    expect(buttonWrapper).toBeInTheDocument()
    
    // Test hover on button wrapper
    await userEvent.hover(buttonWrapper!)
    
    // Wait for the button tooltip to appear - aria-describedby is set when tooltip is shown
    await waitFor(async () => {
      const buttonAriaDescribedby = buttonWrapper!.getAttribute('aria-describedby')
      expect(buttonAriaDescribedby).not.toBeNull()
      
      const tooltip = document.getElementById(buttonAriaDescribedby!)
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toHaveTextContent('Button with tooltip')
    })
  }
}

// Story dedicata ai test di navigazione da tastiera
export const KeyboardNavigation: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzTooltip },
    template: `
      <div class="p-16">
        <h3 class="text-lg font-semibold mb-8">Keyboard Navigation Tests</h3>
        <div class="flex gap-16">
          <FzTooltip text="Focus to show tooltip">
            <span class="text-sm font-medium" data-testid="kbd-trigger">Tab here</span>
          </FzTooltip>
        </div>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test 1: Show tooltip on focus
    const trigger = canvas.getByTestId('kbd-trigger')
    const wrapper = trigger.closest('span[tabindex="0"]') as HTMLElement
    
    // Focus on wrapper
    wrapper.focus()
    
    // Wait for tooltip to be teleported and rendered
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toBeVisible()
    })
    
    // Test 2: Hide tooltip on blur
    wrapper.blur()
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    })
    
    // Test 3: Hide tooltip on Escape key
    wrapper.focus()
    
    // Wait for tooltip to be shown again
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    })
    
    await userEvent.keyboard('{Escape}')
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    })
  }
}

// Story dedicata ai test ARIA
export const AccessibilityARIA: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzTooltip },
    template: `
      <div class="p-16">
        <h3 class="text-lg font-semibold mb-8">ARIA Attributes Tests</h3>
        <FzTooltip text="Accessible tooltip content" data-testid="aria-tooltip">
          <span data-testid="aria-trigger">ARIA Test</span>
        </FzTooltip>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test 1: Verify trigger has correct ARIA attributes
    const trigger = canvas.getByTestId('aria-trigger')
    const wrapper = trigger.closest('span[tabindex="0"]')!
    
    expect(wrapper).toHaveAttribute('tabindex', '0')
    
    // Test 2: Verify no visible tooltips initially
    const visibleTooltipsBefore = document.querySelectorAll('[role="tooltip"][aria-hidden="false"]')
    expect(visibleTooltipsBefore.length).toBe(0)
    
    // Test 3: Show tooltip and verify it appears with correct attributes
    await userEvent.hover(wrapper)
    
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"][aria-hidden="false"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('role', 'tooltip')
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    })
    
    // Test 4: Verify aria-describedby connection
    await waitFor(async () => {
      const ariaDescribedby = wrapper.getAttribute('aria-describedby')
      expect(ariaDescribedby).not.toBeNull()
      
      const tooltip = document.querySelector('[role="tooltip"][aria-hidden="false"]')
      const tooltipId = tooltip?.getAttribute('id')
      expect(tooltipId).toBe(ariaDescribedby)
    })
  }
}

// Story per testare con icone (withIcon prop)
export const WithIcons: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzTooltip },
    template: `
      <div class="p-16">
        <h3 class="text-lg font-semibold mb-8">Tooltips with Icons</h3>
        <div class="flex gap-16">
          <FzTooltip text="Informative with icon" status="informative" :withIcon="true">
            <span data-testid="info-icon">ℹ️</span>
          </FzTooltip>
          
          <FzTooltip text="Success with icon" status="positive" :withIcon="true">
            <span data-testid="success-icon">✓</span>
          </FzTooltip>
          
          <FzTooltip text="Warning with icon" status="alert" :withIcon="true">
            <span data-testid="alert-icon">⚠️</span>
          </FzTooltip>
          
          <FzTooltip text="Error with icon" status="error" :withIcon="true">
            <span data-testid="error-icon">✗</span>
          </FzTooltip>
        </div>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test informative tooltip with icon
    const infoTrigger = canvas.getByTestId('info-icon').closest('span[tabindex="0"]')!
    await userEvent.hover(infoTrigger)
    
    // Wait for tooltip to appear and aria-describedby to be set
    await waitFor(async () => {
      const infoAriaDescribedby = infoTrigger.getAttribute('aria-describedby')
      expect(infoAriaDescribedby).not.toBeNull()
      
      const tooltip = document.getElementById(infoAriaDescribedby!)
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toHaveTextContent('Informative with icon')
      // Verifica che l'icona sia presente nel tooltip
      const icon = tooltip?.querySelector('[class*="fa-circle-info"]') || tooltip?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
    
    await userEvent.unhover(infoTrigger)
    await waitFor(async () => {
      const infoAriaDescribedby = infoTrigger.getAttribute('aria-describedby')
      if (infoAriaDescribedby) {
        const tooltip = document.getElementById(infoAriaDescribedby)
        expect(tooltip).toHaveAttribute('aria-hidden', 'true')
      }
    }, { timeout: 500 })
    
    // Test alert tooltip with icon (dovrebbe avere testo nero)
    const alertTrigger = canvas.getByTestId('alert-icon').closest('span[tabindex="0"]')!
    await userEvent.hover(alertTrigger)
    
    // Wait for tooltip to appear and aria-describedby to be set
    await waitFor(async () => {
      const alertAriaDescribedby = alertTrigger.getAttribute('aria-describedby')
      expect(alertAriaDescribedby).not.toBeNull()
      
      const tooltip = document.getElementById(alertAriaDescribedby!)
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toHaveTextContent('Warning with icon')
    })
  }
}

// Story per testare hover persistence (WCAG 1.4.13)
export const HoverPersistence: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { FzTooltip },
    template: `
      <div class="p-16">
        <h3 class="text-lg font-semibold mb-8">Hover Persistence (WCAG 1.4.13)</h3>
        <FzTooltip text="This is a very long tooltip content that users might want to read carefully and interact with. The tooltip should remain visible when hovering over it." data-testid="persist-tooltip">
          <span data-testid="persist-trigger">Hover to test persistence</span>
        </FzTooltip>
      </div>
    `
  }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Show tooltip by hovering trigger
    const trigger = canvas.getByTestId('persist-trigger')
    const wrapper = trigger.closest('span[tabindex="0"]')!
    
    await userEvent.hover(wrapper)
    
    // Wait for tooltip to be teleported and rendered
    await waitFor(async () => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
      expect(tooltip).toBeVisible()
    })
    
    // Move mouse away from trigger (simulating moving to tooltip)
    await userEvent.unhover(wrapper)
    
    // Get tooltip element after it's confirmed to exist
    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement
    
    // Immediately hover the tooltip itself
    await userEvent.hover(tooltip)
    
    // Tooltip should still be visible
    await waitFor(async () => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    })
    
    // Leave the tooltip
    await userEvent.unhover(tooltip)
    
    // Now it should hide
    await waitFor(async () => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    }, { timeout: 500 })
  }
}
