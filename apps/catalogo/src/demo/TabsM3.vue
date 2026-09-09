<script setup lang="ts">
import { FzTabs, FzTab } from '@fiscozen/tab'
import { env } from '../env'

/* Material distingue due livelli di tab: le **primarie**, che stanno in cima
   alla schermata e possono avere l'icona sopra l'etichetta, con l'indicatore
   che abbraccia il contenuto; e le **secondarie**, che si usano dentro una
   sezione già divisa dalle primarie, con un indicatore più semplice a tutta
   larghezza. La funzione è la stessa: cambia il peso. */
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Primarie e secondarie</h3>
      <p>
        Le secondarie servono quando una schermata ha bisogno di due livelli di tab: stesso
        funzionamento, indicatore più sobrio. E se le linguette non ci stanno, scorrono — la prima
        resta staccata dal bordo, così si capisce che ce n'è dell'altro.
      </p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live" style="display: block">
          <div class="m3-tabs m3-tabs--primarie">
            <FzTabs :environment="env" size="md" :initialSelected="0">
              <FzTab title="Fatture" icon="file-invoice">Le fatture emesse quest'anno.</FzTab>
              <FzTab title="Spese" icon="receipt">Le spese registrate.</FzTab>
              <FzTab title="Corrispettivi" icon="cart-shopping">I corrispettivi giornalieri.</FzTab>
            </FzTabs>
          </div>
        </div>
        <span class="vt-et">primarie: icona e etichetta, indicatore che abbraccia il contenuto</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block">
          <div class="m3-tabs m3-tabs--secondarie">
            <FzTabs :environment="env" size="md" :initialSelected="1">
              <FzTab title="Tutte">Tutte le fatture.</FzTab>
              <FzTab title="Da incassare">Quelle ancora aperte.</FzTab>
              <FzTab title="Incassate">Quelle chiuse.</FzTab>
            </FzTabs>
          </div>
        </div>
        <span class="vt-et">secondarie: solo etichetta, indicatore a tutta larghezza</span>
      </div>
    </div>
  </div>
</template>
