<script setup lang="ts">
import { FzCardList } from '@fiscozen/card-list'

/* La voce di lista di Material è, da noi, la card list: stesso ruolo, stessa
   anatomia. Il nome resta il nostro, cambia solo lo stile.
 *
 * La corrispondenza dei pezzi:
 *   contenitore      → la riga della card list
 *   etichetta        → `title`
 *   testo di supporto → `descriptions` (da una a tre righe, poi tronca)
 *   testo finale     → `value`
 *   icona finale     → l'azione singola, la freccia
 *   controllo finale → le azioni multiple, il bottone icona
 *
 * Il nostro componente ha in più il badge e l'importo in evidenza; li teniamo,
 * e prendono il posto che Material assegna al testo iniziale e a quello finale.
 * Ci manca invece il pezzo iniziale — icona, avatar o media davanti alla riga:
 * è una lacuna del componente, non del tema, e va colmata nel design system. */

const UNA_RIGA = [
  { title: 'Documenti del 2026' },
  { title: 'Fatture emesse' },
  { title: 'Ricevute di pagamento' }
]

const CON_FINALE = [
  { title: 'Fattura #2026-045', value: '€ 1.250,00' },
  { title: 'Fattura #2026-044', value: '€ 870,00' },
  { title: 'Fattura #2026-043', value: '€ 2.400,00' }
]

const DUE_RIGHE = [
  { title: 'Sofia Bianchi', descriptions: ['Socia · 30% delle quote'] },
  { title: 'Marco Rossi', descriptions: ['Amministratore · 45% delle quote'] }
]

const TRE_RIGHE = [
  {
    title: 'Marco Rossi',
    descriptions: [
      'Il tuo commercialista. Segue la partita IVA dal 2023.',
      'Risponde in chat entro un giorno lavorativo.'
    ]
  }
]

const CON_BADGE = [
  {
    badge: { text: 'Da pagare', tone: 'error' as const },
    title: 'F24 di novembre',
    value: '€ 412,00',
    descriptions: ['Scade il 16 dicembre']
  },
  {
    badge: { text: 'Pagato', tone: 'success' as const },
    title: 'F24 di ottobre',
    value: '€ 380,00',
    descriptions: ['Pagato il 18 novembre']
  }
]

const CON_AZIONE = [
  {
    title: 'Dichiarazione dei redditi 2025',
    descriptions: ['Pronta da firmare'],
    actions: [{ type: 'link' as const, label: 'Apri', to: { name: 'esempio' } }]
  }
]

const CON_AZIONI = [
  {
    title: 'Contratto di affitto',
    descriptions: ['Caricato il 3 marzo'],
    actions: [
      { type: 'button' as const, label: 'Scarica' },
      { type: 'button' as const, label: 'Sostituisci' },
      { type: 'button' as const, label: 'Elimina' }
    ]
  }
]
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Anatomia della voce</h3>
      <p>
        La voce di lista di Material è la nostra card list. Contenitore ed etichetta sono gli unici
        pezzi obbligatori: il testo di supporto sta fra una e tre righe, in fondo può esserci un
        testo, un'icona o un controllo. Badge e importo sono in più — nostri.
      </p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="UNA_RIGA" /></div>
        <span class="vt-et">una riga · solo etichetta · contenitore alto 56</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="CON_FINALE" /></div>
        <span class="vt-et">una riga · testo finale</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="DUE_RIGHE" /></div>
        <span class="vt-et">due righe · testo di supporto · contenitore alto 72</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="TRE_RIGHE" /></div>
        <span class="vt-et">tre righe · il supporto si ferma a tre e tronca · alto 88</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="CON_BADGE" /></div>
        <span class="vt-et">variante nostra · badge e importo</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="CON_AZIONE" /></div>
        <span class="vt-et">icona finale · la riga è cliccabile</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block"><FzCardList :items="CON_AZIONI" /></div>
        <span class="vt-et">controllo finale · bottone icona con le azioni</span>
      </div>
    </div>
  </div>
</template>
