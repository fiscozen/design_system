<script lang="ts" setup>
/**
 * FzTruncatedLabel - a field label kept on one line
 *
 * Cuts the label with an ellipsis when it is wider than the field, and shows it in
 * full in a tooltip on hover and while the labelled control has focus, so a keyboard
 * user can read it too. The `<label>` keeps the full text, so the control keeps it as
 * its accessible name. Inline-size containment keeps an uncut label from widening
 * the field: fields side by side share a row whatever their labels' length.
 *
 * Text styles (color, size, weight) go on the component: the label, the ellipsis and
 * the asterisk inherit them.
 *
 * @example
 * <FzTruncatedLabel
 *   class="text-base text-grey-500"
 *   label="Data di versamento dell’imposta sostitutiva"
 *   labelId="amount-label"
 *   controlId="amount"
 *   required
 * />
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

import FzTooltip from './FzTooltip.vue'
import type { FzTruncatedLabelProps } from './types'

const props = defineProps<FzTruncatedLabelProps>()

const isControlFocused = ref(false)

/**
 * Focus is tracked on the document: the control is a sibling the label does not own,
 * and the document sees its focus events whenever and wherever the control mounts.
 */
function handleFocusIn(event: FocusEvent) {
  isControlFocused.value = event.target instanceof Element && event.target.id === props.controlId
}

function handleFocusOut() {
  isControlFocused.value = false
}

onMounted(() => {
  document.addEventListener('focusin', handleFocusIn)
  document.addEventListener('focusout', handleFocusOut)
})

onBeforeUnmount(() => {
  document.removeEventListener('focusin', handleFocusIn)
  document.removeEventListener('focusout', handleFocusOut)
})
</script>

<template>
  <div class="flex w-full min-w-0 [contain:inline-size]">
    <!-- Above the label: the tooltip stays open while the user types, and beside the
         label it would cover the next field in the row. -->
    <FzTooltip truncate :text="label" :externalFocus="isControlFocused" position="top-start">
      <label :id="labelId" class="inline" :for="controlId">{{ label }}</label>
    </FzTooltip>
    <span v-if="required" aria-hidden="true" class="shrink-0 whitespace-pre"> *</span>
  </div>
</template>
