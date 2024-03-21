import type { Meta, StoryObj } from '@storybook/vue3'
import { FzViewFlag } from '@fiscozen/view-flag'

const meta = {
  title: 'View Flag',
  component: FzViewFlag,
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
    role: 'Operatore',
    firstName: 'Mario',
    lastName: 'Rossi',
    environment: 'staging.D'
  }
} satisfies Meta<typeof FzViewFlag>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}