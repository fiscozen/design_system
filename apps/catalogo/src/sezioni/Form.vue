<script setup lang="ts">
import { ref } from 'vue'
import { FzInput, FzCurrencyInput } from '@fiscozen/input'
import { FzTextarea } from '@fiscozen/textarea'
import { FzSelect } from '@fiscozen/select'
import { FzTypeahead } from '@fiscozen/typeahead'
import { FzCheckbox, FzCheckboxCard } from '@fiscozen/checkbox'
import { FzRadio, FzRadioCard, FzRadioIconTile } from '@fiscozen/radio'
import { FzDatepicker } from '@fiscozen/datepicker'
import { FzUpload } from '@fiscozen/upload'
import Demo from '../Demo.vue'
import { env } from '../env'

const testo = ref('Nuvola Studio')
const importo = ref(1250)
const note = ref('')
const regime = ref('forfettario')
const citta = ref('')
const spunta = ref(true)
const spuntaOff = ref(false)
const spunte = ref<string[]>(['pec'])
const scelta = ref('sms')
const tile = ref('')
const data = ref()

const REGIMI = [
  { label: 'Regime forfettario', value: 'forfettario' },
  { label: 'Regime ordinario', value: 'ordinario' }
]
const CITTA = [
  { label: 'Milano', value: 'mi' },
  { label: 'Roma', value: 'rm' },
  { label: 'Torino', value: 'to' }
]
</script>

<template>
  <section id="form" class="cat-sec">
    <h2>Campi</h2>
    <p>Tutto quello con cui l'utente scrive o sceglie.</p>
    <div class="cat-grid">
      <Demo titolo="FzInput" pkg="@fiscozen/input" colonna>
        <FzInput v-model="testo" :environment="env" label="Nome della società" placeholder="Inserisci il nome" />
        <FzInput :environment="env" label="Email" placeholder="Inserisci la tua email" error>
          <template #errorMessage>Inserisci un indirizzo valido per continuare</template>
        </FzInput>
      </Demo>

      <Demo titolo="FzCurrencyInput" pkg="@fiscozen/input" colonna>
        <FzCurrencyInput v-model="importo" :environment="env" label="Importo" placeholder="0,00" />
      </Demo>

      <Demo titolo="FzTextarea" pkg="@fiscozen/textarea" colonna>
        <FzTextarea v-model="note" label="Note (opzionale)" placeholder="Scrivi qui" :rows="3" />
      </Demo>

      <Demo titolo="FzSelect" pkg="@fiscozen/select" colonna>
        <FzSelect v-model="regime" :environment="env" label="Regime fiscale" placeholder="Seleziona il regime" :options="REGIMI" />
      </Demo>

      <Demo titolo="FzTypeahead" pkg="@fiscozen/typeahead" nota="Come la select, ma si cerca scrivendo." colonna>
        <FzTypeahead v-model="citta" :environment="env" label="Città" placeholder="Cerca o seleziona la città" :options="CITTA" />
      </Demo>

      <Demo titolo="FzDatepicker" pkg="@fiscozen/datepicker" colonna>
        <FzDatepicker v-model="data" :inputProps="{ label: 'Data dell\'atto', placeholder: 'GG/MM/AAAA' }" />
      </Demo>

      <Demo titolo="FzCheckbox" pkg="@fiscozen/checkbox" colonna>
        <FzCheckbox v-model="spunta" label="Accetto le condizioni" />
        <FzCheckbox v-model="spuntaOff" label="Disabilitata" disabled />
      </Demo>

      <Demo titolo="FzCheckboxCard" pkg="@fiscozen/checkbox" colonna>
        <FzCheckboxCard
          v-model="spunte"
          orientation="horizontal"
          value="pec"
          label="PEC"
          title="PEC inclusa"
          subtitle="La attiviamo noi e te la comunichiamo"
        />
      </Demo>

      <Demo titolo="FzRadio" pkg="@fiscozen/radio" colonna>
        <FzRadio v-model="scelta" name="cat-radio" value="sms" label="Codice via SMS" size="md" />
        <FzRadio v-model="scelta" name="cat-radio" value="app" label="App Authenticator" size="md" />
      </Demo>

      <Demo titolo="FzRadioCard" pkg="@fiscozen/radio" nota="La scelta fra due strade, quando va salvata." colonna>
        <FzRadioCard
          v-model="scelta"
          name="cat-radiocard"
          value="sms"
          orientation="horizontal"
          label="SMS"
          title="Codice via SMS"
          subtitle="Ricevi i codici sul tuo numero"
        />
        <FzRadioCard
          v-model="scelta"
          name="cat-radiocard"
          value="app"
          orientation="horizontal"
          label="App"
          title="App Authenticator"
          subtitle="Usi i codici generati dalla tua app"
        />
      </Demo>

      <Demo titolo="FzRadioIconTile" pkg="@fiscozen/radio" colonna>
        <FzRadioIconTile v-model="tile" name="cat-tile" value="fattura" label="Fattura" iconName="file-invoice" />
        <FzRadioIconTile v-model="tile" name="cat-tile" value="spesa" label="Spesa" iconName="receipt" />
      </Demo>

      <Demo titolo="FzUpload" pkg="@fiscozen/upload" colonna>
        <FzUpload buttonLabel="Carica un documento" dragAndDropLabel="Trascina qui il file, oppure" />
      </Demo>
    </div>
  </section>
</template>
