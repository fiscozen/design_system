<template>
  <FzDropdown v-bind="props" ref="dropdown" @fzaction:click="(...args) => emit('fzaction:click', ...args)">
    <template #opener="{ open }">
      <FzIconButton :iconName="iconName" @click="open()" :variant="buttonVariant" />
    </template>
  </FzDropdown>
</template>

<script setup lang="ts">
import FzDropdown from './FzDropdown.vue'
import { type FzIconDropdownProps } from './types'
import { FzIconButton } from '@fiscozen/button'
import { ActionlistItem } from '@fiscozen/actionlist'

const props = withDefaults(defineProps<FzIconDropdownProps>(), {
  iconName: 'bars',
  closeOnActionClick: true,
  align: 'center',
  teleport: true,
  buttonVariant: 'secondary'
})

const emit = defineEmits<{
  'fzaction:click': [index: number, action: ActionlistItem]
}>()
</script>
