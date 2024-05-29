<script lang="ts" setup generic="T">
import { computed, useSlots } from 'vue'
import { FzIcon } from '@fiscozen/icons'
import { FzNavlinkProps } from './types'
import { commonClasses } from './classUtils'

const props = defineProps<FzNavlinkProps<T>>()
const slots = useSlots()

const iconOnly = computed(() => !slots.default && !props.label)
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
      :variant="iconVariant"
    ></FzIcon>
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
  </button>
</template>
