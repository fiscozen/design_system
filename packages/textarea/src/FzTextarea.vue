<script setup lang="ts">
/**
 * FzTextarea Component
 *
 * Multi-line text input with label, validation states, and resize control.
 * Error messages use FzAlert (tone="error", variant="text") for consistency
 * with FzInput. Supports combined states (error+disabled, required+help).
 * WCAG 2.1 AA compliant with custom focus ring and full ARIA support.
 *
 * Uses inheritAttrs: false so that all extra attributes and native event
 * listeners (blur, focus, paste, keydown, etc.) are forwarded directly
 * to the native textarea element via v-bind="$attrs", not the root div.
 *
 * Two variants:
 * - `default` draws the field itself (border, background, padding, 77px minimum height);
 * - `bare` draws no box at all and sets no font size, so the container around it is
 *   the visible field and owns the type — the shape a single-line composer bar needs.
 *   It keeps a visible focus indicator (a focus-visible outline replaces the default
 *   variant's border-colour cue) and starts on one row, growing with `autoHeight` up
 *   to `maxRows`. Inside an already-padded box that outline lands within the box, so
 *   `focusAffordance="container"` hands the indicator to the caller — which must then
 *   draw one, or the field fails WCAG 2.4.7.
 *
 * @component
 * @example
 * <FzTextarea label="Description" v-model="text" @blur="onBlur" />
 * @example
 * <!-- composer bar: the caller draws the box and sets the type, the field
 *      only carries the text -->
 * <div class="flex items-end rounded bg-grey-100 px-10 py-8 text-sm">
 *   <FzTextarea v-model="draft" variant="bare" auto-height :max-rows="6" aria-label="Message" />
 * </div>
 */
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { FzTextareaProps } from './types'
import { FzAlert } from '@fiscozen/alert'
import { FzIcon } from '@fiscozen/icons'
import { generateTextareaId } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FzTextareaProps>(), {
  variant: 'default'
})

const isBare = computed(() => props.variant === 'bare')

/**
 * `resize` and `rows` have variant-dependent defaults, so they are resolved here
 * instead of in `withDefaults`: the bare field lives inside a box drawn by the
 * caller, where a resize grabber is out of place and the natural starting height
 * is a single line.
 */
const effectiveResize = computed(() => props.resize ?? (isBare.value ? 'none' : 'all'))

const effectiveRows = computed(() => props.rows ?? (isBare.value ? 1 : 2))

watch(
  () => props.size,
  (size) => {
    if (size !== undefined) {
      console.warn(
        `[FzTextarea] The "size" prop is deprecated and will be removed in the next major version. The textarea always uses text-base (16px).`
      )
    }
  },
  { immediate: true }
)

watch(
  () => props.maxRows,
  (maxRows) => {
    if (maxRows !== undefined && !props.autoHeight) {
      console.warn(`[FzTextarea] "maxRows" has no effect without "autoHeight" enabled.`)
    }
  },
  { immediate: true }
)

/**
 * `focusAffordance` is deliberately absent from `withDefaults`: leaving it
 * `undefined` when unset is what lets a value set on the wrong variant be told
 * apart from no value at all. `undefined` and `'field'` behave identically.
 */
watch(
  () => props.focusAffordance,
  (focusAffordance) => {
    if (focusAffordance !== undefined && !isBare.value) {
      console.warn(
        `[FzTextarea] "focusAffordance" only applies to variant="bare". The default variant draws its focus cue on its own border.`
      )
    }
  },
  { immediate: true }
)

watch(
  () => props.autoHeight,
  (autoHeight) => {
    if (autoHeight && (effectiveResize.value === 'all' || effectiveResize.value === 'vertical')) {
      console.warn(
        `[FzTextarea] Vertical resize is disabled when "autoHeight" is enabled. Only horizontal resize is preserved.`
      )
    }
  },
  { immediate: true }
)

defineSlots<{
  errorMessage?: () => unknown
  helpText?: () => unknown
}>()

const runtimeSlots = useSlots()

const model = defineModel<string>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const uniqueId = generateTextareaId()

/**
 * Falls back to auto-generated ID when no explicit id prop is provided,
 * ensuring label-textarea association always works via for/id binding.
 */
