import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzContainer } from '@fiscozen/container'
import { FzInput } from '@fiscozen/input'
import { FzButton } from '@fiscozen/button'
import { within, expect } from '@storybook/test'

const meta: Meta<any> = {
  title: 'Layout/FzContainer',
  component: FzContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Un componente Container semplice per creare stack verticali con controllo del gap.'
      }
    }
  },
  argTypes: {
    horizontal: {
      control: 'boolean',
      description: 'If true, elements align horizontally. Otherwise, vertically (default)'
    },

    layout: {
      control: 'select',
      options: ['default', 'expand-first', 'expand-all', 'space-between'],
      description: 'Layout behavior for horizontal containers (controls how child elements expand)',
      if: { arg: 'horizontal', eq: true }
    },

    mainGap: {
      name: 'gap',
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'gap del main container (tra le sezioni)'
    },

    sectionGap: {
      name: 'gap',
      control: 'select',
      options: ['none', 'xs', 'sm', 'base', 'lg'],
      description: 'gap dei section container (tra gli elementi interni)'
    },
  }
}

export default meta
type Story = StoryObj<any>

// Storia principale - Demo completa
export const Demo: Story = {
  args: {
    mainGap: 'base',
    sectionGap: 'base',
    horizontal: false
  },
  render: (args: any) => ({
    components: { FzContainer, FzInput },
    setup() {
      return { args }
    },
    template: `
        <FzContainer main :gap="args.mainGap" :horizontal="args.horizontal">
          
          <FzContainer :gap="args.sectionGap" :horizontal="args.horizontal">
            <h2>Prima Sezione</h2>
            <FzInput label="Input 1" placeholder="Primo campo" />
            <FzInput label="Input 2" placeholder="Secondo campo" />
            <FzInput label="Input 3" placeholder="Terzo campo" />
            <FzInput label="Input 4" placeholder="Quarto campo" />
            <FzInput label="Input 5" placeholder="Quinto campo" />
          </FzContainer>
          
          <FzContainer :gap="args.sectionGap" :horizontal="args.horizontal">
            <h2>Seconda Sezione</h2>
            <FzInput label="Input A" placeholder="Campo A" />
            <FzInput label="Input B" placeholder="Campo B" />
            <FzInput label="Input C" placeholder="Campo C" />
            <FzInput label="Input D" placeholder="Campo D" />
            <FzInput label="Input E" placeholder="Campo E" />
            <FzInput label="Input F" placeholder="Campo F" />
            <FzInput label="Input G" placeholder="Campo G" />
          </FzContainer>
          
        </FzContainer>
     `
    })
}

export const Paragraphs: Story = {
  args: {
    mainGap: 'base',
    sectionGap: 'base'
  },
  render: (args: any) => ({
    components: { FzContainer, FzInput },
    setup() {
      return { args }
    },
    template: `
        <FzContainer main :gap="args.mainGap">
          
          <FzContainer :gap="args.sectionGap">
            <h2>Prima Sezione</h2>
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
          </FzContainer>
          
          <FzContainer :gap="args.sectionGap">
            <h2>Seconda Sezione</h2>
            <p>Questo è un paragrafo</p>
            <FzInput label="Input A" placeholder="Campo A" />
            <FzInput label="Input B" placeholder="Campo B" />
            <FzInput label="Input C" placeholder="Campo C" />
            <p>Questo è un paragrafo</p>
            <FzInput label="Input D" placeholder="Campo D" />
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
            <FzInput label="Input E" placeholder="Campo E" />
            <FzInput label="Input F" placeholder="Campo F" />
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
            <FzInput label="Input G" placeholder="Campo G" />
            <FzInput label="Input H" placeholder="Campo H" />
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
          </FzContainer>
          
        </FzContainer>
     `
    }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify vertical orientation
    const containers = canvasElement.querySelectorAll('.fz-container')
    const mainContainer = containers[0]
    
    await expect(mainContainer.classList.contains('fz-container--vertical')).toBe(true)
    await expect(mainContainer.classList.contains('fz-container--horizontal')).toBe(false)
  }
}

