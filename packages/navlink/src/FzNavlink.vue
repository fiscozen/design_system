<script lang="ts" setup generic="T">
import { FzIcon } from '@fiscozen/icons';
import { FzNavlinkProps } from './types';

defineProps<FzNavlinkProps<T>>()
</script>

<template>
    <button 
        class="
            h-32 
            rounded
            text-sm
            text-grey-500
            hover:bg-background-alice-blue
            hover:text-blue-500
            focus:border-1
            focus:border-blue-500 
            focus:bg-background-alice-blue
            focus:text-blue-500
            disabled:text-grey-100
            disabled:bg-core-white
            disabled:border-none
            items-center"
        :disabled="disabled"
        :class="{'w-32': !label, 'py-6 px-12': label}">
        <fz-icon 
            :name="iconName" 
            v-if="iconName" 
            :class="!label ? 'w-32' : 'mr-8'" 
            :size="iconSize"></fz-icon>
        <slot name="content">
            <span>{{ label }}</span>
        </slot>
    </button>
</template>