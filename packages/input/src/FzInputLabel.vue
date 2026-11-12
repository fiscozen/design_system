<script setup lang="ts">
/**
 * FzInputLabel - the label row of a form field
 *
 * Renders the field label and, with `aside`, a shorter text on the right of the same
 * row. The label takes the room the aside leaves. With `truncate` the row stays on one
 * line: the label is cut first, down to about twelve characters (or its own width,
 * when shorter, or the row's, when narrower), and only then the aside; each cut text
 * shows in full in a tooltip on hover and while the labelled control has focus.
 * Without `truncate` the label wraps and the aside stays on its first line.
 *
 * Text styles (color, size, weight) go on the component: the label, the asterisk and
 * the aside inherit them, the aside one size smaller.
 *
 * @example
 * <FzInputLabel
 *   class="text-base text-grey-500"
 *   label="1. IVA dovuta"
 *   labelId="amount-label"
 *   controlId="amount"
 *   aside="calcolato 971,65"
 *   asideId="amount-label-aside"
 *   truncate
 * />
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FzTooltip, FzTruncatedLabel } from "@fiscozen/tooltip";
import type { FzInputLabelProps } from "./types";

const props = defineProps<FzInputLabelProps>();

const isControlFocused = ref(false);

/**
 * Focus is tracked on the document: the control is a sibling the label does not own,
 * and the document sees its focus events whenever and wherever the control mounts.
 */
function handleFocusIn(event: FocusEvent) {
  isControlFocused.value = event.target instanceof Element && event.target.id === props.controlId;
}

function handleFocusOut() {
  isControlFocused.value = false;
}

onMounted(() => {
  document.addEventListener("focusin", handleFocusIn);
  document.addEventListener("focusout", handleFocusOut);
});

onBeforeUnmount(() => {
  document.removeEventListener("focusin", handleFocusIn);
  document.removeEventListener("focusout", handleFocusOut);
});
</script>

<template>
  <div
    v-if="aside && truncate"
    class="flex w-full min-w-0 items-baseline [contain:inline-size]"
  >
    <!-- The space before the aside is padding inside the label column, not a row gap:
         max-w-full then caps the label and that space together at the row's width. -->
    <div class="max-w-full grow basis-0 pr-8">
      <FzTruncatedLabel :label :labelId :controlId :required />
      <!-- FzTruncatedLabel takes no width of its own: this sizer, capped at twelve
           characters, sets how far the label shrinks before the aside is cut. Its text
           is generated content, so the label text is in the DOM once. -->
      <span
        aria-hidden="true"
        :data-label="required ? `${label} *` : label"
        class="invisible block h-0 max-w-[12ch] overflow-hidden whitespace-nowrap before:content-[attr(data-label)]"
      />
    </div>
    <div class="flex min-w-0 text-sm">
      <FzTooltip truncate :text="aside" :externalFocus="isControlFocused" position="top-end">
        <span :id="asideId">{{ aside }}</span>
      </FzTooltip>
    </div>
  </div>
  <div v-else-if="aside" class="flex items-baseline gap-8">
    <label :id="labelId" class="mb-0 grow basis-0" :for="controlId">
      {{ label }}{{ required ? " *" : "" }}
    </label>
    <span :id="asideId" class="text-right text-sm">{{ aside }}</span>
  </div>
  <FzTruncatedLabel
    v-else-if="truncate"
    :label
    :labelId
    :controlId
    :required
  />
  <label v-else :id="labelId" :for="controlId">
    {{ label }}{{ required ? " *" : "" }}
  </label>
</template>
