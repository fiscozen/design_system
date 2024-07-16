<template>
  <VueDatePicker
    v-bind="props"
    :ui="{ menu: calendarClassName }"
    @update:model-value="(e) => $emit('update:model-value', e)"
    :model-value="modelValue"
  >
    <template #arrow-left>
        <FzIcon name="angle-left" size="md"></FzIcon>
    </template>
    <template #arrow-right>
        <FzIcon name="angle-right" size="md"></FzIcon>
    </template>
    <template #tp-inline-arrow-down>
      <FzIcon name="angle-down" size="sm"></FzIcon>
    </template>
    <template #tp-inline-arrow-up>
      <FzIcon name="angle-up" size="sm"></FzIcon>
    </template>
  </VueDatePicker>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzDatepickerProps } from "./types";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useBreakpoints } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzIcon } from "@fiscozen/icons";
import { it } from "date-fns/locale";
import "@vuepic/vue-datepicker/dist/main.css";

const props = withDefaults(defineProps<FzDatepickerProps>(), {
  autoApply: true,
  format: "dd/MM/yyyy",
  formatLocale: () => it,
});

const emit = defineEmits([
  "update:model-value",
  "update:model-timezone-value",
  "text-submit",
  "closed",
  "cleared",
  "open",
  "focus",
  "blur",
  "internal-model-change",
  "recalculate-position",
  "flow-step",
  "update-month-year",
  "invalid-select",
  "tooltip-open",
  "tooltip-close",
  "invalid-fixed-range",
  "time-picker-open",
  "time-picker-close",
  "am-pm-change",
  "range-start",
  "range-end",
  "date-update",
  "invalid-date",
  "overlay-toggle",
]);

const breakpointsMatch = useBreakpoints(breakpoints);
const isMobile = breakpointsMatch.isSmaller("sm");

const calendarClassName = computed(() => {
  const classString: string[] = [];

  if (isMobile.value) {
    classString.push("is-mobile");
  }

  return classString;
});
</script>

<style>
:root {
  --dp-menu-min-width: 320px;
}
.dp__theme_light {
  --dp-range-between-dates-background-color: var(--blue-100, #dee2ff);
  --dp-range-between-dates-text-color: var(--blue-600, #4858cc);
  --dp-primary-color: var(--blue-500, #5a6eff);
  --dp-primary-text-color: var(--core-white, #fff);
  --dp-hover-color: var(--blue-500, #5a6eff);
  --dp-hover-text-color: var(--core-white, #fff);
  --dp-secondary-color: var(--grey-400, #6e777e);
}
.dp__range_start {
  border-end-end-radius: 4px;
  border-start-end-radius: 4px;
}
.dp__range_end {
  border-end-start-radius: 4px;
  border-start-start-radius: 4px;
}
.dp__range_between {
  border-radius: 4px;
}
.dp__today {
  border: 2px solid var(--blue-500, #5a6eff);
}

.dp__cell_auto_range,
.dp__cell_auto_range_start,
.dp__cell_auto_range_end {
  border: 2px dashed var(--blue-400, #7b8bff);
  border-radius: 4px;
}

.is-mobile .dp__flex_display {
  flex-direction: column;
}

.dp__overlay {
  width: 320px !important;
}

.dp__time_col {
  flex-direction: row;
}

.dp__inc_dec_button_inline {
  border-radius: 4px;
  border: 1px solid var(--grey-200, #d1dde6);
  width: 24px;
  height: 24px;
  padding: 4.5px;
}

.dp__instance_calendar {
  padding: 8px;
}

.dp__time_display_inline {
  margin-left: 8px;
  margin-right: 8px;
}

.dp--header-wrap, .dp--header-wrap button{
    height: 32px;
}
.dp__month_year_wrap .dp__inner_nav {
    width: 32px;
    height: 32px;
    padding: 3.5px;
    border-radius: 4px;
    border: 1px solid var(--grey-200, #D1DDE6);
    box-shadow: 0px 0px 0px 0px #000;
}

.dp__month_year_wrap .dp__inner_nav:hover {
    color: var(--core-white, #FFF);
}

.dp__month_year_wrap {
    height: 32px;
}
</style>
