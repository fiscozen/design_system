<script setup lang="ts">

import Retrieve from './Retrieve.vue'
import All from './All.vue'

// INIT FZ FETCHER
import { onBeforeMount } from 'vue'
import { rest } from '@fiscozen/data'

const { setupFzFetcher } = rest

onBeforeMount(() => {
  setupFzFetcher({
    baseUrl: 'https://api.openbrewerydb.org/v1/'
  })
})
// END INIT FZ FETCHER
</script>

<template>
  <div class="flex flex-col gap-12">
    <h1>@fiscozen/data</h1>
    <Retrieve />
    <All />
  </div>
</template>