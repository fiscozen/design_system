import type { Meta, StoryObj } from '@storybook/vue3'

import { FzButton } from '@fiscozen/button'
import { FzInput } from '@fiscozen/input'
import { FzTextarea } from '@fiscozen/textarea'

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
  name: 'Basic Form',
  render: () => ({
    components: { FzButton, FzInput },
    template: `
      <form class="fz-form-container">

        <FzInput type="text" placeholder="Mario" label="Nome" />
        <FzInput type="text" placeholder="Rossi" label="Cognome" />
        <FzInput type="email" placeholder="mario.rossi@example.com" label="Email" />
        <FzInput type="password" placeholder="••••••" label="Password" />
        <FzInput type="password" placeholder="••••••" label="Conferma Password" />
        
        <fieldset class="fz-form-actions">
          <FzButton>Annulla</FzButton>
          <FzButton type="submit">Crea Account</FzButton>
        </fieldset>
      </form>
    `
  }),
}

export const TextareaForm: Story = {
    name: 'Textarea Form',
    render: () => ({
      components: { FzButton, FzInput, FzTextarea },
      template: `
        <form class="fz-form-container">
          <FzInput type="text" placeholder="Mario" label="Nome" />
          <FzInput type="text" placeholder="Rossi" label="Cognome" />

          <FzInput type="tel" placeholder="5551234567" label="Telefono" />

          <FzInput type="email" placeholder="mario.rossi@example.com" label="Email" />

          <FzTextarea class="fz-textarea" placeholder="Descrivi la tua richiesta..." rows="4" label="Richiesta" />

          <FzInput type="password" placeholder="••••••" label="Password" />
          <FzInput type="password" placeholder="••••••" label="Conferma Password" />

          <fieldset class="fz-form-actions">
            <FzButton>Annulla</FzButton>
            <FzButton type="submit">Crea Account</FzButton>
          </fieldset>
        </form>
      `
    }),
  }

export const AdvancedForm: Story = {
    name: 'Advanced Form',
    render: () => ({
      components: { FzButton, FzInput },
      template: `
        <form class="fz-form-container">
          <fieldset class="fz-form-group-vertical bg-gray-100">
            <FzInput type="text" placeholder="Mario" label="Nome" />
            <FzInput type="text" placeholder="Rossi" label="Cognome" />
          </fieldset>
        
          <fieldset class="fz-form-group-vertical bg-gray-100">
            <fieldset class="fz-form-group-horizontal">
              <FzInput type="tel" placeholder="+01" label="Prefisso" />
              <FzInput type="tel" placeholder="5551234567" label="Telefono" />
            </fieldset>
        
            <FzInput type="email" placeholder="mario.rossi@example.com" label="Email" />
          </fieldset>

          <fieldset class="fz-form-group-vertical bg-gray-100">
            <FzInput type="password" placeholder="••••••" label="Password" />
            <FzInput type="password" placeholder="••••••" label="Conferma Password" />
          </fieldset>

          <fieldset class="fz-form-actions bg-gray-100">
            <FzButton>Annulla</FzButton>
            <FzButton type="submit">Crea Account</FzButton>
          </fieldset>
        </form>
      `
    }),
  }

  export default meta
