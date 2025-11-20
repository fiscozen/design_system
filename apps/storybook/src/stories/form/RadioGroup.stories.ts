import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadioGroup, FzRadio, FzRadioCard } from '@fiscozen/radio'
import { FzIcon } from '@fiscozen/icons'
import { expect, within, userEvent } from '@storybook/test'
const checker = 'consultant.jpg'

const meta = {
  title: 'Form/FzRadioGoup',
  component: FzRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['md'],
      control: {
        type: 'select'
      }
    },
    variant: {
      options: ['vertical', 'horizontal'],
      control: {
        type: 'select'
      }
    },
    tone: {
      options: ['neutral', 'emphasis', 'error'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzRadioGroup>

export default meta

type RadioGroupStory = StoryObj<typeof FzRadioGroup>

const Template: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzRadioCard, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}

export const Medium: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group Medium'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup')
    await expect(group).toBeInTheDocument()

    const radios = canvas.getAllByRole('radio')
    await expect(radios.length).toBe(3)

    await expect(radios[1]).toBeChecked()

    await userEvent.click(radios[0])
    await expect(radios[0]).toBeChecked()
    await expect(radios[1]).not.toBeChecked()
  }
}

export const HelpText: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template #help> This is a help text </template>
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}

export const Error: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template #error> This is an error text </template>
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group',
    tone: 'error'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('This is an error text')).toBeInTheDocument()
  }
}

export const VariantHorizontal: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group',
    variant: 'horizontal'
  }
}

export const VariantVertical: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group',
    variant: 'vertical'
  }
}

export const ToneNeutral: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group',
    tone: 'neutral'
  }
}

export const ToneEmphasis: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group',
    tone: 'emphasis'
  }
}

export const ToneError: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template #error> This is an error text </template>
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group',
    tone: 'error'
  }
}

export const Disabled: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group',
    disabled: true
  }
}

export const Required: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      return {
        args
      }
    },
    template: `<form action="">
                    <FzRadioGroup v-bind="args" v-slot="{radioGroupProps}">
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </FzRadioGroup>
                    <input type="submit" value="submit">
                </form>`
  }),
  args: {
    label: 'Radio Group',
    required: true
  }
}

export const HelpTextAndError: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template #help> This is a help text </template>
                    <template #error> This is an error text </template>
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>                   
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group',
    tone: 'error'
  }
}

export const ValueWithNumber: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('0')

      return {
        args,
        selected
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="0" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="2" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}

export const VerticalRadioCardGroup: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadioCard, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected,
        checker
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadioCard label="Option 1" title="Option 1" subtitle="lorem ipsum this is a description" value="option1" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                        <FzRadioCard label="Option 2" title="Option 2" subtitle="lorem ipsum this is a description" value="option2" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                        <FzRadioCard label="Option 3" title="Option 3" subtitle="lorem ipsum this is a description" value="option3" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}

export const HorizontalRadioCardGroup: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadioCard, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected,
        checker
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadioCard label="Option 1" title="Option 1" subtitle="lorem ipsum this is a description" value="option1" v-model="selected" v-bind="radioGroupProps" orientation="horizontal" :imageUrl="checker" tooltip="this is a tooltip" />
                        <FzRadioCard label="Option 2" title="Option 2" subtitle="lorem ipsum this is a description" value="option2" v-model="selected" v-bind="radioGroupProps" orientation="horizontal" :imageUrl="checker" tooltip="this is a tooltip" />
                        <FzRadioCard label="Option 3" title="Option 3" subtitle="lorem ipsum this is a description" value="option3" v-model="selected" v-bind="radioGroupProps" orientation="horizontal" :imageUrl="checker" tooltip="this is a tooltip" />
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}

export const WithTooltips: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps" tooltip="This is an informative tooltip" tooltipStatus="informative" />
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps" tooltip="This is an error tooltip" tooltipStatus="error" />
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps" tooltip="This is a positive tooltip" tooltipStatus="positive" />
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group with Tooltips'
  }
}

export const HorizontalWithTooltips: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('option2')

      return {
        args,
        selected
      }
    },
    watch: {
      selected: {
        immediate: true,
        handler: function (val) {
          console.log(val)
        }
      }
    },
    template: `<FzRadioGroup v-bind="args" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps" tooltip="This is an informative tooltip" tooltipStatus="informative" />
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps" tooltip="This is an error tooltip" tooltipStatus="error" />
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps" tooltip="This is a positive tooltip" tooltipStatus="positive" />
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group Horizontal with Tooltips',
    variant: 'horizontal'
  }
}