const effectiveId = computed(() => props.id || uniqueId)

/**
 * Links textarea to its error or help message for screen readers.
 * Mirrors the template v-if/v-else-if chain: error+errorMessage slot → error id,
 * otherwise helpText slot → help id. This ensures help text is always linked
 * even when error is true but no errorMessage slot is provided.
 */
const ariaDescribedBy = computed(() => {
  if (props.error && runtimeSlots.errorMessage) {
    return `${effectiveId.value}-error`
  }
  if (runtimeSlots.helpText) {
    return `${effectiveId.value}-help`
  }
  return undefined
})

/**
 * References label ID for aria-labelledby when default label is rendered,
 * providing stronger screen reader association alongside for/id binding.
 */
const ariaLabelledBy = computed(() => (props.label ? `${effectiveId.value}-label` : undefined))

const isReadonlyOrDisabled = computed(() => !!props.disabled || !!props.readonly)

const containerClasses = computed(() => [
  'fz-textarea flex flex-col gap-8 items-start w-full',
  {
    'cursor-not-allowed': isReadonlyOrDisabled.value
  }
])

defineExpose({ textareaRef })

// --- Auto-height ---

let cachedLineHeight = 0
let cachedPaddingY = 0
let cachedBorderY = 0
let resizeObserver: ResizeObserver | null = null

/**
 * Reads font metrics once from the DOM. These values are stable because
 * font-size (text-base), padding and border are fixed per variant — p-10 and
 * border-1 in the default variant, both zero in the bare one, where the
 * measurement still holds: padding and border simply contribute 0 to the
 * maxRows ceiling.
 */
function measureMetrics() {
  const el = textareaRef.value
  if (!el) return
  const styles = getComputedStyle(el)
  const lineHeight = parseFloat(styles.lineHeight)
  /**
   * `line-height: normal` computes to the keyword, not to a pixel value, which
   * would leave the maxRows ceiling unset. It cannot happen with the fixed
   * text-base of the default variant, but the bare one inherits its type from
   * the container, so the browser's own ~1.2 ratio is the fallback.
   */
  cachedLineHeight = Number.isFinite(lineHeight) ? lineHeight : parseFloat(styles.fontSize) * 1.2
  cachedPaddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
  cachedBorderY = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
}

/**
 * Resets height to auto (falling back to `rows`-based height), reads the
 * natural scrollHeight, and applies the constrained height.
 * scrollHeight includes padding but not border; with border-box we add borderY.
 */
function adjustHeight() {
  const el = textareaRef.value
  if (!el) return

  el.style.height = 'auto'

  let targetHeight = el.scrollHeight

  if (props.maxRows && cachedLineHeight > 0) {
    const maxHeight = props.maxRows * cachedLineHeight + cachedPaddingY
    if (targetHeight > maxHeight) {
      targetHeight = maxHeight
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }
  } else {
    el.style.overflowY = 'hidden'
  }

  el.style.height = `${targetHeight + cachedBorderY}px`
}

