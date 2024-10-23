<template>
    <div class="fz-layout w-dvw h-dvh grid" :class="layoutClass">
        <template v-if="props.layout === 'twoColumns'">
            <!--div><slot name="fz-col-left"></slot></div>
            <div><slot name="fz-col-right"></slot></div-->
            <slot></slot>
        </template>
        <template v-if="props.layout === 'multipleRows'">
            <slot></slot>
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
            res = 'grid-cols-2'
            break;
        default:
            break;
    }
    return res;
});

</script>

<style scoped>
</style>
