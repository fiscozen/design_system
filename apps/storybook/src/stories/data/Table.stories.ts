import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTable, FzRow, FzOrdering } from '@fiscozen/table'
import { FzColumn } from '@fiscozen/simple-table'
import { FzCollapse } from '@fiscozen/collapse'
import { FzLink } from '@fiscozen/link'
import { FzSelect } from '@fiscozen/select'
import { ref, reactive, computed, onMounted } from 'vue'
import { ActionlistItem } from '@fiscozen/actionlist'

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
  phone_number: '123456789',
  price: '12145,67 €',
  state: "da_inviare",
  hiddenState: 'yes',
  link: 'https://www.fiscozen.it',
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
    modelValue: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    pages: 10,
    actionLabel: '',
    activePage: 2,
    title: 'Table title',
    subtitle: 'Table subtitle',
    newItemButtonLabel: 'Nuova fattura'
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzCollapse,
      FzColumn,
      FzLink,
      FzTable
    },
    template: `
      <div class="p-12">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
          <FzColumn header="Prezzo" field="price" numeric />
          <FzColumn header="link">
            <template #default="{data}">
              <FzLink :to="data.link" target="_blank" external>Dettaglio</FzLink>
            </template>
          </FzColumn>
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
    modelValue: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    actionLabel: '',
    pages: 1,
    title: 'Table title',
    subtitle: 'Table subtitle'
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
        <FzTable v-bind="args" gridTemplateColumns="120px 1fr 1fr 1fr min-content">
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
    modelValue: Array(10)
      .fill({})
      .map(() => longTextSampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle'
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
    modelValue: rows,
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    actionLabel: '',
    pages: 1,
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
      const onRowAction = (index: number, actionListItem: ActionlistItem, rowData: Record<string, any>) => alert(`Clicked action ${index} on row "${rowData.name}"`);
      return { args, onRowAction }
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
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
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
          <FzRow rowClass="!bg-blue-200">
            <div class="col-span-2 flex flex-row justify-center items-center h-full">Custom row</div>
          </FzRow>
        </FzTable>
      </div>
    `
  })
}

