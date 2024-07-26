import type { Meta, StoryObj } from '@storybook/vue3'
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzSimpleTable> = {
  title: '@fiscozen/simple-table/FzSimpleTable',
  tags: ['autodocs'],
  component: FzSimpleTable,
  argTypes: {},
  args: {},
  decorators: [vueRouter([{
    path: '/foo',
    name: 'foo',
    component: () => {}
  }])],
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    value: [{
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
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    template: `
      <div class="p-12">
        <FzSimpleTable v-bind="args">
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

const Empty: Story = {
  args: {},
  render: () => ({
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    template: `
      <div class="p-12">
        <FzSimpleTable :value="[]">
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

export { Default, Empty }

export default meta
