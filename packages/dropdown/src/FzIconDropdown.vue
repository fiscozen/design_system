<template>
  <FzDropdown v-bind="props" ref="dropdown">
    <template #opener="{ open }">
      <FzIconButton :iconName="iconName" @click="open()" :variant="buttonVariant" />
    </template>
  </FzDropdown>
</template>

<script setup lang="ts">
import FzDropdown from './FzDropdown.vue'
import { type FzIconDropdownProps } from './types'
import { FzIconButton } from '@fiscozen/button'

const props = withDefaults(defineProps<FzIconDropdownProps>(), {
  iconName: 'bars',
  closeOnActionClick: true,
  align: 'center',
  teleport: true,
  buttonVariant: 'secondary'
})
</script>
