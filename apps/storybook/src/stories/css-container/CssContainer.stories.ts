import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'

import { FzButton } from '@fiscozen/button'
import { FzInput } from '@fiscozen/input'

// Mock component per Storybook che mostra solo HTML
const CssContainerDemo = defineComponent({
  name: 'CssContainerDemo',
  template: `<div v-html="template"></div>`,
  props: {
    template: {
      type: String,
      required: true
    }
  }
})

const meta: Meta<typeof CssContainerDemo> = {
  title: 'Layout/FzCssContainer',
  component: CssContainerDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# CSS Layout Utilities

Sistema ufficiale di layout CSS-first per il Design System Fiscozen. 

## Setup

\`\`\`js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@fiscozen/css-container'),
  ]
}
\`\`\`

Tutte le classi hanno il prefisso \`fz-container-\` per il namespacing.
        `
      }
    }
  }
}

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  name: '📋 Overview & Quick Start',
  args: {
    template: `
      <div class="space-y-8">
        <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
          <h2 class="text-2xl font-bold text-green-800 mb-4">🚀 CSS Layout Utilities</h2>
          <p class="text-green-700 mb-4">
            Sistema ufficiale di layout CSS-first per il Design System Fiscozen. 
            Tutte le classi hanno il prefisso <code class="bg-green-200 px-2 py-1 rounded">fz-container-</code> per il namespacing.
          </p>
          
          <div class="bg-white p-4 rounded border">
            <h3 class="font-semibold mb-2">Setup Tailwind:</h3>
            <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>// tailwind.config.js
module.exports = {
  plugins: [
    require('@fiscozen/css-container'),
  ]
}</code></pre>
          </div>
        </div>
        
        <div class="fz-container-grid-responsive fz-container-gap-md">
          <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
            <h3 class="font-semibold text-blue-800">🔲 Grid Layouts</h3>
            <p class="text-blue-700 text-sm mt-2">
              <strong>🔥 Autodetect:</strong> <code>fz-container-grid-responsive</code><br/>
              <strong>258 Classi Specifiche:</strong> <code>fz-container-grid-responsive-{M}-{T}-{D}</code><br/>
              <strong>Fissi:</strong> <code>fz-container-grid-1</code> → <code>fz-container-grid-6</code>
            </p>
          </div>
          
          <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
            <h3 class="font-semibold text-green-800">📚 Stack Layouts</h3>
            <p class="text-green-700 text-sm mt-2">
              <strong>Base:</strong> <code>fz-container-stack-v/h/vr/hr</code><br/>
              <strong>84 Responsive:</strong> <code>fz-container-stack-responsive-{M}-{T}-{D}</code>
            </p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
            <h3 class="font-semibold text-purple-800">🎯 Stack Alignments</h3>
            <p class="text-purple-700 text-sm mt-2">
              <strong>Centering:</strong> <code>fz-container-stack-center(-main/-cross)</code><br/>
              <strong>Positioning:</strong> <code>fz-container-stack-align-main/cross-start/center/end</code><br/>
              <strong>Distribution:</strong> <code>fz-container-stack-space-main/cross-between/around/evenly</code>
            </p>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <h3 class="font-semibold text-yellow-800">📏 Semantic Spacing</h3>
            <p class="text-yellow-700 text-sm mt-2">
              <strong>Gap:</strong> <code>fz-container-gap-none/xs/sm/md/lg/xl/2xl</code><br/>
              <strong>Padding:</strong> <code>fz-container-padding-none/xs/sm/md/lg/xl/2xl</code><br/>
              <strong>Margin:</strong> <code>fz-container-margin-none/xs/sm/md/lg/xl/2xl</code>
            </p>
          </div>
          
          <div class="bg-red-50 p-4 rounded border-l-4 border-red-400">
            <h3 class="font-semibold text-red-800">🏗️ Layout Patterns</h3>
            <p class="text-red-700 text-sm mt-2">
              <code>fz-container-form</code><br/>
              <code>fz-container-form-field</code>
            </p>
          </div>
          
          <div class="bg-indigo-50 p-4 rounded border-l-4 border-indigo-400">
            <h3 class="font-semibold text-indigo-800">📱 Responsive</h3>
            <p class="text-indigo-700 text-sm mt-2">
              <code>fz-container-stack-responsive</code><br/>
              Mobile-first automatico
            </p>
          </div>
        </div>
      </div>
    `
  }
}

