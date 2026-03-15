<script setup lang="ts">
/**
 * FzPagination Component
 *
 * Page-based navigation control for paginated data sets.
 * Supports v-model:currentPage for two-way binding of the active page.
 * URL sync is enabled by default (syncUrl): reads the initial page from the URL
 * on mount and writes page changes back via useQueryString.
 * Set :syncUrl="false" to disable.
 *
 * @component
 * @example
 * <FzPagination :totalPages="10" v-model:currentPage="page" />
 * @example
 * <FzPagination :totalPages="10" v-model:currentPage="page" :syncUrl="false" />
 * @example
 * <FzPagination :totalPages="10" v-model:currentPage="page" urlKey="p" />
 */
import { FzContainer } from '@fiscozen/container'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { useMediaQuery, useQueryString } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { computed } from 'vue'
import { usePagination } from './usePagination'
import type { PaginationItem, FzPaginationProps } from './types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Single source of truth for prev/next so the template stays free of ternaries. */
const NAV_ICON_MAP: Record<string, { name: string; position: 'before' | 'after'; ariaLabel: string }> = {
  prev: { name: 'chevron-left', position: 'before', ariaLabel: 'Pagina precedente' },
  next: { name: 'chevron-right', position: 'after', ariaLabel: 'Pagina successiva' }
}

const POSITION_CLASS_MAP: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end'
}

// ---------------------------------------------------------------------------
// Props & Emits
// ---------------------------------------------------------------------------

const props = withDefaults(defineProps<FzPaginationProps>(), {
  currentPage: 0,
  environment: 'frontoffice',
  options: () => ({}),
  position: 'end',
  urlKey: 'page',
  syncUrl: true,
  totalPages: 0
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------

const isDesktop = useMediaQuery(`(min-width: ${breakpoints.sm})`)

const { items: paginationItems } = usePagination(
  () => props.currentPage,
  () => props.totalPages,
  props.options
)

// URL sync: reads the initial page from the URL and writes back on changes.
// When syncUrl is true, useQueryString auto-injects the route from the provider
// (or falls back to router-agnostic mode if no provider exists).
// When syncUrl is false, null forces router-agnostic mode with no overhead.
const queryStringSync = props.syncUrl
  ? useQueryString(
      [{ key: props.urlKey, transform: 'number', defaultValue: props.currentPage }],
    )
  : null

if (queryStringSync) {
  const initialPage = queryStringSync.initialValuesInQueryString[props.urlKey]
  if (initialPage !== undefined && initialPage !== null && initialPage !== props.currentPage) {
    emit('update:currentPage', initialPage as number)
  }
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const justifyClass = computed(() => POSITION_CLASS_MAP[props.position] ?? 'justify-end')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const paginationIcon = (item: PaginationItem) => NAV_ICON_MAP[item.type]?.name

const paginationIconPosition = (item: PaginationItem) => NAV_ICON_MAP[item.type]?.position

const isDisabled = (item: PaginationItem) => item.disabled || item.type === 'ellipsis'

/** Mobile prev/next renders as icon-only FzIconButton instead of FzButton with label. */
const isMobileNav = (item: PaginationItem) =>
  !isDesktop.value && (item.type === 'prev' || item.type === 'next')

/** `fz-pagination-disable-truncate` triggers a scoped :deep() CSS override on FzButton's internal .truncate. */
const buttonClasses = (item: PaginationItem) => ({
  '!min-w-44': true,
  'flex-1': isMobileNav(item),
  'justify-start': isMobileNav(item) && item.type === 'prev',
  'flex': isMobileNav(item) && item.type === 'next',
  'justify-end': isMobileNav(item) && item.type === 'next',
  'fz-pagination-disable-truncate': item.current
})

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

const handlePageClick = (page: number) => {
  emit('update:currentPage', page)
  if (queryStringSync) {
    queryStringSync.setValuesInQueryString({ [props.urlKey]: page })
  }
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
      <span v-if="item.type === 'ellipsis'" class="flex min-w-44 items-center justify-center">
        <FzIcon v-color:grey name="ellipsis" size="md" aria-hidden="true" />
      </span>
      <span
        v-else-if="!isDesktop && (item.type === 'prev' || item.type === 'next')"
        :class="buttonClasses(item)"
      >
        <FzIconButton
          :ariaLabel="NAV_ICON_MAP[item.type]?.ariaLabel"
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