export const HorizontalButtons: Story = {
  args: {
    gap: 'base'
  },
  render: (args: any) => ({
    components: { FzContainer, FzButton },
    setup() {
      return { args }
    },
    template: `
      <FzContainer main gap="lg">
        <h2>Horizontal Container with Buttons</h2>
        
        <FzContainer horizontal :gap="args.gap">
          <FzButton>Button 1</FzButton>
          <FzButton variant="secondary">Button 2</FzButton>
          <FzButton variant="tertiary">Button 3</FzButton>
          <FzButton variant="danger">Button 4</FzButton>
        </FzContainer>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify horizontal orientation class
    const container = canvasElement.querySelector('.fz-container--horizontal')
    await expect(container?.classList.contains('fz-container--horizontal')).toBe(true)
    await expect(container?.classList.contains('fz-container--vertical')).toBe(false)
    
    // Verify buttons are rendered
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(4)
    
    // Verify horizontal layout - buttons should be on the same row
    const firstButton = buttons[0].getBoundingClientRect()
    const secondButton = buttons[1].getBoundingClientRect()
    
    // Second button should be to the right of the first (not below)
    await expect(secondButton.left).toBeGreaterThan(firstButton.right - 1)
    
    // Buttons should be roughly on the same vertical position (allowing small differences)
    const verticalDiff = Math.abs(firstButton.top - secondButton.top)
    await expect(verticalDiff).toBeLessThan(5)
  }
}

export const HorizontalWithGaps: Story = {
  render: () => ({
    components: { FzContainer, FzButton },
    template: `
      <FzContainer main gap="lg">
        <h2>Horizontal Containers with Different Gaps</h2>
        
        <FzContainer gap="lg">
          <FzContainer gap="sm">
            <h3>Gap: Small</h3>
            <FzContainer horizontal gap="sm">
              <FzButton size="sm">Small Gap 1</FzButton>
              <FzButton size="sm">Small Gap 2</FzButton>
              <FzButton size="sm">Small Gap 3</FzButton>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Gap: Base</h3>
            <FzContainer horizontal gap="base">
              <FzButton>Base Gap 1</FzButton>
              <FzButton>Base Gap 2</FzButton>
              <FzButton>Base Gap 3</FzButton>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Gap: Large</h3>
            <FzContainer horizontal gap="lg">
              <FzButton>Large Gap 1</FzButton>
              <FzButton>Large Gap 2</FzButton>
              <FzButton>Large Gap 3</FzButton>
            </FzContainer>
          </FzContainer>
        </FzContainer>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify all horizontal containers have correct classes
    const horizontalContainers = canvasElement.querySelectorAll('.fz-container--horizontal')
    await expect(horizontalContainers.length).toBe(3)
    
    // Verify gap classes
    const smGapContainer = canvasElement.querySelector('.fz-container--horizontal.gap-section-content-sm')
    const baseGapContainer = canvasElement.querySelector('.fz-container--horizontal.gap-section-content-base')
    const lgGapContainer = canvasElement.querySelector('.fz-container--horizontal.gap-section-content-lg')
    
    await expect(smGapContainer).toBeTruthy()
    await expect(baseGapContainer).toBeTruthy()
    await expect(lgGapContainer).toBeTruthy()
    
    // Verify buttons are rendered
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(9)
  }
}

export const HorizontalParagraphs: Story = {
  render: () => ({
    components: { FzContainer },
    template: `
      <FzContainer main gap="lg">
        <h2>Horizontal Container with Paragraphs</h2>
        
        <FzContainer horizontal gap="base">
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <p>Paragraph 3</p>
        </FzContainer>
        
        <p>
          Note: In horizontal orientation, the special p+p spacing is not applied.
        </p>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify horizontal orientation
    const container = canvasElement.querySelector('.fz-container--horizontal')
    await expect(container).toBeTruthy()
    
    // Verify paragraphs are rendered
    const paragraphs = container?.querySelectorAll('p')
    await expect(paragraphs?.length).toBe(3)
  }
}

export const LayoutExpandFirst: Story = {
  render: () => ({
    components: { FzContainer, FzButton },
    template: `
      <FzContainer main gap="lg">
        <h2>Layout: Expand First</h2>
        <p>The first element expands to fill available space, while others maintain their natural size.</p>
        
        <FzContainer gap="lg">
          <FzContainer gap="sm">
            <h3>Task List Example</h3>
            <FzContainer horizontal layout="expand-first" gap="base">
              <FzContainer gap="sm">
                <p>Task name that can be very long</p>
                <p>This task description can contain a lot of text and will expand to fill the available space</p>
              </FzContainer>
              <FzButton variant="primary">Complete</FzButton>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Multiple Tasks</h3>
            <FzContainer gap="sm">
              <FzContainer horizontal layout="expand-first" gap="base">
                <FzContainer gap="sm">
                  <p>Task 1</p>
                  <p>Short description</p>
                </FzContainer>
                <FzButton variant="secondary" size="sm">Edit</FzButton>
              </FzContainer>
              
              <FzContainer horizontal layout="expand-first" gap="base">
                <FzContainer gap="sm">
                  <p>Task 2</p>
                  <p>Another task with a longer description that will expand</p>
                </FzContainer>
                <FzButton variant="secondary" size="sm">Edit</FzButton>
              </FzContainer>
              
              <FzContainer horizontal layout="expand-first" gap="base">
                <FzContainer gap="sm">
                  <p>Task 3</p>
                  <p>Final task</p>
                </FzContainer>
                <FzButton variant="secondary" size="sm">Edit</FzButton>
              </FzContainer>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Form Actions Example</h3>
            <FzContainer gap="base">
              <p>Form content goes here...</p>
              
              <FzContainer horizontal layout="expand-first" gap="base">
                <FzContainer></FzContainer>
                <FzContainer horizontal gap="sm">
                  <FzButton variant="tertiary">Cancel</FzButton>
                  <FzButton variant="primary">Save</FzButton>
                </FzContainer>
              </FzContainer>
            </FzContainer>
          </FzContainer>
        </FzContainer>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify all containers with layout-expand-first have the correct class
    const expandFirstContainers = canvasElement.querySelectorAll('.fz-container--horizontal.layout-expand-first')
    await expect(expandFirstContainers.length).toBe(5)
    
    // Verify they are all horizontal
    for (const container of expandFirstContainers) {
      await expect(container.classList.contains('fz-container--horizontal')).toBe(true)
      await expect(container.classList.contains('layout-expand-first')).toBe(true)
    }
    
    // Verify buttons are rendered
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBeGreaterThan(0)
    
    // Verify the first container's first child takes more space than the button
    const firstContainer = expandFirstContainers[0] as HTMLElement
    const firstChild = firstContainer.children[0] as HTMLElement
    const lastChild = firstContainer.children[firstContainer.children.length - 1] as HTMLElement
    
    // First child should be wider than last child (the button)
    await expect(firstChild.offsetWidth).toBeGreaterThan(lastChild.offsetWidth)
  }
}

export const LayoutExpandAll: Story = {
  render: () => ({
    components: { FzContainer, FzButton },
    template: `
      <FzContainer main gap="lg">
        <h2>Layout: Expand All</h2>
        <p>All elements expand equally to fill available space. Each element gets the same width.</p>
        
        <FzContainer gap="lg">
          <FzContainer gap="sm">
            <h3>Equal Width Buttons</h3>
            <FzContainer horizontal layout="expand-all" gap="base">
              <FzButton variant="primary">Button 1</FzButton>
              <FzButton variant="secondary">Button 2</FzButton>
              <FzButton variant="tertiary">Button 3</FzButton>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Toolbar with Equal Sections</h3>
            <FzContainer horizontal layout="expand-all" gap="base">
              <FzContainer gap="xs">
                <p style="font-weight: bold;">Section 1</p>
                <p style="font-size: 0.875rem;">Content here</p>
              </FzContainer>
              <FzContainer gap="xs">
                <p style="font-weight: bold;">Section 2</p>
                <p style="font-size: 0.875rem;">Content here</p>
              </FzContainer>
              <FzContainer gap="xs">
                <p style="font-weight: bold;">Section 3</p>
                <p style="font-size: 0.875rem;">Content here</p>
              </FzContainer>
            </FzContainer>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Dashboard Cards</h3>
            <FzContainer horizontal layout="expand-all" gap="base">
              <div style="padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <p style="font-weight: bold;">Card 1</p>
                <p>Equal width card</p>
              </div>
              <div style="padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <p style="font-weight: bold;">Card 2</p>
                <p>Equal width card</p>
              </div>
              <div style="padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                <p style="font-weight: bold;">Card 3</p>
                <p>Equal width card</p>
              </div>
            </FzContainer>
          </FzContainer>
        </FzContainer>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify all containers with layout-expand-all have the correct class
    const expandAllContainers = canvasElement.querySelectorAll('.fz-container--horizontal.layout-expand-all')
    await expect(expandAllContainers.length).toBe(3)
    
    // Verify they are all horizontal
    for (const container of expandAllContainers) {
      await expect(container.classList.contains('fz-container--horizontal')).toBe(true)
      await expect(container.classList.contains('layout-expand-all')).toBe(true)
    }
    
    // Verify the first container has equal width children
    const firstContainer = expandAllContainers[0] as HTMLElement
    const children = Array.from(firstContainer.children) as HTMLElement[]
    
    // All children should have similar widths (allowing small differences for rounding)
    if (children.length > 1) {
      const firstWidth = children[0].offsetWidth
      for (let i = 1; i < children.length; i++) {
        const widthDiff = Math.abs(children[i].offsetWidth - firstWidth)
        await expect(widthDiff).toBeLessThan(5)
      }
    }
  }
}

export const LayoutSpaceBetween: Story = {
  render: () => ({
    components: { FzContainer, FzButton },
    template: `
      <FzContainer main gap="lg">
        <h2>Layout: Space Between</h2>
        <p>Elements maintain their natural size but are distributed with space between them. First element aligns to the start, last element aligns to the end.</p>
        
        <FzContainer gap="lg">
          <FzContainer gap="sm">
            <h3>Navbar Example</h3>
            <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
              <FzContainer horizontal layout="space-between" gap="base">
                <div style="font-weight: bold; font-size: 1.25rem;">Logo</div>
                <FzContainer horizontal gap="sm">
                  <FzButton variant="tertiary" size="sm">Home</FzButton>
                  <FzButton variant="tertiary" size="sm">About</FzButton>
                  <FzButton variant="tertiary" size="sm">Contact</FzButton>
                </FzContainer>
              </FzContainer>
            </div>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Header with Actions</h3>
            <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
              <FzContainer horizontal layout="space-between" gap="base">
                <FzContainer gap="xs">
                  <p style="font-weight: bold; margin: 0;">Page Title</p>
                  <p style="font-size: 0.875rem; margin: 0; color: #666;">Subtitle or description</p>
                </FzContainer>
                <FzContainer horizontal gap="sm">
                  <FzButton variant="tertiary" size="sm">Cancel</FzButton>
                  <FzButton variant="primary" size="sm">Save</FzButton>
                </FzContainer>
              </FzContainer>
            </div>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>List Item with Action</h3>
            <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
              <FzContainer horizontal layout="space-between" gap="base">
                <p style="margin: 0;">Item name or description</p>
                <FzButton variant="secondary" size="sm">Edit</FzButton>
              </FzContainer>
            </div>
          </FzContainer>
          
          <FzContainer gap="sm">
            <h3>Footer Example</h3>
            <div style="padding: 1rem; background: #f5f5f5; border-radius: 4px;">
              <FzContainer horizontal layout="space-between" gap="base">
                <p style="margin: 0; font-size: 0.875rem; color: #666;">© 2025 Company Name</p>
                <FzContainer horizontal gap="sm">
                  <a href="#" style="font-size: 0.875rem; color: #666;">Privacy</a>
                  <a href="#" style="font-size: 0.875rem; color: #666;">Terms</a>
                  <a href="#" style="font-size: 0.875rem; color: #666;">Contact</a>
                </FzContainer>
              </FzContainer>
            </div>
          </FzContainer>
        </FzContainer>
      </FzContainer>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify all containers with layout-space-between have the correct class
    const spaceBetweenContainers = canvasElement.querySelectorAll('.fz-container--horizontal.layout-space-between')
    await expect(spaceBetweenContainers.length).toBe(4)
    
    // Verify they are all horizontal
    for (const container of spaceBetweenContainers) {
      await expect(container.classList.contains('fz-container--horizontal')).toBe(true)
      await expect(container.classList.contains('layout-space-between')).toBe(true)
    }
    
    // Verify the first container has space between children
    const firstContainer = spaceBetweenContainers[0] as HTMLElement
    const firstChild = firstContainer.children[0] as HTMLElement
    const lastChild = firstContainer.children[firstContainer.children.length - 1] as HTMLElement
    
    // First child should be at the left edge
    const containerRect = firstContainer.getBoundingClientRect()
    const firstChildRect = firstChild.getBoundingClientRect()
    const lastChildRect = lastChild.getBoundingClientRect()
    
    // First child should be near the left edge (allowing small padding)
    await expect(Math.abs(firstChildRect.left - containerRect.left)).toBeLessThan(5)
    
    // Last child should be near the right edge (allowing small padding)
    await expect(Math.abs(containerRect.right - lastChildRect.right)).toBeLessThan(5)
  }
}