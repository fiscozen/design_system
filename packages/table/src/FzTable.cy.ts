import { h } from 'vue'
import FzTable from './FzTable.vue'
import {FzColumn} from '@fiscozen/simple-table'
import { FzTableProps } from './types';

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

const defaultTemplate = (props: FzTableProps) => () => h(
  h('div', {class: 'h-[600px] max-w-[800px] pt-16'}, [
    h(FzTable, props, [
      h(FzColumn, {header: 'Nome', sticky: 'left'}),
      h(FzColumn, {header: 'Cognome'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Email'}),
      h(FzColumn, {header: 'Phone Number', field: 'phone_number'})
    ])
  ])
)

describe('<FzTable />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    const props = {
      value: (Array(50)).fill({}).map(() => sampleObj),
      placeholder: 'Nessun valore',
      actions: {
        items
      },
      pages: 10,
      activePage: 2
    }
    cy.mount(defaultTemplate(props))
    
  })

  it('shows placeholder when no data is available', () => {
    // see: https://on.cypress.io/mounting-vue
    const props = {
      value: [],
      placeholder: 'Nessun valore',
      actions: {
        items
      },
      pages: 10,
      activePage: 2
    }
    cy.mount(defaultTemplate(props))
    cy.get('.fz__table__empty').should('be.visible')
    cy.get('.fz__table__empty').should('have.text', props.placeholder)
  })
})