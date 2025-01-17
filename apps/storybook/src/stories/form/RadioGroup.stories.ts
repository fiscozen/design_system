import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzRadioGroup, FzRadio, FzRadioCard } from '@fiscozen/radio'
import { FzIcon } from '@fiscozen/icons'
import checker from '../../assets/checker.png'

const meta = {
  title: 'Form/FzRadioGoup',
  component: FzRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
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
  }
}

export const Small: RadioGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Radio Group Small'
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
    error: true
  }
}

export const Disabled: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group Small',
    disabled: true
  }
}

export const Emphasis: RadioGroupStory = {
  ...Template,
  args: {
    label: 'Radio Group Small',
    emphasis: true
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
    error: true
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

export const DoesNotTriggerChangeOnCreation: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzIcon },
    setup() {
      const selected = ref('0')

      return {
        args,
        selected
      }
    },
    methods: {
      onChange() {
        window.alert('on change')
      }
    },
    template: `<FzRadioGroup v-bind="args" @change="onChange" >
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

export const RadioCardGroup: RadioGroupStory = {
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
                        <FzRadioCard title="Option 1" subtitle="lorem ipsum this is a description" value="option1" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                        <FzRadioCard title="Option 2" subtitle="lorem ipsum this is a description" value="option2" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                        <FzRadioCard title="Option 3" subtitle="lorem ipsum this is a description" value="option3" v-model="selected" v-bind="radioGroupProps" orientation="vertical" :imageUrl="checker" />
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group'
  }
}
