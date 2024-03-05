<script setup lang="ts" generic="T = void">
import { RouteLocation } from 'vue-router';
import FzSimpleBreadcrumbs from './FzSimpleBreadcrumbs.vue'
import { Breadcrumb, CustomRouteLocation } from './types';


const props = withDefaults(defineProps<{
    /* 
    * List of breadcrumbs
    */
    breadcrumbs: Breadcrumb<CustomRouteLocation>[];
    /*
    * Breadcrumb separator symbol
    */
    separator?: string;
}>(), {
    separator: '/'
})

</script>

<template>
    <div class="fz__breadcrumbs">
        <fz-simple-breadcrumbs :breadcrumbs="breadcrumbs" :separator="separator">
            <template #bread-label="{bread, isActive}">
                <router-link 
                    :to="bread.metadata.path"
                    class="text-blue-500"
                    :class="{'text-grey-500': isActive}">{{ bread.metadata.name }}</router-link>
            </template>
            <template><slot name="bread-separator"></slot></template>
        </fz-simple-breadcrumbs>
    </div>
</template>