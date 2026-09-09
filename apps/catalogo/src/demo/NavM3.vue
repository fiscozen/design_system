<script setup lang="ts">
import { FzIcon } from '@fiscozen/icons'
import { FzBadge } from '@fiscozen/badge'

/* Dal navigation rail e dal navigation drawer: la destinazione attiva è una
   **forma di sfondo**, non un testo colorato; l'icona sta sempre prima
   dell'etichetta; i gruppi si separano con divisori a piena larghezza; e le
   etichette si troncano invece di andare a capo.
   Il rail «baseline» non è più consigliato: si usa quello **compresso**, che
   tiene icona ed etichetta in colonna, o quello **espanso**, che le mette in
   riga come un drawer. */
const RAIL = [
  { icona: 'file-invoice', label: 'Fatture', attivo: true },
  { icona: 'receipt', label: 'Spese' },
  { icona: 'user-group', label: 'Clienti', badge: '3' },
  { icona: 'folder-open', label: 'Documenti' }
]
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Compresso ed espanso</h3>
      <p>
        A sinistra il rail compresso — icona sopra, etichetta sotto — a destra quello espanso, che è
        il drawer: icona prima del testo, sezioni separate da un divisore, e la destinazione attiva
        con la sua forma piena.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <nav class="m3-rail">
            <button v-for="v in RAIL" :key="v.label" class="m3-rail-voce" :class="{ 'is-attiva': v.attivo }">
              <span class="m3-rail-ind"><FzIcon :name="v.icona" size="md" variant="far" /></span>
              <span class="m3-rail-label">{{ v.label }}</span>
            </button>
          </nav>
        </div>
        <span class="vt-et">rail compresso</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="display: block">
          <nav class="m3-drawer">
            <p class="m3-drawer-sez">Lavoro</p>
            <button v-for="v in RAIL.slice(0, 3)" :key="v.label" class="m3-drawer-voce" :class="{ 'is-attiva': v.attivo }">
              <FzIcon :name="v.icona" size="md" variant="far" />
              <span class="m3-drawer-label">{{ v.label }}</span>
              <FzBadge v-if="v.badge" color="info">{{ v.badge }}</FzBadge>
            </button>
            <hr class="m3-drawer-hr" />
            <p class="m3-drawer-sez">Archivio</p>
            <button class="m3-drawer-voce">
              <FzIcon name="folder-open" size="md" variant="far" />
              <span class="m3-drawer-label">Documenti degli anni scorsi</span>
            </button>
          </nav>
        </div>
        <span class="vt-et">drawer espanso, con sezioni e divisore</span>
      </div>
    </div>
  </div>
</template>
