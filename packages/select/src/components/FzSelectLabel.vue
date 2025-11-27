<script setup lang="ts">
/**
 * FzSelectLabel Component
 *
 * Displays a group label in the select options list.
 * Used to visually separate option groups.
 *
 * @component
 */
import { FzSelectLabelProps } from "../types";

const props = defineProps<{
  option: FzSelectLabelProps;
}>();
</script>

<template>
  <label
    disabled
    test-id="fzselect-label"
    @click.prevent.stop
    :title="props.option.label"
    class="text-grey-400 flex items-center text-ellipsis whitespace-nowrap text-sm min-h-40 px-20"
  >
    {{ props.option.label }}
  </label>
</template>
