import type { Meta, StoryObj } from '@storybook/vue3'

import { FzButton } from '@fiscozen/button'
import { FzInput } from '@fiscozen/input'

const meta: Meta = {
  title: 'Layout/FzFormContainer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Form Container

## Setup

\`\`\`js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@fiscozen/form-container'),
  ]
}
\`\`\`

Sistema semplificato con **5 classi intelligenti** per form responsive:

- \`fz-form-container\` - Layout principale intelligente
- \`fz-form-group-vertical\` - Raggruppamento verticale  
- \`fz-form-group-horizontal\` - Raggruppamento orizzontale
- \`fz-form-actions\` - Action buttons full-width
- \`fz-form-actions-inline\` - Action buttons inline
`
      }
    }
  }
}

type Story = StoryObj<typeof meta>

export const BasicForm: Story = {
  name: 'Form Base',
  render: () => ({
    components: { FzButton, FzInput },
    template: `
      <form class="fz-form-container">

        <FzInput type="text" placeholder="Nome" />
        <FzInput type="text" placeholder="Cognome" />
        <FzInput type="email" placeholder="Email" />
        <FzInput type="tel" placeholder="Telefono" />
        <FzInput type="password" placeholder="Password" />
        <FzInput type="password" placeholder="Conferma Password" />
        
        <div class="fz-form-actions">
          <FzButton>Annulla</FzButton>
          <FzButton type="submit">Crea Account</FzButton>
        </div>
      </form>
    `
  }),
}

export const AdvancedForm: Story = {
    name: 'Advanced Base',
    render: () => ({
      components: { FzButton, FzInput },
      template: `
        <form class="fz-form-container">

          <FzInput type="text" placeholder="Nome" />
          <FzInput type="text" placeholder="Cognome" />
        
          <div class="fz-form-group-vertical">
            <div class="fz-form-group-horizontal">
              <FzInput type="tel" placeholder="+01" />
              <FzInput type="tel" placeholder="5551234567" />
            </div>
        
            <FzInput type="email" placeholder="Email" />
          </div>

          <div class="fz-form-group-vertical">
            <FzInput type="password" placeholder="Password" />
            <FzInput type="password" placeholder="Conferma Password" />
          </div>

          <div class="fz-form-actions">
            <FzButton>Annulla</FzButton>
            <FzButton type="submit">Crea Account</FzButton>
          </div>
        </form>
      `
    }),
  }

  export default meta
