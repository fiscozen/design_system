<template>
    <VueDatePicker v-model="props.modelValue" v-bind="props"></VueDatePicker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzDatepickerProps } from './types'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = withDefaults(defineProps<FzDatepickerProps>(), {})

const emit = defineEmits([
    'update:model-value',
    'update:model-timezone-value',
    'text-submit',
    'closed',
    'cleared',
    'open',
    'focus',
    'blur',
    'internal-model-change',
    'recalculate-position',
    'flow-step',
    'update-month-year',
    'invalid-select',
    'tooltip-open',
    'tooltip-close',
    'invalid-fixed-range',
    'time-picker-open',
    'time-picker-close',
    'am-pm-change',
    'range-start',
    'range-end',
    'date-update',
    'invalid-date',
    'overlay-toggle'
])
</script>

<style>
:root {
    --dp-menu-min-width: 320px;
}
.dp__today {
    border: 2px solid var(--blue-500, #5A6EFF);
}
</style>
<style scoped>
</style>
