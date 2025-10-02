import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzTextarea } from '@fiscozen/textarea'

const meta: Meta<typeof FzTextarea> = {
  title: 'Form/FzTextarea',
  component: FzTextarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'all']
    }
  },
  args: {
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    modelValue: ''
  },
  decorators: [
    () => ({
      template: '<div class="p-10"><story/></div>'
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    id: 'default'
  }
}

const WithValue: Story = {
  args: {
    id: 'default',
    modelValue: 'This is the initial value'
  }
}

const Small: Story = {
  args: {
    id: 'small',
    size: 'sm'
  }
}

const Large: Story = {
  args: {
    id: 'large',
    size: 'lg'
  }
}

const Error: Story = {
  args: {
    id: 'error',
    error: true,
    errorMessage: 'This is an error message'
  }
}

const Help: Story = {
  args: {
    id: 'help',
    helpMessage: 'This is a long long long long long long long long long long help message'
  }
}

const Valid: Story = {
  args: {
    id: 'valid',
    valid: true
  }
}

const Disabled: Story = {
  args: {
    id: 'disabled',
    disabled: true
  }
}

export { Default, WithValue, Small, Large, Error, Help, Valid, Disabled }

export default meta
