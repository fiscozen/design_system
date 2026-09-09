<script setup lang="ts">
import { FzAccordion, FzCollapse } from '@fiscozen/collapse'
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Più FzCollapse dentro un FzAccordion: con `multiple` ne resta aperto più di uno.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live">
          <FzAccordion>
            <FzCollapse title="Quanto costa">Canone annuale, senza costi nascosti.</FzCollapse>
            <FzCollapse title="Quanto ci vuole">Il wizard sono dieci minuti, il resto lo facciamo noi.</FzCollapse>
            <FzCollapse title="Cosa serve">Un documento e lo SPID.</FzCollapse>
          </FzAccordion>
        </div>
        <span class="vt-et">uno alla volta</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzAccordion multiple>
            <FzCollapse title="Prima domanda">Risposta.</FzCollapse>
            <FzCollapse title="Seconda domanda">Risposta.</FzCollapse>
          </FzAccordion>
        </div>
        <span class="vt-et">multiple</span>
      </div>
    </div>
  </div>
</template>
