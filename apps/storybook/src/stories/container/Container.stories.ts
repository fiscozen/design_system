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
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation of the container'
    },

    mainGap: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: '📏 Dimensione del gap del main container (tra le sezioni)'
    },

    sectionGap: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: '📏 Dimensione del gap dei section container (tra gli elementi interni)'
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
    orientation: 'vertical'
  },
  render: (args: any) => ({
    components: { FzContainer, FzInput },
    setup() {
      return { args }
    },
    template: `
        <FzContainer main :gap="args.mainGap" :orientation="args.orientation">
          
          <FzContainer :gap="args.sectionGap" :orientation="args.orientation">
            <h2 class="text-xl font-semibold mb-2">Prima Sezione</h2>
            <FzInput label="Input 1" placeholder="Primo campo" />
            <FzInput label="Input 2" placeholder="Secondo campo" />
            <FzInput label="Input 3" placeholder="Terzo campo" />
            <FzInput label="Input 4" placeholder="Quarto campo" />
            <FzInput label="Input 5" placeholder="Quinto campo" />
          </FzContainer>
          
          <FzContainer :gap="args.sectionGap" :orientation="args.orientation">
            <h2 class="text-xl font-semibold mb-2">Seconda Sezione</h2>
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
            <h2 class="text-xl font-semibold mb-2">Prima Sezione</h2>
            <p>Questo è un paragrafo</p>
            <p>Questo è un paragrafo</p>
          </FzContainer>
          
          <FzContainer :gap="args.sectionGap">
            <h2 class="text-xl font-semibold mb-2">Seconda Sezione</h2>
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
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Horizontal Container with Buttons</h2>
        
        <FzContainer orientation="horizontal" :gap="args.gap">
          <FzButton>Button 1</FzButton>
          <FzButton variant="secondary">Button 2</FzButton>
          <FzButton variant="tertiary">Button 3</FzButton>
          <FzButton variant="danger">Button 4</FzButton>
        </FzContainer>
      </div>
    `
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    
    // Verify horizontal orientation class
    const container = canvasElement.querySelector('.fz-container')
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
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-6">Horizontal Containers with Different Gaps</h2>
        
        <FzContainer gap="lg">
          <div>
            <h3 class="text-lg font-medium mb-2">Gap: Small</h3>
            <FzContainer orientation="horizontal" gap="sm">
              <FzButton size="sm">Small Gap 1</FzButton>
              <FzButton size="sm">Small Gap 2</FzButton>
              <FzButton size="sm">Small Gap 3</FzButton>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-2">Gap: Base</h3>
            <FzContainer orientation="horizontal" gap="base">
              <FzButton>Base Gap 1</FzButton>
              <FzButton>Base Gap 2</FzButton>
              <FzButton>Base Gap 3</FzButton>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-2">Gap: Large</h3>
            <FzContainer orientation="horizontal" gap="lg">
              <FzButton>Large Gap 1</FzButton>
              <FzButton>Large Gap 2</FzButton>
              <FzButton>Large Gap 3</FzButton>
            </FzContainer>
          </div>
        </FzContainer>
      </div>
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
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Horizontal Container with Paragraphs</h2>
        
        <FzContainer orientation="horizontal" gap="base">
          <p class="border border-gray-300 p-2 rounded">Paragraph 1</p>
          <p class="border border-gray-300 p-2 rounded">Paragraph 2</p>
          <p class="border border-gray-300 p-2 rounded">Paragraph 3</p>
        </FzContainer>
        
        <p class="mt-4 text-sm text-gray-600">
          Note: In horizontal orientation, the special p+p spacing is not applied.
        </p>
      </div>
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