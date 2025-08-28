import type { Meta, StoryObj } from '@storybook/vue3'
import { FzContainer } from '@fiscozen/container'

const meta: Meta<typeof FzContainer> = {
  title: 'Components/Container',
  component: FzContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Un componente Container SEMANTIC-FIRST per costruire layout di pagina. Usa sempre valori semantici (none, xs, sm, md, lg, xl, 2xl) per consistency del design system.'
      }
    }
  },
  argTypes: {
    display: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline-flex', 'inline-grid'],
      description: 'Tipo di display del container'
    },
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      description: 'Direzione del flex (solo per flex)'
    },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
      description: 'Allineamento principale'
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'baseline'],
      description: 'Allineamento secondario'
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Gap tra elementi. RACCOMANDATO: usa valori semantici (none, xs, sm, md, lg, xl, 2xl). Valori numerici Tailwind disponibili per casi specifici.'
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', '40', '48', '64'],
      description: 'Padding interno. RACCOMANDATO: usa valori semantici (none, xs, sm, md, lg, xl, 2xl). Valori numerici Tailwind disponibili per casi specifici.'
    },
    tag: {
      control: 'text',
      description: 'Tag HTML da utilizzare per il container'
    },
    wrap: {
      control: 'select',
      options: ['wrap', 'nowrap', 'wrap-reverse', true, false],
      description: 'Wrap del flex. Supporta anche valori boolean: true=wrap, false=nowrap'
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

// Storia - Centering
export const Centered: Story = {
  args: {
    center: true,
    padding: 'xl',
    height: 'screen'
  },
  render: (args) => ({
    components: { FzContainer },
    setup() {
      return { args }
    },
    template: `
      <FzContainer v-bind="args" class="bg-gray-50">
        <div class="bg-blue-500 text-white p-8 rounded-lg">
          <h2 class="text-xl font-bold mb-2">Contenuto Centrato</h2>
          <p>Questo contenuto è perfettamente centrato sia orizzontalmente che verticalmente.</p>
        </div>
      </FzContainer>
    `
  })
}

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

// Storia - Form Layout
export const FormLayout: Story = {
  render: () => ({
    components: { FzContainer },
    template: `
      <FzContainer 
        justify="center"
        padding="40"
        class="min-h-screen bg-gray-100"
      >
        <FzContainer 
          tag="form"
          direction="column" 
          gap="20"
          padding="32"
          class="bg-white rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 class="text-2xl font-bold text-center">Registrazione</h2>
          
          <!-- Nome e Cognome -->
          <FzContainer gap="12">
            <input 
              placeholder="Nome" 
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Cognome" 
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FzContainer>
          
          <!-- Email -->
          <input 
            placeholder="Email" 
            type="email"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <!-- Password -->
          <input 
            placeholder="Password" 
            type="password"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <!-- Buttons -->
          <FzContainer justify="end" gap="12">
            <button 
              type="button"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annulla
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Registrati
            </button>
          </FzContainer>
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

// Storia - Semantic Spacing Demo
export const SemanticSpacing: Story = {
  render: () => ({
    components: { FzContainer },
    template: `
      <FzContainer direction="column" gap="lg" padding="xl">
        <h2 class="text-2xl font-bold mb-4">Demo Spacing Semantico</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold mb-2">Gap: none (0px)</h3>
            <FzContainer gap="none" class="bg-gray-100 p-4 rounded">
              <div class="bg-red-200 p-2 rounded">Item 1</div>
              <div class="bg-red-200 p-2 rounded">Item 2</div>
              <div class="bg-red-200 p-2 rounded">Item 3</div>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Gap: xs (8px)</h3>
            <FzContainer gap="xs" class="bg-gray-100 p-4 rounded">
              <div class="bg-blue-200 p-2 rounded">Item 1</div>
              <div class="bg-blue-200 p-2 rounded">Item 2</div>
              <div class="bg-blue-200 p-2 rounded">Item 3</div>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Gap: sm (32px)</h3>
            <FzContainer gap="sm" class="bg-gray-100 p-4 rounded">
              <div class="bg-green-200 p-2 rounded">Item 1</div>
              <div class="bg-green-200 p-2 rounded">Item 2</div>
              <div class="bg-green-200 p-2 rounded">Item 3</div>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Gap: md (64px)</h3>
            <FzContainer gap="md" class="bg-gray-100 p-4 rounded">
              <div class="bg-yellow-200 p-2 rounded">Item 1</div>
              <div class="bg-yellow-200 p-2 rounded">Item 2</div>
              <div class="bg-yellow-200 p-2 rounded">Item 3</div>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Gap: lg (96px)</h3>
            <FzContainer gap="lg" class="bg-gray-100 p-4 rounded">
              <div class="bg-purple-200 p-2 rounded">Item 1</div>
              <div class="bg-purple-200 p-2 rounded">Item 2</div>
              <div class="bg-purple-200 p-2 rounded">Item 3</div>
            </FzContainer>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Padding Semantico: none, xs, sm, md, lg</h3>
            <FzContainer direction="column" gap="xs">
              <FzContainer padding="none" class="bg-gray-100 border border-gray-300">Padding: none</FzContainer>
              <FzContainer padding="xs" class="bg-red-100 border border-red-300">Padding: xs</FzContainer>
              <FzContainer padding="sm" class="bg-blue-100 border border-blue-300">Padding: sm</FzContainer>
              <FzContainer padding="md" class="bg-green-100 border border-green-300">Padding: md</FzContainer>
              <FzContainer padding="lg" class="bg-yellow-100 border border-yellow-300">Padding: lg</FzContainer>
            </FzContainer>
          </div>
        </div>
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