import type { Meta, StoryObj } from '@storybook/vue3'
import { FzInput } from '@fiscozen/input'
import { all } from '@awesome.me/kit-8137893ad3/icons'

const templateForm =
  '<form action="javascript:void(0);"><story/> <button type="submit" class="mt-10 border-1 px-10 py-4 rounded ">Submit</button></form>'

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
    leftIcon: {
      options: all.map((icon) => icon.iconName) as String[],
      control: {
        type: 'select'
      }
    },
    leftIconVariant: {
      options: all.map((icon) => icon.prefix) as String[],
      control: {
        type: 'select'
      }
    },
    rightIcon: {
      options: all.map((icon) => icon.iconName) as String[],
      control: {
        type: 'select'
      }
    },
    rightIconVariant: {
      options: all.map((icon) => icon.prefix) as String[],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    label: 'Input Label',
    placeholder: 'Value'
  },
  decorators: [() => ({ template: '<div style="max-width: 300px; padding:10px;"><story/></div>' })]
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
    helpText:
      'This is a helper text with a lot of content and it will be displayed in more than one line'
  }
}

const Error: Story = {
  args: {
    error: true,
    errorMessage: 'This is an error message'
  }
}

const LeftIcon: Story = {
  args: {
    label: 'Label',
    size: 'md',
    leftIcon: 'calendar-lines'
  }
}

const RightIcon: Story = {
  args: {
    rightIcon: 'credit-card'
  }
}

const Email: Story = {
  args: {
    type: 'email',
    required: true
  },
  decorators: [() => ({ template: templateForm })]
}

const Telephone: Story = {
  args: {
    type: 'tel',
    pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
    required: true
  },
  decorators: [() => ({ template: templateForm })]
}

const Valid: Story = {
  args: {
    valid: true
  }
}

const Required: Story = {
  args: {
    required: true
  },
  decorators: [() => ({ template: templateForm })]
}

const LeftAndRightWithValid: Story = {
  title: 'Left and Right Icon with Valid',
  args: {
    leftIcon: 'calendar-lines',
    rightIcon: 'credit-card',
    valid: true
  }
}

const WithDefaultValues: Story = {
  args: {
    label: 'Input Label',
    placeholder: 'This is a very long placeholder with a longer value and longer meaning',
    modelValue: 'This is a very long text with a longer value and longer meaning'
  }
}

const Number: Story = {
  args: {
    type: 'number',
    required: true
  },
  decorators: [() => ({ template: templateForm })]
}

const Url: Story = {
  args: {
    type: 'url',
    required: true
  },
  decorators: [() => ({ template: templateForm })]
}

const MaxLength: Story = {
  args: {
    maxlength: 4
  },
  decorators: [() => ({ template: templateForm })]
}

export {
  Default,
  LeftIcon,
  RightIcon,
  Required,
  Disabled,
  Password,
  Email,
  Telephone,
  Number,
  Url,
  HelpText,
  Error,
  Valid,
  LeftAndRightWithValid,
  WithDefaultValues,
  MaxLength
}

export default meta
