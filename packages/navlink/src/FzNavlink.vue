<script lang="ts" setup generic="T">
/**
 * FzNavlink
 *
 * @deprecated Deprecated for external use — internal-only until consumers migrate.
 * New code must use `@fiscozen/action` `FzAction` with `type="action"` and
 * `variant="textLeft"` instead. This package stays published because
 * `@fiscozen/actionlist` and `@fiscozen/navlist` still depend on it.
 * See the @fiscozen/navlink README for the full migration guide.
 */
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
