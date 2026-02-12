<template>
  <VueDatePicker
    class="fz-datepicker"
    ref="dp"
    :key="floatingKey"
    v-bind="mappedProps"
    text-input
    :ui="{ menu: calendarClassName }"
    @date-update="handleDateUpdate"
    @update:model-value="
      (e: any) =>
        $emit(
          'update:model-value',
          props.valueFormat && e instanceof Date
            ? format(e, props.valueFormat)
            : e
        )
    "
    @flow-step="handleFlowStep"
    :model-value="modelValue"
  >
    <template
      #dp-input="{ value, onBlur, onFocus, onInput, onEnter, onTab, onKeypress, onPaste, closeMenu, onClear }"
    >
      <FzInput
        @focus="onFocus"
        @blur="onBlur"
        @update:modelValue="(e: string | number | undefined) => handleInputModelUpdate(onInput, onClear, String(e ?? ''))"
        @keyup.enter="onEnter"
        @keydown.tab="onTab"
        @keypress="onKeypress"
        @paste="
          (e: ClipboardEvent) => handlePaste(onPaste, closeMenu, e, value)
        "
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
    <template #time-picker="{ time, updateTime }">
      <!-- Overlay grid for hours/minutes/seconds — positioned over calendar -->
      <div v-if="activeOverlay" class="fz-time-picker__overlay">
        <div class="fz-time-picker__overlay-header">
          <span class="fz-time-picker__overlay-title">
            {{ activeOverlay === 'hours' ? 'Ora' : activeOverlay === 'minutes' ? 'Minuti' : 'Secondi' }}
          </span>
        </div>
        <FzDivider margin="none" />
        <div class="fz-time-picker__overlay-grid">
          <button
            v-for="item in overlayItems"
            :key="item"
            :class="[
              'fz-time-picker__overlay-cell',
              { 'fz-time-picker__overlay-cell--selected': isOverlayItemSelected(time, item) }
            ]"
            @click="selectOverlayItem(time, updateTime, item)"
          >
            {{ String(item).padStart(2, '0') }}
          </button>
        </div>
      </div>
      <div v-else class="fz-time-picker">
        <FzDivider margin="none" />
        <!-- Time controls row -->
        <div class="fz-time-picker__row mt-8">
          <!-- Hours column -->
          <div class="fz-time-picker__col">
            <span class="fz-time-picker__label">Ora</span>
            <div class="fz-time-picker__controls">
              <FzIconButton
                iconName="angle-up"
                size="sm"
                variant="secondary"
                ariaLabel="Increment hours"
                @click="handleTimeIncrement(time, updateTime, 'hours', 1)"
              />
              <FzButton
                variant="invisible"
                environment="backoffice"
                :label="formatTimeValue(time.hours)"
                containerClass="fz-time-picker__btn-label"
                overrideContainerClass
                class="fz-time-picker__display-btn"
                @click="openOverlay('hours')"
              />
              <FzIconButton
                iconName="angle-down"
                size="sm"
                variant="secondary"
                ariaLabel="Decrement hours"
                @click="handleTimeIncrement(time, updateTime, 'hours', -1)"
              />
            </div>
          </div>
          <!-- Separator -->
          <template v-if="showMinutes">
            <span class="fz-time-picker__separator">:</span>
            <!-- Minutes column -->
            <div class="fz-time-picker__col">
              <span class="fz-time-picker__label">Minuti</span>
              <div class="fz-time-picker__controls">
                <FzIconButton
                  iconName="angle-up"
                  size="sm"
                  variant="secondary"
                  ariaLabel="Increment minutes"
                  @click="handleTimeIncrement(time, updateTime, 'minutes', 1)"
                />
                <FzButton
                  variant="invisible"
                  environment="backoffice"
                  :label="formatTimeValue(time.minutes)"
                  containerClass="fz-time-picker__btn-label"
                  overrideContainerClass
                  class="fz-time-picker__display-btn"
                  @click="openOverlay('minutes')"
                />
                <FzIconButton
                  iconName="angle-down"
                  size="sm"
                  variant="secondary"
                  ariaLabel="Decrement minutes"
                  @click="handleTimeIncrement(time, updateTime, 'minutes', -1)"
                />
              </div>
            </div>
          </template>
          <!-- Seconds -->
          <template v-if="showSeconds">
            <span class="fz-time-picker__separator">:</span>
            <div class="fz-time-picker__col">
              <span class="fz-time-picker__label">Secondi</span>
              <div class="fz-time-picker__controls">
                <FzIconButton
                  iconName="angle-up"
                  size="sm"
                  variant="secondary"
                  ariaLabel="Increment seconds"
                  @click="handleTimeIncrement(time, updateTime, 'seconds', 1)"
                />
                <FzButton
                  variant="invisible"
                  environment="backoffice"
                  :label="formatTimeValue(time.seconds)"
                  containerClass="fz-time-picker__btn-label"
                  overrideContainerClass
                  class="fz-time-picker__display-btn"
                  @click="openOverlay('seconds')"
                />
                <FzIconButton
                  iconName="angle-down"
                  size="sm"
                  variant="secondary"
                  ariaLabel="Decrement seconds"
                  @click="handleTimeIncrement(time, updateTime, 'seconds', -1)"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template #action-buttons>
      <FzButton size="xs" variant="invisible" @click="closeMenu"
        >Cancella</FzButton
      >
      <FzButton size="xs" @click="selectDate" class="ml-4">Seleziona</FzButton>
    </template>
    <template #clear-icon></template>
  </VueDatePicker>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { FzDatepickerProps } from "./types";
