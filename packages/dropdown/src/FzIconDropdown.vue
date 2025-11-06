<template>
  <FzDropdown
    v-bind="props"
    ref="dropdown"
    @fzaction:click="(...args) => emit('fzaction:click', ...args)"
    :environment="mappedSizeToEnvironment"
  >
    <template #opener="{ open }">
      <FzIconButton
        :iconName="iconName"
        @click.stop="open()"
        :variant="buttonVariant"
        :disabled="disabled"
        :environment="mappedSizeToEnvironment"
        :aria-label="label"
      />
    </template>
    <template #actionList>
      <slot name="actionList"></slot>
    </template>
  </FzDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FzDropdown from './FzDropdown.vue'
import { type FzIconDropdownProps, type FzIconDropdownSlots } from './types'
import { FzIconButton } from '@fiscozen/button'
import { FzActionProps } from '@fiscozen/action'
import { sizeToEnvironmentMapping } from '@fiscozen/button/src/utils'

const props = withDefaults(defineProps<FzIconDropdownProps>(), {
  iconName: 'bars',
  closeOnActionClick: true,
  align: 'center',
  teleport: true,
  environment: 'frontoffice',
  buttonVariant: 'secondary',
  label: 'Open dropdown'
})

const mappedSizeToEnvironment = computed<'backoffice' | 'frontoffice'>(() => {
  return props.size ? sizeToEnvironmentMapping[props.size] : props.environment
})

defineSlots<FzIconDropdownSlots>()

const emit = defineEmits<{
  'fzaction:click': [index: number, action: FzActionProps]
}>()
</script>
