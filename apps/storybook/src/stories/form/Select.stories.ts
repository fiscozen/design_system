import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { ref } from 'vue'
import { FzSelect } from '@fiscozen/select'

const meta = {
  title: 'Form/FzSelect',
  component: FzSelect,
  tags: ['autodocs'],
  argTypes: {
    environment: {
      options: ['backoffice', 'frontoffice'],
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
    environment: 'frontoffice',
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
    environment: 'frontoffice',
    label: 'Select',
    placeholder: 'Custom placeholder',
    options: [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
      { value: '3', label: 'Options with a very long text' }
    ]
  }
}

export const Frontoffice: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    environment: 'frontoffice'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify opener button renders
    const opener = canvas.getByRole('button', { name: /select/i })
    expect(opener).toBeTruthy()
    
    // Verify frontoffice height (44px = h-44)
    expect(opener.classList.contains('h-44')).toBe(true)
    
    // Verify ARIA attributes
    expect(opener.getAttribute('aria-haspopup')).toBe('listbox')
    expect(opener.getAttribute('aria-expanded')).toBe('false')
  }
}

export const Backoffice: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    environment: 'backoffice'
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify opener button renders
    const opener = canvas.getByRole('button', { name: /select/i })
    expect(opener).toBeTruthy()
    
    // Verify backoffice height (32px = h-32)
    expect(opener.classList.contains('h-32')).toBe(true)
  }
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
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify opener button has error styling
    const opener = canvas.getByRole('button', { name: /select/i })
    expect(opener.getAttribute('aria-invalid')).toBe('true')
    
    // Verify error border color
    expect(opener.classList.contains('border-semantic-error-200')).toBe(true)
  }
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
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify opener button is disabled
    const opener = canvas.getByRole('button', { name: /select/i })
    expect(opener.hasAttribute('disabled')).toBe(true)
    expect(opener.getAttribute('aria-disabled')).toBe('true')
    
    // Verify disabled styling
    expect(opener.classList.contains('bg-grey-100')).toBe(true)
    expect(opener.classList.contains('border-grey-100')).toBe(true)
  }
}

export const Readonly: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    readonly: true
  },
  decorators: [
    () => ({
      template: `
      <div style="width:100vw;height:100vh;">
        <story/>
      </div>
      `
    })
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify opener button is readonly (same styling as disabled)
    const opener = canvas.getByRole('button', { name: /select/i })
    expect(opener.getAttribute('aria-disabled')).toBe('true')
    
    // Verify readonly styling (same as disabled)
    expect(opener.classList.contains('bg-grey-100')).toBe(true)
    expect(opener.classList.contains('border-grey-100')).toBe(true)
  }
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


export const SelectWithOptionLabelAndSubtitle: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    disableTruncate: true,
    options: [
      { label: 'Consigliate', kind: 'label' },
      { value: '1', label: 'Reverse Charge - Cessione di rottami e altri materiali di recupero', subtitle: 'Per vendite di materiali di recupero come rottami metallici o carta da macero.' },
      { value: '2', label: 'Escluso - Art. 1, Art. 2, Art. 3, Art. 5, Art. 26', subtitle: 'Per rimborsi spese sostenuti in nome e per conto del cliente.' },
      { label: 'Tutte le normative', kind: 'label' },
      { value: '3', label: 'Fuori campo - Art. 3, comma 4a', subtitle: 'Per operazioni di cessione di diritti d\'autore.' },
      { value: '4', label: 'Fuori campo - Art. 3, comma 4b', subtitle: 'Per cessione di beni verso San Marino e Vaticano.' }
    ]
  }
}

export const FloatingLabel: SelectStory = {
  ...Template,
  args: {
    ...Template.args,
    rightIcon: 'bell',
    rightIconButton: true,
    rightIconLast: true,
    variant: 'floating-label',
    rightIconButtonVariant: 'secondary'
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
