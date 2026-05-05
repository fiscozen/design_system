import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { FzStepper } from '@fiscozen/stepper'
import { ref } from 'vue'

const meta: Meta<typeof FzStepper> = {
  title: 'Navigation/FzStepper',
  component: FzStepper,
  tags: ['autodocs'],
  argTypes: {
    environment: {
      control: 'select',
      options: ['frontoffice', 'backoffice']
    },
    hasStepbar: { control: 'boolean' },
    hasStepperList: { control: 'boolean' },
    forceMobile: { table: { disable: true } }
  },
  args: {
    environment: 'frontoffice',
    hasStepbar: true,
    hasStepperList: true
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const steps = [
  {
    title: 'Informazioni',
    description: 'Inserisci i dati personali',
    status: 'completed' as const
  },
  {
    title: 'Documenti',
    description: 'Carica i documenti richiesti'
  },
  {
    title: 'Riepilogo',
    description: 'Verifica e conferma',
    status: 'error' as const
  },
  {
    title: 'Pagamento',
    description: 'Seleziona il metodo di pagamento'
  },
  {
    title: 'Conferma',
    description: 'Completa il processo'
  }
]

const truncatedSteps = [
  {
    title: 'Caricamento dei documenti di identità e fiscali obbligatori',
    description:
      'Carica il documento di identità in corso di validità e il codice fiscale in formato PDF',
    isTextTruncated: true,
    status: 'completed' as const
  },
  {
    title: 'Verifica e validazione dei dati inseriti nel modulo di registrazione',
    description:
      'Controlla attentamente tutte le informazioni inserite prima di procedere con la fase successiva',
    isTextTruncated: true
  },
  {
    title: 'Conferma definitiva e invio della pratica al commercialista assegnato',
    description:
      'La pratica verrà inviata al commercialista che ti contatterà entro 24 ore lavorative',
    isTextTruncated: true
  },
  {
    title: 'Revisione approfondita dei termini e delle condizioni contrattuali',
    description:
      'Leggi con attenzione i termini del contratto prima di procedere con la firma digitale',
    isTextTruncated: true
  },
  {
    title: 'Pagamento della quota di iscrizione e attivazione del servizio',
    description:
      'Seleziona il metodo di pagamento preferito tra carta di credito, bonifico o PayPal',
    isTextTruncated: true
  },
  {
    title: 'Ricezione della conferma e accesso alla dashboard personale',
    description:
      'Riceverai una email di conferma con le credenziali di accesso alla tua area riservata',
    isTextTruncated: true
  }
]

const renderTemplate = `
  <div class="w-full flex flex-col items-center">
    <FzStepper v-bind="args" v-model:activeStep="activeStep" />
    <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
      current active step is {{activeStep + 1}}
    </div>
  </div>
`

const defaultDecorator = [
  () => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })
]

function makeRender(initialStep = 1) {
  return (args: any) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(initialStep)
      return { args, activeStep }
    },
    template: renderTemplate
  })
}

// ============================================
// DEFAULT
// ============================================

const defaultSteps = [
  { title: 'Completed', description: 'This step is completed', status: 'completed' as const },
  { title: 'Current', description: 'This is the active step' },
  { title: 'Default', description: 'This step has no status' },
  { title: 'Error', description: 'This step has an error', status: 'error' as const },
  { title: 'Disabled', description: 'This step is disabled', status: 'disabled' as const }
]

export const Default: Story = {
  args: { steps: defaultSteps },
  decorators: defaultDecorator,
  render: makeRender(1),
  play: async ({ canvasElement, step }) => {
    await step('Verify stepper renders', async () => {
      await expect(canvasElement.querySelector('.fz-stepper')).toBeInTheDocument()
    })

    await step('Verify all 5 steps are rendered', async () => {
      const stepEls = canvasElement.querySelectorAll('.fz-stepper__step')
      await expect(stepEls.length).toBe(5)
    })

    await step('Verify progress bars are visible', async () => {
      const bars = canvasElement.querySelectorAll('.fz-stepper__progress')
      await expect(bars.length).toBeGreaterThan(0)
    })
  }
}

// ============================================
// ENVIRONMENT
// ============================================

export const Frontoffice: Story = {
  args: { steps, environment: 'frontoffice' },
  decorators: defaultDecorator,
  render: makeRender(1),
  play: async ({ canvasElement, step }) => {
    await step('Verify current step bar is blue', async () => {
      const bars = canvasElement.querySelectorAll('.fz-stepper__progress')
      const currentBar = Array.from(bars).find((b) => b.classList.contains('bg-blue-500'))
      await expect(currentBar).toBeInTheDocument()
    })
  }
}

