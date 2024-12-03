import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTable } from '@fiscozen/table'
import { FzColumn } from '@fiscozen/simple-table'

const meta: Meta<typeof FzTable> = {
  title: '@fiscozen/table/FzTable',
  component: FzTable,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

const sampleObj = {
  nome: 'Riccardo',
  cognome: 'Agnoletto',
  email: 'riccardo.agnoletto@fiscozen.it',
  phone_number: '123456789'
}

const items =  [
  {
    type: 'button' as const,
    label: 'Some label'
  },
  {
    type: 'button' as const,
    label: 'Another label'
  },
  {
    type: 'button' as const,
    label: 'A slightly longer label'
  },
  {
    type: 'button' as const,
    label: 'label'
  },
];

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    value: (Array(50)).fill({}).map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    activePage: 2
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px] w-[500px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email" />
          <FzColumn header="Numero di telefono" field="phone_number" />
        </FzTable>
      </div>
    `
  })
}
export { Default }

export default meta