import { VueDatePicker, type TimeInternalModel } from "@vuepic/vue-datepicker";
import { useBreakpoints } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzIconButton, FzButton } from "@fiscozen/button";
import { FzInput, FzInputProps } from "@fiscozen/input";
import { FzDivider } from "@fiscozen/divider";
import { it } from "date-fns/locale";
import { format, parse } from "date-fns";
import "@vuepic/vue-datepicker/dist/main.css";

const props = withDefaults(defineProps<FzDatepickerProps>(), {
  autoApply: true,
  format: "dd/MM/yyyy",
  formatLocale: () => it,
  state: undefined,
  autoPosition: true,
  textInput: true,
  arrowNavigation: true,
});

const dp = ref();

const selectDate = () => {
  dp.value.selectDate();
};

const closeMenu = () => {
  dp.value.closeMenu();
};

/**
 * Compute the props to pass to VueDatePicker v12,
 * remapping legacy v8 props to their new v12 equivalents.
 */
const mappedProps = computed(() => {
  // Start with a shallow copy so we can delete legacy keys
  const p = { ...props } as Record<string, any>;

  // ── format / formatLocale → formats / locale ──────────────
  // Map legacy `format` prop to `formats.input`
  const legacyFormat = p.format;
  const legacyFormatLocale = p.formatLocale;

  // Build `formats` from legacy `format` if no explicit `formats` was given
  if (legacyFormat && !p.formats) {
    p.formats = { input: legacyFormat };
  }
  delete p.format;

  // Map legacy `formatLocale` (date-fns Locale) → `locale`
  if (legacyFormatLocale && !p.locale) {
    p.locale = legacyFormatLocale;
  }
  delete p.formatLocale;

  // If locale is a string, we can't use it directly in v12
  // (v12 only accepts date-fns Locale objects)
  // Fall back to `it` if string was provided
  if (typeof p.locale === "string") {
    p.locale = it;
  }

  // ── autoPosition + placement → floating ──────────────────
  // In v12, autoPosition no longer exists. The floating prop
  // controls positioning via @floating-ui/vue.
  delete p.autoPosition;

  // Map our convenience `placement` prop into `floating.placement`
  const legacyPlacement = p.placement;
  if (legacyPlacement) {
    p.floating = { ...(p.floating ?? {}), placement: legacyPlacement };
  }
  delete p.placement;

  // ── state / name → inputAttrs ─────────────────────────────
  const legacyState = p.state;
  const legacyName = p.name;

  if ((legacyState !== undefined || legacyName !== undefined) && !p.inputAttrs) {
    p.inputAttrs = {};
  }
  if (legacyState !== undefined && p.inputAttrs && p.inputAttrs.state === undefined) {
    p.inputAttrs.state = legacyState;
  }
  if (legacyName !== undefined && p.inputAttrs && p.inputAttrs.name === undefined) {
    p.inputAttrs.name = legacyName;
  }
  delete p.state;
  delete p.name;

  // ── time-related props → timeConfig ───────────────────────
  const timeKeys = [
    "enableTimePicker",
    "enableMinutes",
    "is24",
    "timePickerInline",
    "enableSeconds",
    "noHoursOverlay",
    "noMinutesOverlay",
    "noSecondsOverlay",
  ] as const;

  const hasLegacyTimeProps = timeKeys.some((k) => p[k] !== undefined);

  if (hasLegacyTimeProps && !p.timeConfig) {
    p.timeConfig = {};
  }

  for (const key of timeKeys) {
    if (p[key] !== undefined) {
      if (p.timeConfig && (p.timeConfig as any)[key] === undefined) {
        (p.timeConfig as any)[key] = p[key];
      }
      delete p[key];
    }
  }

  // ── flow: array → { steps } ───────────────────────────────
  if (Array.isArray(p.flow)) {
    p.flow = { steps: p.flow };
  }

  // ── Remove our custom props that VueDatePicker doesn't need
  delete p.inputProps;
  delete p.valueFormat;

  return p;
});