if (props.autoHeight) {
  watch(model, () => nextTick(adjustHeight), { flush: 'post' })

  onMounted(() => {
    measureMetrics()
    adjustHeight()
    if (textareaRef.value) {
      resizeObserver = new ResizeObserver(() => adjustHeight())
      resizeObserver.observe(textareaRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })
}

const labelClasses = computed(() => [
  'font-normal text-base mb-0',
  props.disabled || props.readonly ? 'text-grey-300' : 'text-grey-500'
])

const mapResizeToClass = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  all: 'resize'
} as const

/**
 * When autoHeight is active, vertical resize is disabled.
 * Horizontal resize is preserved if originally requested.
 */
const autoHeightResizeMap = {
  none: 'resize-none',
  vertical: 'resize-none',
  horizontal: 'resize-x',
  all: 'resize-x'
} as const

/**
 * Generates textarea state-specific classes following the same priority order
 * as FzInput: error > disabled/readonly > default.
 * Readonly and disabled share identical visual styling.
 */
const evaluateStateClasses = () => {
  switch (true) {
    case !!props.error:
      return 'border-semantic-error-200 focus:border-semantic-error-300 bg-core-white text-core-black cursor-text'

    case isReadonlyOrDisabled.value:
      return 'bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed'

    default:
      return 'border-grey-300 focus:border-blue-600 bg-core-white text-core-black cursor-text'
  }
}

/**
 * The bare variant has no box to recolour, so only the text colour reacts to
 * state. `error` keeps driving `aria-invalid` and the errorMessage slot; the
 * visual error affordance belongs to the container the caller draws.
 */
const evaluateBareStateClasses = () => {
  switch (true) {
    case isReadonlyOrDisabled.value:
      return 'text-grey-300 cursor-not-allowed'

    default:
      return 'text-core-black cursor-text'
  }
}

/**
 * Base chrome of the field. The bare variant switches every box-drawing
 * declaration off — including the browser's own border, padding and background,
 * which would otherwise show through. The focus indicator is not part of this
 * string for the bare variant: which element carries it is the caller's choice,
 * resolved in `bareFocusClasses` below.
 *
 * It also sets no font size, so type is inherited from the container the same
 * way the box is: Tailwind's preflight gives a textarea `font-size: 100%` and
 * `line-height: inherit`, so a `text-sm` on the box carries the field and
 * anything else in it (a character counter, say) on one scale. The default
 * variant keeps its fixed `text-base`.
 */
const baseClasses =
  'border-1 rounded p-10 placeholder:text-grey-300 block w-full outline-none focus:ring-0 focus:outline-none text-base min-w-[96px] min-h-[77px]'

const bareClasses = 'border-0 p-0 bg-transparent placeholder:text-grey-300 block w-full min-w-0'

/**
 * The focus indicator of the bare variant — and the one declaration a caller
 * cannot make from the outside without `!important`.
 *
 * `'field'` (the default) draws a focus-visible outline on the textarea itself,
 * standing in for the border-colour cue the default variant uses. Removing it
 * with nothing in its place would be a WCAG 2.4.7 failure.
 *
 * `'container'` does not merely *omit* that outline: the browser's own
 * `:focus-visible` ring would take its place, so it has to be suppressed as
 * actively as the default variant suppresses it. The caller is then obliged to
 * draw the indicator on the box it owns. That obligation is documented on the
 * prop; the component has no way to check it was honoured, which is why the
 * default stays on `'field'`.
 */
const bareFocusClasses = computed(() =>
  props.focusAffordance === 'container'
    ? 'outline-none focus:ring-0 focus:outline-none'
    : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:rounded'
)

const classes = computed(() => [
  isBare.value ? bareClasses : baseClasses,
  isBare.value ? bareFocusClasses.value : '',
  isBare.value ? evaluateBareStateClasses() : evaluateStateClasses(),
  props.autoHeight
    ? autoHeightResizeMap[effectiveResize.value]
    : mapResizeToClass[effectiveResize.value],
  {
    'pr-[38px]': props.valid
  }
])

const helpClasses = computed(() => [
  'font-normal text-base',
  props.disabled || props.readonly ? 'text-grey-300' : 'text-grey-500'
])
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :id="`${effectiveId}-label`" :class="labelClasses" :for="effectiveId"
      >{{ label }}{{ required ? ' *' : '' }}</label
    >
    <div class="relative w-full">
      <textarea
        ref="textareaRef"
        :id="effectiveId"
        :name
        :class="classes"
        :placeholder
        :disabled
        :required
        :rows="effectiveRows"
        :cols
        :minlength
        :maxlength
        :readonly
        :aria-required="required ? 'true' : 'false'"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-disabled="isReadonlyOrDisabled ? 'true' : 'false'"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="ariaDescribedBy"
        v-model="model"
        v-bind="$attrs"
      ></textarea>
      <FzIcon
        v-if="valid"
        name="check"
        size="sm"
        class="text-semantic-success absolute right-10 top-10"
        aria-hidden="true"
      />
    </div>
    <FzAlert
      v-if="error && $slots.errorMessage"
      :id="`${effectiveId}-error`"
      role="alert"
      tone="error"
      variant="text"
    >
      <slot name="errorMessage"></slot>
    </FzAlert>
    <span v-else-if="$slots.helpText" :id="`${effectiveId}-help`" :class="helpClasses">
      <slot name="helpText"></slot>
    </span>
  </div>
</template>
