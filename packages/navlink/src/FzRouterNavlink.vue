<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { FzRouterNavlinkProps } from './types'
import { commonClasses } from './classUtils'

const props = defineProps<FzRouterNavlinkProps>()
const slots = useSlots()

const iconOnly = computed(() => !slots.default && !props.label)
</script>

<template>
  <router-link
    :to="meta"
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
