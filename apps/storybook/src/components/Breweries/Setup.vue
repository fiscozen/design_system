<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { rest } from '@fiscozen/data'

const { setupFzFetcher } = rest

onBeforeMount(() => {
  setupFzFetcher({
    baseUrl: 'https://api.openbrewerydb.org/v1/'
  })
})
</script>

<template>
  <h1>@fiscozen/data</h1>
  <slot />
</template>