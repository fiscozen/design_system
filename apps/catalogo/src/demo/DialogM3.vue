<script setup lang="ts">
import { ref } from 'vue'
import { FzDialog } from '@fiscozen/dialog'
import { FzButton } from '@fiscozen/button'
import { env } from '../env'

/* L'anatomia del dialogo di base: contenitore, icona (facoltativa), headline
   (facoltativa), testo di supporto, divisore (facoltativo), etichette dei
   bottoni, e lo scrim che spegne quello che c'è dietro.
   Dalle guidelines: l'headline è una frase o una domanda breve e chiara — e
   niente scuse («Ci dispiace per l'interruzione»), niente allarmi
   («Attenzione!»), niente ambiguità («Sei sicuro?»). */
/* FzDialog non si apre montandolo: espone `show()` e `close()`, e va chiamato
   sull'istanza. Montarlo con un `v-if` lo rende, ma resta chiuso. */
const base = ref<InstanceType<typeof FzDialog> | null>(null)
const pieno = ref<InstanceType<typeof FzDialog> | null>(null)
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Anatomia</h3>
      <p>
        Il dialogo di base con l'icona in cima e le azioni in fondo a destra; e quello a schermo
        intero, con la chiusura a sinistra e l'azione di conferma a destra nella barra.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="secondary" @click="base?.show()">Dialogo di base</FzButton>
          <FzDialog ref="base" class="m3-dialog">
            <template #header><h2>Elimina il cliente</h2></template>
            <template #body>
              Le fatture associate a Nuvola Studio restano archiviate e continuerai a vederle nello
              storico. Il cliente invece sparisce dall'elenco.
            </template>
            <template #footer>
              <FzButton :environment="env" variant="invisible" @click="base?.close()">Annulla</FzButton>
              <FzButton :environment="env" variant="invisible" @click="base?.close()">Elimina</FzButton>
            </template>
          </FzDialog>
        </div>
        <span class="vt-et">contenitore, headline, testo di supporto, azioni</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="secondary" @click="pieno?.show()">A schermo intero</FzButton>
          <FzDialog ref="pieno" class="m3-dialog m3-dialog--pieno">
            <template #header><h2>Nuova fattura</h2></template>
            <template #footer>
              <FzButton :environment="env" variant="invisible" @click="pieno?.close()">Annulla</FzButton>
              <FzButton :environment="env" variant="invisible" @click="pieno?.close()">Salva</FzButton>
            </template>
            <template #body>
              A schermo intero il dialogo non galleggia: occupa la pagina, e in cima ha una barra con
              la chiusura a sinistra e l'azione a destra. Si usa quando dentro c'è un compito, non
              una domanda.
            </template>
          </FzDialog>
        </div>
        <span class="vt-et">a schermo intero: barra in testa, niente scrim</span>
      </div>
    </div>
  </div>
</template>
