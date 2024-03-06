<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import FzSimpleBreadcrumbs from './FzSimpleBreadcrumbs.vue'
import { Breadcrumb, CustomRouteLocation } from './types';
import { useRoute } from 'vue-router';


const props = withDefaults(defineProps<{
    /** 
     * List of breadcrumbs. If you don't pass this prop the
     * component will generate automatic breadcrumbs based on
     * the route object
     */
    breadcrumbs?: Breadcrumb<CustomRouteLocation>[];
    /**
     * Breadcrumb separator symbol
     */
    separator?: string;
}>(), {
    separator: '/'
})

const route = useRoute()

const breads: ComputedRef<Breadcrumb<CustomRouteLocation>[]> = computed(() => {
    if (props.breadcrumbs && props.breadcrumbs.length) {
        return props.breadcrumbs;
    }
    if (!route || !route.matched) {
        return []
    }

    return route.matched.map((match) => ({
        id: match.name,
        label: match.name,
        metadata: match
    } as Breadcrumb<CustomRouteLocation>))
})

</script>

<template>
    <div class="fz__breadcrumbs">
        <fz-simple-breadcrumbs :breadcrumbs="breads" :separator="separator">
            <template #bread-label="{bread, isActive}">
                <router-link 
                    :to="bread.metadata.path"
                    class="text-blue-500"
                    :class="{'text-grey-500': isActive}">{{ bread.label }}</router-link>
            </template>
            <template><slot name="bread-separator"></slot></template>
        </fz-simple-breadcrumbs>
    </div>
</template>