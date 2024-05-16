import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTooltip } from '@fiscozen/tooltip'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Tooltip',
  component: FzTooltip,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
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

const gridClasses =  {
  tl: 'col-start-1 row-start-1',
  t: 'col-start-2 row-start-1 justify-center',
  tr: 'col-start-3 row-start-1 justify-end',
  r: 'col-start-3 row-start-2 justify-end items-center',
  br: 'col-start-3 row-start-3 justify-end items-end',
  b: 'col-start-2 row-start-3 justify-center items-end',
  bl: 'col-start-1 row-start-3 items-end',
  l: 'col-start-1 row-start-2 items-center',
}

const simpletemplate = `
  <div class="h-11/12 w-11/12" :class="args.classes"> 
    <FzTooltip :text="args.text" :status="args.status">
      <button>test</button>
    </FzTooltip>
  </div>
`
const template = `
  <div class="h-[100vh] w-[100vw]" :class="['grid', 'grid-cols-3', 'grid-rows-3', 'grow-0', args.classes]"> 
    <div v-for="(gridClass, key) in gridClasses" :class="['container', 'flex', 'flex-row', gridClass]">
      <FzTooltip :text="args.text" :status="args.status">
        <button>hover</button>
      </FzTooltip>
      <FzTooltip :text="args.text" :status="args.status" class="ml-12" :withIcon="true">
          <button>hover, with icon</button>
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