import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { ref } from 'vue'
import { Fz{{pascalCase component}} } from '@fiscozen/{{kebabCase component}}'

const meta = {
  title: '{{pascalCase component}}/Fz{{pascalCase component}}',
  component: Fz{{pascalCase component}},
  tags: ['autodocs'],
  argTypes: {
    // Define controls for your props
    // variant: {
    //   control: 'select',
    //   options: ['primary', 'secondary', 'danger', 'success']
    // },
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice'],
      description: 'Component environment determining size and spacing',
      table: {
        defaultValue: { summary: 'frontoffice' }
      }
    },
    disabled: { control: 'boolean' },
    // Hide deprecated props from controls:
    // deprecatedProp: { table: { disable: true } }
  },
  args: {
    // Default args for all stories
    disabled: false
  },
  decorators: [
    () => ({
      template: '<div style="max-width: 400px; padding: 16px;"><story/></div>'
    })
  ]
} satisfies Meta<typeof Fz{{pascalCase component}}>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// DEFAULT STORY
// ============================================

export const Default: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify component renders', async () => {
      // Adjust selector based on your component
      const element = canvas.getByRole('button') // or 'textbox', etc.
      await expect(element).toBeInTheDocument()
      await expect(element).toBeVisible()
    })
    
    await step('Verify default ARIA attributes', async () => {
      const element = canvas.getByRole('button')
      await expect(element).toHaveAttribute('aria-disabled', 'false')
    })
    
    await step('Verify default environment styling (frontoffice)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-44')).toBe(true)
    })
  }
}

// ============================================
// ENVIRONMENT STORIES
// ============================================

export const Frontoffice: Story = {
  args: {
    environment: 'frontoffice'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify frontoffice height (44px = h-44)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-44')).toBe(true)
    })
  }
}

export const Backoffice: Story = {
  args: {
    environment: 'backoffice'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify backoffice height (32px = h-32)', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('h-32')).toBe(true)
    })
  }
}

// ============================================
// STATE STORIES
// ============================================

export const Disabled: Story = {
  args: {
    disabled: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')
    
    await step('Verify disabled state', async () => {
      await expect(element).toBeDisabled()
      await expect(element).toHaveAttribute('aria-disabled', 'true')
    })
    
    await step('Verify click does not fire when disabled', async () => {
      await userEvent.click(element)
      // No error should occur, component should not respond
    })
  }
}

// ============================================
// INTERACTION STORIES
// ============================================

export const UserInteraction: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')
    
    await step('Click the component', async () => {
      await userEvent.click(element)
      // Add assertions for expected behavior after click
    })
  }
}

export const KeyboardNavigation: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus element', async () => {
      await userEvent.tab()
      const focusedElement = document.activeElement
      await expect(focusedElement).toBe(canvas.getByRole('button'))
    })
    
    await step('Activate with Enter key', async () => {
      await userEvent.keyboard('{Enter}')
      // Add assertions for expected behavior
    })
    
    await step('Activate with Space key', async () => {
      await userEvent.keyboard(' ')
      // Add assertions for expected behavior
    })
  }
}

// ============================================
// VARIANT STORIES (if applicable)
// ============================================

// Uncomment and customize if your component has variants:
// export const Primary: Story = {
//   args: { variant: 'primary' },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement)
//     const element = canvas.getByRole('button')
//     
//     await expect(element.classList.contains('bg-blue-500')).toBe(true)
//     await expect(element.classList.contains('text-core-white')).toBe(true)
//   }
// }
// 
// export const Secondary: Story = {
//   args: { variant: 'secondary' },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement)
//     const element = canvas.getByRole('button')
//     
//     await expect(element.classList.contains('bg-core-white')).toBe(true)
//     await expect(element.classList.contains('text-grey-500')).toBe(true)
//   }
// }

// ============================================
// ERROR STATE (if applicable)
// ============================================

// Uncomment if your component supports error state:
// export const Error: Story = {
//   render: (args) => ({
//     components: { Fz{{pascalCase component}} },
//     setup: () => ({ args }),
//     template: `
//       <Fz{{pascalCase component}} v-bind="args" :error="true">
//         <template #errorMessage>This field is required</template>
//       </Fz{{pascalCase component}}>
//     `
//   }),
//   args: {},
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement)
//     
//     await step('Verify error message is displayed', async () => {
//       const errorMessage = canvas.getByText('This field is required')
//       await expect(errorMessage).toBeVisible()
//     })
//     
//     await step('Verify error ARIA attributes', async () => {
//       const input = canvas.getByRole('textbox')
//       await expect(input).toHaveAttribute('aria-invalid', 'true')
//       
//       const errorId = input.getAttribute('aria-describedby')
//       await expect(errorId).toBeTruthy()
//       
//       if (errorId) {
//         const errorElement = canvasElement.querySelector(`#${errorId}`)
//         await expect(errorElement).toHaveAttribute('role', 'alert')
//       }
//     })
//   }
// }

// ============================================
// V-MODEL STORY (if applicable)
// ============================================

// Uncomment if your component supports v-model:
// export const WithVModel: Story = {
//   render: (args) => ({
//     components: { Fz{{pascalCase component}} },
//     setup: () => {
//       const value = ref('')
//       return { args, value }
//     },
//     template: `
//       <div>
//         <Fz{{pascalCase component}} v-bind="args" v-model="value" />
//         <p class="mt-4 text-sm text-grey-500">Current value: {{ value }}</p>
//       </div>
//     `
//   }),
//   args: {},
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement)
//     
//     await step('Type in input', async () => {
//       const input = canvas.getByRole('textbox')
//       await userEvent.clear(input)
//       await userEvent.type(input, 'Test value')
//       await expect(input).toHaveValue('Test value')
//     })
//     
//     await step('Verify v-model updates', async () => {
//       const output = canvas.getByText(/Current value:/)
//       await expect(output.textContent).toContain('Test value')
//     })
//   }
// }

// ============================================
// ALL STATES STORY
// ============================================

export const AllStates: Story = {
  render: () => ({
    components: { Fz{{pascalCase component}} },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-grey-500 mb-2">Default</p>
          <Fz{{pascalCase component}} />
        </div>
        <div>
          <p class="text-sm text-grey-500 mb-2">Disabled</p>
          <Fz{{pascalCase component}} :disabled="true" />
        </div>
        <div>
          <p class="text-sm text-grey-500 mb-2">Backoffice</p>
          <Fz{{pascalCase component}} environment="backoffice" />
        </div>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button, input, [role="button"]')
    await expect(buttons.length).toBeGreaterThanOrEqual(3)
  }
}
