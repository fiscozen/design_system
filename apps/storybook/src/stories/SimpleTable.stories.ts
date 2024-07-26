import type { Meta, StoryObj } from '@storybook/vue3'
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzSimpleTable> = {
  title: '@fiscozen/simple-table/FzSimpleTable',
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [vueRouter([{
    path: '/foo',
    name: 'foo',
    component: () => {}
  }])],
  render: () => ({
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    data() {
      return {
        data: [{
          date: new Date(),
          user: 'John Doe',
          action: 'Ha inviato un messaggio',
        },
        {
          date: new Date(),
          user: 'John Doee',
          action: 'Ha inviato un messaggio',
        },
        {
          date: new Date(),
          user: 'John Doeee',
          action: 'Ha inviato un messaggio',
        }]
      }
    },
    template: `
      <div class="p-12">
        <FzSimpleTable :data>
          <FzColumn field="date" header="Data">
            <template #default="props">
              {{ props.data.date.toLocaleDateString() }}
            </template>
          </FzColumn>
          <FzColumn field="user" header="Utente">
            <template #default="props">
              <FzLink to="foo" size="md">{{ props.data.user }}</FzLink>
            </template>
          </FzColumn>
          <FzColumn field="action" header="Azione" />
        </FzSimpleTable>
      </div>
    `
  })
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {}
}

export { Default }

export default meta
