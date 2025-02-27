import { h, ref, Ref } from "vue";
import FzTable from "./FzTable.vue";
import { FzColumn } from "@fiscozen/simple-table";
import { FzTableProps, Ordering } from "./types";

const sampleObj = {
  nome: "Riccardo",
  cognome: "Agnoletto",
  email: "riccardo.agnoletto@fiscozen.it",
  phone_number: "123456789",
};

const items = [
  {
    type: "button" as const,
    label: "Some label",
  },
  {
    type: "button" as const,
    label: "Another label",
  },
  {
    type: "button" as const,
    label: "A slightly longer label",
  },
  {
    type: "button" as const,
    label: "label",
  },
];

const defaultTemplate = (props: FzTableProps) => () => {

  return h(
    h("div", { class: "h-[600px] max-w-[800px] pt-16" }, [
      h(FzTable, props, [
        h(FzColumn, { header: "Nome", sticky: "left" }),
        h(FzColumn, { header: "Cognome" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Email" }),
        h(FzColumn, { header: "Phone Number", field: "phone_number" }),
      ]),
    ]),
  )};

describe("<FzTable />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    const props = {
      modelValue: Array(50)
        .fill({})
        .map(() => sampleObj),
      placeholder: "Nessun valore",
      actions: {
        items,
      },
      pages: 10,
      activePage: 2,
    };
    cy.mount(defaultTemplate(props));
  });

  it("shows placeholder when no data is available", () => {
    // see: https://on.cypress.io/mounting-vue
    const props = {
      modelValue: [],
      placeholder: "Nessun valore",
      actions: {
        items,
      },
      pages: 10,
      activePage: 2,
    };
    cy.mount(defaultTemplate(props));
    cy.get(".fz__table__empty").should("be.visible");
    cy.get(".fz__table__empty").should("have.text", props.placeholder);
  });

  it("should emit ordering event", () => {
    const onOrderChange = cy.spy().as('onOrderChangeSpy')
    const props = {
      modelValue: Array(50)
        .fill({})
        .map(() => sampleObj),
      placeholder: "Nessun valore",
      pages: 10,
      activePage: 0,
      'onFztable:ordering': onOrderChange,
      ordering: {
        cognome: {
          field: 'Cognome',
          direction: 'desc' satisfies Ordering['direction'],
          orderable: true
        }
      }
    };
    cy.mount(defaultTemplate(props));

    cy.get('[data-cy=fztable-ordering]').click();
    cy.get('@onOrderChangeSpy').should('have.been.calledWith', {field: 'Cognome', direction: 'desc', orderable: true}, 'asc')
  });

  it("should emit search event", () => {
    const onSearch = cy.spy().as('onSearchSpy')
    const props = {
      modelValue: Array(50)
        .fill({})
        .map(() => sampleObj),
      placeholder: "Nessun valore",
      pages: 10,
      activePage: 0,
      filterable: true,
      'onUpdate:searchTerm': onSearch
    };
    cy.mount(defaultTemplate(props));

    cy.get('[data-cy=fztable-search]').type('asd');
    cy.get('@onSearchSpy').should('have.been.calledWith', 'asd')
  });
});

