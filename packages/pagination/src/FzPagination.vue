<script setup lang="ts">
/**
 * FzPagination Component
 *
 * Page-based navigation control for paginated data sets.
 * Supports v-model:currentPage for two-way binding of the active page.
 *
 * @component
 * @example
 * <FzPagination :totalPages="10" v-model:currentPage="page" />
 */
import { FzContainer } from '@fiscozen/container'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { useMediaQuery } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { computed } from 'vue'
import { usePagination } from './usePagination'
import type { PaginationItem, FzPaginationProps } from './types'

const props = withDefaults(defineProps<FzPaginationProps>(), {
  currentPage: 0,
  environment: 'frontoffice',
  options: () => ({}),
  position: 'end',
  totalPages: 0
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

const isDesktop = useMediaQuery(`(min-width: ${breakpoints.sm})`)

const { items: paginationItems } = usePagination(
  () => props.currentPage,
  () => props.totalPages,
  props.options
)

const NAV_ICON_MAP: Record<string, { name: string; position: 'before' | 'after' }> = {
  prev: { name: 'chevron-left', position: 'before' },
  next: { name: 'chevron-right', position: 'after' }
}

const paginationIcon = (item: PaginationItem) => NAV_ICON_MAP[item.type]?.name

const paginationIconPosition = (item: PaginationItem) => NAV_ICON_MAP[item.type]?.position

const isDisabled = (item: PaginationItem) => item.disabled || item.type === 'ellipsis'

/** Maps `position` prop to the corresponding Tailwind justify utility class for FzContainer. */
const justifyClass = computed(() => {
  switch (props.position) {
    case 'start':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'end':
    default:
      return 'justify-end'
  }
})

/**
 * Builds the CSS class array for a pagination item.
 *
 * Applies minimum width, mobile-specific flex layout for prev/next,
 * and a truncate-override marker on the active page button.
 */
const buttonClasses = (item: PaginationItem) => {
  const classes = ['!min-w-44']

  if (!isDesktop.value && (item.type === 'prev' || item.type === 'next')) {
    classes.push('flex-1')

    if (item.type === 'prev') {
      classes.push('justify-start')
    } else {
      classes.push('flex', 'justify-end')
    }
  }

  if (item.current) {
    classes.push('fz-pagination-disable-truncate')
  }

  return classes
}

const handlePageClick = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<template>
  <FzContainer
    v-if="totalPages > 1"
    alignItems="center"
    :class="[justifyClass]"
    gap="xs"
    horizontal
    tag="nav"
    ariaLabel="Paginazione"
  >
    <template v-for="(item, index) in paginationItems" :key="`${item.type}-${item.value}-${index}`">
      <FzIcon v-if="item.type === 'ellipsis'" name="ellipsis" size="md" aria-hidden="true" />
      <span
        v-else-if="!isDesktop && (item.type === 'prev' || item.type === 'next')"
        :class="buttonClasses(item)"
      >
        <FzIconButton
          :ariaLabel="item.type === 'prev' ? 'Pagina precedente' : 'Pagina successiva'"
          :disabled="item.disabled"
          :environment="environment"
          :iconName="paginationIcon(item) ?? ''"
          :variant="isDisabled(item) ? 'secondary' : 'invisible'"
          @click="handlePageClick(item.value)"
        />
      </span>
      <FzButton
        v-else
        :aria-current="item.current ? 'page' : undefined"
        :aria-label="
          item.type === 'page' || item.type === 'firstPage' || item.type === 'lastPage'
            ? `Pagina ${item.label}`
            : undefined
        "
        :class="buttonClasses(item)"
        :disabled="item.disabled"
        :environment="environment"
        :iconName="paginationIcon(item)"
        :iconPosition="paginationIconPosition(item)"
        :label="item.label"
        :variant="isDisabled(item) || item.current ? 'secondary' : 'invisible'"
        @click="handlePageClick(item.value)"
      />
    </template>
  </FzContainer>
</template>

<style scoped>
/** Overrides FzButton's internal .truncate so the current page label is never clipped. */
:deep(.fz-pagination-disable-truncate > .truncate) {
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: normal !important;
}
</style>
