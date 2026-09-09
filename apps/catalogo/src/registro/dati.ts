import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzTable, FzRow } from '@fiscozen/table'
import Tabelle from '../demo/Tabelle.vue'
import type { Voce } from '../tipi'

const COLONNE = [
  { field: 'numero', label: 'Numero' },
  { field: 'cliente', label: 'Cliente' },
  { field: 'importo', label: 'Importo' }
]
const DATI = [
  { numero: '2026-045', cliente: 'Nuvola Studio', importo: '€ 1.250,00' },
  { numero: '2026-044', cliente: 'Ferrari SRL', importo: '€ 480,00' }
]

export const DATI_GRUPPO: Voce[] = [
  { nome: 'FzSimpleTable', pkg: '@fiscozen/simple-table', gruppo: 'Dati', comp: FzSimpleTable, demo: Tabelle, nota: 'La tabella essenziale: intestazioni, righe, e il contenuto che decidi tu colonna per colonna.' },
  { nome: 'FzColumn', pkg: '@fiscozen/simple-table', gruppo: 'Dati', comp: FzColumn, demo: Tabelle, nota: 'La colonna: con `field` prende il valore dal dato, con lo slot ci metti quello che vuoi.' },
  {
    nome: 'FzTable',
    pkg: '@fiscozen/table',
    gruppo: 'Dati',
    comp: FzTable,
    nota: 'La tabella completa del Back Office: ricerca, filtri, ordinamento, selezione, paginazione.',
    gallerie: [
      {
        titolo: 'Con qualche riga',
        colonna: true,
        celle: [
          { etichetta: 'base', props: { columns: COLONNE, value: DATI, title: 'Fatture' }, larga: true },
          { etichetta: 'con ricerca e selezione', props: { columns: COLONNE, value: DATI, title: 'Fatture', searchable: true, selectable: true }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzRow',
    pkg: '@fiscozen/table',
    gruppo: 'Dati',
    comp: FzRow,
    demo: Tabelle,
    nota: 'La riga della tabella: si usa dentro FzTable, non da sola. Qui la vedi al lavoro nella tabella.'
  }
]
