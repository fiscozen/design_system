<script setup lang="ts">
import { FzCard } from '@fiscozen/card'
import { FzCardList } from '@fiscozen/card-list'
import { FzAccordion, FzCollapse } from '@fiscozen/collapse'
import { FzContainer } from '@fiscozen/container'
import { FzButton } from '@fiscozen/button'
import Demo from '../Demo.vue'
import { env } from '../env'

const RIGHE = [
  { title: 'Fattura #2026-045', value: '€ 1.250,00', descriptions: ['Nuvola Studio · 3 aprile'] },
  { title: 'Fattura #2026-044', value: '€ 480,00', descriptions: ['Ferrari SRL · 28 marzo'] }
]
</script>

<template>
  <section id="contenitori" class="cat-sec">
    <h2>Contenitori</h2>
    <p>Come si raggruppa quello che sta dentro una schermata.</p>
    <div class="cat-grid">
      <Demo titolo="FzCard" pkg="@fiscozen/card" nota="Contenitore, non bersaglio: l'azione è il bottone dentro." colonna>
        <FzCard :environment="env" title="Dati della società" :primaryAction="{ label: 'Modifica' }">
          Nuvola Studio SRL, Via Ozanam 12, Milano.
        </FzCard>
      </Demo>

      <Demo titolo="FzCardList" pkg="@fiscozen/card-list" colonna>
        <FzCardList :items="RIGHE" />
      </Demo>

      <Demo titolo="FzCollapse" pkg="@fiscozen/collapse" colonna>
        <FzCollapse title="Cosa comprende il servizio" subtitle="Aprilo per leggere">
          Commercialista dedicato, dichiarazioni, fatture illimitate e assistenza in chat.
        </FzCollapse>
      </Demo>

      <Demo titolo="FzAccordion" pkg="@fiscozen/collapse" nota="Più collapse insieme; con multiple ne resta aperto più di uno." colonna>
        <FzAccordion multiple>
          <FzCollapse title="Quanto costa">Canone annuale, senza costi nascosti.</FzCollapse>
          <FzCollapse title="Quanto ci vuole">Il wizard sono dieci minuti, il resto lo facciamo noi.</FzCollapse>
        </FzAccordion>
      </Demo>

      <Demo titolo="FzContainer" pkg="@fiscozen/container" nota="Le spaziature verticali fra i blocchi: gap xs, sm, base, lg." colonna>
        <FzContainer gap="sm" tag="div">
          <FzButton :environment="env" variant="secondary" containerClass="w-full">Primo</FzButton>
          <FzButton :environment="env" variant="secondary" containerClass="w-full">Secondo</FzButton>
        </FzContainer>
      </Demo>
    </div>
  </section>
</template>
