<script setup lang="ts">
/* Il riquadro di un componente: nome, pacchetto da cui si importa, una riga
   che dice quando si usa, e sotto l'esempio vivo. */
defineProps<{
  titolo: string
  pkg: string
  nota?: string
  /** Esempi impilati invece che affiancati. */
  colonna?: boolean
}>()
</script>

<template>
  <div :id="titolo" class="cat-demo">
    <div class="cat-demo-h">
      <b>{{ titolo }}</b>
      <code>{{ pkg }}</code>
    </div>
    <p v-if="nota" class="cat-demo-n">{{ nota }}</p>
    <div class="cat-demo-body" :class="{ 'is-col': colonna }">
      <slot />
    </div>
  </div>
</template>
