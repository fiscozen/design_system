import { FzCard } from '@fiscozen/card'
import { FzCardList, FzCardListItem } from '@fiscozen/card-list'
import { FzCollapse, FzAccordion } from '@fiscozen/collapse'
import { FzPopover } from '@fiscozen/popover'
import { FzFloating } from '@fiscozen/composables'
import Accordion from '../demo/Accordion.vue'
import CardM3 from '../demo/CardM3.vue'
import ListM3 from '../demo/ListM3.vue'
import Sovrapposti from '../demo/Sovrapposti.vue'
import type { Voce } from '../tipi'

const RIGHE = [
  { title: 'Fattura #2026-045', value: '€ 1.250,00', descriptions: ['Nuvola Studio · 3 aprile'] },
  { title: 'Fattura #2026-044', value: '€ 480,00', descriptions: ['Ferrari SRL · 28 marzo'] }
]

export const CONTENITORI: Voce[] = [
  {
    nome: 'FzCard',
    pkg: '@fiscozen/card',
    gruppo: 'Contenitori',
    comp: FzCard,
    env: true,
    slot: 'Nuvola Studio SRL, Via Ozanam 12, Milano.',
    nota: 'Un contenitore, non un bersaglio: la card non si clicca, l’azione è il bottone che sta dentro.',
    anteprima: { etichetta: 'default', props: { title: 'Dati della società' } },
    demo: CardM3,
    gallerie: [
      {
        titolo: 'Colori',
        nota: 'Il colore non è decorazione: dice di che tipo è il contenuto.',
        colonna: true,
        celle: [
          { etichetta: 'default', props: { title: 'Dati della società' } },
          { etichetta: 'grey', props: { title: 'Dati della società', color: 'grey' } },
          { etichetta: 'blue', props: { title: 'Informazione', color: 'blue' } },
          { etichetta: 'yellow', props: { title: 'Da controllare', color: 'yellow' } },
          { etichetta: 'red', props: { title: 'Problema', color: 'red' } }
        ]
      },
      {
        titolo: 'Con le azioni',
        colonna: true,
        celle: [
          { etichetta: 'primaria', props: { title: 'Dati della società', primaryAction: { label: 'Modifica' } } },
          {
            etichetta: 'primaria e secondaria',
            props: { title: 'Dati della società', primaryAction: { label: 'Conferma' }, secondaryAction: { label: 'Annulla' } }
          },
          {
            etichetta: 'con icon button',
            props: {
              title: 'Dati della società',
              primaryAction: { label: 'Conferma' },
              secondaryAction: { label: 'Annulla' },
              tertiaryAction: { icon: 'trash' }
            }
          }
        ]
      },
      {
        titolo: 'Richiudibile',
        colonna: true,
        celle: [
          { etichetta: 'collapsible', props: { title: 'Dettagli', collapsible: true } },
          { etichetta: 'aperta di default', props: { title: 'Dettagli', collapsible: true, defaultExpanded: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzCardList',
    pkg: '@fiscozen/card-list',
    gruppo: 'Contenitori',
    comp: FzCardList,
    nota: 'Una lista di righe con titolo, valore e descrizione: il pattern delle liste su mobile.',
    demo: ListM3,
    gallerie: [
      { titolo: 'Con tre righe', colonna: true, celle: [{ etichetta: 'items', props: { items: RIGHE }, larga: true }] }
    ]
  },
  {
    nome: 'FzCardListItem',
    pkg: '@fiscozen/card-list',
    gruppo: 'Contenitori',
    comp: FzCardListItem,
    nota: 'La singola riga della lista, quando la componi a mano invece di passare `items`.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'con valore', props: { title: 'Fattura #2026-045', value: '€ 1.250,00', descriptions: ['Nuvola Studio · 3 aprile'] }, larga: true },
          { etichetta: 'con badge', props: { title: 'Fattura #2026-044', value: '€ 480,00', badge: { color: 'warning', text: 'In scadenza' } }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzCollapse',
    pkg: '@fiscozen/collapse',
    gruppo: 'Contenitori',
    comp: FzCollapse,
    slot: 'Commercialista dedicato, dichiarazioni, fatture illimitate e assistenza in chat.',
    nota: 'Apre e chiude un blocco di contenuto. Quello che è dentro non si vede: non metterci quello che serve per decidere.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'solo titolo', props: { title: 'Cosa comprende il servizio' }, larga: true },
          { etichetta: 'con sottotitolo', props: { title: 'Cosa comprende il servizio', subtitle: 'Aprilo per leggere' }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzAccordion',
    pkg: '@fiscozen/collapse',
    gruppo: 'Contenitori',
    comp: FzAccordion,
    demo: Accordion,
    nota: 'Più collapse coordinati: di default se ne apre uno per volta.'
  },
  {
    nome: 'FzPopover',
    pkg: '@fiscozen/popover',
    gruppo: 'Contenitori',
    comp: FzPopover,
    demo: Sovrapposti,
    nota: 'Un pannello ancorato a un elemento, che si apre su richiesta.'
  },
  {
    nome: 'FzFloating',
    pkg: '@fiscozen/composables',
    gruppo: 'Contenitori',
    comp: FzFloating,
    demo: Sovrapposti,
    nota: 'Il mattone sotto popover, dropdown e tooltip: posiziona un contenuto rispetto a un altro.'
  }
]
