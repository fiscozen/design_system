<script setup lang="ts">
import { ref } from 'vue'
import { FzDialog, FzConfirmDialog } from '@fiscozen/dialog'
import { FzButton } from '@fiscozen/button'
import { env } from '../env'

const dialog = ref<InstanceType<typeof FzDialog> | null>(null)
const conferma = ref<InstanceType<typeof FzConfirmDialog> | null>(null)
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Si aprono da un’azione. FzConfirmDialog è la variante per «sei sicuro?», con due bottoni già al posto giusto.</p>
    </div>
    <div class="vt-grid">
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="secondary" @click="dialog?.show()">Apri il dialog</FzButton>
          <FzDialog ref="dialog">
            <template #header><h2>Elimina cliente</h2></template>
            <template #footer>
              <FzButton :environment="env" variant="invisible" @click="dialog?.close()">Ho capito</FzButton>
            </template>
            <template #body>Stai per eliminare Nuvola Studio. Le fatture associate restano archiviate.</template>
          </FzDialog>
        </div>
        <span class="vt-et">FzDialog</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="danger" @click="conferma?.show()">Apri la conferma</FzButton>
          <FzConfirmDialog
            ref="conferma"
            title="Elimina cliente"
            confirmLabel="Elimina cliente"
            cancelLabel="Annulla"
            @confirm="conferma?.close()"
            @cancel="conferma?.close()"
          >
            <template #body>Questa azione non si può annullare.</template>
          </FzConfirmDialog>
        </div>
        <span class="vt-et">FzConfirmDialog</span>
      </div>
    </div>
  </div>
</template>
