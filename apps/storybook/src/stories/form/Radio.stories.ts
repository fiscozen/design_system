import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadio } from '@fiscozen/radio'

const meta = {
  title: 'Form/FzRadio',
  component: FzRadio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['md'],
      control: {
        type: 'select'
      }
    },
    tone: {
      options: ['neutral', 'emphasis', 'error'],
      control: {
        type: 'select'
      }
    },
    tooltipStatus: {
      options: ['neutral', 'informative', 'positive', 'alert', 'error'],
      control: {
        type: 'select'
      }
    }
  },
} satisfies Meta<typeof FzRadio>

export default meta

type RadioStory = StoryObj<typeof FzRadio>

const Template: RadioStory = {
  render: (args) => ({
    components: { FzRadio },
    setup() {
      return {
        args
      }
    },
    template: `<FzRadio v-bind="args" />`
  }),
  args: {
    label: 'Radio',
    value: 'test'
  }
}

export const Medium: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio'
  }
}


export const CheckedDefault: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true
  }
}

export const Disabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    disabled: true
  }
}

export const CheckedDisabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true,
    disabled: true
  }
}

export const ToneNeutral: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'neutral'
  }
}

export const ToneEmphasis: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'emphasis'
  }
}

export const ToneError: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'error'
  }
}

export const WithTooltip: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tooltip: 'This is an informative tooltip'
  }
}

export const HasTextFalse: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    hasText: false
  }
}

export const VeryLongLabel: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  globals: {
    viewport: {
      value: "xs",
      isRotated: false
    }
  }
}
