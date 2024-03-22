<script lang="ts" setup generic="T">
import { FzIcon } from '@fiscozen/icons'
import { FzNavlinkProps } from './types'
import { commonClasses } from './classUtils'

defineProps<FzNavlinkProps<T>>()
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      { 'flex w-32 flex-row items-center justify-center': iconOnly, 'px-12 py-6': !iconOnly },
      commonClasses
    ]"
  >
    <FzIcon
      :name="iconName"
      v-if="iconName"
      :class="iconOnly ? '' : 'mr-8'"
      :size="iconSize"
    ></FzIcon>
    <slot>
      <span>{{ label }}</span>
    </slot>
  </button>
</template>
