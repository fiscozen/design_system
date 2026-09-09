<script setup lang="ts">
import { FzToast } from '@fiscozen/toast'
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>I toni</h3>
      <p>Conferma breve dopo un’azione. I tipi sono tre — success, warning, error — e ognuno ha la sua icona.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live"><FzToast type="success" message="Fattura inviata" /></div>
        <span class="vt-et">success</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live"><FzToast type="error" message="Non siamo riusciti a inviarla" /></div>
        <span class="vt-et">error</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live"><FzToast type="warning" message="Controlla i dati del cliente" /></div>
        <span class="vt-et">warning</span>
      </div>
    </div>
  </div>
</template>
