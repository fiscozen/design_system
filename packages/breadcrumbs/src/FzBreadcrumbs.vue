<script setup lang="ts" generic="T">
import { computed } from 'vue'
import type { FzBreadcrumbsProps, DisplayItem } from './types'

const props = withDefaults(defineProps<FzBreadcrumbsProps<T>>(), {
  separator: '/',
  ariaLabel: 'Breadcrumb',
  environment: 'frontoffice'
})

const displayedItems = computed<DisplayItem<T>[]>(() => {
  const { breadcrumbs, environment } = props
  if (environment === 'frontoffice' && breadcrumbs.length > 3) {
    return [
      { kind: 'breadcrumb', item: breadcrumbs[0], isActive: false },
      { kind: 'ellipsis' },
      { kind: 'breadcrumb', item: breadcrumbs[breadcrumbs.length - 2], isActive: false },
      { kind: 'breadcrumb', item: breadcrumbs[breadcrumbs.length - 1], isActive: true }
    ]
  }
  return breadcrumbs.map((item, index) => ({
    kind: 'breadcrumb' as const,
    item,
    isActive: index === breadcrumbs.length - 1
  }))
})
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" class="fz-breadcrumbs text-sm" :aria-label="ariaLabel">
    <ol class="m-0 flex list-none gap-1 p-0">
      <li
        v-for="(displayItem, index) in displayedItems"
        :key="displayItem.kind === 'ellipsis' ? '__ellipsis__' : displayItem.item.id"
        class="flex items-center gap-1"
      >
        <template v-if="displayItem.kind === 'ellipsis'">
          <span class="text-blue-500">...</span>
        </template>
        <template v-else>
          <slot name="bread-label" :bread="displayItem.item" :isActive="displayItem.isActive">
            <div
              class="text-blue-500"
              :class="{ 'text-grey-500': displayItem.isActive }"
              :aria-current="displayItem.isActive ? 'page' : undefined"
            >
              {{ displayItem.item.label }}
            </div>
          </slot>
        </template>
        <span v-if="index < displayedItems.length - 1" aria-hidden="true">
          <slot name="bread-separator">
            <span class="text-grey-300">{{ separator }}</span>
          </slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
