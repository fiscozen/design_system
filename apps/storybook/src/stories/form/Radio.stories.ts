import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadio } from '@fiscozen/radio'
import { expect, within, userEvent } from '@storybook/test'

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
  decorators: [() => ({ template: '<div style="padding:10px;"><story/></div>' })]
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    await expect(radio).not.toBeChecked()
    await expect(canvas.getByText('Radio')).toBeInTheDocument()

    await userEvent.click(radio)
    await expect(radio).toBeChecked()
  }
}

export const CheckedDefault: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeChecked()
  }
}

export const Disabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeDisabled()
    await expect(radio).not.toBeChecked()
  }
}

export const CheckedDisabled: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    checked: true,
    disabled: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    await expect(radio).toBeChecked()
    await expect(radio).toBeDisabled()
  }
}

export const ToneNeutral: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'neutral'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('text-core-black')
  }
}

export const ToneEmphasis: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'emphasis'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('peer-checked:before:border-blue-500')
  }
}

export const ToneError: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tone: 'error'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const label = canvas.getByText('Radio').closest('label')
    await expect(label).toHaveClass('text-semantic-error')
  }
}

export const WithTooltip: RadioStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    tooltip: 'This is an informative tooltip'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parentElement = within(canvasElement.parentElement as HTMLElement)
    const radio = canvas.getByRole('radio')
    await expect(radio).toBeInTheDocument()
    const tooltip = parentElement.getByText('This is an informative tooltip')
    await expect(tooltip).toBeInTheDocument()
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
      value: 'xs',
      isRotated: false
    }
  }
}
