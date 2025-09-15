import type { Meta, StoryObj } from '@storybook/vue3'
import { FzContainer } from '@fiscozen/container'
import { FzInput } from '@fiscozen/input'

const meta: Meta<typeof FzContainer> = {
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
    // Main/Section type
    main: {
      control: 'boolean',
      description: '🎯 Se true usa stili "main", se false usa stili "section"'
    },
    
    // Gap size
    gap: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: '📏 Dimensione del gap tra elementi'
    },
    
    // HTML Tag
    tag: {
      control: 'text',
      description: 'Tag HTML da utilizzare per il container (default: div)'
    }
  }
}

export default meta
type Story = StoryObj<typeof FzContainer>

// Storia principale - Demo completa
export const Demo: Story = {
  render: () => ({
    components: { FzContainer, FzInput },
    template: `      
      <!-- Main Container -->
      <FzContainer main gap="lg">
        
        <FzContainer gap="base">
          <h2 class="text-xl font-semibold mb-2">Prima Sezione - 5 Input</h2>
          <FzInput label="Input 1" placeholder="Primo campo" />
          <FzInput label="Input 2" placeholder="Secondo campo" />
          <FzInput label="Input 3" placeholder="Terzo campo" />
          <FzInput label="Input 4" placeholder="Quarto campo" />
          <FzInput label="Input 5" placeholder="Quinto campo" />
        </FzContainer>
        
        <FzContainer gap="base">
          <h2 class="text-xl font-semibold mb-2">Seconda Sezione - 7 Input</h2>
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