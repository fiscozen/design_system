import type { Meta, StoryObj } from '@storybook/vue3'
import { FzContainer } from '@fiscozen/container'
import { FzButton } from '@fiscozen/button'
import { FzInput } from '@fiscozen/input'

const meta: Meta<typeof FzContainer> = {
  title: 'Layout/[DEPRECATED] FzContainer',
  component: FzContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Un componente Container SEMANTIC-FIRST per costruire layout di pagina.'
      }
    }
  },
  argTypes: {
    // Layout Basic
    display: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline-flex', 'inline-grid'],
      description: 'Tipo di display del container'
    },
    tag: {
      control: 'text',
      description: 'Tag HTML da utilizzare per il container (default: div)'
    },
    
    // Flex Layout
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      description: 'Direzione del flex (solo per display flex/inline-flex)'
    },
    wrap: {
      control: 'select',
      options: ['wrap', 'nowrap', 'wrap-reverse', true, false],
      description: 'Comportamento wrap del flex. Supporta valori boolean: true=wrap, false=nowrap'
    },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
      description: 'Allineamento principale (justify-content)'
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'baseline'],
      description: 'Allineamento secondario (align-items)'
    },
    
    // Grid Layout
    gridCols: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'none'],
      description: 'Numero di colonne grid (solo per display grid/inline-grid)'
    },
    gridRows: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', 'none'],
      description: 'Numero di righe grid (solo per display grid/inline-grid)'
    },
    
    // Gap (Semantic First)
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: '🌟 Gap tra elementi. RACCOMANDATO: valori semantici (none, xs, sm, md, lg, xl, 2xl)'
    },
    rowGap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Gap specifico tra righe. RACCOMANDATO: valori semantici'
    },
    colGap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Gap specifico tra colonne. RACCOMANDATO: valori semantici'
    },
    
    // Padding (Semantic First)
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: '🌟 Padding per tutti i lati. RACCOMANDATO: valori semantici (none, xs, sm, md, lg, xl, 2xl)'
    },
    paddingTop: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding superiore. RACCOMANDATO: valori semantici'
    },
    paddingRight: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding destro. RACCOMANDATO: valori semantici'
    },
    paddingBottom: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding inferiore. RACCOMANDATO: valori semantici'
    },
    paddingLeft: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding sinistro. RACCOMANDATO: valori semantici'
    },
    paddingX: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding orizzontale (left + right). RACCOMANDATO: valori semantici'
    },
    paddingY: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding verticale (top + bottom). RACCOMANDATO: valori semantici'
    },
    
    // Margin (Semantic First)
    margin: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: '🌟 Margin per tutti i lati. RACCOMANDATO: valori semantici (none, xs, sm, md, lg, xl, 2xl)'
    },
    marginTop: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin superiore. RACCOMANDATO: valori semantici'
    },
    marginRight: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin destro. RACCOMANDATO: valori semantici'
    },
    marginBottom: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin inferiore. RACCOMANDATO: valori semantici'
    },
    marginLeft: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin sinistro. RACCOMANDATO: valori semantici'
    },
    marginX: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin orizzontale (left + right). RACCOMANDATO: valori semantici'
    },
    marginY: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Margin verticale (top + bottom). RACCOMANDATO: valori semantici'
    },
    
    // Sizing
    width: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Larghezza del container'
    },
    height: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Altezza del container'
    },
    maxWidth: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Larghezza massima del container'
    },
    maxHeight: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Altezza massima del container'
    },
    minWidth: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Larghezza minima del container'
    },
    minHeight: {
      control: 'select',
      options: ['auto', 'full', 'screen', 'fit', 'max', 'min'],
      description: 'Altezza minima del container'
    },
    
    // Overflow
    overflow: {
      control: 'select',
      options: ['visible', 'hidden', 'scroll', 'auto'],
      description: 'Comportamento overflow per entrambi gli assi'
    },
    overflowX: {
      control: 'select',
      options: ['visible', 'hidden', 'scroll', 'auto'],
      description: 'Comportamento overflow per asse X'
    },
    overflowY: {
      control: 'select',
      options: ['visible', 'hidden', 'scroll', 'auto'],
      description: 'Comportamento overflow per asse Y'
    },
    
    // Boolean Controls
    fullWidth: {
      control: 'boolean',
      description: 'Se il container deve occupare tutta la larghezza disponibile'
    },
    fullHeight: {
      control: 'boolean',
      description: 'Se il container deve occupare tutta l\'altezza disponibile'
    },
    center: {
      control: 'boolean',
      description: '🎯 Centra il contenuto sia orizzontalmente che verticalmente'
    },
    centerX: {
      control: 'boolean',
      description: 'Centra il contenuto orizzontalmente'
    },
    centerY: {
      control: 'boolean',
      description: 'Centra il contenuto verticalmente'
    },
    
    // Custom
    class: {
      control: 'text',
      description: 'Classe CSS custom da applicare al container'
    }
  }
}

