import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

const meta: Meta<typeof FzSimpleTable> = {
  title: 'Data/FzSimpleTable',
  tags: ['autodocs'],
  component: FzSimpleTable,
  subcomponents: { FzColumn },
  argTypes: {},
  args: {},
  decorators: [
    vueRouter([
      {
        path: '/foo',
        name: 'foo',
        component: () => {}
      }
    ])
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    value: [
      {
        date: new Date(),
        user: 'John Doe',
        action: 'Ha inviato un messaggio'
      },
      {
        date: new Date(),
        user: 'John Doee',
        action: 'Ha inviato un messaggio'
      },
      {
        date: new Date(),
        user: 'John Doeee',
        action: 'Ha inviato un messaggio'
      }
    ]
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    template: `
      <div class="p-12">
        <FzSimpleTable v-bind="args">
          <FzColumn header="Data">
            <template #default="props">
              {{ props.data.date.toLocaleDateString() }}
            </template>
          </FzColumn>
          <FzColumn header="Utente">
            <template #default="props">
              <FzLink to="foo" size="md">{{ props.data.user }}</FzLink>
            </template>
          </FzColumn>
          <FzColumn field="action" header="Azione" />
        </FzSimpleTable>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify table structure', async () => {
      const table = canvas.getByRole('table')
      await expect(table).toBeInTheDocument()
      await expect(table).toBeVisible()
    })
    
    await step('Verify table headers are rendered', async () => {
      const headers = canvas.getAllByRole('columnheader')
      await expect(headers.length).toBe(3)
      await expect(headers[0]).toHaveTextContent('Data')
      await expect(headers[1]).toHaveTextContent('Utente')
      await expect(headers[2]).toHaveTextContent('Azione')
    })
    
    await step('Verify table rows are rendered', async () => {
      const rows = canvas.getAllByRole('row')
      // 1 header row + 3 data rows
      await expect(rows.length).toBe(4)
    })
    
    await step('Verify data is displayed in rows', async () => {
      await expect(canvas.getByText('John Doe')).toBeInTheDocument()
      await expect(canvas.getByText('John Doee')).toBeInTheDocument()
      await expect(canvas.getByText('John Doeee')).toBeInTheDocument()
      // This text appears in multiple rows, so use getAllByText
      const actionTexts = canvas.getAllByText('Ha inviato un messaggio')
      await expect(actionTexts.length).toBeGreaterThan(0)
    })
    
    await step('Verify custom column templates render correctly', async () => {
      // Verify links are rendered in the Utente column
      const links = canvas.getAllByRole('link')
      await expect(links.length).toBeGreaterThan(0)
      await expect(links[0]).toHaveTextContent('John Doe')
    })
  }
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
          <FzColumn header="Data">
            <template #default="props">
              {{ props.data.date.toLocaleDateString() }}
            </template>
          </FzColumn>
          <FzColumn header="Utente">
            <template #default="props">
              <FzLink to="foo" size="md">{{ props.data.user }}</FzLink>
            </template>
          </FzColumn>
          <FzColumn field="action" header="Azione" />
        </FzSimpleTable>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify table structure exists', async () => {
      const table = canvas.getByRole('table')
      await expect(table).toBeInTheDocument()
    })
    
    await step('Verify headers are still rendered when empty', async () => {
      const headers = canvas.getAllByRole('columnheader')
      await expect(headers.length).toBe(3)
      await expect(headers[0]).toHaveTextContent('Data')
      await expect(headers[1]).toHaveTextContent('Utente')
      await expect(headers[2]).toHaveTextContent('Azione')
    })
    
    await step('Verify default placeholder is displayed', async () => {
      await expect(canvas.getByText('No data available')).toBeInTheDocument()
    })
    
    await step('Verify placeholder spans all columns', async () => {
      const placeholderCell = canvas.getByText('No data available')
      const colspan = placeholderCell.getAttribute('colspan')
      await expect(colspan).toBe('100%')
    })
  }
}

const WithFixedWidthColumns: Story = {
  args: {
    value: [
      {
        date: new Date(),
        user: 'John Doe',
        action: 'Ha inviato un messaggio'
      },
      {
        date: new Date(),
        user: 'John Doee',
        action: 'Ha inviato un messaggio'
      },
      {
        date: new Date(),
        user: 'John Doeee',
        action: 'Ha inviato un messaggio'
      }
    ]
  },
  render: (args) => ({
    setup() {
      return {args};
    },
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    template: `
      <div class="p-12">
        <FzSimpleTable v-bind="args">
          <FzColumn header="Data" width="200px">
            <template #default="props">
              {{ props.data.date.toLocaleDateString() }}
            </template>
          </FzColumn>
          <FzColumn header="Utente" width="10em">
            <template #default="props">
              <FzLink to="foo" size="md">{{ props.data.user }}</FzLink>
            </template>
          </FzColumn>
          <FzColumn field="action" header="Azione" />
        </FzSimpleTable>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify table renders with fixed width columns', async () => {
      const table = canvas.getByRole('table')
      await expect(table).toBeInTheDocument()
    })
    
    await step('Verify column widths are applied', async () => {
      const headers = canvas.getAllByRole('columnheader')
      await expect(headers.length).toBe(3)
      
      // Check that width styles are applied
      const firstHeader = headers[0]
      const firstHeaderStyles = window.getComputedStyle(firstHeader)
      // The width should be set via inline style
      const firstHeaderWidth = firstHeader.getAttribute('style')
      await expect(firstHeaderWidth).toContain('width')
      
      const secondHeader = headers[1]
      const secondHeaderWidth = secondHeader.getAttribute('style')
      await expect(secondHeaderWidth).toContain('width')
    })
    
    await step('Verify data rows are rendered correctly', async () => {
      const rows = canvas.getAllByRole('row')
      // 1 header row + 3 data rows
      await expect(rows.length).toBe(4)
      await expect(canvas.getByText('John Doe')).toBeInTheDocument()
    })
  }
}

const WithCustomPlaceholder: Story = {
  args: {
    value: [],
    placeholder: 'No records found'
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: {
      FzSimpleTable,
      FzColumn,
      FzLink
    },
    template: `
      <div class="p-12">
        <FzSimpleTable v-bind="args">
          <FzColumn header="Data">
            <template #default="props">
              {{ props.data.date.toLocaleDateString() }}
            </template>
          </FzColumn>
          <FzColumn header="Utente">
            <template #default="props">
              <FzLink to="foo" size="md">{{ props.data.user }}</FzLink>
            </template>
          </FzColumn>
          <FzColumn field="action" header="Azione" />
        </FzSimpleTable>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify custom placeholder is displayed', async () => {
      await expect(canvas.getByText('No records found')).toBeInTheDocument()
    })
    
    await step('Verify default placeholder is not displayed', async () => {
      const defaultPlaceholder = canvas.queryByText('No data available')
      await expect(defaultPlaceholder).not.toBeInTheDocument()
    })
  }
}

export { Default, Empty, WithFixedWidthColumns, WithCustomPlaceholder }

export default meta
