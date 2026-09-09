<script setup lang="ts">
import { FzButton } from '@fiscozen/button'
import { env } from '../env'

/* Material ha cinque stili di colore — elevated, filled, tonal, outlined, text
   — e cinque taglie, con due forme (tonda e squadrata) per ognuna. Il nostro
   FzButton ne ha cinque di varianti, che ci mappano sopra quasi uno a uno:
   primary → filled, secondary → outlined, invisible → text. Mancano elevated e
   tonal, e qui li mostro composti con quello che c'è. */
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>I cinque stili di colore</h3>
      <p>
        Da sinistra: elevated, filled, tonal, outlined, text. I nostri sono tre — primary, secondary,
        invisible — e coprono filled, outlined e text; elevated e tonal qui sono ottenuti dal tema,
        e nel design system non esistono come varianti.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="secondary" class="m3-elevated">Elevated</FzButton>
          <FzButton :environment="env" variant="primary">Filled</FzButton>
          <FzButton :environment="env" variant="secondary" class="m3-tonal">Tonal</FzButton>
          <FzButton :environment="env" variant="secondary" class="m3-outlined">Outlined</FzButton>
          <FzButton :environment="env" variant="invisible">Text</FzButton>
        </div>
        <span class="vt-et">i cinque stili, con i nostri componenti</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live" style="align-items: flex-end">
          <FzButton :environment="env" variant="primary" class="m3-xs">XS</FzButton>
          <FzButton :environment="env" variant="primary">S</FzButton>
          <FzButton :environment="env" variant="primary" class="m3-md">M</FzButton>
          <FzButton :environment="env" variant="primary" class="m3-lg">L</FzButton>
        </div>
        <span class="vt-et">le taglie: 32 · 40 · 56 · 96</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzButton :environment="env" variant="primary">Tonda</FzButton>
          <FzButton :environment="env" variant="primary" class="m3-quadra">Squadrata</FzButton>
        </div>
        <span class="vt-et">le due forme — premile: convergono sulla stessa</span>
      </div>
    </div>
  </div>
</template>
