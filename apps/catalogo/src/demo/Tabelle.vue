<script setup lang="ts">
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzBadge } from '@fiscozen/badge'

const FATTURE = [
  { numero: '2026-045', cliente: 'Nuvola Studio', importo: '€ 1.250,00', stato: 'Pagata' },
  { numero: '2026-044', cliente: 'Ferrari SRL', importo: '€ 480,00', stato: 'In scadenza' },
  { numero: '2026-043', cliente: 'Bianchi Marco', importo: '€ 2.100,00', stato: 'Scaduta' }
]
const COLORE: Record<string, string> = { Pagata: 'success', 'In scadenza': 'warning', Scaduta: 'error' }
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Una FzColumn per colonna: con `field` prende il valore dal dato, con lo slot ci metti quello che vuoi.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live">
          <FzSimpleTable :value="FATTURE">
            <FzColumn field="numero" header="Numero" />
            <FzColumn field="cliente" header="Cliente" />
            <FzColumn field="importo" header="Importo" numeric />
            <FzColumn header="Stato">
              <template #default="props">
                <FzBadge :color="COLORE[props.data.stato]">{{ props.data.stato }}</FzBadge>
              </template>
            </FzColumn>
          </FzSimpleTable>
        </div>
        <span class="vt-et">colonne con field, e una con lo slot</span>
      </div>
    </div>
  </div>
</template>
