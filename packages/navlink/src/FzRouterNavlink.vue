<script lang="ts" setup>
/**
 * FzRouterNavlink
 *
 * @deprecated Deprecated for external use — internal-only until consumers migrate.
 * New code must use `@fiscozen/action` `FzAction` with `type="link"` and
 * `variant="textLeft"` instead. Pass the vue-router target via the `to` prop.
 * This package stays published because `@fiscozen/actionlist` and
 * `@fiscozen/navlist` still depend on it.
 * See the @fiscozen/navlink README for the full migration guide.
 */
import { FzIcon } from '@fiscozen/icons'
import { computed, useSlots } from 'vue'
import { FzRouterNavlinkProps } from './types'
import { commonClasses, disabledClasses } from './classUtils'

const props = defineProps<FzRouterNavlinkProps>()
const slots = useSlots()

const iconOnly = computed(() => !slots.default && !props.label)
</script>

<template>
  <component
    :is="disabled ? 'span' : 'router-link'"
    :to="disabled ? undefined : meta"
    :class="[
      { 'block flex w-32 items-center justify-center': iconOnly, 'px-12 py-6': !iconOnly },
      disabled ? disabledClasses : commonClasses
    ]"
  >
    <FzIcon
      :name="iconName"
      v-if="iconName"
      :class="iconOnly ? 'w-32' : 'mr-8'"
      :size="iconSize"
    ></FzIcon>
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
  </component>
</template>
