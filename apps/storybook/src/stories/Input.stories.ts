import type { Meta, StoryObj } from '@storybook/vue3'
import { FzInput } from '@fiscozen/input'

const meta = {
  title: '@fiscozen/input/FzInput',
  component: FzInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    },
    type: {
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      control: {
        type: 'select'
      }
    },
  },
  args: {
    label: 'Input Label',
    placeholder: 'Value',
  }
} satisfies Meta<typeof FzInput>

type Story = StoryObj<typeof meta>


const Default: Story = {}

const Disabled: Story = {
  args: {
    disabled: true
  }
}

const Password: Story = {
  args: {
    type: 'password'
  }
}


const HelpText: Story = {
  args: {
    "helpText": 'This is a helper text with a lot of content and it will be displayed in more than one line'
  }
}

const Error: Story = {
  args: {
    error: true,
    "errorMessage": 'This is an error message'
  },
}

const LeftIcon : Story = {
  args: {
    label: 'Label',
    size: 'md',
    leftIcon: 'calendar-lines'
  }
}

const RightIcon : Story = {
  args: {
    rightIcon: 'credit-card'
  }
}

const Email : Story = {
  args: {
    type: 'email',
    required: true
  },
  decorators: [
    () => ({ template: '<div style="max-width: 300px;"><form action="#"><story/> <button type="submit">Submit</button></form></div>' })
  ]
}

const Telephone : Story = {
  args: {
    type: 'tel',
    pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
    required: true
  },
  decorators: [
    () => ({ template: '<div style="max-width: 300px;"><form action="#"><story/> <button type="submit">Submit</button></form></div>' })
  ]
}

const Valid : Story = {
  args: {
    valid: true
  }
}

export { Default,LeftIcon, RightIcon, Disabled, Password, Email, Telephone, HelpText, Error, Valid }

export default meta
