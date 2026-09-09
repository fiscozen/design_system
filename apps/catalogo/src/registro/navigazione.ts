import { FzTabs, FzTab } from '@fiscozen/tab'
import { FzBreadcrumbs, FzRouterBreadcrumbs } from '@fiscozen/breadcrumbs'
import { FzPagination } from '@fiscozen/pagination'
import { FzStepper } from '@fiscozen/stepper'
import { FzDropdown, FzIconDropdown } from '@fiscozen/dropdown'
import { FzAction, FzActionList, FzActionSection } from '@fiscozen/action'
import { FzActionlist } from '@fiscozen/actionlist'
import { FzNavbar } from '@fiscozen/navbar'
import { FzNavlink, FzRouterNavlink } from '@fiscozen/navlink'
import { FzNavlist } from '@fiscozen/navlist'
import TabsDemo from '../demo/Tabs.vue'
import AzioniDemo from '../demo/Azioni.vue'
import NavDemo from '../demo/Navigazione.vue'
import NavM3 from '../demo/NavM3.vue'
import TabsM3 from '../demo/TabsM3.vue'
import type { Voce } from '../tipi'

const BRICIOLE = [
  { id: 'clienti', label: 'Clienti' },
  { id: 'cliente', label: 'Nuvola Studio' },
  { id: 'fattura', label: 'Fattura #2026-045' }
]

const AZIONI = [
  { type: 'link', label: 'Duplica', to: '/esempio', iconName: 'copy', iconVariant: 'far' },
  { type: 'link', label: 'Scarica il PDF', to: '/esempio', iconName: 'file-pdf', iconVariant: 'far' },
  { type: 'link', label: 'Elimina', to: '/esempio', iconName: 'trash', iconVariant: 'far' }
]

/* Gli stati veri del componente: completed, error, disabled — più `activeStep`,
   che dice a che punto sei. «done» e «todo» non esistono, e infatti prima il
   passo attivo non si vedeva. */
const PASSI = [
  { title: 'Dati', description: 'Chi sei', status: 'completed' as const },
  { title: 'Documenti', description: 'Cosa serve' },
  { title: 'Firma', description: 'Ci siamo' },
  { title: 'Atto', description: 'Dal notaio', disabled: true }
]

