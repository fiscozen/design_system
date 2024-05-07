import type { Meta, StoryObj } from '@storybook/vue3'
import {reactive, ref} from 'vue'

import { FzTooltip, FzTooltipProps } from '@fiscozen/tooltip'

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
  <div class="h-[100vh] w-[100vw]" :class="args.classes" class="grid grid-cols-3 grid-rows-3 grow-0"> 
    <div class="container flex flex-row" v-for="(gridClass, key) in gridClasses" :class="gridClass">
      <FzTooltip :text="args.text" :status="args.status">
        <button>hover</button>
      </FzTooltip>
      <FzTooltip :text="args.text" :status="args.status" class="ml-12" :withIcon="true">
          <button>hover, with icon</button>
      </FzTooltip>
    </div>
  </div>
`

const neutralTooltip = (args: FzTooltipProps) => ({
  setup() {
    return { args, gridClasses }
  },
  components: { FzTooltip },
  template: simpletemplate
})
export const NeutralTooltip = neutralTooltip.bind({})
NeutralTooltip.args = {
  status: 'neutral',
  text: 'this is a tooltip'
}

const informativeTooltip = (args: FzTooltipProps) => ({
  setup() {
    return { args, gridClasses }
  },
  components: { FzTooltip },
  template
})
export const InformativeTooltip = informativeTooltip.bind({})
InformativeTooltip.args = {
  status: 'informative',
  text: 'this is a informative tooltip '
}

const positiveTooltip = (args: FzTooltipProps) => ({
  setup() {
    return { args, gridClasses }
  },
  components: { FzTooltip },
  template
})
export const PositiveTooltip = positiveTooltip.bind({})
PositiveTooltip.args = {
  status: 'positive',
  text: 'this is a positive tooltip'
}

const alertTooltip = (args: FzTooltipProps) => ({
  setup() {
    return { args, gridClasses }
  },
  components: { FzTooltip },
  template
})
export const AlertTooltip = alertTooltip.bind({})
AlertTooltip.args = {
  status: 'alert',
  text: 'this is an alert tooltip'
}

const errorTooltip = (args: FzTooltipProps) => ({
  setup() {
    return { args, gridClasses }
  },
  components: { FzTooltip },
  template
})
export const ErrorTooltip = errorTooltip.bind({})
ErrorTooltip.args = {
  status: 'error',
  text: 'this is an error tooltip'
}