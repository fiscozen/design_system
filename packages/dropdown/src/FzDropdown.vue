<template>
  <FzFloating
    :isOpen
    :position="floatingPosition"
    ref="container"
    overrideContentClass
    contentClass="mt-4"
    :teleport="teleport"
  >
    <template #opener>
      <slot name="opener" :isOpen="isOpen" :open :close>
        <FzButton
          icon-position="after"
          :icon-name="buttonIconName"
          @click="isOpen = !isOpen"
          :environment="mappedSizeToEnvironment"
          :variant="buttonVariant"
          :disabled="disabled"
        >
          <slot :isOpen="isOpen"></slot>
        </FzButton>
      </slot>
    </template>
    <slot name="actionList">
      <FzActionList :listClass="props.listClass">
        <FzActionSection
          v-for="(section, index) in groupedActions"
          :key="index"
          :label="index !== '__default__' ? index : undefined"
          :environment="environment"
        >
          <FzAction
            v-for="(action, actionIndex) in section"
            :key="actionIndex"
            v-bind="action"
            @click="handleActionClick(action)"
            :environment="environment"
          />
        </FzActionSection>
      </FzActionList>
    </slot>
  </FzFloating>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, ref } from 'vue'
import { FzButton } from '@fiscozen/button'
import { FzAction, FzActionList, FzActionProps, FzActionSection } from '@fiscozen/action'
import { FzFloating, useClickOutside, useKeyDown } from '@fiscozen/composables'
import { FzDropdownProps, FzDropdownSlots } from './types'
import { sizeToEnvironmentMapping } from '@fiscozen/button/src/utils'

const props = withDefaults(defineProps<FzDropdownProps>(), {
  environment: 'frontoffice',
  actions: () => [],
  closeOnActionClick: true,
  teleport: true
})

const mappedSizeToEnvironment = computed<'backoffice' | 'frontoffice'>(() => {
  return props.size ? sizeToEnvironmentMapping[props.size] : props.environment
})
const emit = defineEmits<{
  'fzaction:click': [actionIndex: number, action: FzActionProps]
}>()

defineSlots<FzDropdownSlots>()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const container = ref<ComponentPublicInstance>()
const containerDom = computed(() => container.value?.$el)
const buttonIconName = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const floatingPosition = computed(() => {
  switch (props.align) {
    case 'left':
      return 'bottom-start'
    case 'right':
      return 'bottom-end'
    default:
      return 'bottom'
  }
})

const groupedActions = computed(() => {
  const sections: Record<string, FzActionProps[]> = {}

  let section = '__default__'
  props.actions.forEach((action) => {
    if (action.type === 'section') {
      section = action.label || '__default__'
      return
    }

    if (!sections[section]) {
      sections[section] = []
    }
    sections[section].push(action)
  })
  return sections
})

useClickOutside(containerDom, () => {
  isOpen.value = false
})

useKeyDown(containerDom, (event) => {
  if (event.key !== 'Escape') return
  isOpen.value = false
})

function handleActionClick(action: FzActionProps) {
  const stringifiedAction = JSON.stringify(action)
  const index = props.actions.findIndex((compareAction) => JSON.stringify(compareAction) == stringifiedAction)
  emit('fzaction:click', index, action)
  if (props.closeOnActionClick) {
    isOpen.value = false
  }
}

/**
 * @deprecated Use the isOpen model instead
 */
function open() {
  isOpen.value = true
}

/**
 * @deprecated Use the isOpen model instead
 */
function close() {
  isOpen.value = false
}

defineExpose({
  open,
  close
})
</script>
