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
  FzCardListItemAction,
  FzCardListItemProps,
  FzCardListItemEmits,
} from "./types";
import type { FzActionLinkProps, FzActionProps } from "@fiscozen/action";
import FzCardActionLink from "./components/FzCardActionLink.vue";
import FzCardMultiActions from "./components/FzCardMultiActions.vue";
import FzCardNoAction from "./components/FzCardNoAction.vue";

const props = defineProps<FzCardListItemProps>();

const emit = defineEmits<FzCardListItemEmits>();

// Section markers render as group headers in the dropdown but don't count
// toward the action-count routing (none / link / actions).
const interactiveActions = computed<FzActionProps[]>(
  () => (props.actions?.filter((a) => a.type !== "section") ?? []) as FzActionProps[],
);

const actionsMode = computed<ActionsMode>(() => {
  if (!interactiveActions.value.length) return "none";
  if (interactiveActions.value.length === 1 && interactiveActions.value[0].type === "link") return "link";
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
    :action="interactiveActions[0] as FzActionLinkProps"
    @fzaction:click="(action) => emit('fzaction:click', 0, action as FzActionProps)"
  />
  <FzCardMultiActions
    v-else
    :badge="badge"
    :title="title"
    :show-indicator="showIndicator"
    :value="value"
    :descriptions="descriptions"
    :actions="actions as FzCardListItemAction[]"
    @fzaction:click="(index, action) => emit('fzaction:click', index, action)"
  />
</template>
