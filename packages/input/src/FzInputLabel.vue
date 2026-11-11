<script setup lang="ts">
/**
 * FzInputLabel - the label row of a form field
 *
 * Renders the field label and, with `aside`, a shorter text on the right of the same
 * row. The label takes the room the aside leaves. With `truncate` the row stays on one
 * line: the label is cut first, down to about twelve characters (or its own width,
 * when shorter), and only then the aside; each cut text shows in full in a tooltip.
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
import { FzTooltip, FzTruncatedLabel } from "@fiscozen/tooltip";
import type { FzInputLabelProps } from "./types";

defineProps<FzInputLabelProps>();
</script>

<template>
  <div
    v-if="aside && truncate"
    class="flex w-full min-w-0 items-baseline gap-8 [contain:inline-size]"
  >
    <div class="grow basis-0">
      <FzTruncatedLabel :label :labelId :controlId :required />
      <!-- FzTruncatedLabel takes no width of its own: this copy, capped at twelve
           characters and never shown, sets how far the label shrinks before the
           aside is cut. -->
      <span aria-hidden="true" class="invisible block h-0 max-w-[12ch] overflow-hidden whitespace-nowrap">
        {{ label }}{{ required ? " *" : "" }}
      </span>
    </div>
    <div class="flex min-w-0 text-sm">
      <FzTooltip truncate :text="aside" position="top-end">
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
