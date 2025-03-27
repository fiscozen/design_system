import type { Meta, StoryObj } from '@storybook/vue3'
import { FzViewFlag } from '@fiscozen/view-flag'

const meta: Meta<typeof FzViewFlag> = {
  title: 'Overlay/FzViewFlag',
  component: FzViewFlag,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    role: 'Operatore',
    firstName: 'Mario',
    lastName: 'Rossi',
    environment: 'staging.D'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const WithSlot: Story = {
  args: {},
  render: () => ({
    components: { FzViewFlag },
    template: `
      <FzViewFlag>
        <template #default>
          <div class="flex flex-col gap-8">
            <div>Slot content</div>
            <div>Slot content2</div>
          </div>
        </template>
      </FzViewFlag>
    `
  })
}