const ColumnOrdering: Story = {
  args: {
    modelValue: [
      {
        nome: 'Francesco',
        cognome: 'Panico',
        email: 'francesco.panico@fiscozen.it',
        phone_number: '123456789'
      },
      {
        nome: 'Riccardo',
        cognome: 'Agnoletto',
        email: 'riccardo.agnoletto@fiscozen.it',
        phone_number: '2345'
      },
      {
        nome: 'Cristian',
        cognome: 'Barraco',
        email: 'cristian.barraco@fiscozen.it',
        phone_number: '111111'
      },
    ],
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    actionLabel: '',
    internalOrdering: true,
    title: 'Table title',
    subtitle: 'Table subtitle'
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
      const handleNameOrdering = (ordering: FzOrdering, direction: FzOrdering['direction']) => {
        console.log('ordering', ordering, direction)
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
        <FzTable v-bind="args" gridTemplateColumns="120px 1fr 1fr 1fr min-content" v-model:ordering="ordering" @fztable:ordering="handleNameOrdering">
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
    actionLabel: '',
    pages: 2345,
    activePage: 2,
    searchFilterPlaceholder: 'Ricerca',
    title: 'Table title',
    subtitle: 'Table subtitle',
    newItemButton: true,
    newItemButtonLabel: 'Nuova fattura',
    searchable: true,
  },
  render: (args) => ({
    setup() {
      const loading = ref(false);
      const data = ref<Record<string, string>[]>([]);

      const searchTerm = ref('');
      const extFilters = {
        hiddenState: 'Stato non relativo a una colonna'
      }
      const filters = reactive<Record<string, any>>({
        state: '',
        hiddenState: ''
      });
      const filteredData = computed(() => {
        return data.value.filter((el: any) => {
          let res = true;
          const found = Object.values(el).find((col: any) => col.includes(searchTerm.value))
          for (const filter in filters) {
            res &&= !filters[filter] || (el[filter] === filters[filter])
          }
          res &&= !!found;
          return res;
        })
      })
      const emptyFilters = () => {
        Object.keys(filters).forEach((filter) => {
          filters[filter] = ''
        })
      }
      onMounted(() => {
        loading.value = true;
        setTimeout(() => {
          data.value = Array(10)
            .fill({})
            .map(() => sampleObj);
          data.value[1] = {
            nome: 'Francesco',
            cognome: 'Panico',
            email: 'francesco.panico@fiscozen.it',
            phone_number: '123456789',
            state: 'inviata',
            hiddenState: 'no'
          }
          data.value[2] = {
            nome: 'Cristian',
            cognome: 'Barraco',
            email: 'cristian.barraco@fiscozen.it',
            phone_number: '4444',
            state: 'scaduta',
            hiddenState: 'no'
          }
          loading.value = false;
        }, 3000)
      })
      return { args, filteredData, searchTerm, filters, emptyFilters, extFilters, loading }
    },
    components: {
      FzColumn,
      FzSelect,
      FzTable
    },
    template: `
      <div class="p-12">
        <FzTable
          gridTemplateColumns="120px 1fr 1fr 1fr 1fr min-content"
          v-bind="args"
          v-model:searchTerm="searchTerm"
          :hasActiveFilters="Object.values(filters).some((filter) => !!filter)"
          :extFilters="extFilters"
          :loading="loading"
          :modelValue="filteredData"
          @fztable:emptyFilters="emptyFilters">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
          <FzColumn header="Stato invio" field="state" :filterable="true" filterName="Stato invio utente" />
          <template #filter-state>
            <FzSelect :options="[
                {label: 'Da inviare', value: 'da_inviare'},
                {label: 'Inviata', value: 'inviata'},
                {label: 'Scaduta', value: 'scaduta'},
              ]"
              v-model="filters.state"></FzSelect>
          </template>
          <template #filter-hiddenState>
            <FzSelect :options="[
                {label: 'Si', value: 'yes'},
                {label: 'No', value: 'no'},
              ]"
              v-model="filters.hiddenState"></FzSelect>
          </template>
        </FzTable>
      </div>
    `
  })
}

const Selectable: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    selectable: true,
    recordNumber: 100,
  },
  render: (args) => ({
    setup() {
      const selectedRowIds = ref(new Set([3,7]));
      return { args, selectedRowIds }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <h3>Selected rows: {{selectedRowIds}}</h3>
        <FzTable v-bind="args" v-model:selectedRowIds="selectedRowIds">
          <FzColumn header="Nome" />
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

const Accordion: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => ({
        ...sampleObj,
        subRows: Array(5).fill({}).map(() => sampleObj)
      })),
    actionLabel: '',
    actions: {
      items
    },
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    variant: 'accordion'
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" />
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

const FullScreen: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => ({
        ...sampleObj,
      })),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    allowFullscreen: true
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" />
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

const ActionsDisabled: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: {
      items
    },
    actionsDisabled: true,
    title: 'Table title',
    subtitle: 'Table subtitle',
    newItemButtonLabel: 'Nuova fattura'
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
      <div class="p-32 h-[800px]">
        <FzTable v-bind="args">
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

const DynamicActions: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    actions: row => ({
      items: [
        {
          type: 'button' as const,
          label: `Action ${row.nome}`
        },
        {
          type: 'button' as const,
          label: `Action ${row.cognome}`
        },
        {
          type: 'button' as const,
          label: `Action ${row.email}`
        }
      ]
    }),
    title: 'Table title',
    subtitle: 'Table subtitle',
    newItemButtonLabel: 'Nuova fattura'
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
      <div class="p-32 h-[800px]">
        <FzTable v-bind="args">
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

const DynamicColumns: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle'
  },
  render: (args) => ({
    setup() {
      const columns = ref()
      setTimeout(() => {
        columns.value = [
          {
            header: 'Nome',
            field: 'nome'
          },
          {
            header: 'Cognome',
            field: 'cognome'
          },
          {
            header: 'Numero di telefono',
            field: 'phone_number'
          }
        ]
      }, 2000)
      return { args, columns }
    },
    components: {
      FzColumn,
      FzTable,
      FzCollapse
    },
    template: `
      <div class="p-32 h-[800px]">
        <FzTable v-bind="args">
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn v-for="(col, index) in columns" :key="index" :header="col.header" :field="col.field" />
        </FzTable>
      </div>
    `
  })
}

