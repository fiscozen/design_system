<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { Galleria, Voce } from './tipi'
import { env } from './env'

/* Una galleria: le celle con dentro il componente vero, ognuna con la sua
   etichetta. Lo stato (hover, focus, active) è una classe sulla cella. */
const props = defineProps<{ voce: Voce; galleria: Galleria }>()

/* Ogni cella tiene il suo valore: così i campi si possono usare davvero,
   invece di restare bloccati sul valore di partenza. */
const modelli = reactive<Record<number, unknown>>({})

const comuni = computed(() => ({
  ...(props.voce.props ?? {}),
  ...(props.voce.env ? { environment: env.value } : {})
}))
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>{{ galleria.titolo }}</h3>
      <p v-if="galleria.nota">{{ galleria.nota }}</p>
    </div>
    <div class="vt-grid" :class="{ 'is-col': galleria.colonna }">
      <div
        v-for="(c, i) in galleria.celle"
        :key="i"
        class="vt-cella"
        :class="[c.stato ? `forza-${c.stato}` : '', { 'is-larga': c.larga }]"
      >
        <div class="vt-live">
          <component
            :is="voce.comp"
            v-bind="{ ...comuni, ...(c.props ?? {}) }"
            :model-value="i in modelli ? modelli[i] : (c.props as any)?.modelValue"
            @update:model-value="(v: unknown) => (modelli[i] = v)"
          >
            {{ c.slot ?? voce.slot }}
          </component>
        </div>
        <span class="vt-et">{{ c.etichetta }}</span>
      </div>
    </div>
  </div>
</template>