export const NAVIGAZIONE: Voce[] = [
  { nome: 'FzTabs', pkg: '@fiscozen/tab', gruppo: 'Navigazione', comp: FzTabs, demo: TabsM3, demoDopo: TabsDemo, nota: 'Sezioni della stessa pagina, non passi di un flusso: si salta avanti e indietro senza conseguenze.' },
  { nome: 'FzTab', pkg: '@fiscozen/tab', gruppo: 'Navigazione', comp: FzTab, demo: TabsDemo, nota: 'La singola linguetta, con titolo, icona, badge e stato disabilitato.' },
  {
    nome: 'FzBreadcrumbs',
    pkg: '@fiscozen/breadcrumbs',
    gruppo: 'Navigazione',
    comp: FzBreadcrumbs,
    env: true,
    nota: 'Dove sono, e come torno indietro di un passo.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'tre livelli', props: { breadcrumbs: BRICIOLE }, larga: true },
          { etichetta: 'due livelli', props: { breadcrumbs: BRICIOLE.slice(0, 2) }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzRouterBreadcrumbs',
    pkg: '@fiscozen/breadcrumbs',
    gruppo: 'Navigazione',
    comp: FzRouterBreadcrumbs,
    env: true,
    nota: 'Le stesse briciole, ma costruite da sole dalle rotte attraversate. Nel catalogo la catena è corta — una rotta sola — quindi qui si vede anche con le briciole passate a mano, che è il modo in cui il componente si comporta quando il router non basta.',
    gallerie: [
      {
        titolo: 'Dalle rotte del catalogo',
        nota: 'Quello che il router del catalogo può dare: una rotta sola, quindi una briciola sola.',
        colonna: true,
        celle: [{ etichetta: 'dal router', props: {}, larga: true }]
      },
      {
        titolo: 'Con le briciole passate a mano',
        colonna: true,
        celle: [{ etichetta: 'breadcrumbs', props: { breadcrumbs: BRICIOLE }, larga: true }]
      }
    ]
  },
  {
    nome: 'FzPagination',
    pkg: '@fiscozen/pagination',
    gruppo: 'Navigazione',
    comp: FzPagination,
    env: true,
    nota: 'Le pagine di una lista lunga: nel Back Office, dove i record sono migliaia.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'poche pagine', props: { currentPage: 1, totalPages: 4 }, larga: true },
          { etichetta: 'molte pagine', props: { currentPage: 5, totalPages: 42 }, larga: true },
          { etichetta: 'in centro', props: { currentPage: 2, totalPages: 8, position: 'center' }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzStepper',
    pkg: '@fiscozen/stepper',
    gruppo: 'Navigazione',
    comp: FzStepper,
    nota: 'A che punto sono di un flusso lungo, e quanto manca.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'al secondo passo', props: { steps: PASSI, hasStepbar: true, activeStep: 1 }, larga: true },
          { etichetta: 'senza descrizioni', props: { steps: PASSI.map((p) => ({ ...p, description: undefined })), hasStepbar: true, activeStep: 1 }, larga: true },
          {
            etichetta: 'con un passo in errore',
            props: { steps: PASSI.map((p, i) => (i === 2 ? { ...p, status: 'error' } : p)), hasStepbar: true, activeStep: 2 },
            larga: true
          }
        ]
      }
    ]
  },
  {
    nome: 'FzDropdown',
    pkg: '@fiscozen/dropdown',
    gruppo: 'Navigazione',
    comp: FzDropdown,
    env: true,
    slot: 'Azioni',
    nota: 'Un menu di azioni dietro un bottone: quando sono più di due e non stanno in pagina.',
    gallerie: [
      {
        titolo: 'Varianti',
        celle: [
          { etichetta: 'default', props: { actions: AZIONI } },
          { etichetta: 'secondario', props: { actions: AZIONI, buttonVariant: 'secondary' } },
          { etichetta: 'allineato a destra', props: { actions: AZIONI, align: 'right' } },
          { etichetta: 'disabilitato', props: { actions: AZIONI, disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzIconDropdown',
    pkg: '@fiscozen/dropdown',
    gruppo: 'Navigazione',
    comp: FzIconDropdown,
    env: true,
    nota: 'Lo stesso menu, ma dietro un’icona: nelle righe di una tabella, dove lo spazio non c’è.',
    gallerie: [
      {
        titolo: 'Varianti',
        celle: [
          { etichetta: 'tre puntini', props: { actions: AZIONI, iconName: 'ellipsis-vertical', ariaLabel: 'Azioni' } },
          { etichetta: 'altra icona', props: { actions: AZIONI, iconName: 'gear', ariaLabel: 'Impostazioni' } }
        ]
      }
    ]
  },
  { nome: 'FzAction', pkg: '@fiscozen/action', gruppo: 'Navigazione', comp: FzAction, demo: AzioniDemo, nota: 'La riga di un menu: etichetta, icona, e dove porta.' },
  { nome: 'FzActionList', pkg: '@fiscozen/action', gruppo: 'Navigazione', comp: FzActionList, demo: AzioniDemo, nota: 'Il contenitore delle azioni, con la sua ombra e i suoi bordi.' },
  { nome: 'FzActionSection', pkg: '@fiscozen/action', gruppo: 'Navigazione', comp: FzActionSection, demo: AzioniDemo, nota: 'Raggruppa le azioni sotto un titolo, quando sono tante.' },
  {
    nome: 'FzActionlist',
    pkg: '@fiscozen/actionlist',
    gruppo: 'Navigazione',
    comp: FzActionlist,
    nota: 'La versione precedente della lista di azioni, deprecata: nel prodotto nuovo si usa @fiscozen/action. Le sue voci sono navlink, non azioni.',
    gallerie: [
      {
        titolo: 'Con tre voci',
        colonna: true,
        celle: [
          {
            etichetta: 'items',
            props: {
              label: 'Azioni',
              items: [
                { type: 'button', label: 'Duplica', iconName: 'copy', iconVariant: 'far' },
                { type: 'button', label: 'Scarica il PDF', iconName: 'file-pdf', iconVariant: 'far' },
                { type: 'button', label: 'Elimina', iconName: 'trash', iconVariant: 'far' }
              ]
            },
            larga: true
          }
        ]
      }
    ]
  },
  { nome: 'FzNavbar', pkg: '@fiscozen/navbar', gruppo: 'Navigazione', comp: FzNavbar, demo: NavDemo, nota: 'La barra in cima all’app.' },
  { nome: 'FzNavlink', pkg: '@fiscozen/navlink', gruppo: 'Navigazione', comp: FzNavlink, demo: NavDemo, nota: 'La voce di navigazione, con icona e stato selezionato.' },
  {
    nome: 'FzRouterNavlink',
    pkg: '@fiscozen/navlink',
    gruppo: 'Navigazione',
    comp: FzRouterNavlink,
    nota: 'La stessa voce, ma legata a una rotta: si accende da sola quando la rotta è quella.',
    gallerie: [
      {
        titolo: 'Legato al router',
        colonna: true,
        celle: [
          { etichetta: 'rotta attiva', props: { label: 'Catalogo', iconName: 'house', to: '/' }, larga: true },
          { etichetta: 'altra rotta', props: { label: 'Un’altra pagina', iconName: 'file', to: '/esempio' }, larga: true }
        ]
      }
    ]
  },
  { nome: 'FzNavlist', pkg: '@fiscozen/navlist', gruppo: 'Navigazione', comp: FzNavlist, demo: NavM3, demoDopo: NavDemo, nota: 'La lista di navigazione laterale, con le sue sezioni.' }
]
