<script setup lang="ts">
import { ref } from 'vue'

import { FzCard } from '@fiscozen/card'
import { FzButton } from '@fiscozen/button'
import { FzSelect } from '@fiscozen/select'

import { useBreweries } from './useBreweries'

const breweryIds = [
  '5128df48-79fc-4f0f-8b52-d06be54d0cec',
  '9c5a66c8-cc13-416f-a5d9-0a769c87d318',
  '34e8c68b-6146-453f-a4b9-1f6cd99a5ada',
]

const breweryId = ref(breweryIds[0])

const { useRetrieveBreweryById } = useBreweries()

const { data: autoData, error: autoError, isLoading: autoLoading } = useRetrieveBreweryById(breweryId)

// Totally manual
const { data: manualData, error: manualError, isLoading: manualLoading, execute: manualExecute } = useRetrieveBreweryById(breweryId, {
  onMount: false,
  autoUpdate: false
})
</script>

<template>
  <FzCard title="Choose a brewery ID" class="fz-card mb-8">
    <FzSelect v-model="breweryId" :options="breweryIds.map(id => ({ value: id, label: id }))" />
  </FzCard>
  <FzCard title="Retrieve (onMount: true)" class="fz-card mb-8">
    <p>Loading: {{ autoLoading }}</p>
    <p v-if="autoError">Error: {{ autoError }}</p>
    <pre v-else>{{ autoData }}</pre>
  </FzCard>

  <FzCard title="Retrieve (onMount: false, autoUpdate: true)" class="fz-card mb-8">
    <FzButton @click="manualExecute" class="mb-4">Execute Manual Fetch</FzButton>

    <p>Loading: {{ manualLoading }}</p>
    <p v-if="manualError">Error: {{ manualError }}</p>
    <pre v-else>{{ manualData }}</pre>
  </FzCard>
</template>