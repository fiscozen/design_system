import type { Meta, StoryObj } from '@storybook/vue3'
import { FzDatepicker } from '@fiscozen/datepicker'

const meta: Meta<typeof FzDatepicker> = {
  title: '@fiscozen/datepicker/FzDatepicker',
  component: FzDatepicker,
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
