<script setup lang="ts">
import { ref } from 'vue'
import { FzDatepicker } from '@fiscozen/datepicker'

/* Material distingue tre modi di chiedere una data: il **docked** — il
   calendario che si apre attaccato al campo, sul desktop — il **modal**, che
   si apre al centro su mobile, e il **modal input**, cioè scriverla a mano
   quando la data è lontana. Il nostro FzDatepicker li copre tutti e tre con
   le sue prop; qui si vedono affiancati. */
const a = ref()
const b = ref()
const c = ref()
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>I tre modi di chiedere una data</h3>
      <p>
        Attaccato al campo sul desktop, al centro su mobile, e scritto a mano quando la data è
        lontana — scorrere dodici mesi di calendario per una scadenza dell'anno prossimo è la
        fatica che il campo di testo evita.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzDatepicker v-model="a" :inputProps="{ label: 'Data dell’atto', placeholder: 'GG/MM/AAAA' }" />
          <p class="m3-supporting">Docked: si apre sotto il campo</p>
        </div>
        <span class="vt-et">docked</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzDatepicker v-model="b" :enableTimePicker="true" :inputProps="{ label: 'Appuntamento', placeholder: 'GG/MM/AAAA HH:MM' }" />
          <p class="m3-supporting">Con l’orario: data e ora nello stesso passaggio</p>
        </div>
        <span class="vt-et">data e ora</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzDatepicker v-model="c" clearable :inputProps="{ label: 'Scadenza', placeholder: 'GG/MM/AAAA' }" />
          <p class="m3-supporting">Cancellabile: la data si può togliere</p>
        </div>
        <span class="vt-et">con azzeramento</span>
      </div>
    </div>
  </div>
</template>
