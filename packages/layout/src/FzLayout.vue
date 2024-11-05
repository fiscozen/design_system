<template>
    <div class="fz-layout w-dvw h-dvh grid gap-10 p-16" :class="layoutClass">
        <template v-if="props.layout === 'twoColumns'">
            <!--div><slot name="fz-col-left"></slot></div>
            <div><slot name="fz-col-right"></slot></div-->
            <slot></slot>
        </template>
        <template v-if="props.layout === 'multipleRows'">
            <slot></slot>
        </template>
        <template v-if="props.layout === 'leftShoulder'">
            <div class="col-span-2">
                <slot name="navbar"></slot>
            </div>
            <div class="col-span-2">
                <slot name="header"></slot>
            </div>
            <div class="col-span-2 lg:col-span-1">
                <slot name="left-shoulder"></slot>
            </div>
            <div class="col-span-2 lg:col-span-1">
                <slot></slot>
            </div>
        </template>
        <template v-if="props.layout === 'rightShoulder'">
            <div class="col-span-2">
                <slot name="navbar"></slot>
            </div>
            <div class="col-span-2">
                <slot name="header"></slot>
            </div>
            <div class="col-span-2 lg:col-span-1">
                <slot></slot>
            </div>
            <div class="col-span-2 lg:col-span-1">
                <slot name="right-shoulder"></slot>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzLayoutProps } from './types'

const props = withDefaults(defineProps<FzLayoutProps>(), {})

const emit = defineEmits([])

const layoutClass = computed(() => {
    let res = '';
    switch (props.layout) {
        case 'multipleRows':
            res = 'grid-rows-auto'
            break;
        case 'twoColumns':
            res = 'grid-cols-1 grid-rows-[60px_1fr] md:grid-rows-1 md:grid-cols-2'
            break;
        case 'leftShoulder':
            res = 'grid-rows-[40px_160px_60px_1fr] grid-cols-1 lg:grid-rows-[40px_160px_1fr] lg:grid-cols-[260px_1fr]'
            break;
        case 'rightShoulder':
            res = 'grid-rows-[40px_160px_60px_1fr] grid-cols-1 lg:grid-rows-[40px_160px_1fr] lg:grid-cols-[1fr_260px]'
            break;
        default:
            break;
    }
    return res;
});

</script>

<style scoped>
</style>
