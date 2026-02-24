import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzDisplayField } from '@fiscozen/displayfield'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
  title: 'Form/FzDisplayField',
  component: FzDisplayField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'normal'],
      control: { type: 'select' }
    },
    gap: {
      options: ['none', 'small', 'medium'],
      control: { type: 'select' }
    },
    isEmphasized: {
      control: { type: 'boolean' }
    }
  },
  args: {
    label: 'Label',
    value: 'Value'
  },
  decorators: [() => ({ template: '<div style="max-width: 300px; padding: 10px;"><story/></div>' })]
} satisfies Meta<typeof FzDisplayField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Label',
    value: 'Value'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify label and value are visible', async () => {
      expect(canvas.getByText('Label')).toBeVisible()
      expect(canvas.getByText('Value')).toBeVisible()
    })

    await step('Verify component has correct test id', async () => {
      const display = canvas.getByTestId('fz-display-field')
      expect(display).toBeInTheDocument()
    })
  }
}

export const SizeSmall: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    size: 'small'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify label uses small text class', async () => {
      const label = canvas.getByText('Label')
      expect(label).toBeVisible()
      expect(label.classList.contains('text-sm')).toBe(true)
    })
  }
}

export const SizeNormal: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    size: 'normal'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify label uses normal text class', async () => {
      const label = canvas.getByText('Label')
      expect(label).toBeVisible()
      expect(label.classList.contains('text-base')).toBe(true)
    })
  }
}

export const Emphasized: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    isEmphasized: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify value uses semibold font', async () => {
      const value = canvas.getByText('Value')
      expect(value).toBeVisible()
      expect(value.classList.contains('font-semibold')).toBe(true)
    })
  }
}

export const NotEmphasized: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    isEmphasized: false
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify value uses normal font weight', async () => {
      const value = canvas.getByText('Value')
      expect(value).toBeVisible()
      expect(value.classList.contains('font-normal')).toBe(true)
    })
  }
}

export const GapNone: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    gap: 'none'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify container has no gap', async () => {
      const display = canvas.getByTestId('fz-display-field')
      expect(display.classList.contains('gap-0')).toBe(true)
    })
  }
}

export const GapSmall: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    gap: 'small'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify container has small gap', async () => {
      const display = canvas.getByTestId('fz-display-field')
      expect(display.classList.contains('gap-8')).toBe(true)
    })
  }
}

export const GapMedium: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    gap: 'medium'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify container has medium gap', async () => {
      const display = canvas.getByTestId('fz-display-field')
      expect(display.classList.contains('gap-12')).toBe(true)
    })
  }
}

export const FullExample: Story = {
  args: {
    label: 'Full Name',
    value: 'John Doe',
    size: 'normal',
    isEmphasized: true,
    gap: 'small'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify full example renders correctly', async () => {
      expect(canvas.getByText('Full Name')).toBeVisible()
      expect(canvas.getByText('John Doe')).toBeVisible()
    })

    await step('Verify all props are applied', async () => {
      const display = canvas.getByTestId('fz-display-field')
      expect(display.classList.contains('gap-8')).toBe(true)

      const label = canvas.getByText('Full Name')
      expect(label.classList.contains('text-base')).toBe(true)

      const value = canvas.getByText('John Doe')
      expect(value.classList.contains('font-semibold')).toBe(true)
    })
  }
}
