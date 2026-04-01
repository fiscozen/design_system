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
import { FzBadge } from "@fiscozen/badge";
import { FzIconButton } from "@fiscozen/button";
import { FzIconDropdown } from "@fiscozen/dropdown";
import { FzIcon } from "@fiscozen/icons";
import { FzDivider } from "@fiscozen/divider";
import type {
  ActionsMode,
  FzCardListItemProps,
  FzCardListItemEmits,
} from "./types";
import type { FzActionProps } from "@fiscozen/action";
import { FzContainer } from "@fiscozen/container";

const { actions, badge, value } = defineProps<FzCardListItemProps>();

const emit = defineEmits<FzCardListItemEmits>();

const actionsMode = computed<ActionsMode>(() => {
  if (!actions?.length) return "none";
  if (actions.length === 1) return "single";
  return "multiple";
});

function emitSingleAction() {
  if (!actions || actions.length !== 1) {
    return;
  }
  emit("fzaction:click", 0, actions[0]);
}

function handleRowClick(e: MouseEvent) {
  if (actionsMode.value !== "single") return;
  e.stopPropagation();
  emitSingleAction();
}

function emitActionClick(actionIndex: number, action: FzActionProps) {
  emit("fzaction:click", actionIndex, action);
}

const hasTitleOnly = computed(() => !badge && !value);
const hasValue = computed(() => !hasTitleOnly.value && !!value);
</script>

<template>
  <FzContainer
    gap="xs"
    class="p-8 hover:bg-semantic-info-50 hover:rounded cursor-pointer"
    @click="handleRowClick"
  >
    <!-- Header -->
    <FzContainer horizontal alignItems="center" layout="space-between">
      <!-- Badge -->
      <FzBadge v-if="badge" :tone="badge.tone" variant="text">
        {{ badge.text }}
      </FzBadge>
      <!-- Title only -->
      <FzContainer
        v-else-if="hasTitleOnly"
        horizontal
        gap="xs"
        alignItems="center"
        class="min-w-0 flex-1"
      >
        <!-- Indicator -->
        <FzIcon
          v-if="showIndicator"
          name="circle-small"
          size="xs"
          variant="fas"
          v-color:blue
        >
        </FzIcon>
        <!-- Title -->
        <p v-bold class="min-w-0 flex-1 truncate">{{ title }}</p>
      </FzContainer>
      <FzContainer v-else></FzContainer>
      <!-- Actions -->
      <FzContainer
        v-if="actionsMode !== 'none'"
        horizontal
        gap="xs"
        alignItems="center"
        layout="expand-last"
        class="shrink-0"
      >
        <!-- Single action -->
        <FzIconButton
          v-if="actionsMode === 'single'"
          iconName="arrow-right"
          variant="invisible"
          environment="frontoffice"
          aria-label="Open"
        />
        <!-- Multiple actions -->
        <FzIconDropdown
          v-else
          :actions="actions!"
          iconName="ellipsis-vertical"
          variant="invisible"
          aria-label="Open menu"
          @fzaction:click="emitActionClick"
          @update:isOpen="emit('update:isOpen', $event)"
        />
      </FzContainer>
    </FzContainer>

    <!-- Title and value -->
    <FzContainer
      v-if="!hasTitleOnly"
      horizontal
      gap="sm"
      alignItems="center"
      layout="space-between"
    >
      <!-- Title and indicator -->
      <FzContainer horizontal gap="xs" alignItems="center" class="min-w-0">
        <!-- Indicator -->
        <FzIcon
          v-if="showIndicator"
          name="circle-small"
          size="xs"
          variant="fas"
          v-color:blue
        />
        <!-- Title -->
        <p v-bold class="min-w-0 flex-1 truncate">{{ title }}</p>
      </FzContainer>
      <!-- Value -->
      <p v-if="hasValue" v-bold v-color:blue class="text-base whitespace-nowrap">
        {{ value }}
      </p>
    </FzContainer>

    <!-- Descriptions -->
    <FzContainer v-if="descriptions" gap="none">
      <p v-for="(desc, i) in descriptions" :key="i" v-small v-color:grey>
        {{ desc }}
      </p>
    </FzContainer>
  </FzContainer>
  <FzDivider margin="none" />
</template>
