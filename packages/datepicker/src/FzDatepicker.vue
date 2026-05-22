<script setup lang="ts">
/**
 * FzDatepicker – Date/date-range picker built on VueDatePicker v12.
 *
 * Wraps `@vuepic/vue-datepicker` with Fiscozen-branded styling, FzInput
 * integration, and legacy v8-prop mapping. The calendar menu is teleported
 * to `<body>` by default so it renders correctly inside modals, dialogs,
 * and other overflow-hidden containers.
 *
 * Branded extension points provided to the wrapped picker:
 *  - Calendar/overlay navigation arrows: `arrow-left`, `arrow-right`,
 *    `arrow-up`, `arrow-down` (FzIcon, rendered inside VueDatePicker's own
 *    button — would nest two buttons + leak an unlabeled inner button if we
 *    used FzIconButton).
 *  - Inline time-picker chevrons: `tp-inline-arrow-up`,
 *    `tp-inline-arrow-down` (FzIcon, same rationale as above).
 *  - Time-picker mode toggles (overlay mode only): `clock-icon`,
 *    `calendar-icon` (FzIcon).
 *  - Confirm/cancel action row (visible only with `autoApply: false`):
 *    `action-buttons` (FzButton, inherits `inputProps.environment`).
 *
 * @component
 * @example
 * <FzDatepicker
 *   v-model="date"
 *   :inputProps="{ label: 'Data', placeholder: 'gg/mm/aaaa' }"
 * />
 */
import { computed, ref } from 'vue'
import { FzDatepickerProps } from './types'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { useBreakpoints } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { FzInput, FzInputProps } from '@fiscozen/input'
import { it } from 'date-fns/locale'
import { format } from 'date-fns'
import '@vuepic/vue-datepicker/dist/main.css'

const props = withDefaults(defineProps<FzDatepickerProps>(), {
  /** @default true */
  autoApply: true,
  /** @default 'dd/MM/yyyy' */
  format: 'dd/MM/yyyy',
  /** @default it (Italian locale from date-fns) */
  formatLocale: () => it,
  /** @default true */
  autoPosition: true,
  /** @default true – enables keyboard date entry */
  textInput: true,
  /** @default true */
  arrowNavigation: true,
  /** @default 'body' – teleports the calendar menu to body */
  teleport: 'body',
  clearable: false,
  clearAriaLabel: 'Cancella'
})

defineSlots<{
  errorMessage?: () => unknown
  helpText?: () => unknown
}>()

const dp = ref()

/**
 * Imperatively commits the current selection (same as clicking "Seleziona").
 * Useful from a parent via `ref`, e.g. for custom keyboard shortcuts.
 */
const selectDate = () => {
  dp.value.selectDate()
}

/**
 * Imperatively closes the calendar menu without committing the selection
 * (same as clicking "Cancella"). Useful from a parent via `ref`.
 */
const closeMenu = () => {
  dp.value.closeMenu()
}

const handleMenuClosed = () => {
  emit('closed')
}

/**
 * Re-emits VueDatePicker's `flow-step` event to consumers of FzDatepicker.
 * Intentionally a plain forward: an earlier `handleFlowStep` also force-closed
 * the menu on the last step, which broke the `autoApply: false` flow (the
 * "Seleziona" button was bypassed). With this no-op forward, menu close is
 * driven by VueDatePicker's own logic (auto-apply when enabled; otherwise
 * the user explicitly confirms).
 */
const forwardFlowStep = (step: number, ...rest: unknown[]) => {
  emit('flow-step', step, ...rest)
}

/**
 * Stable sub-objects for mappedProps – kept outside the computed so that
 * VueDatePicker receives the **same reference** across re-evaluations when
 * only unrelated props (e.g. modelValue) change.  This prevents v12's
 * internal `watch([placement, y])` / `shouldRender` toggle from firing
 * unnecessary DOM cycles that manifest as a visual flicker.
 */
const stableFormats = computed(() => {
  const fmt = props.format
  return fmt && !props.formats ? { input: fmt } : props.formats
})

/**
 * VueDatePicker v12 expects a `date-fns` Locale object. We accept also a
 * v8-style string for backward compatibility, but **any string is treated
 * as Italian** (fallback to `it`) — VueDatePicker won't load arbitrary
 * locales by name. Consumers who need a different language must pass the
 * Locale object directly.
 */
