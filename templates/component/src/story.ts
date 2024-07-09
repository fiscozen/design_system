import type { Meta, StoryObj } from '@storybook/vue3'
import { Fz{{pascalCase component}} } from '@fiscozen/{{kebabCase component}}'

const meta: Meta<typeof Fz{{pascalCase component}}> = {
  title: '@fiscozen/{{kebabCase component}}/Fz{{pascalCase component}}',
  component: Fz{{pascalCase component}},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {}
}

export { Default }

export default meta
