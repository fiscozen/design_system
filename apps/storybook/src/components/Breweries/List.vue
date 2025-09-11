<script setup lang="ts">
import { FzButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'

import { useBreweries } from './useBreweries'

const { useListBreweries } = useBreweries()

const { data: autoData, error: autoError, isLoading: autoLoading } = useListBreweries({
  onMount: true
})

const { data: manualData, error: manualError, isLoading: manualLoading, execute: manualExecute } = useListBreweries({
  onMount: false
})

const { data: filteredData, error: filteredError, isLoading: filteredLoading } = useListBreweries({
  filters: {
    by_state: 'singapore'
  }
})
</script>

<template>
  <div class="space-y-6">
    
    <FzCard title="📄 Base Query (no params)" class="fz-card">
      <div class="text-sm text-gray-600 mb-4">
        <code>useList() - No query params</code>
      </div>
      <p>Loading: {{ autoLoading }}</p>
      <p v-if="autoError">Error: {{ autoError }}</p>
      <pre v-else-if="autoData" class="text-sm">Items count: {{ autoData.length }}</pre>
      <pre v-else>No data</pre>
    </FzCard>

    <FzCard title="🔧 Manual Execution" class="fz-card">
      <FzButton @click="manualExecute" class="mb-4">Execute Manual Fetch</FzButton>

      <p>Loading: {{ manualLoading }}</p>
      <p v-if="manualError">Error: {{ manualError }}</p>
      <pre v-else-if="manualData" class="text-sm">Items count: {{ manualData.length }}</pre>
      <pre v-else>No data</pre>
    </FzCard>

    <FzCard title="🔍 Query Filters: ?by_state=singapore" class="fz-card">
      <p>Loading: {{ filteredLoading }}</p>
      <p v-if="filteredError">Error: {{ filteredError }}</p>
      <pre v-else-if="filteredData" class="text-sm">Items count: {{ filteredData.length }} {{ typeof filteredData }}</pre>
      <pre v-else>No data</pre>
    </FzCard>
  </div>
</template>