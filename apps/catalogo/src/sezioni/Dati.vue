<script setup lang="ts">
import { FzSimpleTable, FzColumn } from '@fiscozen/simple-table'
import { FzBadge } from '@fiscozen/badge'
import Demo from '../Demo.vue'

const FATTURE = [
  { numero: '2026-045', cliente: 'Nuvola Studio', importo: '€ 1.250,00', stato: 'Pagata' },
  { numero: '2026-044', cliente: 'Ferrari SRL', importo: '€ 480,00', stato: 'In scadenza' },
  { numero: '2026-043', cliente: 'Bianchi Marco', importo: '€ 2.100,00', stato: 'Scaduta' }
]
const COLORE: Record<string, string> = { Pagata: 'success', 'In scadenza': 'warning', Scaduta: 'error' }
</script>

<template>
  <section id="dati" class="cat-sec">
    <h2>Dati</h2>
    <p>Le tabelle: soprattutto Back Office, dove i volumi sono alti.</p>
    <div class="cat-grid">
      <Demo titolo="FzSimpleTable" pkg="@fiscozen/simple-table" colonna>
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
      </Demo>
    </div>
  </section>
</template>
