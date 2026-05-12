<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import FzBreadcrumbs from './FzBreadcrumbs.vue'
import type { Breadcrumb, CustomRouteLocation, FzRouterBreadcrumbsProps } from './types'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<FzRouterBreadcrumbsProps>(), {
  separator: '/',
  ariaLabel: 'Breadcrumb',
  environment: 'frontoffice'
})

const route = useRoute()

const breads: ComputedRef<Breadcrumb<CustomRouteLocation>[]> = computed(() => {
  if (props.breadcrumbs?.length) {
    return props.breadcrumbs
  }
  if (!route?.matched) {
    return []
  }

  return route.matched.map(
    (match) =>
      ({
        id: match.name?.toString() || match.path,
        label: match.name?.toString() || match.path,
        metadata: match
      }) satisfies Breadcrumb<CustomRouteLocation>
  )
})
</script>

<template>
  <FzBreadcrumbs
    :breadcrumbs="breads"
    :separator="separator"
    :ariaLabel="ariaLabel"
    :environment="environment"
  >
    <template #bread-label="{ bread, isActive }">
      <RouterLink v-if="!isActive" :to="bread.metadata" class="text-blue-500">{{
        bread.label
      }}</RouterLink>
      <span v-else class="text-grey-500" aria-current="page">{{ bread.label }}</span>
    </template>
  </FzBreadcrumbs>
</template>
