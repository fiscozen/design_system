<script setup lang="ts">
import { ref } from 'vue'
import { FzTabs, FzTab } from '@fiscozen/tab'
import { FzBreadcrumbs } from '@fiscozen/breadcrumbs'
import { FzPagination } from '@fiscozen/pagination'
import { FzStepper } from '@fiscozen/stepper'
import { FzDropdown } from '@fiscozen/dropdown'
import Demo from '../Demo.vue'
import { env } from '../env'

const pagina = ref(1)

const BRICIOLE = [
  { id: 'home', label: 'Clienti' },
  { id: 'cliente', label: 'Nuvola Studio' },
  { id: 'fattura', label: 'Fattura #2026-045' }
]

const PASSI = [
  { title: 'Dati', description: 'Chi sei', status: 'done' },
  { title: 'Documenti', description: 'Cosa serve', status: 'current' },
  { title: 'Firma', description: 'Ci siamo', status: 'todo' }
]

const AZIONI = [
  { type: 'link', label: 'Duplica', to: '/esempio', iconName: 'copy', iconVariant: 'far' },
  { type: 'link', label: 'Scarica il PDF', to: '/esempio', iconName: 'file-pdf', iconVariant: 'far' },
  { type: 'link', label: 'Elimina', to: '/esempio', iconName: 'trash', iconVariant: 'far' }
]
</script>

<template>
  <section id="navigazione" class="cat-sec">
    <h2>Navigazione</h2>
    <p>Come ci si muove: dove sono, dove posso andare, a che punto sono.</p>
    <div class="cat-grid">
      <Demo titolo="FzTabs" pkg="@fiscozen/tab" colonna>
        <FzTabs :environment="env" size="md" :initialSelected="0">
          <FzTab title="Assistenza">Le conversazioni con l'assistenza.</FzTab>
          <FzTab title="Commercialista">Le conversazioni con il commercialista.</FzTab>
        </FzTabs>
      </Demo>

      <Demo titolo="FzBreadcrumbs" pkg="@fiscozen/breadcrumbs" colonna>
        <FzBreadcrumbs :environment="env" :breadcrumbs="BRICIOLE" />
      </Demo>

      <Demo titolo="FzPagination" pkg="@fiscozen/pagination" colonna>
        <FzPagination :environment="env" :currentPage="pagina" :totalPages="8" @change="pagina = $event" />
      </Demo>

      <Demo titolo="FzStepper" pkg="@fiscozen/stepper" nota="Il progresso di un flusso lungo." colonna>
        <FzStepper :steps="PASSI" hasStepbar />
      </Demo>

      <Demo titolo="FzDropdown" pkg="@fiscozen/dropdown" colonna>
        <FzDropdown :environment="env" :actions="AZIONI">Azioni</FzDropdown>
      </Demo>
    </div>
  </section>
</template>
