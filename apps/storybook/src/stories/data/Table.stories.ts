import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTable, FzRow, Ordering } from '@fiscozen/table'
import { FzColumn } from '@fiscozen/simple-table'
import { FzCollapse } from '@fiscozen/collapse'
import { ref, reactive, computed } from 'vue'

const meta: Meta<typeof FzTable> = {
  title: 'Data/FzTable',
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

const items = [
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
  }
]

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    value: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    activePage: 2
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-12 h-[600px] w-[500px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
          <template #row-2>
            <FzCollapse class="col-span-5 w-full py-8">
              <template #summary>custom collapsible row summary</template>
              <template #content>custom collapsible row content</template>
            </FzCollapse>
          </template>
        </FzTable>
      </div>
    `
  })
}

const FixedColumnWidth: Story = {
  args: {
    value: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    activePage: 2
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-12">
        <FzTable v-bind="args" gridTemplateColumns="120px 1fr 1fr 1fr">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
          <template #row-2>
            <FzCollapse class="col-span-5 w-full py-8">
              <template #summary>custom collapsible row summary</template>
              <template #content>custom collapsible row content</template>
            </FzCollapse>
          </template>
        </FzTable>
      </div>
    `
  })
}

const longTextSampleObj = {
  nome: 'Documento di prova',
  descrizione: 
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed ' +
    'ipsum purus. Vivamus suscipit ligula vel lacus aliquet lobortis. Nunc ' + 
    'elementum ex et eleifend dapibus. Donec sagittis efficitur mi nec pulvinar. ' +
    'Donec sit amet nulla ac ex blandit cursus eget vitae dui. Donec dapibus vel ' +
    'tellus vitae fringilla. Integer pretium hendrerit mauris nec tincidunt. ' +
    'Proin mauris metus, lobortis nec dapibus a, lacinia vel enim. Class aptent ' +
    'taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
    'Morbi sodales eget neque non viverra. Sed id metus eu urna fringilla dignissim a ' +
    'urna. Nulla facilisi. Fusce eget tellus hendrerit, bibendum dolor eget, dictum massa. ' +
    'Etiam at elit consectetur, lobortis tortor vitae, feugiat nulla. Aenean gravida ' +
    'porttitor libero, at tristique enim sollicitudin in. Nullam tincidunt imperdiet odio, ' +
    'id semper nisl commodo quis.'
}

const LongText: Story = {
  args: {
    value: Array(10)
      .fill({})
      .map(() => longTextSampleObj),
    placeholder: 'Nessun valore'
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-12 h-[600px] w-[500px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Descrizione" />
        </FzTable>
      </div>
    `
  })
}

const rows = [{
  name: 'Riga 1'
}, {
  name: 'Riga 2'
}, {
  name: 'Riga 3'
}, {
  name: 'Riga 4'
}]

const ActionClick: Story = {
  args: {
    value: rows,
    placeholder: 'Nessun valore',
    actions: {
      items: [
        {
          type: 'button' as const,
          label: 'Action 1'
        },
        {
          type: 'button' as const,
          label: 'Action 2'
        },
        {
          type: 'button' as const,
          label: 'Action 3'
        }
      ]
    }
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    methods: {
      onRowAction: (index: number, rowData: Record<string, any>) => console.log(`Clicked action ${index} on row "${rowData.name}"`)
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-12 h-[600px] w-[500px]">
        <FzTable v-bind="args" @fztable:rowactionclick="onRowAction">
          <FzColumn header="Nome" field="name" />
        </FzTable>
      </div>
    `
  })
}

const CustomRows: Story = {
  args: {
    placeholder: 'Nessun valore'
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzCollapse,
      FzColumn,
      FzRow,
      FzTable
    },
    template: `
      <div class="p-12 h-[800px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Descrizione" />
          <FzRow>
            <div>Riccardo</div>
            <div>description text for Riccardo</div>
          </FzRow>
          <FzRow>
            <div>Francesco</div>
            <div>description text for Francesco</div>
          </FzRow>
          <FzRow>
            <div>Cristian</div>
            <div>description text for Cristian</div>
          </FzRow>
          <FzRow>
            <div class="col-span-2 h-32 bg-blue-200 flex flex-row justify-center items-center">Custom row</div>
          </FzRow>
        </FzTable>
      </div>
    `
  })
}

const ColumnOrdering: Story = {
  args: {
    value: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    activePage: 2,
  },
  render: (args) => ({
    setup() {
      const ordering = reactive({
        nome: {
          field: 'Nome',
          orderable: true,
          direction: 'asc'
        }
      });
      const handleNameOrdering = (ordering: Ordering, direction: Ordering['direction']) => {
        ordering.direction = direction;
      }
      return { args, handleNameOrdering, ordering }
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-12">
        <FzTable v-bind="args" gridTemplateColumns="120px 1fr 1fr 1fr" :ordering @fztable:ordering="handleNameOrdering">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
        </FzTable>
      </div>
    `
  })
}

const Filters: Story = {
  args: {
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    activePage: 2,
    filterable: true,
    searchFilterLabel: 'Ricerca'
  },
  render: (args) => ({
    setup() {
      const data = Array(10)
        .fill({})
        .map(() => sampleObj);
      data[1] = {
        nome: 'Francesco',
        cognome: 'Panico',
        email: 'francesco.panico@fiscozen.it',
        phone_number: '123456789'
      }
            
      const searchTerm = ref('');
      const filteredData = computed(() => {
        return data.filter((el) => {
          let res = false;
          const found = Object.values(el).find((col) => col.includes(searchTerm.value))
          res = !!found;
          return res;
        })
      })
      return { args, filteredData, searchTerm }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12">
        <FzTable gridTemplateColumns="120px 1fr 1fr 1fr" v-bind="args" v-model:searchTerm="searchTerm" :value="filteredData">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
        </FzTable>
      </div>
    `
  })
}

export { Default, FixedColumnWidth, LongText, ActionClick, CustomRows, ColumnOrdering, Filters }

export default meta