export default meta
type Story = StoryObj<typeof FzContainer>

// Storia base - Stack verticale
export const VerticalStack: Story = {
  args: {
    direction: 'column',
    gap: 'md',
    padding: 'lg'
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args">
        <div class="bg-blue-100 p-4 rounded">Elemento 1</div>
        <div class="bg-green-100 p-4 rounded">Elemento 2</div>
        <div class="bg-yellow-100 p-4 rounded">Elemento 3</div>
      </FzContainer>
    `
  })
}

// Storia - Stack orizzontale
export const HorizontalStack: Story = {
  args: {
    direction: 'row',
    gap: 'sm',
    padding: 'lg',
    align: 'center'
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args">
        <div class="bg-blue-100 p-4 rounded">Elemento 1</div>
        <div class="bg-green-100 p-4 rounded">Elemento 2</div>
        <div class="bg-yellow-100 p-4 rounded">Elemento 3</div>
      </FzContainer>
    `
  })
}

/*
// Storia - Centering
export const Centered: Story = {
  args: {
    center: true,
    height: 'screen',
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args" class="bg-gray-50 min-h-screen">
        <div class="bg-blue-500 text-white p-8 rounded-lg">
          <h2 class="text-xl font-bold mb-2">Contenuto Centrato</h2>
          <p>Questo contenuto è perfettamente centrato sia orizzontalmente che verticalmente.</p>
        </div>
      </FzContainer>
    `
  })
}
*/

