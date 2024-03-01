<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons';
import type { IconVariants } from './types';

withDefaults(defineProps<{
    name: string|string[],
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    variant?: IconVariants,
}>(),
{size: 'lg', variant: 'fasl'})

</script>

<template>
    <font-awesome-icon :icon="typeof name === 'string' ? byPrefixAndName[variant][name] : name" :size="size"/>
</template>