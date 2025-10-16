import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzTooltip } from '@fiscozen/tooltip'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Overlay/FzTooltip',
  component: FzTooltip,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['neutral', 'informative', 'positive', 'alert', 'error']
    },
    position: {
      control: { type: 'select' },
      options: [
        'auto',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ]
    },
    text: { control: { type: 'text' } },
    withIcon: { control: { type: 'boolean' } }
  },
  args: {
    position: 'auto'
  }
} satisfies Meta<typeof FzTooltip>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

const gridClasses = {
  tl: 'col-start-1 row-start-1',
  t: 'col-start-2 row-start-1 justify-center',
  tr: 'col-start-3 row-start-1 justify-end',
  r: 'col-start-3 row-start-2 justify-end items-center',
  br: 'col-start-3 row-start-3 justify-end items-end',
  b: 'col-start-2 row-start-3 justify-center items-end',
  bl: 'col-start-1 row-start-3 items-end',
  l: 'col-start-1 row-start-2 items-center'
}

const simpletemplate = `
  <div class="h-11/12 w-11/12" :class="args.classes"> 
    <FzTooltip :text="args.text" :status="args.status">
      <span>hover</span>
    </FzTooltip>
  </div>
`
const template = `
  <div class="h-[200vh] w-[100vw]" :class="['grid', 'grid-cols-3', 'grid-rows-3', 'grow-0', args.classes]"> 
    <div v-for="(gridClass, key) in gridClasses" :class="['container', 'flex', 'flex-row', gridClass]">
      <FzTooltip :text="args.text" :status="args.status">
        <span>hover</span>
      </FzTooltip>
      <FzTooltip :text="args.text" :status="args.status" class="ml-12" :withIcon="true">
          <span>hover, with icon</span>
      </FzTooltip>
    </div>
  </div>
`

export const NeutralTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template: simpletemplate
  }),
  args: {
    status: 'neutral',
    text: 'this is a informative tooltip with a very long text that lets us test overflow'
  }
}

export const InformativeTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'informative',
    text: 'this is a informative tooltip with a very long text that lets us test overflow'
  }
}

export const PositiveTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'positive',
    text: 'this is a positive tooltip with a very long text that lets us test overflow'
  }
}

export const AlertTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'alert',
    text: 'this is a alert tooltip with a very long text that lets us test overflow'
  }
}

export const ErrorTooltip: Story = {
  render: (args) => ({
    setup() {
      return { args, gridClasses }
    },
    components: { FzTooltip },
    template
  }),
  args: {
    status: 'error',
    text: 'this is a error tooltip with a very long text that lets us test overflow'
  }
}

export const WithInteractiveElements: Story = {
  render: (args) => ({
    setup() {
      const handleClick = (label: string) => alert(`Clicked: ${label}`)
      return { args, handleClick }
    },
    components: { FzTooltip },
    template: `
      <div class="flex flex-col gap-16 p-16">
        <div>
          <h3 class="text-lg font-semibold mb-8">Recommended: Non-interactive elements</h3>
          <div class="flex gap-16">
            <FzTooltip text="This is an icon with tooltip">
              <span class="text-2xl">⚙️</span>
            </FzTooltip>
            
            <FzTooltip text="Image with tooltip">
              <img src="https://via.placeholder.com/40" alt="User avatar" class="rounded-full" />
            </FzTooltip>
            
            <FzTooltip text="Text with tooltip" status="informative" :withIcon="true">
              <span class="text-sm font-medium">Hover me</span>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            ✅ Clean tab order: wrapper + content are non-interactive
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-8">Works but creates extra tab stop</h3>
          <div class="flex gap-16">
            <FzTooltip text="Button with tooltip">
              <button @click="handleClick('Save')" class="px-12 py-6 bg-blue-500 text-white rounded">
                Save
              </button>
            </FzTooltip>
            
            <FzTooltip text="Link with tooltip" status="informative">
              <a href="#" @click.prevent="handleClick('Link')" class="text-blue-600 underline">
                Click me
              </a>
            </FzTooltip>
          </div>
          <p class="text-sm text-gray-600 mt-8">
            ⚠️ Nested interactive elements: 2 tab stops (wrapper + button/link)
          </p>
        </div>
      </div>
    `
  }),
  args: {}
}
