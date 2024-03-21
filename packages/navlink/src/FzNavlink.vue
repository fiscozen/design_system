<script lang="ts" setup generic="T">
import { FzIcon } from '@fiscozen/icons'
import { FzNavlinkProps } from './types'

defineProps<FzNavlinkProps<T>>()
</script>

<template>
  <button
    class="text-grey-500 hover:bg-background-alice-blue border-1 focus:border-1 focus:bg-background-alice-blue disabled:text-grey-100 disabled:bg-core-white h-32 items-center rounded border-transparent text-sm hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 disabled:border-transparent"
    :disabled="disabled"
    :class="{ 'w-32': !label, 'px-12 py-6': label }"
  >
    <FzIcon
      :name="iconName"
      v-if="iconName"
      :class="!label ? 'w-32' : 'mr-8'"
      :size="iconSize"
    ></FzIcon>
    <slot name="navlink-label">
      <span>{{ label }}</span>
    </slot>
  </button>
</template>
