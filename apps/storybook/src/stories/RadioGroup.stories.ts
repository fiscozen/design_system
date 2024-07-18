import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { FzRadioGroup, FzRadio } from '@fiscozen/radio'
import { FzIcon } from '@fiscozen/icons'

const meta = {
  title: '@fiscozen/radio/FzRadioGoup',
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
                        <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    size: 'sm',
    label: 'Radio Group'
  }
}

export const Medium: RadioGroupStory = {
  ...Template,
  args: {
    size: 'md',
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

export const helpText: RadioGroupStory = {
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
    size: 'sm',
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
    size: 'sm',
    label: 'Radio Group',
    error: true
  }
}

export const disabled: RadioGroupStory = {
  ...Template,
  args: {
    size: 'sm',
    label: 'Radio Group Small',
    disabled: true
  }
}

export const emphasis: RadioGroupStory = {
  ...Template,
  args: {
    size: 'sm',
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
    size: 'sm',
    label: 'Radio Group',
    required: true
  }
}

export const helpTextAndError: RadioGroupStory = {
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
    size: 'md',
    label: 'Radio Group',
    error: true
  }
}