/**
 * VueDatePicker reads `floating.placement` once during setup (it passes a
 * plain value, not a ref, to `useFloating`). To make placement changes
 * reactive we force a remount via `:key` whenever the floating config changes.
 */
const floatingKey = computed(() => {
  const f = mappedProps.value.floating;
  return f ? JSON.stringify(f) : "default";
});

const handleDateUpdate = (e: string | Date) => {
  let res: string | Date = e;
  const formatStr = props.format;
  if (props.modelType === "iso" && e instanceof Date) {
    res = e.toISOString();
  } else if (typeof e === "string" && typeof formatStr === "string") {
    res = parse(e, formatStr, new Date());
    if (props.modelType === "iso") {
      res = res.toISOString();
    }
    // TODO handle custom props.format functions
  } else if (typeof props.modelType === "string") {
    res = format(e as Date, props.modelType);
  }
  emit("update:model-value", res);
};

const emit = defineEmits([
  "update:model-value",
  "text-submit",
  "closed",
  "cleared",
  "open",
  "focus",
  "blur",
  "internal-model-change",
  "flow-step",
  "update-month-year",
  "invalid-select",
  "tooltip-open",
  "tooltip-close",
  "invalid-fixed-range",
  "text-input",
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
    readonly: !props.textInput || props.disabled,
    disabled: !props.textInput || props.disabled,
  };
});

const handleFlowStep = (step: number) => {
  const flowProp = props.flow;
  const steps = Array.isArray(flowProp)
    ? flowProp
    : flowProp && typeof flowProp === "object" && "steps" in flowProp
      ? flowProp.steps
      : undefined;
  if (steps?.length === step) {
    dp.value.closeMenu();
  }
};