// Storia - Grid Layout
export const GridLayout: Story = {
  args: {
    display: 'grid',
    gridCols: '3',
    gap: 'md',
    padding: 'lg'
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args">
        <div class="bg-red-100 p-4 rounded">Card 1</div>
        <div class="bg-blue-100 p-4 rounded">Card 2</div>
        <div class="bg-green-100 p-4 rounded">Card 3</div>
        <div class="bg-yellow-100 p-4 rounded">Card 4</div>
        <div class="bg-purple-100 p-4 rounded">Card 5</div>
        <div class="bg-pink-100 p-4 rounded">Card 6</div>
      </FzContainer>
    `
  })
}

/*
// Storia - Layout di pagina
export const PageLayout: Story = {
  render: () => ({
    components: { FzContainer },
    template: `
      <div>
        <!-- Header -->
        <FzContainer 
          tag="header"
          padding="20" 
          justify="between" 
          align="center"
          class="bg-blue-600 text-white"
        >
          <div class="text-xl font-bold">Logo</div>
          <nav class="flex gap-4">
            <a href="#" class="hover:underline">Home</a>
            <a href="#" class="hover:underline">About</a>
            <a href="#" class="hover:underline">Contact</a>
          </nav>
        </FzContainer>

        <!-- Main Content -->
        <FzContainer 
          tag="main"
          direction="column" 
          gap="32"
          padding="40"
          class="min-h-screen bg-gray-50"
        >
          <FzContainer direction="column" gap="16">
            <h1 class="text-3xl font-bold">Benvenuto</h1>
            <p class="text-gray-600">Questo è un esempio di layout di pagina creato con FzContainer.</p>
          </FzContainer>

          <!-- Content Grid -->
          <FzContainer 
            display="grid"
            gridCols="2"
            gap="24"
          >
            <FzContainer 
              direction="column"
              gap="12"
              padding="24"
              class="bg-white rounded-lg shadow"
            >
              <h3 class="text-xl font-semibold">Sezione 1</h3>
              <p class="text-gray-600">Contenuto della prima sezione con layout verticale.</p>
            </FzContainer>

            <FzContainer 
              direction="column"
              gap="12"
              padding="24"
              class="bg-white rounded-lg shadow"
            >
              <h3 class="text-xl font-semibold">Sezione 2</h3>
              <p class="text-gray-600">Contenuto della seconda sezione con layout verticale.</p>
            </FzContainer>
          </FzContainer>
        </FzContainer>

        <!-- Footer -->
        <FzContainer 
          tag="footer"
          padding="20"
          justify="center"
          class="bg-gray-800 text-white"
        >
          <p>&copy; 2024 - Design System Container</p>
        </FzContainer>
      </div>
    `
  })
}
*/

// Storia - Form Layout semplificato con Design System Components
export const FormLayout: Story = {
  render: () => ({
    components: { FzContainer, FzButton, FzInput },
    template: `
      <FzContainer
        tag="form"
        direction="column"
        gap="md"
        justify="center"
        class="bg-gray-100"
      >
        <!-- Form Card -->
          <h2 class="text-2xl font-bold text-center mb-6">Registrazione</h2>
          
          <!-- Nome -->
          <FzInput 
            label="Nome"
            placeholder="Inserisci il nome" 
            required
          />
          
          <!-- Cognome -->
          <FzInput 
            label="Cognome"
            placeholder="Inserisci il cognome" 
            required
          />
          
          <!-- Email -->
          <FzInput 
            label="Email"
            placeholder="Inserisci la tua email"
            type="email" 
            required
          />
          
          <!-- Password -->
          <FzInput 
            label="Password"
            placeholder="Inserisci la password"
            type="password" 
            required
          />
          
          <!-- Buttons -->
          <FzContainer direction="row" gap="sm" justify="end">
            <FzButton 
              label="Annulla"
              variant="secondary"
            />
            <FzButton 
              label="Registrati"
              variant="primary"
            />
          </FzContainer>
      </FzContainer>
    `
  })
}

// Storia - Wrap Layout con valori boolean
export const WrapLayout: Story = {
  args: {
    direction: 'row',
    wrap: true,
    gap: 'sm',
    padding: 'lg'
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args" class="max-w-md">
        <div class="bg-blue-100 p-4 rounded w-32">Item largo 1</div>
        <div class="bg-green-100 p-4 rounded w-32">Item largo 2</div>
        <div class="bg-yellow-100 p-4 rounded w-32">Item largo 3</div>
        <div class="bg-purple-100 p-4 rounded w-32">Item largo 4</div>
        <div class="bg-pink-100 p-4 rounded w-32">Item largo 5</div>
      </FzContainer>
    `
  })
}

// Storia - Responsive Design
export const ResponsiveDesign: Story = {
  render: () => ({
    components: { FzContainer },
    setup() {
      const items = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
        description: `Descrizione dell'elemento ${i + 1}`
      }))
      return { items }
    },
    template: `
      <FzContainer 
        direction="column"
        gap="lg"
        padding="lg"
      >
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Design Responsive</h2>
          <p class="text-gray-600 mb-8">
            Questo layout si adatta automaticamente alle diverse dimensioni dello schermo:
            <br>
            • Mobile: 1 colonna
            <br>
            • Tablet: 2 colonne  
            <br>
            • Desktop: 4 colonne
          </p>
        </div>

        <FzContainer 
          display="grid"
          :gridCols="{ xs: '1', sm: '2', lg: '4' }"
          gap="md"
        >
          <FzContainer 
            v-for="item in items"
            :key="item.id"
            direction="column"
            gap="8"
            padding="16"
            class="bg-white border rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div class="w-full h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
            <h3 class="font-semibold">{{ item.title }}</h3>
            <p class="text-sm text-gray-600">{{ item.description }}</p>
          </FzContainer>
        </FzContainer>
      </FzContainer>
    `
  })
}