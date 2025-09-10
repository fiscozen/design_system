<script setup lang="ts">

import { FzCard } from '@fiscozen/card'
import { FzButton } from '@fiscozen/button'

import { useBreweries } from './useBreweries'

const { useRetrieveBreweryById } = useBreweries()

const { data: autoData, error: autoError, isLoading: autoLoading } = useRetrieveBreweryById('b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0')

const { data: manualData, error: manualError, isLoading: manualLoading, execute: manualExecute } = useRetrieveBreweryById('b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0', {
  onMount: false
})
</script>

<template>
  <FzCard title="Retrieve (onMount: true)" class="fz-card mb-8">
    <p>Loading: {{ autoLoading }}</p>
    <p v-if="autoError">Error: {{ autoError }}</p>
    <pre v-else>{{ autoData }}</pre>
  </FzCard>

  <FzCard title="Retrieve (onMount: false)" class="fz-card mb-8">
    <FzButton @click="manualExecute" class="mb-4">Execute Manual Fetch</FzButton>

    <p>Loading: {{ manualLoading }}</p>
    <p v-if="manualError">Error: {{ manualError }}</p>
    <pre v-else>{{ manualData }}</pre>
  </FzCard>
</template>