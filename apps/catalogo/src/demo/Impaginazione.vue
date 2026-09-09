<script setup lang="ts">
import { FzButton, FzButtonGroup } from '@fiscozen/button'
import { FzContainer } from '@fiscozen/container'
import { env } from '../env'
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Non si vedono: mettono in fila quello che ci sta dentro, con le spaziature giuste.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live">
          <FzButtonGroup>
            <FzButton :environment="env" variant="secondary" iconName="arrow-left" iconPosition="before">Indietro</FzButton>
            <FzButton :environment="env" variant="primary" iconName="arrow-right" iconPosition="after">Avanti</FzButton>
          </FzButtonGroup>
        </div>
        <span class="vt-et">FzButtonGroup: secondaria a sinistra, primaria a destra</span>
      </div>
      <div v-for="gap in ['xs', 'sm', 'base', 'lg']" :key="gap" class="vt-cella">
        <div class="vt-live" style="display: block; width: 100%">
          <FzContainer :gap="gap" tag="div">
            <FzButton :environment="env" variant="secondary" containerClass="w-full">Primo</FzButton>
            <FzButton :environment="env" variant="secondary" containerClass="w-full">Secondo</FzButton>
          </FzContainer>
        </div>
        <span class="vt-et">FzContainer gap="{{ gap }}"</span>
      </div>
    </div>
  </div>
</template>
