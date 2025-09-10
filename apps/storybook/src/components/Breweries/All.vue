<script setup lang="ts">

import { FzButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'

import { useBreweries } from './useBreweries'

const { useAllBreweries } = useBreweries()

const { data: autoData, error: autoError, isLoading: autoLoading } = useAllBreweries()

const { data: manualData, error: manualError, isLoading: manualLoading, execute: manualExecute } = useAllBreweries({
  onMount: false
})
</script>

<template>
  <FzCard title="All (onMount: true)" class="fz-card mb-8">
    <p>Loading: {{ autoLoading }}</p>
    <p v-if="autoError">Error: {{ autoError }}</p>
    <pre v-else-if="autoData">Items count: {{ autoData.length }}</pre>
    <pre v-else>No data</pre>
  </FzCard>

  <FzCard title="All (onMount: false)" class="fz-card mb-8">
    <FzButton @click="manualExecute" class="mb-4">Execute Manual Fetch</FzButton>

    <p>Loading: {{ manualLoading }}</p>
    <p v-if="manualError">Error: {{ manualError }}</p>
    <pre v-else-if="manualData">Items count: {{ manualData.length }}</pre>
    <pre v-else>No data</pre>
  </FzCard>
</template>