<script setup lang="ts">
import { computed } from 'vue';
import type { IconBackgroundProps } from './types';
import FzIcon from './FzIcon.vue';

const props = withDefaults(
  defineProps<IconBackgroundProps>(),
  { size: 'lg', variant: 'far', backgroundColor: 'core-white' }
);

const iconClasses = computed(() => {
    return [
        'box-content',
        'p-[8px]',
        'rounded-full',
        `bg-${props.backgroundColor}`
    ];
});
</script>

<template>
    <FzIcon :class="iconClasses" v-bind="props" />
</template>
