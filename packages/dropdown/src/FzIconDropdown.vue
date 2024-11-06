<template>
  <FzDropdown v-bind="props">
    <template #opener="slotProps">
        <FzIconButton :iconName="iconName" @click="slotProps.isOpen = !slotProps.isOpen"/>
    </template>
  </FzDropdown>
</template>

<script setup lang="ts">
import FzDropdown from './FzDropdown.vue';
import { FzIconDropdownProps } from './types';
import { FzIconButton } from '@fiscozen/button';

const props = withDefaults(defineProps<FzIconDropdownProps>(), {
    iconName: 'bars'
})
</script>