const stableLocale = computed(() => {
  const loc = props.locale ?? props.formatLocale
  return typeof loc === 'string' ? it : loc
})

const stableInputAttrs = computed(() => {
  const base = props.inputAttrs ?? {}
  const attrs: Record<string, unknown> = { ...base }
  if (props.state !== undefined && attrs.state === undefined) attrs.state = props.state
  if (props.name !== undefined && attrs.name === undefined) attrs.name = props.name
  return attrs
})

const stableTextInput = computed<
  boolean | Partial<import('@vuepic/vue-datepicker').TextInputConfig>
>(() => {
  if (!props.textInput) return false
  const fmt = typeof props.format === 'string' ? props.format : 'dd/MM/yyyy'
  return { format: fmt }
})

const stableFloating = computed(() => {
  const base = props.floating
  if (props.placement) {
    return { ...(base ?? {}), placement: props.placement }
  }
  return base
})

const stableTimeConfig = computed(() => {
  const timeKeys = [
    'enableTimePicker',
    'enableMinutes',
    'is24',
    'timePickerInline',
    'enableSeconds',
    'noHoursOverlay',
    'noMinutesOverlay',
    'noSecondsOverlay'
  ] as const

  const hasLegacy = timeKeys.some((k) => (props as any)[k] !== undefined)
  if (!hasLegacy) return props.timeConfig

  const cfg: Record<string, unknown> = { ...(props.timeConfig ?? {}) }
  for (const key of timeKeys) {
    const val = (props as any)[key]
    if (val !== undefined && cfg[key] === undefined) cfg[key] = val
  }
  return cfg
})

const stableFlow = computed(() => {
  const f = props.flow
  return Array.isArray(f) ? { steps: f } : f
})

/**
 * Italian aria-label defaults for screen readers. VueDatePicker exposes its
 * own `ariaLabels` prop with English defaults (`"Previous month"`, `"Open
 * time picker"`, ...). Since the component is Italian-localised by default
 * (date-fns `it` locale), we provide an Italian aria-label map and merge any
 * consumer-supplied `ariaLabels` on top (consumer wins per-key).
 *
 * To localise into a different language, pass a complete `ariaLabels` map.
 */
const TIME_UNIT_IT: Record<'hours' | 'minutes' | 'seconds', string> = {
  hours: 'ore',
  minutes: 'minuti',
  seconds: 'secondi'
}

const stableAriaLabels = computed(() => {
  const italianDefaults = {
    menu: 'Calendario',
    input: 'Selettore data',
    calendarIcon: 'Icona calendario',
    toggleOverlay: 'Apri o chiudi il pannello',
    openTimePicker: 'Apri selezione ora',
    closeTimePicker: 'Chiudi selezione ora',
    timePicker: 'Selezione ora',
    incrementValue: (t: 'hours' | 'minutes' | 'seconds') => `Incrementa ${TIME_UNIT_IT[t]}`,
    decrementValue: (t: 'hours' | 'minutes' | 'seconds') => `Decrementa ${TIME_UNIT_IT[t]}`,
    openTpOverlay: (t: 'hours' | 'minutes' | 'seconds') => `Apri elenco ${TIME_UNIT_IT[t]}`,
    amPmButton: 'Cambia AM/PM',
    openYearsOverlay: 'Apri elenco anni',
    openMonthsOverlay: 'Apri elenco mesi',
    nextMonth: 'Mese successivo',
    prevMonth: 'Mese precedente',
    nextYear: 'Anno successivo',
    prevYear: 'Anno precedente',
    clearInput: 'Cancella valore',
    day: (d: { value: Date }) => format(d.value, 'EEEE d MMMM yyyy', { locale: it }),
    // VueDatePicker passes the JS-native weekday number (0=Sunday … 6=Saturday).
    // Jan 7 2024 is a Sunday, so the offset reproduces the full week in order.
    weekDay: (d: number) => format(new Date(2024, 0, 7 + d), 'EEEE', { locale: it }),
    monthPicker: (isOverlay: boolean) => (isOverlay ? 'Elenco mesi' : 'Selettore mese'),
    yearPicker: (isOverlay: boolean) => (isOverlay ? 'Elenco anni' : 'Selettore anno'),
    timeOverlay: (t: 'hours' | 'minutes' | 'seconds') => `Elenco ${TIME_UNIT_IT[t]}`
  }
  return { ...italianDefaults, ...(props.ariaLabels ?? {}) }
})

