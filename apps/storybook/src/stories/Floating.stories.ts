import type { Meta, StoryObj } from '@storybook/vue3'
import { reactive, ref } from 'vue'

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
  title: '@fiscozen/composables/FzFloating',
  component: FzFloating,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof FzFloating>

export default meta
type Story = StoryObj<typeof FzFloating>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

const simpleTemplate = `
  <div class="h-screen w-screen" :class="args.class">
    <FzFloating :position="args.position" :isOpen>
      <template #opener>
          <FzNavlink @click="isOpen = !isOpen">open float here</FzNavlink>
      </template> 
      <FzNavlist :sections/>
    </FzFloating>
  </div>
`

const Template: Story = {
  render: (args) => ({
    setup() {
      const isOpen = ref(false)
      const sections = reactive(example)
      return { args, isOpen, sections }
    },
    components: { FzFloating, FzNavlink, FzNavlist },
    template: simpleTemplate
  })
}
export const WithOpenerRightStart: Story = {
  ...Template,
  args: {
    position: 'right-start',
    class: ''
  }
}
export const WithOpenerRight: Story = {
  ...Template,
  args: {
    position: 'right',
    class: 'flex flex-col justify-center'
  }
}

export const WithOpenerRightBottom: Story = {
  ...Template,
  args: {
    position: 'right-end',
    class: 'flex flex-col justify-end'
  }
}
export const WithOpenerTopStart: Story = {
  ...Template,
  args: {
    position: 'top-start',
    class: 'flex flex-col justify-end'
  }
}

export const WithOpenerTop: Story = {
  ...Template,
  args: {
    position: 'top',
    class: 'flex flex-col justify-end items-center'
  }
}

export const WithOpenerTopEnd: Story = {
  ...Template,
  args: {
    position: 'top-end',
    class: 'flex flex-col justify-end items-end'
  }
}

export const WithOpenerLeftEnd: Story = {
  ...Template,
  args: {
    position: 'left-end',
    class: 'flex flex-col justify-end items-end'
  }
}

export const WithOpenerLeft: Story = {
  ...Template,
  args: {
    position: 'left',
    class: 'flex flex-col justify-center items-end'
  }
}

export const WithOpenerLeftStart: Story = {
  ...Template,
  args: {
    position: 'left-start',
    class: 'flex flex-col justify-start items-end'
  }
}

export const WithOpenerBottomEnd: Story = {
  ...Template,
  args: {
    position: 'bottom-end',
    class: 'flex flex-col justify-start items-end'
  }
}

export const WithOpenerBottom: Story = {
  ...Template,
  args: {
    position: 'bottom',
    class: 'flex flex-col justify-start items-center'
  }
}

export const WithOpenerBottomStart: Story = {
  ...Template,
  args: {
    position: 'bottom-start',
    class: 'flex flex-col justify-start items-start'
  }
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
