<script setup lang="ts">
import { ref } from 'vue'
import { FzAlert } from '@fiscozen/alert'
import { FzProgress, FzProgressBar } from '@fiscozen/progress'
import { FzTooltip } from '@fiscozen/tooltip'
import { FzDialog } from '@fiscozen/dialog'
import { FzButton } from '@fiscozen/button'
import Demo from '../Demo.vue'
import { env } from '../env'

const dialogAperto = ref(false)
</script>

<template>
  <section id="feedback" class="cat-sec">
    <h2>Feedback</h2>
    <p>Quello che il prodotto dice all'utente: stato, avvisi, conferme.</p>
    <div class="cat-grid">
      <Demo titolo="FzAlert" pkg="@fiscozen/alert" colonna>
        <FzAlert :environment="env" tone="info" title="Ci pensiamo noi" :showButtonAction="false">
          La pratica è in lavorazione: ti scriviamo appena c'è una novità.
        </FzAlert>
        <FzAlert :environment="env" tone="warning" title="Manca un documento" buttonActionLabel="Carica">
          Carica la visura per far ripartire la pratica.
        </FzAlert>
        <FzAlert :environment="env" tone="error" title="Pagamento non riuscito" buttonActionLabel="Riprova">
          Riprova con un'altra carta, oppure scrivici in chat.
        </FzAlert>
        <FzAlert :environment="env" tone="success" title="Fattura inviata" :showButtonAction="false">
          Il tuo cliente la riceve entro pochi minuti.
        </FzAlert>
      </Demo>

      <Demo titolo="FzProgress" pkg="@fiscozen/progress" nota="Il caricamento: gira finché la cosa non è pronta.">
        <FzProgress size="sm" />
        <FzProgress size="md" />
        <FzProgress size="lg" />
      </Demo>

      <Demo titolo="FzProgressBar" pkg="@fiscozen/progress" nota="Quanto manca: valore su totale." colonna>
        <FzProgressBar :current="70" :max="100" size="md" valueText="70%" label="Spazio usato" />
      </Demo>

      <Demo titolo="FzTooltip" pkg="@fiscozen/tooltip">
        <FzTooltip text="Lo calcoliamo dalle quote dei soci" position="top" status="neutral">
          <FzButton :environment="env" variant="secondary">Titolare effettivo</FzButton>
        </FzTooltip>
      </Demo>

      <Demo titolo="FzDialog" pkg="@fiscozen/dialog" nota="Si apre su un'azione: qui il bottone lo mostra." colonna>
        <FzButton :environment="env" variant="secondary" @click="dialogAperto = true">Apri il dialog</FzButton>
        <FzDialog
          v-if="dialogAperto"
          title="Elimina cliente"
          :isDrawer="false"
          @close="dialogAperto = false"
        >
          <template #body>
            Stai per eliminare Nuvola Studio. Le fatture associate restano archiviate.
          </template>
        </FzDialog>
      </Demo>
    </div>
  </section>
</template>
