import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzDivider, FzDividerProps } from '@fiscozen/divider'

const meta: Meta<typeof FzDivider> = {
  title: 'Panel/FzDivider',
  component: FzDivider,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const simpleDivider = (args: FzDividerProps) => ({
  setup() {
    return { args }
  },
  components: { FzDivider },
  template: `
    <div class="w-screen h-screen">
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pulvinar et arcu eu dapibus. In posuere dictum mi convallis vestibulum. Sed sed lectus urna. Nulla sed velit maximus tellus commodo aliquam. Nullam id metus nunc. Integer hendrerit sagittis accumsan. Pellentesque accumsan a diam a bibendum. Mauris pellentesque ipsum mi, lacinia elementum mauris viverra sit amet. Morbi condimentum nisl vitae eros lobortis, ac accumsan elit vulputate. Fusce fringilla, mi et pharetra fermentum, nunc sapien suscipit ligula, elementum sollicitudin est orci sit amet orci. Aenean semper consequat odio et porta. Suspendisse ut scelerisque purus, ac pellentesque justo. Praesent a gravida ipsum. Maecenas elit lacus, consequat sit amet mauris et, imperdiet fringilla metus.
      </div>
      <FzDivider v-bind="args" />
      <div>
        Donec lacus sapien, semper ac rhoncus id, rutrum id eros. Nunc purus odio, dignissim dignissim erat id, tempor pulvinar est. Aenean faucibus eu mi quis placerat. Sed at magna vestibulum, tempus arcu sed, tristique nibh. Phasellus rutrum faucibus luctus. Sed pretium risus a dolor viverra, non pretium quam ornare. Mauris nulla arcu, tincidunt ac leo vitae, vestibulum iaculis turpis. In sed lectus diam. In ipsum nibh, egestas at convallis et, rutrum nec tellus. Nunc vitae scelerisque risus, rutrum pharetra enim. Pellentesque malesuada semper elit, convallis mattis est molestie aliquet. Curabitur ut sodales nibh. Phasellus sodales vulputate sem. Etiam in efficitur justo, vel placerat metus.
      </div>
    </div>
  `
})

const Default: Story = {
  args: {},
  render: simpleDivider,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify divider renders correctly', async () => {
      const divider = canvasElement.querySelector('.border-t-1')
      await expect(divider).toBeInTheDocument()
      await expect(divider).toBeVisible()
    })
    
    await step('Verify divider has correct border styling', async () => {
      const divider = canvasElement.querySelector('.border-t-1')
      await expect(divider).toHaveClass('border-t-1')
      await expect(divider).toHaveClass('border-grey-200')
      await expect(divider).toHaveClass('border-solid')
    })
    
    await step('Verify divider has correct spacing', async () => {
      const dividerContainer = canvasElement.querySelector('.my-16')
      await expect(dividerContainer).toBeInTheDocument()
      await expect(dividerContainer).toHaveClass('my-16')
    })
    
    await step('Verify divider is full width', async () => {
      const dividerContainer = canvasElement.querySelector('.w-full')
      await expect(dividerContainer).toBeInTheDocument()
      await expect(dividerContainer).toHaveClass('w-full')
    })
    
    await step('Verify no label is present when label prop is not provided', async () => {
      const label = canvasElement.querySelector('span')
      await expect(label).not.toBeInTheDocument()
    })
  }
}

const WithLabel: Story = {
  args: { label: 'This is a label' },
  render: simpleDivider,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify divider with label renders correctly', async () => {
      const dividerContainer = canvasElement.querySelector('.flex.items-center')
      await expect(dividerContainer).toBeInTheDocument()
      await expect(dividerContainer).toBeVisible()
    })
    
    await step('Verify label text is displayed', async () => {
      const label = canvas.getByText('This is a label')
      await expect(label).toBeInTheDocument()
      await expect(label).toBeVisible()
    })
    
    await step('Verify label has correct styling', async () => {
      const label = canvas.getByText('This is a label')
      await expect(label).toHaveClass('text-md')
    })
    
    await step('Verify divider lines are present on both sides of label', async () => {
      const dividerLines = canvasElement.querySelectorAll('.border-t-1.border-grey-200')
      // Should have 2 divider lines (one on each side of the label)
      await expect(dividerLines.length).toBe(2)
    })
    
    await step('Verify divider container has flex layout', async () => {
      const dividerContainer = canvasElement.querySelector('.flex.items-center')
      await expect(dividerContainer).toHaveClass('flex')
      await expect(dividerContainer).toHaveClass('items-center')
      await expect(dividerContainer).toHaveClass('gap-6')
    })
    
    await step('Verify divider lines have flex-1 class for equal spacing', async () => {
      const dividerLines = canvasElement.querySelectorAll('.flex-1')
      // Should have 2 flex-1 elements (the divider lines on each side)
      await expect(dividerLines.length).toBe(2)
    })
  }
}

export { Default, WithLabel }

// ============================================
// ADDITIONAL STORIES FOR COMPREHENSIVE TESTING
// ============================================

export const WithCustomLabelClass: Story = {
  args: { 
    label: 'Custom styled label',
    labelClass: 'font-bold text-blue-500'
  },
  render: simpleDivider,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify label with custom class renders correctly', async () => {
      const label = canvas.getByText('Custom styled label')
      await expect(label).toBeInTheDocument()
      await expect(label).toBeVisible()
    })
    
    await step('Verify custom label classes are applied', async () => {
      const label = canvas.getByText('Custom styled label')
      await expect(label).toHaveClass('font-bold')
      await expect(label).toHaveClass('text-blue-500')
    })
    
    await step('Verify default text-md class is still present', async () => {
      const label = canvas.getByText('Custom styled label')
      await expect(label).toHaveClass('text-md')
    })
  }
}

export const EmptyLabel: Story = {
  args: { label: '' },
  render: simpleDivider,
  play: async ({ canvasElement, step }) => {
    await step('Verify divider handles empty label gracefully', async () => {
      // When label is empty string, it should render as simple divider (no label)
      const divider = canvasElement.querySelector('.border-t-1')
      await expect(divider).toBeInTheDocument()
      
      // Should not have the flex container for label
      const flexContainer = canvasElement.querySelector('.flex.items-center')
      await expect(flexContainer).not.toBeInTheDocument()
    })
  }
}

export const LongLabel: Story = {
  args: { 
    label: 'This is a very long label that might need to wrap or truncate depending on the container width and styling'
  },
  render: simpleDivider,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify long label renders correctly', async () => {
      const label = canvas.getByText(/This is a very long label/)
      await expect(label).toBeInTheDocument()
      await expect(label).toBeVisible()
    })
    
    await step('Verify divider lines are still present with long label', async () => {
      const dividerLines = canvasElement.querySelectorAll('.border-t-1.border-grey-200')
      await expect(dividerLines.length).toBe(2)
    })
    
    await step('Verify container handles long text gracefully', async () => {
      const dividerContainer = canvasElement.querySelector('.flex.items-center')
      await expect(dividerContainer).toBeInTheDocument()
      
      // Container should be visible and handle long text
      const containerRect = dividerContainer?.getBoundingClientRect()
      await expect(containerRect?.width).toBeGreaterThan(0)
      await expect(containerRect?.height).toBeGreaterThan(0)
    })
  }
}

export default meta
