import type { Gruppo, Voce } from './tipi'
import { BASE } from './registro/base'
import { CAMPI } from './registro/campi'
import { CONTENITORI } from './registro/contenitori'
import { FEEDBACK } from './registro/feedback'
import { NAVIGAZIONE } from './registro/navigazione'
import { DATI_GRUPPO } from './registro/dati'

/* Il registro: tutto quello che il catalogo mostra, in un posto solo.
   Lo legge anche `scripts/audit-copertura.mjs`, che confronta questa lista con
   i componenti pubblici del design system e dice se ne manca qualcuno. */
export const REGISTRO: Voce[] = [
  ...BASE,
  ...CAMPI,
  ...CONTENITORI,
  ...FEEDBACK,
  ...NAVIGAZIONE,
  ...DATI_GRUPPO
]

/* Le strutture di pagina — layout e template — sono fuori: il catalogo parla di
   componenti, e un template si guarda a pagina intera, non in un riquadro.
   L'audit di copertura le conosce e le dichiara escluse. */
export const GRUPPI: Gruppo[] = ['Base', 'Campi', 'Contenitori', 'Feedback', 'Navigazione', 'Dati']

export function perGruppo(g: Gruppo) {
  return REGISTRO.filter((v) => v.gruppo === g)
}
