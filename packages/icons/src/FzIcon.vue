<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'
import type { IconSize, IconVariant } from './types'

withDefaults(
  defineProps<{
    name: string | string[]
    size?: IconSize
    variant?: IconVariant
  }>(),
  { size: 'lg', variant: 'fasr' }
)
</script>

<template>
  <font-awesome-icon
    :icon="typeof name === 'string' ? byPrefixAndName[variant][name] : name"
    :size="size !== 'md' ? size : undefined"
  />
</template>
