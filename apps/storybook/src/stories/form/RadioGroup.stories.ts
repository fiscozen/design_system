import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadioGroup, FzRadio, FzRadioCard } from '@fiscozen/radio'
import { FzIcon } from '@fiscozen/icons'
import { expect, fn, within, userEvent } from '@storybook/test'
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
  },
  decorators: [() => ({ template: '<div style="padding:10px;"><story/></div>' })]
} satisfies Meta<typeof FzRadioGroup>

export default meta

type RadioGroupStory = StoryObj<typeof FzRadioGroup>

const Template: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzRadioCard, FzIcon },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const selected = ref(initialValue ?? 'option2')
      const handleUpdate = (value: string) => {
        selected.value = value
        if (onUpdateModelValue) {
          onUpdateModelValue(value)
        }
      }

      return {
        restArgs,
        selected,
        handleUpdate
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
    // Use :modelValue and @update:modelValue instead of v-model to avoid double-calling spy
    template: `<FzRadioGroup v-bind="restArgs" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
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
    label: 'Radio Group Medium',
    modelValue: 'option2',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify radio group renders correctly', async () => {
      const group = canvas.getByRole('radiogroup')
      await expect(group).toBeInTheDocument()

      const radios = canvas.getAllByRole('radio')
      await expect(radios.length).toBe(3)
      await expect(radios[1]).toBeChecked()
    })
    
    await step('Click first radio and verify update:modelValue IS called', async () => {
      const radios = canvas.getAllByRole('radio')
      
      await userEvent.click(radios[0])
      
      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the new value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('option1')
      await expect(radios[0]).toBeChecked()
      await expect(radios[1]).not.toBeChecked()
    })
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
    disabled: true,
    modelValue: 'option2',
    // 👇 Define spy in args - it should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify disabled state', async () => {
      const group = canvas.getByRole('radiogroup')
      await expect(group).toBeInTheDocument()
      
      const radios = canvas.getAllByRole('radio')
      await expect(radios.length).toBe(3)
      
      // All radios should be disabled
      for (const radio of radios) {
        await expect(radio).toBeDisabled()
        await expect(radio).toHaveAttribute('aria-disabled', 'true')
      }
    })
    
    await step('Verify click handler is NOT called when clicking disabled radio', async () => {
      const radios = canvas.getAllByRole('radio')
      
      // Try clicking the first radio (should not trigger update)
      await userEvent.click(radios[0])
      
      // ROBUST CHECK: Verify the update:modelValue spy was NOT called
      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
      
      // Verify the selection didn't change (still option2)
      await expect(radios[1]).toBeChecked()
      await expect(radios[0]).not.toBeChecked()
    })
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

export const KeyboardNavigation: RadioGroupStory = {
  render: (args) => ({
    components: { FzRadioGroup, FzRadio, FzRadioCard, FzIcon },
    setup() {
      const { modelValue: initialValue, 'onUpdate:modelValue': onUpdateModelValue, ...restArgs } = args
      const selected = ref(initialValue ?? 'option2')
      const handleUpdate = (value: string) => {
        selected.value = value
        if (onUpdateModelValue) {
          onUpdateModelValue(value)
        }
      }

      return {
        restArgs,
        selected,
        handleUpdate
      }
    },
    // Use :modelValue and @update:modelValue instead of v-model to avoid double-calling spy
    template: `<FzRadioGroup v-bind="restArgs" >
                    <template v-slot="{radioGroupProps}"> 
                        <FzRadio label="Option 1" value="option1" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 2" value="option2" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
                        <FzRadio label="Option 3" value="option3" :modelValue="selected" @update:modelValue="handleUpdate" v-bind="radioGroupProps"/>
                    </template>
                    
                </FzRadioGroup>`
  }),
  args: {
    label: 'Radio Group',
    modelValue: 'option2',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Focus checked radio', async () => {
      const radios = canvas.getAllByRole('radio')
      // Focus the checked radio (option2, which is radios[1])
      radios[1].focus()
      await expect(document.activeElement).toBe(radios[1])
      await expect(radios[1]).toBeChecked()
    })
    
    await step('Navigate to first radio with Arrow Up (arrow keys auto-select)', async () => {
      const radios = canvas.getAllByRole('radio')
      
      // Arrow up should move to previous radio (option1) and automatically select it
      await userEvent.keyboard('{ArrowUp}')
      await expect(document.activeElement).toBe(radios[0])
      
      // ROBUST CHECK: Arrow keys in radio groups automatically select, verify spy was called with correct value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('option1')
      await expect(radios[0]).toBeChecked()
      await expect(radios[1]).not.toBeChecked()
    })
    
    await step('Navigate with Arrow Down (arrow keys auto-select)', async () => {
      const radios = canvas.getAllByRole('radio')
      
      // Arrow down should move to next radio (option2) and automatically select it
      await userEvent.keyboard('{ArrowDown}')
      await expect(document.activeElement).toBe(radios[1])
      
      // ROBUST CHECK: Arrow keys automatically select, verify spy was called with correct value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('option2')
      await expect(radios[1]).toBeChecked()
      await expect(radios[0]).not.toBeChecked()
    })
    
    await step('Activate with Space key (should not change selection)', async () => {
      const radios = canvas.getAllByRole('radio')
      const lastCallCount = args['onUpdate:modelValue'].mock.calls.length
      
      // Space on already-selected radio should not trigger another update
      await userEvent.keyboard(' ')
      
      // ROBUST CHECK: Space on already-selected radio should not call spy again
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(lastCallCount)
      await expect(radios[1]).toBeChecked()
    })
  }
}