export const Backoffice: Story = {
  args: { steps, environment: 'backoffice' },
  decorators: defaultDecorator,
  render: makeRender(1),
  play: async ({ canvasElement, step }) => {
    await step('Verify current step bar is blue (bar is always blue)', async () => {
      const bars = canvasElement.querySelectorAll('.fz-stepper__progress')
      const currentBar = Array.from(bars).find((b) => b.classList.contains('bg-blue-500'))
      await expect(currentBar).toBeInTheDocument()
    })
  }
}

// ============================================
// STEPBAR
// ============================================

export const NoStepbar: Story = {
  args: { steps, hasStepbar: false },
  decorators: defaultDecorator,
  render: makeRender(1),
  play: async ({ canvasElement, step }) => {
    await step('Verify stepbar is hidden', async () => {
      const bars = canvasElement.querySelectorAll('.fz-stepper__progress')
      await expect(bars.length).toBe(0)
    })

    await step('Verify steps are still rendered', async () => {
      const stepEls = canvasElement.querySelectorAll('.fz-stepper__step')
      await expect(stepEls.length).toBe(5)
    })
  }
}

// ============================================
// TEXT TRUNCATION
// ============================================

export const TextTruncated: Story = {
  args: { steps: truncatedSteps },
  decorators: defaultDecorator,
  render: makeRender(0),
  play: async ({ canvasElement, step }) => {
    await step('Verify titles have truncate class', async () => {
      const titles = canvasElement.querySelectorAll('.fz-stepper__title')
      for (const title of Array.from(titles)) {
        await expect(title).toHaveClass('truncate')
      }
    })

    await step('Verify descriptions have truncate class', async () => {
      const descs = canvasElement.querySelectorAll('.fz-stepper__description')
      for (const desc of Array.from(descs)) {
        await expect(desc).toHaveClass('truncate')
      }
    })
  }
}

// ============================================
// DESCRIPTION VISIBILITY
// ============================================

export const NoDescription: Story = {
  args: {
    steps: steps.map((s) => ({ ...s, hasStepDescription: false }))
  },
  decorators: defaultDecorator,
  render: makeRender(1),
  play: async ({ canvasElement, step }) => {
    await step('Verify no description elements are rendered', async () => {
      const descs = canvasElement.querySelectorAll('.fz-stepper__description')
      await expect(descs.length).toBe(0)
    })

    await step('Verify step titles are still visible', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Informazioni')).toBeVisible()
    })
  }
}

// ============================================
// MOBILE
// ============================================

export const MobileWithList: Story = {
  args: { steps },
  decorators: defaultDecorator,
  render: makeRender(1),
  parameters: {
    viewport: { defaultViewport: 'xs' }
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify mobile layout renders', async () => {
      const stepper = canvasElement.querySelector('.fz-stepper.flex.flex-col')
      await expect(stepper).toBeInTheDocument()
    })

    await step('Verify dropdown is visible', async () => {
      const dropdown = canvasElement.querySelector('.fz-stepper__dropdown')
      await expect(dropdown).toBeInTheDocument()
    })

    await step('Verify active step title is displayed', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Documenti')).toBeVisible()
    })

    await step('Open dropdown and verify steps are listed', async () => {
      const dropdown = canvasElement.querySelector('.fz-stepper__dropdown')
      const opener = dropdown?.querySelector('.cursor-pointer') as HTMLElement
      if (opener) {
        await userEvent.click(opener)
        await waitFor(
          () => {
            expect(document.body.textContent).toContain('Riepilogo')
          },
          { timeout: 1000 }
        )
      }
    })
  }
}

export const MobileWithoutList: Story = {
  args: { steps, hasStepperList: false },
  decorators: defaultDecorator,
  render: makeRender(1),
  parameters: {
    viewport: { defaultViewport: 'xs' }
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify mobile layout renders', async () => {
      await expect(canvasElement.querySelector('.fz-stepper.flex.flex-col')).toBeInTheDocument()
    })

    await step('Verify dropdown is NOT rendered', async () => {
      await expect(canvasElement.querySelector('.fz-stepper__dropdown')).not.toBeInTheDocument()
    })

    await step('Verify active step is still displayed', async () => {
      const canvas = within(canvasElement)
      await expect(canvas.getByText('Documenti')).toBeVisible()
    })
  }
}

export default meta
