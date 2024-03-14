<script lang="ts" setup>
import FzNavlink from './FzNavlink.vue'
import { FzRouterNavlinkProps } from './types'

const props = defineProps<FzRouterNavlinkProps>()
</script>

<template>
  <router-link :to="meta.path">
    <fz-navlink v-bind="props"></fz-navlink>
  </router-link>
</template>
