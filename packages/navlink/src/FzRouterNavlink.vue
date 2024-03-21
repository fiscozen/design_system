<script lang="ts" setup>
import FzNavlink from './FzNavlink.vue'
import { FzRouterNavlinkProps } from './types'

const props = defineProps<FzRouterNavlinkProps>()
</script>

<template>
  <router-link :to="meta.path">
    <FzNavlink v-bind="props"></FzNavlink>
  </router-link>
</template>
