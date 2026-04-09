<script lang="ts" setup>
import { ref, computed, inject, watch, onMounted, onBeforeUnmount, useId } from 'vue'
import { FzCollapseProps, ACCORDION_KEY } from './types'
import { FzIcon } from '@fiscozen/icons'

const props = withDefaults(defineProps<FzCollapseProps>(), {
  variant: 'section',
  iconClass: 'text-blue-500'
})
const isOpen = defineModel<boolean>('open', { default: false })
const detailsRef = ref<HTMLDetailsElement | null>(null)

const accordion = inject(ACCORDION_KEY, null)
const collapseId = useId()

onMounted(() => {
  if (accordion) {
    accordion.register(collapseId, () => {
      isOpen.value = false
    })
  }
})

onBeforeUnmount(() => {
  if (accordion) {
    accordion.unregister(collapseId)
  }
})

watch(
  isOpen,
  (val) => {
    if (val) {
      accordion?.notifyOpen(collapseId)
    }
  },
  { immediate: true }
)

const handleToggle = (e: ToggleEvent) => {
  if (e.newState === 'open' && isOpen.value === false) {
    isOpen.value = true
  } else if (e.newState === 'closed' && isOpen.value === true) {
    isOpen.value = false
  }
}

const handleClick = () => {
  if (detailsRef.value?.open) {
    isOpen.value = false
  } else {
    isOpen.value = true
  }
}

const isSection = computed(() => props.variant === 'section')
const isButton = computed(() => props.variant === 'button')

const iconSizeMap = { button: 'md', section: 'lg' } as const

const staticHeaderClasses = [
  'w-full',
  'block',
  'cursor-pointer',
  'select-none',
  'list-none',
  '[&::-webkit-details-marker]:hidden'
]

const headerWrapperClasses = computed(() => ({
  'flex w-full': true,

  // Section: just the header row (column not needed, only one child)
  'items-start': isSection.value,

  // Button: header row + rightContent side by side
  'items-center gap-24': isButton.value
}))

const headerRowClasses = computed(() => ({
  // Layout
  'flex gap-8 items-start cursor-pointer': true,

  // Width — section fills parent, button grows within flex
  'w-full': isSection.value,
  'flex-[1_0_0]': isButton.value
}))

const titleClasses = computed(() => ({
  // Typography — section
  'font-semibold text-[17px] leading-[24px]': isSection.value,

  // Typography — button
  'font-normal text-base leading-[20px]': isButton.value,

  // Font features — button (tabular numbers)
  '[font-feature-settings:"lnum"_1,"tnum"_1]': isButton.value,

  // Color
  'text-core-black': true
}))

const textContainerClasses = computed(() => ({
  'flex flex-col items-start justify-center min-w-0 gap-4': true,

  // Section: text expands, pushes chevron to far right
  'flex-[1_0_0]': isSection.value,

  // Button: text wraps content, chevron stays close to title
  'shrink-0': isButton.value
}))

const subtitleClasses = 'font-normal text-base leading-[20px] text-grey-500'

const contentSpacingClasses = computed(() => ({
  // Spacing from header (replaces gap on details, which doesn't support flex reliably)
  'mt-16': isButton.value,
  'mt-24': isSection.value
}))

const indentClasses = computed(() => ({
  // Indent spacer width
  'w-[28px]': isButton.value,
  'w-[32px]': isSection.value,

  'self-stretch shrink-0': true
}))
</script>

<template>
  <details
    ref="detailsRef"
    :open="isOpen"
    data-e2e="details"
    class="w-full overflow-clip"
    @toggle="handleToggle"
  >
    <summary
      data-e2e="summary"
      :class="[staticHeaderClasses, props.headerClass]"
      @click.stop.prevent="handleClick"
    >
      <div :class="headerWrapperClasses" data-e2e="header-wrapper">
        <div :class="headerRowClasses" data-e2e="header-row">
          <slot name="icon">
            <FzIcon
              v-if="icon"
              :class="iconClass"
              :name="icon"
              :size="iconSizeMap[variant]"
              data-e2e="leading-icon"
            />
          </slot>
          <div :class="textContainerClasses" data-e2e="text-container">
            <slot name="header">
              <span :class="titleClasses" data-e2e="title">{{ title }}</span>
            </slot>
            <span
              v-if="subtitle && isSection && !isOpen"
              :class="subtitleClasses"
              data-e2e="subtitle"
            >
              {{ subtitle }}
            </span>
          </div>
          <slot name="chevron">
            <FzIcon
              :name="isOpen ? 'angle-up' : 'angle-down'"
              :size="iconSizeMap[variant]"
              data-e2e="chevron-icon"
            />
          </slot>
        </div>
        <div v-if="isButton" @click.stop>
          <slot name="rightContent" />
        </div>
      </div>
    </summary>
    <div
      data-e2e="content"
      v-show="isOpen"
      :class="['flex w-full items-start', contentSpacingClasses, contentClass]"
    >
      <div v-if="icon" :class="indentClasses" data-e2e="indent-space" />
      <div class="flex min-w-0 flex-[1_0_0] flex-col">
        <slot name="content" />
      </div>
    </div>
  </details>
</template>
