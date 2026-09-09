<script setup lang="ts">
import { FzIconButton } from '@fiscozen/button'
import { FzIconDropdown } from '@fiscozen/dropdown'
import { env } from '../env'

/* Dall'icon button di Material: quattro stili di colore (filled, tonal,
   outlined, standard), due forme e **tre larghezze** — stretta, normale,
   larga. E dalla tab accessibility: alle taglie XS e S il bersaglio deve
   restare almeno 48×48dp. */
const AZIONI = [
  { type: 'link', label: 'Duplica', to: '/esempio', iconName: 'copy', iconVariant: 'far' },
  { type: 'link', label: 'Scarica il PDF', to: '/esempio', iconName: 'file-pdf', iconVariant: 'far' },
  { type: 'link', label: 'Elimina', to: '/esempio', iconName: 'trash', iconVariant: 'far' }
]
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Stili, forme, larghezze</h3>
      <p>
        Quattro stili di colore e tre larghezze. Il bersaglio resta 48dp anche quando il bottone ne
        misura 40: è la regola della tab sull'accessibilità.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzIconButton :environment="env" variant="primary" iconName="plus" ariaLabel="Filled" />
          <FzIconButton :environment="env" variant="secondary" iconName="pen" ariaLabel="Tonal" class="m3-tonal" />
          <FzIconButton :environment="env" variant="secondary" iconName="star" ariaLabel="Outlined" class="m3-outlined" />
          <FzIconButton :environment="env" variant="invisible" iconName="trash" ariaLabel="Standard" />
        </div>
        <span class="vt-et">filled · tonal · outlined · standard</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzIconButton :environment="env" variant="secondary" iconName="pen" ariaLabel="Stretto" class="m3-stretto" />
          <FzIconButton :environment="env" variant="secondary" iconName="pen" ariaLabel="Normale" />
          <FzIconButton :environment="env" variant="secondary" iconName="pen" ariaLabel="Largo" class="m3-largo" />
        </div>
        <span class="vt-et">le tre larghezze: stretta, normale, larga</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzIconDropdown :environment="env" :actions="AZIONI" iconName="ellipsis-vertical" ariaLabel="Altre azioni" />
        </div>
        <span class="vt-et">con il menu: la scocca è quella del FAB menu</span>
      </div>
    </div>
  </div>
</template>
