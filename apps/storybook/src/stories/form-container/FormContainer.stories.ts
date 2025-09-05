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
/*
export const AdvancedForm: Story = {
  name: '🏢 Form Avanzato',
  render: () => ({
    components: { FzButton, FzInput },
    template: `
      <form class="fz-form-container">
        <h2>Configurazione Sistema</h2>
        
        <!-- Sezione 1: Configurazioni base -->
        <fieldset class="fz-form-group-vertical">
          <legend>Configurazioni Generali</legend>
          <FzInput type="text" placeholder="Nome applicazione" />
          <FzInput type="url" placeholder="URL base" />
          <FzInput type="email" placeholder="Email amministratore" />
        </fieldset>
        
        <!-- Campi distribuiti automaticamente -->
        <FzInput type="text" placeholder="Tema interfaccia" value="Auto" />
        <FzInput type="text" placeholder="Lingua predefinita" value="Italiano" />
        
        <!-- Actions inline integrate nel grid -->
        <div class="fz-form-actions-inline">
          <FzButton>Test Connessione</FzButton>
          <FzButton>Anteprima</FzButton>
        </div>
        
        <FzInput type="number" placeholder="Timeout sessione (min)" />
        <FzInput type="number" placeholder="Max file upload (MB)" />
        <FzInput type="text" placeholder="Prefisso API" />
        
        <!-- Sezione 2: Notifiche radio group -->
        <div class="fz-form-group-vertical">
          <h3>Modalità Notifiche</h3>
          <div class="fz-form-group-horizontal">
            <FzButton>🔔 Tutte</FzButton>
            <FzButton>⚠️ Importanti</FzButton>
            <FzButton>🔕 Nessuna</FzButton>
          </div>
        </div>
        
        <!-- Controlli orizzontali -->
        <div class="fz-form-group-horizontal">
          <FzButton>✅ Backup Auto</FzButton>
          <FzButton>📝 Log Dettagliati</FzButton>
          <FzButton>🐛 Debug Mode</FzButton>
        </div>
        
        <!-- Actions finali full-width -->
        <div class="fz-form-actions">
          <FzButton>Ripristina Default</FzButton>
          <FzButton>Salva Bozza</FzButton>
          <FzButton type="submit">Applica Configurazione</FzButton>
        </div>
      </form>
    `
  }),
}

export const TextareaForm: Story = {
  name: '📄 Form con Textarea',
  render: () => ({
    components: { FzButton, FzInput },
    template: `
      <form class="fz-form-container">
        <h2>Richiesta Supporto</h2>
        
        <!-- Informazioni base - grid intelligente -->
        <FzInput type="text" placeholder="Nome completo" />
        <FzInput type="email" placeholder="Email" />
        <FzInput type="tel" placeholder="Telefono" />
        
        <FzInput type="text" placeholder="Tipo di richiesta" value="Supporto tecnico" />
        <FzInput type="text" placeholder="Priorità" value="🟡 Media" />
        
        <FzInput type="text" placeholder="Numero ordine (opzionale)" />
        
        <!-- FzInput multiline AUTOMATICAMENTE full-width (grid breaker) -->
        <FzInput 
          class="fz-textarea" 
          multiline
          rows="5"
          placeholder="Descrivi dettagliatamente la tua richiesta. Includi tutti i passaggi che hanno portato al problema, eventuali messaggi di errore, e qualsiasi altra informazione utile..."
        />
        
        <!-- Il layout multi-colonna riprende automaticamente -->
        <FzInput type="date" placeholder="Data evento" />
        <FzInput type="url" placeholder="Link di riferimento" />
        
        <!-- Allegati inline -->
        <div class="fz-form-actions-inline">
          <FzButton>📎 Allega File</FzButton>
          <FzButton>📸 Screenshot</FzButton>
        </div>
        
        <!-- Preferenze contatto -->
        <div class="fz-form-group-vertical">
          <h3>Preferenze di contatto</h3>
          <div class="fz-form-group-horizontal">
            <FzButton>📧 Email</FzButton>
            <FzButton>📞 Telefono</FzButton>
            <FzButton>📧📞 Entrambi</FzButton>
          </div>
        </div>
        
        <!-- Privacy finale -->
        <div class="fz-form-group-horizontal">
            <FzButton>✅ Privacy Policy *</FzButton>
            <FzButton>📬 Aggiornamenti Email</FzButton>
        </div>
        
        <!-- Actions finali -->
        <div class="fz-form-actions">
          <FzButton>Salva Bozza</FzButton>
          <FzButton type="submit">Invia Richiesta</FzButton>
        </div>
      </form>
    `
  }),
}
*/
export default meta
