import { ref, watch } from 'vue'

/* Le tre versioni del design system che il catalogo sa mostrare.
 *
 *   attuale — il DS com'è oggi, non lo tocchiamo
 *   v1      — la riscrittura della scocca: accessibilità, contrasti, stati,
 *             impaginazione. Il comportamento dei componenti resta identico,
 *             perché è tutto CSS applicato dall'esterno.
 *   v2      — Material 3 Expressive letto sui nostri componenti: rampa tonale,
 *             strati di stato, filled text field, morphing alla pressione.
 */
export type Tema = 'attuale' | 'v1' | 'v2'

export const TEMI: { id: Tema; label: string; nota: string }[] = [
  { id: 'attuale', label: 'Attuale', nota: 'Il design system come è oggi.' },
  { id: 'v1', label: 'Versione 1', nota: 'Stessi componenti, stessa funzionalità: cambia la scocca. Contrasti a norma, focus e stati che oggi mancano, una sola grammatica visiva.' },
  { id: 'v2', label: 'Versione 2', nota: 'Lettura di Material 3 Expressive: ruoli di colore tonali, strati di stato, campi pieni con la sottolineatura, e la forma che si squadra e cresce quando premi.' }
]

const salvato = (typeof localStorage !== 'undefined' && localStorage.getItem('catalogo-tema')) as Tema | null
const daUrl = new URLSearchParams(location.search).get('tema') as Tema | null

export const tema = ref<Tema>(daUrl ?? salvato ?? 'attuale')

watch(tema, (t) => localStorage.setItem('catalogo-tema', t))