/**
 * Compute the props to pass to VueDatePicker v12,
 * remapping legacy v8 props to their new v12 equivalents.
 *
 * Sub-objects are individually memoised (computed) so that VueDatePicker
 * only sees a new reference when the relevant inputs actually change.
 * Props already bound explicitly in the template (modelValue, textInput)
 * are excluded to avoid redundant merge work.
 */
const mappedProps = computed(() => {
  const p = { ...props } as Record<string, any>

  // ── Replace legacy scalars with stable sub-objects ────────
  delete p.format
  delete p.formatLocale
  p.formats = stableFormats.value
  p.locale = stableLocale.value

  delete p.autoPosition
  delete p.placement
  p.floating = stableFloating.value

  delete p.state
  delete p.name
  p.inputAttrs = stableInputAttrs.value

  const timeKeys = [
    'enableTimePicker',
    'enableMinutes',
    'is24',
    'timePickerInline',
    'enableSeconds',
    'noHoursOverlay',
    'noMinutesOverlay',
    'noSecondsOverlay'
  ]
  for (const key of timeKeys) delete p[key]
  p.timeConfig = stableTimeConfig.value

  p.flow = stableFlow.value

  // Italian aria-label defaults (consumer-supplied keys win — see `stableAriaLabels`).
  p.ariaLabels = stableAriaLabels.value

  // ── Normalize teleport: true/"" → "body", falsy → remove ─
  if (p.teleport === true || p.teleport === '') {
    p.teleport = 'body'
  } else if (!p.teleport) {
    delete p.teleport
  }

  // ── Remove custom props that VueDatePicker doesn't need ───
  delete p.inputProps
  delete p.valueFormat
  delete p.clearable
  delete p.clearAriaLabel

  // ── Remove props already bound explicitly in the template ─
  delete p.modelValue
  delete p.textInput

  return p
})

/**
 * VueDatePicker reads `floating.placement` once during setup (it passes a
 * plain value, not a ref, to `useFloating`). To make placement changes
 * reactive we force a remount via `:key` whenever the floating config changes.
 */
const floatingKey = computed(() => {
  const f = mappedProps.value.floating
  return f ? JSON.stringify(f) : 'default'
})

/**
 * Emits declared by FzDatepicker.
 *
 * Two categories live here:
 *
 *  1. **Owned emits** — directly emitted by this component:
 *     `update:model-value`, `text-input`, `closed`, `cleared` (deprecated),
 *     `fzdatepicker:clear`, `flow-step`.
 *
 *  2. **Pass-through emits** — declared here so that parents can listen with
 *     `@event-name` on `<FzDatepicker>` while Vue's attribute fallthrough
 *     forwards them from the inner `<VueDatePicker>` (we render it as the
 *     single root). These are NOT routed via this component's `emit()`, so
 *     `wrapper.emitted('name')` in isolated VTU tests will not capture them.
 *     To verify them, listen on the parent or assert through VueDatePicker.
 *     Includes: `text-submit`, `open`, `focus`, `blur`,
 *     `internal-model-change`, `update-month-year`, `invalid-select`,
 *     `tooltip-open/close`, `invalid-fixed-range`, `am-pm-change`,
 *     `range-start/end`, `invalid-date`, `overlay-toggle`.
 */
const emit = defineEmits<{
  'update:model-value': [value: unknown]
  'text-submit': [value: string]
  closed: []
  /** @deprecated Use `fzdatepicker:clear` instead. Will be removed in a future version. */
  cleared: [value: string]
  'fzdatepicker:clear': []
  open: []
  focus: []
  blur: []
  'internal-model-change': [...args: any[]]
  'flow-step': [step: number, ...rest: unknown[]]
  'update-month-year': [...args: any[]]
  'invalid-select': [...args: any[]]
  'tooltip-open': [...args: any[]]
  'tooltip-close': [...args: any[]]
  'invalid-fixed-range': [...args: any[]]
  'text-input': [value: string]
  'am-pm-change': [...args: any[]]
  'range-start': [...args: any[]]
  'range-end': [...args: any[]]
  'invalid-date': [...args: any[]]
  'overlay-toggle': [...args: any[]]
}>()