const EpmtyTable: Story = {
  args: {
    modelValue: [],
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle'
  },
  render: (args) => ({
    setup() {
    },
    components: {
      FzColumn,
      FzTable,
    },
    template: `
      <div class="p-32">
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

const Radio: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    recordNumber: 100,
    variant: 'radio',
    actions: {
      items
    },
  },
  render: (args) => ({
    setup() {
      const selectedRowIds = ref(new Set([3]));
      return { args, selectedRowIds }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <h3>Selected rows: {{selectedRowIds}}</h3>
        <FzTable v-bind="args" v-model:selectedRowIds="selectedRowIds">
          <FzColumn header="Nome" />
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

const List: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    subtitle: 'Table subtitle',
    variant: 'list',
    actions: {
      items
    },
    actionLabel: '',
  },
  parameters: {
    viewport: {
      defaultViewport: 'sm'
    }
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <FzTable v-bind="args">
          <FzColumn header="Nome" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email"/>
          <FzColumn header="Numero di telefono" field="phone_number" />
        </FzTable>
      </div>
    `
  })
}

const ListWithSelection: Story = {
  args: {
    modelValue: Array(10)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    title: 'Table title',
    selectable: true,
    subtitle: 'Table subtitle',
    variant: 'list',
    actions: {
      items
    },
    actionLabel: '',
  },
  parameters: {
    viewport: {
      defaultViewport: 'sm'
    }
  },
  render: (args) => ({
    setup() {
      const selectedRowIds = ref(new Set([3,7]));
      return { args, selectedRowIds }
    },
    components: {
      FzColumn,
      FzTable
    },
    template: `
      <div class="p-12 h-[600px]">
        <FzTable v-bind="args" v-model:selectedRowIds="selectedRowIds">
          <FzColumn header="Nome" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email"/>
          <FzColumn header="Numero di telefono" field="phone_number" />
        </FzTable>
      </div>
    `
  })
}

const CustomNewItemButton: Story = {
  args: {
    modelValue: Array(50)
      .fill({})
      .map(() => sampleObj),
    placeholder: 'Nessun valore',
    newItemButton: true,
    newItemButtonLabel: 'Scarica tutte',
    newItemButtonIcon: 'arrow-down-to-bracket',
    title: 'Table title',
    subtitle: 'Table subtitle',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzCollapse,
      FzColumn,
      FzLink,
      FzTable
    },
    template: `
      <div class="p-12">
        <FzTable v-bind="args">
          <FzColumn header="Nome" sticky="left" />
          <FzColumn header="Cognome" />
          <FzColumn header="Email">
            <template #default="{data}"><b>{{data.email}}</b></template>
          </FzColumn>
          <FzColumn header="Numero di telefono" field="phone_number" />
          <FzColumn header="Prezzo" field="price" numeric />
          <FzColumn header="link">
            <template #default="{data}">
              <FzLink :to="data.link" target="_blank" external>Dettaglio</FzLink>
            </template>
          </FzColumn>
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

export { Default, FixedColumnWidth, LongText, ActionClick, CustomRows, ColumnOrdering, Filters, Selectable, Accordion, FullScreen, ActionsDisabled, DynamicActions, DynamicColumns, EpmtyTable, Radio, List, ListWithSelection, CustomNewItemButton }

export default meta
