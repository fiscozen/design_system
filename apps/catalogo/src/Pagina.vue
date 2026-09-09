<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Vetrina from './Vetrina.vue'
import { REGISTRO } from './registro'
import { env } from './env'

/* La pagina di un componente: tutte le varianti e tutti gli stati. */
const route = useRoute()
const voce = computed(() => REGISTRO.find((v) => v.nome === route.params.nome))
</script>

<template>
  <main v-if="voce" class="cat-main">
    <p class="cat-briciole">
      <RouterLink to="/">Catalogo</RouterLink> / {{ voce.gruppo }}
    </p>
    <header class="cat-head">
      <div>
        <h1>{{ voce.nome }}</h1>
        <p>{{ voce.nota }}</p>
        <p class="cat-imp"><code>import {{ '{' }} {{ voce.nome }} {{ '}' }} from '{{ voce.pkg }}'</code></p>
      </div>
      <div v-if="voce.env" class="cat-env">
        <button :class="{ 'is-on': env === 'frontoffice' }" @click="env = 'frontoffice'">Front Office</button>
        <button :class="{ 'is-on': env === 'backoffice' }" @click="env = 'backoffice'">Back Office</button>
      </div>
    </header>

    <component :is="voce.demo" v-if="voce.demo" />
    <Vetrina v-for="(g, i) in voce.gallerie ?? []" :key="i" :voce="voce" :galleria="g" />
    <component :is="voce.demoDopo" v-if="voce.demoDopo" />
  </main>
  <main v-else class="cat-main">
    <p>Componente non trovato. <RouterLink to="/">Torna al catalogo</RouterLink>.</p>
  </main>
</template>
