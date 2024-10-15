<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import FzBreadcrumbs from './FzBreadcrumbs.vue'
import { Breadcrumb, CustomRouteLocation, FzRouterBreadcrumbsProps } from './types'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<FzRouterBreadcrumbsProps>(),
  {
    separator: '/'
  }
)

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
  <div class="fz__breadcrumbs">
    <fz-breadcrumbs :breadcrumbs="breads" :separator="separator">
      <template #bread-label="{ bread, isActive }">
        <router-link
          :to="bread.metadata"
          class="text-blue-500"
          :class="{ 'text-grey-500': isActive }"
          >{{ bread.label }}</router-link
        >
      </template>
      <template><slot name="bread-separator"></slot></template>
    </fz-breadcrumbs>
  </div>
</template>
