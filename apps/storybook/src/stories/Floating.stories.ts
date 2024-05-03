import type { Meta, StoryObj } from '@storybook/vue3'
import {reactive, ref} from 'vue'

import { FzFloating } from '@fiscozen/composables'
import { FzNavlink } from '@fiscozen/navlink'
import { FzNavlist } from '@fiscozen/navlist'

const example = [
      {
        label: 'Label 1',
        items: [
          {
            label: 'Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            summary: 'Item #2',
            subitems: [
              {
                label: 'Sub-Item #1',
                meta: {
                  path: '/foo',
                  name: 'foo'
                }
              },
              {
                label: 'Sub-Item #2',
                meta: {
                  path: '/foo',
                  name: 'foo'
                }
              }
            ]
          }
        ]
      },
      {
        label: 'Label 2',
        items: [
          {
            label: 'Item #1',
            disabled: true,
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      }
    ]

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Floating',
  component: FzFloating,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {
  }
} satisfies Meta<typeof FzFloating>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

const simpleTemplate = `
  <div class="h-screen w-screen" :class="args.classes">
    <FzFloating :position="args.position" :isOpen>
      <template #opener>
          <FzNavlink @click="isOpen = !isOpen">open float here</FzNavlink>
      </template> 
      <FzNavlist :sections/>
    </FzFloating>
  </div>
`

const withOpenerRightStart = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerRightStart = withOpenerRightStart.bind({})
WithOpenerRightStart.args = {
    position: 'right-start',
    classes: ''
}

const withOpenerRight = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerRight = withOpenerRight.bind({})
WithOpenerRight.args = {
    position: 'right',
    classes: 'flex flex-col justify-center'
}

const withOpenerRightBottom = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerRightBottom = withOpenerRightBottom.bind({})
WithOpenerRightBottom.args = {
    position: 'right-end',
    classes: 'flex flex-col justify-end'
}

const withOpenerTopStart = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerTopStart = withOpenerTopStart.bind({})
WithOpenerTopStart.args = {
    position: 'top-start',
    classes: 'flex flex-col justify-end'
}

const withOpenerTop = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerTop= withOpenerTop.bind({})
WithOpenerTop.args = {
    position: 'top',
    classes: 'flex flex-col justify-end items-center'
}

const withOpenerTopEnd = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerTopEnd = withOpenerTopEnd.bind({})
WithOpenerTopEnd.args = {
    position: 'top-end',
    classes: 'flex flex-col justify-end items-end'
}

const withOpenerLeftEnd = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerLeftEnd = withOpenerLeftEnd.bind({})
WithOpenerLeftEnd.args = {
    position: 'left-end',
    classes: 'flex flex-col justify-end items-end'
}

const withOpenerLeft = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerLeft = withOpenerLeft.bind({})
WithOpenerLeft.args = {
    position: 'left',
    classes: 'flex flex-col justify-center items-end'
}

const withOpenerLeftStart = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerLeftStart = withOpenerLeftStart.bind({})
WithOpenerLeftStart.args = {
    position: 'left-start',
    classes: 'flex flex-col justify-start items-end'
}

const withOpenerBottomEnd = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerBottomEnd = withOpenerBottomEnd.bind({})
WithOpenerBottomEnd.args = {
    position: 'bottom-end',
    classes: 'flex flex-col justify-start items-end'
}

const withOpenerBottom = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerBottom = withOpenerBottom.bind({})
WithOpenerBottom.args = {
    position: 'bottom',
    classes: 'flex flex-col justify-start items-center'
}

const withOpenerBottomStart = (args) => ({
  setup() {
    const isOpen = ref(false);
    const sections = reactive(example);
    return { args, isOpen, sections }
  },
  components: { FzFloating, FzNavlink, FzNavlist },
  template: simpleTemplate
})
export const WithOpenerBottomStart = withOpenerBottomStart.bind({})
WithOpenerBottomStart.args = {
    position: 'bottom-start',
    classes: 'flex flex-col justify-start items-start'
}

// following stories are left as comments until related design is finalized
/* const windowContainer = (args) => ({
  setup() {
    return { args }
  },
  components: { FzFloating },
  template: `
    <fz-floating v-bind="args">
      <div>some content </div>
    </fz-floating>
  `
})

export const WindowContainer = windowContainer.bind({})
WindowContainer.args = {
}

const customContainer = (args) => ({
  setup() {
    return { args }
  },
  components: { FzFloating },
  template: `
    <div class="page">
      <main></main>
      <aside>
        <FzFloating>floating in a separate container like an aside</FzFloating>
      </aside>
    </div>
    <fz-floating v-bind="args">
      <div>some content </div>
    </fz-floating>
  `
}) 

export const CustomContainer = customContainer.bind({})
CustomContainer.args = {
} */