const handlePaste = (
  onPaste: (() => void) | ((e: ClipboardEvent) => any),
  closeMenu: () => void,
  e: ClipboardEvent,
  value: string
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

const handleInputModelUpdate = (
  onInput: (val: string) => void,
  onClear: () => void,
  value: string
) => {
  onInput(value);
  emit("text-input", value);
  if (!value) {
    onClear();
    emit("cleared", value);
  }
};

// ── Time-picker slot helpers ─────────────────────────────────

type OverlayField = keyof TimeInternalModel;

const activeOverlay = ref<OverlayField | null>(null);

const showMinutes = computed(() => {
  return props.enableMinutes ?? (props.timeConfig as Record<string, unknown> | undefined)?.enableMinutes ?? true;
});

const showSeconds = computed(() => {
  return props.enableSeconds ?? (props.timeConfig as Record<string, unknown> | undefined)?.enableSeconds ?? false;
});

const formatTimeValue = (val: number | number[]) => {
  const v = Array.isArray(val) ? val[0] : val;
  return String(v).padStart(2, "0");
};

const wrapTimeValue = (val: number, min: number, max: number) => {
  if (val > max) return min;
  if (val < min) return max;
  return val;
};

const handleTimeIncrement = (
  time: TimeInternalModel,
  updateTime: (time: TimeInternalModel) => void,
  field: keyof TimeInternalModel,
  delta: number
) => {
  const max = field === "hours" ? 23 : 59;
  const currentVal = time[field];

  if (Array.isArray(currentVal)) {
    const newArr = [...currentVal];
    newArr[0] = wrapTimeValue(newArr[0] + delta, 0, max);
    updateTime({ ...time, [field]: newArr });
  } else {
    updateTime({ ...time, [field]: wrapTimeValue(currentVal + delta, 0, max) });
  }
};

// ── Overlay helpers ──────────────────────────────────────────

const openOverlay = (field: OverlayField) => {
  activeOverlay.value = field;
};

const overlayItems = computed<number[]>(() => {
  if (!activeOverlay.value) return [];
  if (activeOverlay.value === "hours") {
    // 0–23
    return Array.from({ length: 24 }, (_, i) => i);
  }
  // minutes/seconds: 5-minute intervals (00, 05, 10, ... 55)
  return Array.from({ length: 12 }, (_, i) => i * 5);
});

const isOverlayItemSelected = (time: TimeInternalModel, value: number) => {
  const field = activeOverlay.value;
  if (!field) return false;
  const current = time[field];
  const currentVal = Array.isArray(current) ? current[0] : current;
  return currentVal === value;
};

const selectOverlayItem = (
  time: TimeInternalModel,
  updateTime: (time: TimeInternalModel) => void,
  value: number
) => {
  const field = activeOverlay.value;
  if (!field) return;
  const current = time[field];

  if (Array.isArray(current)) {
    const newArr = [...current];
    newArr[0] = value;
    updateTime({ ...time, [field]: newArr });
  } else {
    updateTime({ ...time, [field]: value });
  }
  activeOverlay.value = null;
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

.dp__time_display_inline {
  @apply mx-8;
}

.fz-time-picker {
  @apply flex flex-col items-center;
}

.fz-time-picker__row {
  @apply flex items-center justify-center gap-16 pb-16;
}

.fz-time-picker__col {
  @apply flex flex-col items-center gap-4;
}

.fz-time-picker__label {
  @apply text-sm font-medium text-core-black;
}

.fz-time-picker__controls {
  @apply flex items-center gap-4;
}

.fz-time-picker__display-btn {
  @apply !min-w-0 !px-8;
  width: 40px;
}

.fz-time-picker__btn-label {
  @apply text-base font-normal text-core-black text-center;
}

.fz-time-picker__separator {
  @apply text-base font-medium text-core-black self-end pb-8;
}

/* ── Overlay ─────────────────────────────── */

/* Make the menu inner a positioning context for the overlay */
.dp__menu_inner:has(.fz-time-picker__overlay) {
  @apply relative;
}

.fz-time-picker__overlay {
  @apply absolute inset-0 flex flex-col bg-core-white z-10 rounded;
}

.fz-time-picker__overlay-header {
  @apply flex justify-center py-8;
}

.fz-time-picker__overlay-title {
  @apply text-base font-semibold text-core-black;
}

.fz-time-picker__overlay-grid {
  @apply grid grid-cols-3 gap-4 p-8 overflow-y-auto;
}

.fz-time-picker__overlay-cell {
  @apply flex items-center justify-center rounded text-base font-normal text-core-black bg-core-white cursor-pointer;
  @apply hover:bg-blue-500 hover:text-core-white;
  padding: 8px;
}

.fz-time-picker__overlay-cell--selected {
  @apply bg-blue-500 text-core-white;
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
.dp--menu-wrapper {
  z-index: unset;
  @apply z-70;
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

.dp__clear_icon {
  @apply absolute right-0 top-1/2 cursor-pointer transform-none;
}
</style>
