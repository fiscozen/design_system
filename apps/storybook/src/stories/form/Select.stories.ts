import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { FzSelect } from '@fiscozen/select'

const meta = {
  title: 'Form/FzSelect',
  component: FzSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzSelect>
export default meta

type SelectStory = StoryObj<typeof FzSelect>

const Template: SelectStory = {
  render: (args) => ({
    components: { FzSelect },
    setup() {
      const model = ref('')
      return {
        args,
        model
      }
    },
    template: `<div class="p-8 relative" style='width:200px'>
                  <FzSelect v-bind="args" v-model="model"> 
                      <template #error>Custom error message</template>
                      <template #help>Custom help message</template>
                  </FzSelect>
                </div>`
  }),
  args: {
    size: 'md',
    label: 'Select',
    placeholder: 'Custom placeholder',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      {
        value: '3',
        label: 'Options with a very long text that is very very very long and unreadable'
      }
    ]
  }
}

const BottomTemplate: SelectStory = {
  render: (args) => ({
    components: { FzSelect },
    setup() {
      const model = ref('')
      return {
        args,
        model
      }
    },
    template: `
                  <FzSelect v-bind="args" v-model="model"> 
                      <template #error>Custom error message</template>
                      <template #help>Custom help message</template>
                  </FzSelect>
                `
  }),
  args: {
    size: 'md',
    label: 'Select',
    placeholder: 'Custom placeholder',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { value: '3', label: 'Options with a very long text' }
    ]
  }
}

export const Medium: SelectStory = {
  ...Template,
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const Small: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'sm'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const Large: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'lg'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const Error: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    error: true
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const Disabled: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const Required: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    required: true
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const SelectWithHundredsOfOptions: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    teleport: true,
    options: Array.from({ length: 1000 }, (_, i) => ({
      value: i.toString(),
      label: `Option ${i}`
    }))
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const SelectWithHundredsOfOptionsAndMaxHeight: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    options: Array.from({ length: 1000 }, (_, i) => ({
      value: i.toString(),
      label: `Option ${i}`
    })),
    floatingPanelMaxHeight: '200px'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ]
}

export const OpenOnTop: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    position: 'top'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <div style='padding-top:200px'><story/></div>
      </div>
      `
    })
  ]
}

export const AutoVertical: SelectStory = {
  ...BottomTemplate,
  args: {
    ...BottomTemplate.args
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <div style='position: absolute; bottom: 8px; width: 200px;'><story/></div>
      </div>
      `
    })
  ]
}

export const LongTextOnRight: SelectStory = {
  ...Template,
  args: {
    ...Template.args
  },
  decorators: [
    () => ({
      template: `
      <div class="flex w-full justify-end">
        <story/>
      </div>
      `
    })
  ]
}

export const SelectWithOptionLabel: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    options: [
      { label: 'Group 1', kind: 'label' },
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { label: 'Group 2', kind: 'label' },
      { value: '3', label: 'Three' }
    ]
  }
}