/**
 * Formats and emits the selected date value.
 * When `valueFormat` is set and the value is a Date, applies date-fns
 * formatting so consumers receive a string instead of a Date object.
 */
const handleModelValueUpdate = (e: any) => {
  emit(
    'update:model-value',
    props.valueFormat && e instanceof Date ? format(e, props.valueFormat) : e
  )
}

const breakpointsMatch = useBreakpoints(breakpoints)
const isMobile = breakpointsMatch.isSmaller('sm')

const calendarClassName = computed(() => (isMobile.value ? ['is-mobile'] : []))

/**
 * Composes the props passed to the inner <FzInput>. `clearable` /
 * `clearAriaLabel` flow through after the consumer's `inputProps` spread so
 * the dedicated DS-level props always win over an attempt to set them via
 * `inputProps`. The same holds for `readonly`/`disabled` which derive from
 * `textInput` + `disabled` and intentionally override user input.
 *
 * `name` precedence (kept for backward compatibility — see types.ts):
 *   inputProps.name > top-level `name` prop > inputAttrs.name
 */
const safeInputProps = computed<FzInputProps>(() => {
  const inputAttrsName = (props.inputAttrs as Record<string, unknown> | undefined)?.name as
    | string
    | undefined
  return {
    leftIcon: 'calendar-lines',
    name: props.name ?? inputAttrsName,
    ...props.inputProps,
    clearable: props.clearable,
    clearAriaLabel: props.clearAriaLabel,
    readonly: !props.textInput || props.disabled,
    disabled: !props.textInput || props.disabled
  }
})

const handlePaste = (
  onPaste: (() => void) | ((e: ClipboardEvent) => any),
  closeMenu: () => void,
  e: ClipboardEvent
) => {
  onPaste(e)
  closeMenu()
}

const handleInputModelUpdate = (
  onInput: (val: string) => void,
  onClear: () => void,
  value: string
) => {
  onInput(value)
  emit('text-input', value)
  if (!value) {
    onClear()
    emit('cleared', value)
  }
}
</script>

<template>
  <VueDatePicker
    class="fz-datepicker"
    ref="dp"
    :key="floatingKey"
    v-bind="mappedProps"
    :text-input="stableTextInput"
    :ui="{ menu: calendarClassName }"
    @update:model-value="handleModelValueUpdate"
    @closed="handleMenuClosed"
    @flow-step="forwardFlowStep"
    :model-value="modelValue"
  >
    <template
      #dp-input="{
        value,
        onBlur,
        onFocus,
        onInput,
        onEnter,
        onTab,
        onKeypress,
        onPaste,
        closeMenu,
        onClear
      }"
    >
      <FzInput
        @focus="onFocus"
        @blur="onBlur"
        @update:modelValue="
          (e: string | number | undefined) =>
            handleInputModelUpdate(onInput, onClear, String(e ?? ''))
        "
        @keyup.enter="onEnter"
        @keydown.tab="onTab"
        @keypress="onKeypress"
        @paste="(e: ClipboardEvent) => handlePaste(onPaste, closeMenu, e)"
        @fzinput:clear="emit('fzdatepicker:clear')"
        v-bind="safeInputProps"
        :modelValue="value"
      >
        <template v-if="$slots.errorMessage" #errorMessage>
          <slot name="errorMessage"></slot>
        </template>
        <template v-if="$slots.helpText" #helpText>
          <slot name="helpText"></slot>
        </template>
      </FzInput>
    </template>
    <template #arrow-left>
      <FzIcon name="angle-left" size="md" />
    </template>
    <template #arrow-right>
      <FzIcon name="angle-right" size="md" />
    </template>
    <template #arrow-up>
      <FzIcon name="angle-up" size="md" />
    </template>
    <template #arrow-down>
      <FzIcon name="angle-down" size="md" />
    </template>
    <!--
      Inline time-picker chevrons. Slots are active only when
      timePickerInline: true and are rendered INSIDE VueDatePicker's own
      <button>, so we use FzIcon (not FzIconButton) to avoid nested buttons.
    -->
    <template #tp-inline-arrow-up>
      <FzIcon name="angle-up" size="md" />
    </template>
    <template #tp-inline-arrow-down>
      <FzIcon name="angle-down" size="md" />
    </template>
    <template #clock-icon>
      <FzIcon name="clock" size="sm" />
    </template>
    <template #calendar-icon>
      <FzIcon name="calendar" size="sm" />
    </template>
    <template #action-buttons>
      <FzButton :environment="props.inputProps?.environment" variant="invisible" @click="closeMenu"
        >Cancella</FzButton
      >
      <FzButton :environment="props.inputProps?.environment" @click="selectDate" class="ml-4"
        >Seleziona</FzButton
      >
    </template>
    <template #clear-icon></template>
  </VueDatePicker>
