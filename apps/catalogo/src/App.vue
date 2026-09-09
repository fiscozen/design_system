<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { GRUPPI, perGruppo } from './registro'
import { TEMI, tema } from './tema'

/* Catalogo visivo del design system. Storybook mostra un componente per volta e
   documenta le prop; qui si vede l'insieme, e dentro ogni componente tutte le
   varianti e tutti gli stati. */
const route = useRoute()
const notaTema = computed(() => TEMI.find((t) => t.id === tema.value)!.nota)

/* Il tema sta anche sul body, non solo sul riquadro del contenuto: calendario,
   tendine e pannelli sovrapposti vengono teletrasportati fuori dall'albero del
   componente, e lì dentro le regole del tema non arriverebbero mai. */
watchEffect(() => {
  document.body.classList.remove(...TEMI.map((t) => `tema-${t.id}`))
  document.body.classList.add(`tema-${tema.value}`)
})
</script>

<template>
  <div class="cat">
    <nav class="cat-nav">
      <RouterLink to="/" class="cat-brand-link">
        <p class="cat-brand">Catalogo</p>
        <p class="cat-sub">Design system Fiscozen</p>
      </RouterLink>
      <template v-for="g in GRUPPI" :key="g">
        <template v-if="perGruppo(g).length">
          <h3>{{ g }}</h3>
          <RouterLink
            v-for="v in perGruppo(g)"
            :key="v.nome"
            :to="`/c/${v.nome}`"
            :class="{ 'is-on': route.params.nome === v.nome }"
          >
            {{ v.nome }}
          </RouterLink>
        </template>
      </template>
    </nav>

    <div class="cat-corpo">
      <div class="cat-temi">
        <div class="cat-temi-tabs" role="tablist" aria-label="Versione del design system">
          <button
            v-for="t in TEMI"
            :key="t.id"
            role="tab"
            :aria-selected="tema === t.id"
            :class="{ 'is-on': tema === t.id }"
            @click="tema = t.id"
          >
            {{ t.label }}
          </button>
        </div>
        <p class="cat-temi-nota">{{ notaTema }}</p>
      </div>

      <div :class="`tema-${tema}`">
        <RouterView />
      </div>
    </div>
  </div>
</template>
