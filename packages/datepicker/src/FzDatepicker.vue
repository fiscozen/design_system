<template>
  <VueDatePicker
    class="fz-dialog"
    ref="dp"
    v-bind="props"
    :ui="{ menu: calendarClassName }"
    @date-update="handleDateUpdate"
    @update:model-value="
      (e) =>
        $emit(
          'update:model-value',
          props.valueFormat ? format(e, props.valueFormat) : e,
        )
    "
    @flow-step="handleFlowStep"
    :model-value="modelValue"
  >
    <template #dp-input="{ value, onInput, onEnter, onPaste, closeMenu }">
      <FzInput
        @update:modelValue="(e: string) => onInput(e)"
        @keyup.enter="onEnter"
        @paste="(e: ClipboardEvent) => handlePaste(onPaste, closeMenu, e, value)"
        v-bind="safeInputProps"
        :modelValue="value"
      >
      </FzInput>
    </template>
    <template #arrow-left>
      <FzIconButton
        iconName="angle-left"
        size="md"
        variant="secondary"
      ></FzIconButton>
    </template>
    <template #arrow-right>
      <FzIconButton
        iconName="angle-right"
        size="md"
        variant="secondary"
      ></FzIconButton>
    </template>
    <template #tp-inline-arrow-down>
      <FzIconButton
        iconName="angle-down"
        size="sm"
        variant="secondary"
      ></FzIconButton>
    </template>
    <template #tp-inline-arrow-up>
      <FzIconButton
        iconName="angle-up"
        size="sm"
        variant="secondary"
      ></FzIconButton>
    </template>
    <template #action-buttons>
      <FzButton size="xs" variant="invisible" @click="closeMenu"
        >Cancella</FzButton
      >
      <FzButton size="xs" @click="selectDate" class="ml-4">Seleziona</FzButton>
    </template>
  </VueDatePicker>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { FzDatepickerProps } from "./types";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useBreakpoints } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzIconButton, FzButton } from "@fiscozen/button";
import { FzInput, FzInputProps } from "@fiscozen/input";
import { it } from "date-fns/locale";
import { format, parse } from "date-fns";
import "@vuepic/vue-datepicker/dist/main.css";

const props = withDefaults(defineProps<FzDatepickerProps>(), {
  autoApply: true,
  format: "dd/MM/yyyy",
  formatLocale: () => it,
  state: undefined,
  autoPosition: true,
});

const dp = ref();

const selectDate = () => {
  dp.value.selectDate();
};

const closeMenu = () => {
  dp.value.closeMenu();
};

const handleDateUpdate = (e: string | Date) => {
  let res = e;
  if (props.valueFormat) {
    res = format(e, props.valueFormat);
  } else if (props.modelType === "iso" && e instanceof Date) {
    res = e.toISOString();
  } else if ((typeof e === "string") && (typeof props.format === "string")) {
    res = parse(e, props.format, new Date());
    if (props.modelType === "iso") {
      res = res.toISOString()
    }
    // TODO handle custom props.format functions
  }
  emit("update:model-value", res);
};

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

const safeInputProps = computed<FzInputProps>(() => {
  return {
    leftIcon: "calendar-lines",
    name: props.name,
    ...props.inputProps,
    readonly: !props.textInput,
  };
});

const handleFlowStep = (step: number) => {
  if (props.flow?.length === step) {
    dp.value.closeMenu();
  }
};

const handlePaste = (
  onPaste: (e: ClipboardEvent) => any,
  closeMenu: () => void,
  e: ClipboardEvent,
  value: string,
) => {
  e.stopPropagation();
  e.preventDefault();
  const rawPastedText = e.clipboardData?.getData("text/plain");
  //@ts-ignore
  handleDateUpdate(rawPastedText);
  nextTick(() => {
    closeMenu();
  });
};
</script>

<style>
:root {
  --dp-menu-min-width: 320px;
  --dp-font-family: var(--font-sans-inter, "Inter", sans-serif);
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
.dp__menu {
  border: none;
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.06),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1);
}

.dp__range_start,
.dp__range_end,
.dp__range_between,
.dp__date_hover_start:hover,
.dp__date_hover_end:hover {
  @apply rounded;
}

.dp__today {
  @apply border-2 border-blue-500;
}

.dp__cell_auto_range,
.dp__cell_auto_range_start,
.dp__cell_auto_range_end {
  @apply border-2 border-dashed border-blue-400 rounded;
}

.dp__cell_inner:hover {
  transition: none;
}

.dp__range_between {
  @apply border-none;
}

.is-mobile .dp__flex_display {
  @apply flex-col;
}

.dp__overlay_container {
  @apply h-full;
}

.dp__overlay {
  @apply !w-[320px];
}

.dp__time_col {
  @apply flex-row;
}

.dp__instance_calendar {
  @apply p-8;
}

.dp__time_display_inline {
  @apply mx-8;
}

.dp--header-wrap,
.dp--header-wrap button {
  @apply h-32;
}

.dp__month_year_wrap .dp__inner_nav:hover {
  @apply text-core-white;
}

.dp__month_year_wrap {
  @apply h-32;
}

.dp__calendar_header_separator,
.dp__arrow_top {
  @apply hidden;
}

.dp__calendar_item {
  @apply flex justify-center;
}

.dp--menu--inner-stretched {
  @apply p-0;
}

.dp__menu:focus {
  border: none;
}

.dp__inner_nav {
  width: unset;
}

button.dp__overlay_action.dp__button_bottom {
  @apply hidden;
}

.dp__cell_offset.dp__active_date {
  @apply text-core-white;
}

.dp__action_row {
  @apply justify-between;
}
</style>