</template>

<style>
/**
 * Global (unscoped) styles – required because VueDatePicker's calendar menu
 * is teleported to <body> by default.  Scoped styles would not reach the
 * teleported DOM, so all `.dp__*` overrides must be global.
 */

/* ── Design tokens: Fiscozen brand colours applied to VueDatePicker ── */
:root {
  --dp-menu-min-width: 320px;
  --dp-font-family: var(--font-sans-inter, 'Inter', sans-serif);
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
  @apply rounded border-2 border-dashed border-blue-400;
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

.dp__overlay {
  @apply w-full;
}

.dp__time_picker_inline_container {
  padding: var(--dp-menu-padding);
  padding-top: 0;

  .dp__time_col {
    @apply flex-row;
  }
}

.dp__time_display_inline {
  @apply mx-8;
  @apply w-[30px];
}

/* ── Inline time-picker increment/decrement buttons ──────────────
   * Style the chevron buttons (`tp-inline-arrow-up` / `-down`) to match
   * FzIconButton variant="secondary" size="sm". The slot content itself
   * (FzIcon) is rendered INSIDE this <button>; here we style the button.
   * Using `button.` prefix to win specificity against VueDatePicker's
   * default `.dp__inc_dec_button_inline { width:100%; height:8px; ... }`.
   */
button.dp__inc_dec_button_inline {
  @apply border-1 border-grey-200 bg-core-white rounded border-solid;
  @apply flex items-center justify-center;
  @apply hover:bg-grey-100;
  @apply focus:border-blue-600 focus:outline-none;
  width: 32px;
  height: 32px;
  padding: 0;
}

button.dp__inc_dec_button_inline.dp__inc_dec_button_disabled,
button.dp__inc_dec_button_inline.dp__inc_dec_button_disabled:hover {
  @apply bg-grey-100 border-grey-200 text-grey-200 cursor-not-allowed;
}

.dp--header-wrap,
.dp--header-wrap button {
  @apply h-32;
}

.dp__month_year_wrap {
  @apply h-32;
  @apply gap-[4px];
}

/* ── Calendar/overlay navigation arrow buttons ──────────────────
   * VueDatePicker renders `.dp__inner_nav` as the outer <button> for the
   * prev/next month/year arrows. Slot content (FzIcon) is rendered INSIDE
   * this button; we style the button itself to match
   * `<FzButton variant="secondary" environment="backoffice">` (32×32 boxed
   * look).
   *
   * IMPORTANT: This <style> block does NOT go through PostCSS/Tailwind at
   * package build time, so `@apply` / `theme()` are written as-is to the
   * published CSS. We use raw CSS with Fiscozen design-token CSS custom
   * properties (--grey-100, --grey-200, --core-white, --blue-600) which
   * are defined at runtime by @fiscozen/style and inherited globally.
   *
   * Strategy on hover: vue-datepicker's upstream rule is
   *   .dp__inner_nav:hover { background: var(--dp-hover-color);
   *                          color: var(--dp-hover-icon-color); }
   * We REDEFINE those CSS variables locally on the button so the upstream
   * rule naturally resolves to our grey values — no specificity fight.
   */
.dp__inner_nav {
  --dp-hover-color: var(--grey-100, #f1f1f1);
  --dp-hover-icon-color: var(--grey-500, #495057);

  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--grey-200, #ccc);
  border-radius: 4px;
  background-color: var(--core-white, #fff);
  color: var(--grey-500, #495057);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dp__inner_nav:focus {
  border-color: var(--blue-600, #4858cc);
  outline: none;
}

/* ── Hidden VueDatePicker elements not needed in Fiscozen design ── */
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

/* z-index override: ensures the teleported calendar floats above modals/dialogs */
.dp--menu-wrapper {
  z-index: unset;
  @apply z-70;
}

.dp__menu:focus {
  border: none;
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
  @apply absolute right-0 top-1/2 transform-none cursor-pointer;
}
</style>