export const GridLayouts: Story = {
  name: '🔲 Grid Layouts',
  args: {
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">🔥 Grid Responsive Intelligente (Autodetect)</h3>
          <div class="fz-container-grid-responsive fz-container-gap-md">
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 1</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 2</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 3</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 4</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 5</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 6</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 7</div>
            <div class="bg-emerald-100 p-4 rounded text-center border-2 border-emerald-200">Auto 8</div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            💡 Si adatta automaticamente: ridimensiona la finestra per vedere l'effetto!
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Responsive 1-2-3 (1 mobile → 2 tablet → 3 desktop)</h3>
          <div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 1</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 2</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 3</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 4</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 5</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Item 6</div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">🔄 Stack Responsive V-H (v mobile → h tablet/desktop)</h3>
          <div class="fz-container-stack-responsive-v-h fz-container-gap-md">
            <div class="bg-green-100 p-4 rounded text-center border-2 border-green-200">Stack A</div>
            <div class="bg-green-100 p-4 rounded text-center border-2 border-green-200">Stack B</div>
            <div class="bg-green-100 p-4 rounded text-center border-2 border-green-200">Stack C</div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            💡 Ridimensiona la finestra: vertical su mobile, horizontal su tablet+
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Fisso 3 Colonne</h3>
          <div class="fz-container-grid-3 fz-container-gap-sm">
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Col A</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Col B</div>
            <div class="bg-blue-100 p-4 rounded text-center border-2 border-blue-200">Col C</div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Responsive 1-2 (1 mobile → 2 tablet/desktop)</h3>
          <div class="fz-container-grid-responsive-1-2 fz-container-gap-md">
            <div class="bg-purple-100 p-4 rounded text-center border-2 border-purple-200">Item A</div>
            <div class="bg-purple-100 p-4 rounded text-center border-2 border-purple-200">Item B</div>
            <div class="bg-purple-100 p-4 rounded text-center border-2 border-purple-200">Item C</div>
            <div class="bg-purple-100 p-4 rounded text-center border-2 border-purple-200">Item D</div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Responsive 1-1-3 (1 mobile → 1 tablet → 3 desktop)</h3>
          <div class="fz-container-grid-responsive-1-1-3 fz-container-gap-lg">
            <div class="bg-orange-100 p-4 rounded text-center border-2 border-orange-200">Desktop Only</div>
            <div class="bg-orange-100 p-4 rounded text-center border-2 border-orange-200">Multi Column</div>
            <div class="bg-orange-100 p-4 rounded text-center border-2 border-orange-200">Layout</div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Responsive 2-4-6 (2 mobile → 4 tablet → 6 desktop)</h3>
          <div class="fz-container-grid-responsive-2-4-6 fz-container-gap-sm">
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">A</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">B</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">C</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">D</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">E</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">F</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">G</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">H</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">I</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">J</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">K</div>
            <div class="bg-red-100 p-3 rounded text-center text-xs border-2 border-red-200">L</div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Grid Responsive 4 (4 colonne sempre)</h3>
          <div class="fz-container-grid-responsive-4 fz-container-gap-md">
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 1</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 2</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 3</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 4</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 5</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 6</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 7</div>
            <div class="bg-teal-100 p-4 rounded text-center border-2 border-teal-200">Fixed 8</div>
          </div>
        </div>
      </div>
    `
  }
}

export const StackLayouts: Story = {
  name: '📚 Stack Layouts',
  args: {
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Stack Base - Direzioni</h3>
          <div class="space-y-6">
            <div>
              <h4 class="font-medium mb-2">Stack Verticale (v)</h4>
              <div class="fz-container-stack-v fz-container-gap-sm max-w-xs">
                <div class="bg-blue-100 p-3 rounded text-center border">Item A</div>
                <div class="bg-blue-100 p-3 rounded text-center border">Item B</div>
                <div class="bg-blue-100 p-3 rounded text-center border">Item C</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">Stack Orizzontale (h)</h4>
              <div class="fz-container-stack-h fz-container-gap-sm">
                <div class="bg-green-100 p-3 rounded text-center border">Item A</div>
                <div class="bg-green-100 p-3 rounded text-center border">Item B</div>
                <div class="bg-green-100 p-3 rounded text-center border">Item C</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">Stack Verticale Inverso (vr)</h4>
              <div class="fz-container-stack-vr fz-container-gap-sm max-w-xs">
                <div class="bg-purple-100 p-3 rounded text-center border">First (appears last)</div>
                <div class="bg-purple-100 p-3 rounded text-center border">Second</div>
                <div class="bg-purple-100 p-3 rounded text-center border">Third (appears first)</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">Stack Orizzontale Inverso (hr)</h4>
              <div class="fz-container-stack-hr fz-container-gap-sm">
                <div class="bg-red-100 p-3 rounded text-center border">First (appears right)</div>
                <div class="bg-red-100 p-3 rounded text-center border">Second</div>
                <div class="bg-red-100 p-3 rounded text-center border">Third (appears left)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Stack Responsive - Esempi Popolari</h3>
          <div class="space-y-6">
            <div>
              <h4 class="font-medium mb-2">v-h (Verticale mobile → Orizzontale tablet+)</h4>
              <div class="fz-container-stack-responsive-v-h fz-container-gap-md">
                <div class="bg-blue-100 p-4 rounded text-center border">Navigation Item 1</div>
                <div class="bg-blue-100 p-4 rounded text-center border">Navigation Item 2</div>
                <div class="bg-blue-100 p-4 rounded text-center border">Navigation Item 3</div>
              </div>
              <p class="text-sm text-gray-600 mt-2">📱→🖥️ Ridimensiona per vedere l'effetto</p>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">h-v (Orizzontale mobile → Verticale tablet+)</h4>
              <div class="fz-container-stack-responsive-h-v fz-container-gap-md">
                <div class="bg-green-100 p-4 rounded text-center border">Button A</div>
                <div class="bg-green-100 p-4 rounded text-center border">Button B</div>
                <div class="bg-green-100 p-4 rounded text-center border">Button C</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">v-h-v (Verticale mobile → Orizzontale tablet → Verticale desktop)</h4>
              <div class="fz-container-stack-responsive-v-h-v fz-container-gap-md">
                <div class="bg-purple-100 p-4 rounded text-center border">Complex Item 1</div>
                <div class="bg-purple-100 p-4 rounded text-center border">Complex Item 2</div>
                <div class="bg-purple-100 p-4 rounded text-center border">Complex Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">v-v-h (Verticale mobile/tablet → Orizzontale desktop)</h4>
              <div class="fz-container-stack-responsive-v-v-h fz-container-gap-md">
                <div class="bg-orange-100 p-4 rounded text-center border">Desktop Layout A</div>
                <div class="bg-orange-100 p-4 rounded text-center border">Desktop Layout B</div>
                <div class="bg-orange-100 p-4 rounded text-center border">Desktop Layout C</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">hr-vr (Orizzontale reverse mobile → Verticale reverse tablet+)</h4>
              <div class="fz-container-stack-responsive-hr-vr fz-container-gap-md">
                <div class="bg-red-100 p-4 rounded text-center border">Reverse A</div>
                <div class="bg-red-100 p-4 rounded text-center border">Reverse B</div>
                <div class="bg-red-100 p-4 rounded text-center border">Reverse C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export const FormContainer: Story = {
  name: '📝 Form Container',
  render: () => ({
    components: { FzButton, FzInput },
    template: `
        <div class="bg-gray-100 p-8">
          <form class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white rounded shadow mx-auto">
            <h3 class="text-xl font-bold text-center">Form di Contatto</h3>
            <fieldset class="fz-container-grid-responsive-sm fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="Grid Responsive SM" placeholder="Item A" />
              <FzInput label="Grid Responsive SM" placeholder="Item B" />
              <FzInput label="Grid Responsive SM" placeholder="Item C" />
              <FzInput label="Grid Responsive SM" placeholder="Item D" />
              <FzInput label="Grid Responsive SM" placeholder="Item E" />
            </fieldset>
            <fieldset class="fz-container-stack-v fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="Stack V" placeholder="Item F" />
              <FzInput label="Stack V" placeholder="Item G" />
            </fieldset>
            <fieldset class="fz-container-grid-responsive-1-2-3 fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="grid-responsive-1-2-3" placeholder="Item 1" />
              <FzInput label="grid-responsive-1-2-3" placeholder="Item 2" />
              <FzInput label="grid-responsive-1-2-3" placeholder="Item 3" />
              <FzInput label="grid-responsive-1-2-3" placeholder="Item 4" />
              <FzInput label="grid-responsive-1-2-3" placeholder="Item 5" />
            </fieldset>
            <fieldset class="fz-container-stack-h fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="stack-h" placeholder="Item 6" />
              <FzInput label="stack-h" placeholder="Item 7" />
            </fieldset>
            <fieldset class="fz-container-stack-responsive-v-h fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="stack-responsive-v-h" placeholder="Item 8" />
              <FzInput label="stack-responsive-v-h" placeholder="Item 9" />
              <FzInput label="stack-responsive-v-h" placeholder="Item 10" />
              <FzInput label="stack-responsive-v-h" placeholder="Item 11" />
              <FzInput label="stack-responsive-v-h" placeholder="Item 12" />
            </fieldset>
            <fieldset class="fz-container-stack-responsive-v-h-v fz-container-gap-md bg-blue-100 hover:bg-blue-200">
              <FzInput label="stack-responsive-v-h-v" placeholder="Item 13" />
              <FzInput label="stack-responsive-v-h-v" placeholder="Item 14" />
              <FzInput label="stack-responsive-v-h-v" placeholder="Item 15" />
              <FzInput label="stack-responsive-v-h-v" placeholder="Item 16" />
              <FzInput label="stack-responsive-v-h-v" placeholder="Item 17" />
            </fieldset>
            <fieldset class="fz-container-stack-h fz-container-gap-md fz-container-stack-align-main-end bg-blue-100 hover:bg-blue-200">
              <FzButton class="fz-button" variant="secondary">Reset</FzButton>
              <FzButton class="fz-button" variant="primary">Invia</FzButton>
            </fieldset>
          </form>
        </div>
      `
  }),
}

export const StackAlignments: Story = {
  name: '🎯 Stack Alignments',
  args: {
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Centering Shortcuts</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">Center (both axes)</h4>
              <div class="fz-container-stack-center h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-blue-500 text-white px-4 py-2 rounded">Perfectly Centered</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">Center Main Axis Only</h4>
              <div class="fz-container-stack-h fz-container-stack-center-main h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-green-500 text-white px-4 py-2 rounded">Main Centered</div>
                <div class="bg-green-500 text-white px-4 py-2 rounded">Items</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">Center Cross Axis Only</h4>
              <div class="fz-container-stack-h fz-container-stack-center-cross h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-purple-500 text-white px-4 py-2 rounded">Cross</div>
                <div class="bg-purple-500 text-white px-4 py-2 rounded">Centered</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Main Axis Alignment (Positioning)</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">align-main-start (justify-start)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-main-start fz-container-gap-sm h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-blue-100 p-3 rounded">Item 1</div>
                <div class="bg-blue-100 p-3 rounded">Item 2</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">align-main-center (justify-center)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-main-center fz-container-gap-sm h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-green-100 p-3 rounded">Item 1</div>
                <div class="bg-green-100 p-3 rounded">Item 2</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">align-main-end (justify-end)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-main-end fz-container-gap-sm h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-purple-100 p-3 rounded">Item 1</div>
                <div class="bg-purple-100 p-3 rounded">Item 2</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Cross Axis Alignment (Positioning)</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">align-cross-start (items-start)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-cross-start fz-container-gap-sm h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-blue-100 p-3 rounded">Short</div>
                <div class="bg-blue-100 p-3 rounded">Longer content here</div>
                <div class="bg-blue-100 p-3 rounded">Medium</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">align-cross-center (items-center)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-cross-center fz-container-gap-sm h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-green-100 p-3 rounded">Short</div>
                <div class="bg-green-100 p-3 rounded">Longer content here</div>
                <div class="bg-green-100 p-3 rounded">Medium</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">align-cross-end (items-end)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-cross-end fz-container-gap-sm h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-purple-100 p-3 rounded">Short</div>
                <div class="bg-purple-100 p-3 rounded">Longer content here</div>
                <div class="bg-purple-100 p-3 rounded">Medium</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">align-cross-stretch (items-stretch)</h4>
              <div class="fz-container-stack-h fz-container-stack-align-cross-stretch fz-container-gap-sm h-32 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-red-100 p-3 rounded">Stretched</div>
                <div class="bg-red-100 p-3 rounded">All items</div>
                <div class="bg-red-100 p-3 rounded">Same height</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Main Axis Space Distribution</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">space-main-between (justify-between)</h4>
              <div class="fz-container-stack-h fz-container-stack-space-main-between h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-blue-100 p-3 rounded">Start</div>
                <div class="bg-blue-100 p-3 rounded">Middle</div>
                <div class="bg-blue-100 p-3 rounded">End</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">space-main-around (justify-around)</h4>
              <div class="fz-container-stack-h fz-container-stack-space-main-around h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-green-100 p-3 rounded">Item 1</div>
                <div class="bg-green-100 p-3 rounded">Item 2</div>
                <div class="bg-green-100 p-3 rounded">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">space-main-evenly (justify-evenly)</h4>
              <div class="fz-container-stack-h fz-container-stack-space-main-evenly h-24 bg-gray-100 border-2 border-dashed border-gray-300">
                <div class="bg-purple-100 p-3 rounded">Item 1</div>
                <div class="bg-purple-100 p-3 rounded">Item 2</div>
                <div class="bg-purple-100 p-3 rounded">Item 3</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Cross Axis Space Distribution (Multi-line)</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">space-cross-between (content-between)</h4>
              <div class="fz-container-stack-h fz-container-stack-space-cross-between flex-wrap h-40 bg-gray-100 border-2 border-dashed border-gray-300" style="max-width: 300px;">
                <div class="bg-blue-100 p-3 rounded">Line 1 A</div>
                <div class="bg-blue-100 p-3 rounded">Line 1 B</div>
                <div class="bg-blue-100 p-3 rounded">Line 1 C</div>
                <div class="bg-blue-100 p-3 rounded">Line 2 A</div>
                <div class="bg-blue-100 p-3 rounded">Line 2 B</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">space-cross-stretch (content-stretch)</h4>
              <div class="fz-container-stack-h fz-container-stack-space-cross-stretch flex-wrap h-40 bg-gray-100 border-2 border-dashed border-gray-300" style="max-width: 300px;">
                <div class="bg-red-100 p-3 rounded">Stretch A</div>
                <div class="bg-red-100 p-3 rounded">Stretch B</div>
                <div class="bg-red-100 p-3 rounded">Stretch C</div>
                <div class="bg-red-100 p-3 rounded">Stretch D</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export const GenericLayout: Story = {
  name: '🏗️ Generic Layout',
  args: {
    template: `
      <div class="bg-gray-100 min-h-screen fz-container-padding-lg">
        <div class="fz-container-stack-v fz-container-gap-lg max-w-6xl mx-auto">
          <header class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-md bg-white shadow rounded">
            <h1 class="text-2xl font-bold">Layout Generico</h1>
            <nav class="fz-container-stack-h fz-container-gap-md">
              <a href="#" class="text-blue-600 hover:text-blue-800">Link 1</a>
              <a href="#" class="text-blue-600 hover:text-blue-800">Link 2</a>
              <a href="#" class="text-blue-600 hover:text-blue-800">Link 3</a>
            </nav>
          </header>
          
          <div class="fz-container-grid-responsive fz-container-gap-md">
            <div class="fz-container-stack-center fz-container-padding-lg bg-white rounded shadow">
              <div class="text-center">
                <h3 class="text-lg font-semibold">Container 1</h3>
                <p class="text-gray-600 mt-2">Contenuto generico del primo container</p>
              </div>
            </div>
            <div class="fz-container-stack-center fz-container-padding-lg bg-white rounded shadow">
              <div class="text-center">
                <h3 class="text-lg font-semibold">Container 2</h3>
                <p class="text-gray-600 mt-2">Contenuto generico del secondo container</p>
              </div>
            </div>
            <div class="fz-container-stack-center fz-container-padding-lg bg-white rounded shadow">
              <div class="text-center">
                <h3 class="text-lg font-semibold">Container 3</h3>
                <p class="text-gray-600 mt-2">Contenuto generico del terzo container</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export const SemanticSpacing: Story = {
  name: '📏 Semantic Spacing',
  args: {
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Gap - Spazio tra elementi</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">gap-none (0)</h4>
              <div class="fz-container-stack-h fz-container-gap-none bg-gray-100 p-4">
                <div class="bg-blue-100 p-2 border">Item 1</div>
                <div class="bg-blue-100 p-2 border">Item 2</div>
                <div class="bg-blue-100 p-2 border">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-xs (0.5rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-xs bg-gray-100 p-4">
                <div class="bg-green-100 p-2 border">Item 1</div>
                <div class="bg-green-100 p-2 border">Item 2</div>
                <div class="bg-green-100 p-2 border">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-sm (2rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-sm bg-gray-100 p-4">
                <div class="bg-purple-100 p-2 border">Item 1</div>
                <div class="bg-purple-100 p-2 border">Item 2</div>
                <div class="bg-purple-100 p-2 border">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-md (4rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-md bg-gray-100 p-4">
                <div class="bg-orange-100 p-2 border">Item 1</div>
                <div class="bg-orange-100 p-2 border">Item 2</div>
                <div class="bg-orange-100 p-2 border">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-lg (6rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-lg bg-gray-100 p-4">
                <div class="bg-red-100 p-2 border">Item 1</div>
                <div class="bg-red-100 p-2 border">Item 2</div>
                <div class="bg-red-100 p-2 border">Item 3</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-xl (8rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-xl bg-gray-100 p-4">
                <div class="bg-teal-100 p-2 border">Large</div>
                <div class="bg-teal-100 p-2 border">Gap</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-2">gap-2xl (12rem)</h4>
              <div class="fz-container-stack-h fz-container-gap-2xl bg-gray-100 p-4">
                <div class="bg-indigo-100 p-2 border">Huge</div>
                <div class="bg-indigo-100 p-2 border">Gap</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Padding - Spazio interno</h3>
          <div class="space-y-4">
            <div class="fz-container-stack-h fz-container-gap-md">
              <div>
                <h4 class="font-medium mb-2">padding-none</h4>
                <div class="fz-container-padding-none bg-blue-100 border-2 border-blue-300">
                  <div class="bg-white">No padding</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2">padding-xs</h4>
                <div class="fz-container-padding-xs bg-green-100 border-2 border-green-300">
                  <div class="bg-white">XS padding</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2">padding-sm</h4>
                <div class="fz-container-padding-sm bg-purple-100 border-2 border-purple-300">
                  <div class="bg-white">SM padding</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2">padding-md</h4>
                <div class="fz-container-padding-md bg-orange-100 border-2 border-orange-300">
                  <div class="bg-white">MD padding</div>
                </div>
              </div>
            </div>
            
            <div class="fz-container-stack-h fz-container-gap-md">
              <div>
                <h4 class="font-medium mb-2">padding-lg</h4>
                <div class="fz-container-padding-lg bg-red-100 border-2 border-red-300">
                  <div class="bg-white">LG padding</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2">padding-xl</h4>
                <div class="fz-container-padding-xl bg-teal-100 border-2 border-teal-300">
                  <div class="bg-white">XL padding</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2">padding-2xl</h4>
                <div class="fz-container-padding-2xl bg-indigo-100 border-2 border-indigo-300">
                  <div class="bg-white">2XL padding</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Margin - Spazio esterno</h3>
          <div class="bg-gray-200 p-4">
            <div class="space-y-1">
              <div class="fz-container-margin-none bg-blue-100 border text-center">margin-none</div>
              <div class="fz-container-margin-xs bg-green-100 border text-center">margin-xs</div>
              <div class="fz-container-margin-sm bg-purple-100 border text-center">margin-sm</div>
              <div class="fz-container-margin-md bg-orange-100 border text-center">margin-md</div>
              <div class="fz-container-margin-lg bg-red-100 border text-center">margin-lg</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Combinazioni - Esempi Pratici</h3>
          <div class="space-y-6">
            <div class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white border rounded shadow">
              <h4 class="font-medium">Card con spacing semantico</h4>
              <div class="fz-container-stack-h fz-container-gap-sm">
                <div class="bg-blue-100 p-3 rounded">Button 1</div>
                <div class="bg-blue-100 p-3 rounded">Button 2</div>
              </div>
              <p class="text-gray-600">gap-md + padding-lg + gap-sm interno</p>
            </div>
            
            <div class="fz-container-grid-responsive-1-2 fz-container-gap-lg fz-container-padding-md">
              <div class="fz-container-stack-v fz-container-gap-xs fz-container-padding-sm bg-blue-50 rounded">
                <h5 class="font-medium">Feature A</h5>
                <p class="text-sm text-gray-600">gap-xs, padding-sm</p>
              </div>
              <div class="fz-container-stack-v fz-container-gap-xs fz-container-padding-sm bg-green-50 rounded">
                <h5 class="font-medium">Feature B</h5>
                <p class="text-sm text-gray-600">gap-xs, padding-sm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export const RealWorldExamples: Story = {
  name: '🌍 Real World Examples',
  args: {
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">🖥️ Dashboard Layout</h3>
          <div class="fz-container-stack-v fz-container-gap-lg fz-container-padding-lg bg-gray-100 rounded">
            <!-- Header -->
            <header class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-md bg-white rounded shadow">
              <h1 class="text-xl font-bold">Dashboard</h1>
              <div class="fz-container-stack-h fz-container-gap-sm">
                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Nuovo</button>
                <button class="px-4 py-2 border rounded hover:bg-gray-50">Impostazioni</button>
              </div>
            </header>
            
            <!-- Main Content -->
            <div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Vendite</h3>
                <div class="text-3xl font-bold text-green-600">€12,345</div>
                <p class="text-sm text-gray-600">+15% rispetto al mese scorso</p>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Ordini</h3>
                <div class="text-3xl font-bold text-blue-600">1,234</div>
                <p class="text-sm text-gray-600">+8% rispetto al mese scorso</p>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Clienti</h3>
                <div class="text-3xl font-bold text-purple-600">567</div>
                <p class="text-sm text-gray-600">+23% rispetto al mese scorso</p>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Prodotti</h3>
                <div class="text-3xl font-bold text-orange-600">89</div>
                <p class="text-sm text-gray-600">Nuovi questo mese</p>
              </div>
            </div>
            
            <!-- Charts Section -->
            <div class="fz-container-grid-responsive-1-1-2 fz-container-gap-lg">
              <div class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Trend Vendite</h3>
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <p class="text-gray-500">[Grafico delle vendite]</p>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white rounded shadow">
                <h3 class="font-semibold text-lg">Attività Recenti</h3>
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center p-3 bg-gray-50 rounded">
                    <span class="text-sm">Nuovo ordine #1234</span>
                    <span class="text-xs text-gray-500">2 min fa</span>
                  </div>
                  <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center p-3 bg-gray-50 rounded">
                    <span class="text-sm">Cliente registrato</span>
                    <span class="text-xs text-gray-500">5 min fa</span>
                  </div>
                  <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center p-3 bg-gray-50 rounded">
                    <span class="text-sm">Prodotto aggiornato</span>
                    <span class="text-xs text-gray-500">12 min fa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">📱 App Mobile Layout</h3>
          <div class="max-w-sm mx-auto fz-container-stack-v fz-container-gap-none bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <!-- Status Bar -->
            <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-xs bg-black text-white text-xs">
              <span>9:41</span>
              <span>●●●●○</span>
              <span>100%</span>
            </div>
            
            <!-- Header -->
            <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-md bg-blue-600 text-white">
              <h2 class="font-semibold">My App</h2>
              <button class="p-2">☰</button>
            </div>
            
            <!-- Content -->
            <div class="fz-container-stack-v fz-container-gap-md fz-container-padding-md bg-white flex-1">
              <div class="fz-container-stack-responsive-v fz-container-gap-sm">
                <div class="fz-container-stack-center fz-container-padding-lg bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div class="text-center">
                    <div class="text-3xl mb-2">🎯</div>
                    <h3 class="font-semibold">Feature Principale</h3>
                    <p class="text-sm text-gray-600 mt-1">Descrizione della feature</p>
                  </div>
                </div>
                
                <div class="fz-container-grid-2 fz-container-gap-sm">
                  <div class="fz-container-stack-center fz-container-padding-md bg-blue-50 rounded-lg">
                    <div class="text-center">
                      <div class="text-xl mb-1">📊</div>
                      <p class="text-xs font-medium">Analytics</p>
                    </div>
                  </div>
                  <div class="fz-container-stack-center fz-container-padding-md bg-green-50 rounded-lg">
                    <div class="text-center">
                      <div class="text-xl mb-1">⚙️</div>
                      <p class="text-xs font-medium">Settings</p>
                    </div>
                  </div>
                  <div class="fz-container-stack-center fz-container-padding-md bg-orange-50 rounded-lg">
                    <div class="text-center">
                      <div class="text-xl mb-1">📱</div>
                      <p class="text-xs font-medium">Mobile</p>
                    </div>
                  </div>
                  <div class="fz-container-stack-center fz-container-padding-md bg-purple-50 rounded-lg">
                    <div class="text-center">
                      <div class="text-xl mb-1">🔔</div>
                      <p class="text-xs font-medium">Alerts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom Navigation -->
            <div class="fz-container-stack-h fz-container-gap-none bg-gray-100 border-t">
              <div class="fz-container-stack-center fz-container-padding-sm flex-1 text-blue-600">
                <div class="text-xs font-medium">Home</div>
              </div>
              <div class="fz-container-stack-center fz-container-padding-sm flex-1 text-gray-400">
                <div class="text-xs">Search</div>
              </div>
              <div class="fz-container-stack-center fz-container-padding-sm flex-1 text-gray-400">
                <div class="text-xs">Profile</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">📝 Form Complesso</h3>
          <div class="max-w-2xl mx-auto fz-container-stack-v fz-container-gap-lg fz-container-padding-xl bg-white rounded-lg shadow">
            <div class="text-center">
              <h2 class="text-2xl font-bold">Registrazione Azienda</h2>
              <p class="text-gray-600 mt-2">Compila tutti i campi per completare la registrazione</p>
            </div>
            
            <!-- Sezione Dati Azienda -->
            <div class="fz-container-stack-v fz-container-gap-md">
              <h3 class="text-lg font-semibold border-b pb-2">Dati Azienda</h3>
              
              <div class="fz-container-grid-responsive-1-2 fz-container-gap-md">
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Ragione Sociale *</label>
                  <input type="text" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Inserisci ragione sociale" />
                </div>
                
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Partita IVA *</label>
                  <input type="text" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="IT12345678901" />
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-xs">
                <label class="text-sm font-medium">Indirizzo Sede Legale *</label>
                <input type="text" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Via, Numero Civico" />
              </div>
              
              <div class="fz-container-grid-responsive-2-3 fz-container-gap-md">
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Città *</label>
                  <input type="text" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Città" />
                </div>
                
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">CAP *</label>
                  <input type="text" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="12345" />
                </div>
                
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Provincia *</label>
                  <select class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
                    <option>Seleziona provincia</option>
                    <option>Milano (MI)</option>
                    <option>Roma (RM)</option>
                    <option>Napoli (NA)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Sezione Contatti -->
            <div class="fz-container-stack-v fz-container-gap-md">
              <h3 class="text-lg font-semibold border-b pb-2">Dati di Contatto</h3>
              
              <div class="fz-container-grid-responsive-1-2 fz-container-gap-md">
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Email *</label>
                  <input type="email" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="azienda@example.com" />
                </div>
                
                <div class="fz-container-stack-v fz-container-gap-xs">
                  <label class="text-sm font-medium">Telefono *</label>
                  <input type="tel" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="+39 123 456 7890" />
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-xs">
                <label class="text-sm font-medium">Sito Web</label>
                <input type="url" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="https://www.example.com" />
              </div>
            </div>
            
            <!-- Sezione Note -->
            <div class="fz-container-stack-v fz-container-gap-xs">
              <label class="text-sm font-medium">Note aggiuntive</label>
              <textarea rows="3" class="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Eventuali note o richieste specifiche..."></textarea>
            </div>
            
            <!-- Azioni -->
            <div class="fz-container-stack-responsive-v-h fz-container-gap-md fz-container-stack-space-main-end">
              <button type="button" class="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                Annulla
              </button>
              <button type="button" class="px-6 py-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed font-medium">
                Salva Bozza
              </button>
              <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Registra Azienda
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">🛒 E-commerce Product Grid</h3>
          <div class="fz-container-stack-v fz-container-gap-lg fz-container-padding-lg bg-gray-50 rounded">
            <!-- Filters -->
            <div class="fz-container-stack-responsive-v-h fz-container-gap-md fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-md bg-white rounded shadow">
              <h2 class="text-xl font-bold">Prodotti</h2>
              <div class="fz-container-stack-h fz-container-gap-sm">
                <select class="px-3 py-2 border rounded-md text-sm">
                  <option>Categoria</option>
                  <option>Elettronica</option>
                  <option>Abbigliamento</option>
                  <option>Casa</option>
                </select>
                <select class="px-3 py-2 border rounded-md text-sm">
                  <option>Ordina per</option>
                  <option>Prezzo crescente</option>
                  <option>Prezzo decrescente</option>
                  <option>Più venduti</option>
                </select>
              </div>
            </div>
            
            <!-- Products Grid -->
            <div class="fz-container-grid-responsive-1-2-4 fz-container-gap-md">
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">📱</span>
                </div>
                <h3 class="font-semibold">iPhone 15 Pro</h3>
                <p class="text-sm text-gray-600">Smartphone Apple ultimo modello</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€1.199</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">💻</span>
                </div>
                <h3 class="font-semibold">MacBook Air M2</h3>
                <p class="text-sm text-gray-600">Laptop ultraportatile</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€1.499</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">🎧</span>
                </div>
                <h3 class="font-semibold">AirPods Pro</h3>
                <p class="text-sm text-gray-600">Auricolari wireless</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€279</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">⌚</span>
                </div>
                <h3 class="font-semibold">Apple Watch</h3>
                <p class="text-sm text-gray-600">Smartwatch Series 9</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€449</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">🖥️</span>
                </div>
                <h3 class="font-semibold">iMac 24"</h3>
                <p class="text-sm text-gray-600">Desktop all-in-one</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€1.699</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
              
              <div class="fz-container-stack-v fz-container-gap-sm fz-container-padding-md bg-white rounded shadow hover:shadow-lg transition-shadow">
                <div class="fz-container-stack-center h-48 bg-gray-100 rounded">
                  <span class="text-gray-400">📷</span>
                </div>
                <h3 class="font-semibold">iPad Pro</h3>
                <p class="text-sm text-gray-600">Tablet professionale</p>
                <div class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
                  <span class="text-xl font-bold text-green-600">€1.099</span>
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="fz-container-stack-center fz-container-padding-md">
              <div class="fz-container-stack-h fz-container-gap-sm">
                <button class="px-3 py-2 border rounded hover:bg-gray-50">←</button>
                <button class="px-3 py-2 bg-blue-600 text-white rounded">1</button>
                <button class="px-3 py-2 border rounded hover:bg-gray-50">2</button>
                <button class="px-3 py-2 border rounded hover:bg-gray-50">3</button>
                <button class="px-3 py-2 border rounded hover:bg-gray-50">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export default meta
