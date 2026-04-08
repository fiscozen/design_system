<script setup lang="ts">
/**
 * FzCardListItem Component
 *
 * A list item row used inside FzCardList.
 * Displays an optional badge, row actions (single arrow, or action dropdown),
 * a status indicator dot, a bold title with an optional amount on the right, and optional description lines.
 *
 * @component
 * @example
 * <FzCardListItem
 *   badge="Text badge"
 *   title="Title"
 *   amount="0,00 €"
 *   :descriptions="['Description 1', 'Description 2']"
 *   @fzaction:click="onActionClick"
 * />
 */
import { computed } from "vue";
import type {
  ActionsMode,
  FzCardListItemProps,
  FzCardListItemEmits,
} from "./types";
import type { FzActionLinkProps, FzActionProps } from "@fiscozen/action";
import FzCardActionLink from "./components/FzCardActionLink.vue";
import FzCardMultiActions from "./components/FzCardMultiActions.vue";
import FzCardNoAction from "./components/FzCardNoAction.vue";

const props = defineProps<FzCardListItemProps>();

const emit = defineEmits<FzCardListItemEmits>();

const actionsMode = computed<ActionsMode>(() => {
  if (!props.actions?.length) return "none";
  if (props.actions.length === 1 && props.actions[0].type === "link") return "link";
  return "actions";
});

</script>

<template>
  <FzCardNoAction
    v-if="actionsMode === 'none'"
    :badge="badge"
    :title="title"
    :show-indicator="showIndicator"
    :value="value"
    :descriptions="descriptions"
  />
  <FzCardActionLink
    v-else-if="actionsMode === 'link'"
    :badge="badge"
    :title="title"
    :show-indicator="showIndicator"
    :value="value"
    :descriptions="descriptions"
    :action="actions?.[0] as FzActionLinkProps"
    @fzaction:click="(action) => emit('fzaction:click', 0, action as FzActionProps)"
  />
  <FzCardMultiActions
    v-else
    :badge="badge"
    :title="title"
    :show-indicator="showIndicator"
    :value="value"
    :descriptions="descriptions"
    :actions="actions as FzActionProps[]"
    @fzaction:click="(index, action) => emit('fzaction:click', index, action)"
  />
</template>
