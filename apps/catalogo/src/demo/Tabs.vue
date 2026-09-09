<script setup lang="ts">
import { FzTabs, FzTab } from '@fiscozen/tab'
import { env } from '../env'
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>FzTabs è il contenitore, FzTab la singola linguetta con il suo contenuto.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live">
          <FzTabs :environment="env" size="md" :initialSelected="0">
            <FzTab title="Assistenza">Le conversazioni con l’assistenza.</FzTab>
            <FzTab title="Commercialista">Le conversazioni con il tuo commercialista.</FzTab>
            <FzTab title="Archiviate" disabled>Niente qui.</FzTab>
          </FzTabs>
        </div>
        <span class="vt-et">orizzontale, con una linguetta disabilitata</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzTabs :environment="env" size="md" :initialSelected="1">
            <FzTab title="Dati" icon="user">I dati anagrafici.</FzTab>
            <FzTab title="Fatture" icon="file-invoice" badgeContent="3">Le fatture emesse.</FzTab>
          </FzTabs>
        </div>
        <span class="vt-et">con icona e badge</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzTabs :environment="env" size="md" vertical :initialSelected="0">
            <FzTab title="Anagrafica">I dati anagrafici.</FzTab>
            <FzTab title="Contatti">Email e telefono.</FzTab>
          </FzTabs>
        </div>
        <span class="vt-et">verticale</span>
      </div>
    </div>
  </div>
</template>
