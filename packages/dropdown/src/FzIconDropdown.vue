<template>
  <FzDropdown v-bind="props" ref="dropdown">
    <template #opener>
        <FzIconButton :iconName="iconName" @click="dropdown?.open()" :variant="buttonVariant"/>
    </template>
  </FzDropdown>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, ref } from 'vue';
import FzDropdown from './FzDropdown.vue';
import { type FzIconDropdownProps } from './types';
import { FzIconButton } from '@fiscozen/button';

const dropdown = ref<ComponentPublicInstance>();

const props = withDefaults(defineProps<FzIconDropdownProps>(), {
    iconName: 'bars',
    closeOnActionClick: true,
    align: 'center',
    teleport: true,
    buttonVariant: 'secondary'
})
</script>
