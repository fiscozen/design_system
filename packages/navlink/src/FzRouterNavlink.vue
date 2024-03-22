<script lang="ts" setup>
import { FzRouterNavlinkProps } from './types'
import { commonClasses } from './classUtils'

const props = defineProps<FzRouterNavlinkProps>()
</script>

<template>
  <router-link
    :to="meta.path"
    :disabled="disabled"
    :class="[{ 'w-32': iconOnly, 'px-12 py-6': !iconOnly }, commonClasses]"
  >
    <FzIcon
      :name="iconName"
      v-if="iconName"
      :class="iconOnly ? 'w-32' : 'mr-8'"
      :size="iconSize"
    ></FzIcon>
    <slot>
      <span>{{ label }}</span>
    </slot>
  </router-link>
</template>
