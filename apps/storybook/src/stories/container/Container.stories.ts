import type { Meta, StoryObj } from '@storybook/vue3'
import { FzContainer } from '@fiscozen/container'
import { FzInput } from '@fiscozen/input'

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
            <FzInput label="Input 1" placeholder="Primo campo" />
            <FzInput label="Input 2" placeholder="Secondo campo" />
            <FzInput label="Input 3" placeholder="Terzo campo" />
            <FzInput label="Input 4" placeholder="Quarto campo" />
            <FzInput label="Input 5" placeholder="Quinto campo" />
          </FzContainer>
          
          <FzContainer :gap="args.sectionGap">
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