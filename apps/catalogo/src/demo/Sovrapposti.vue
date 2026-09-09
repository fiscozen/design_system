<script setup lang="ts">
import { ref } from 'vue'
import { FzPopover } from '@fiscozen/popover'
import { FzFloating } from '@fiscozen/composables'
import { FzButton } from '@fiscozen/button'
import { env } from '../env'

const aperto = ref(false)
const aperto2 = ref(false)
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Contenuto che galleggia sopra la pagina, ancorato a un elemento.</p>
    </div>
    <div class="vt-grid">
      <div class="vt-cella">
        <div class="vt-live">
          <FzPopover v-model:isOpen="aperto" position="bottom">
            <template #opener>
              <FzButton :environment="env" variant="secondary" @click="aperto = !aperto">Apri il popover</FzButton>
            </template>
            <div style="padding: 12px; max-width: 220px">Un contenuto ancorato al bottone che lo ha aperto.</div>
          </FzPopover>
        </div>
        <span class="vt-et">FzPopover</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzFloating :isOpen="aperto2" position="bottom">
            <template #opener>
              <FzButton :environment="env" variant="secondary" @click="aperto2 = !aperto2">Apri il floating</FzButton>
            </template>
            <div style="padding: 12px; background: #fff; border: 1px solid #e6e5e1; border-radius: 8px">
              FzFloating è il pezzo di base su cui sono costruiti popover, dropdown e tooltip.
            </div>
          </FzFloating>
        </div>
        <span class="vt-et">FzFloating</span>
      </div>
    </div>
  </div>
</template>
