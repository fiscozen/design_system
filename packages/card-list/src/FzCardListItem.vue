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
import { computed, useId } from "vue";
import { FzBadge } from "@fiscozen/badge";
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

const rowTitleId = useId();

const actionsMode = computed<ActionsMode>(() => {
  if (!actions?.length) return "none";
  if (actions.length === 1) return "single";
  return "multiple";
});

function handleRowInteraction(e: MouseEvent | KeyboardEvent) {
  if (e instanceof KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
  }
  e.stopPropagation();
  emitActionClick();
}

const singleActionListeners = computed(() =>
  actionsMode.value === "single"
    ? { click: handleRowInteraction, keydown: handleRowInteraction }
    : {},
);

function emitActionClick(actionIndex: number = 0, action: FzActionProps = actions![0]) {
  emit("fzaction:click", actionIndex, action);
}

const hasTitleOnly = computed(() => !badge && !value);
const hasValue = computed(() => !!value);
</script>

<template>
  <FzContainer
    gap="xs"
    :role="actionsMode === 'single' ? 'button' : undefined"
    :tabindex="actionsMode === 'single' ? 0 : undefined"
    :aria-labelledby="actionsMode === 'single' ? rowTitleId : undefined"
    :class="[
      'p-8 hover:bg-semantic-info-50 hover:rounded',
      { 'cursor-pointer': actionsMode === 'single' },
      {
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-200 focus-visible:rounded':
          actionsMode === 'single',
      },
    ]"
    v-on="singleActionListeners"
  >
    <!--
      Header row layout:
      - badge present → badge + actions
      - hasTitleOnly (no badge, no value) → title + actions (inline)
      - value present, no badge → actions only; title + value are in the second row
    -->
    <FzContainer horizontal alignItems="center">
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
        <p
          v-bold
          class="min-w-0 flex-1 truncate"
          :id="actionsMode === 'single' ? rowTitleId : undefined"
        >
          {{ title }}
        </p>
      </FzContainer>
      <!-- Actions -->
      <FzContainer
        v-if="actionsMode !== 'none'"
        horizontal
        gap="xs"
        alignItems="center"
        layout="expand-last"
        class="shrink-0 ml-auto"
      >
        <!-- Single action: decorative; row is role="button" and keyboard-activatable -->
        <span
          v-if="actionsMode === 'single'"
          class="inline-flex shrink-0 text-inherit"
          aria-hidden="true"
        >
          <FzIcon name="arrow-right" size="md" variant="fas" v-color:grey />
        </span>
        <!-- Multiple actions -->
        <FzIconDropdown
          v-else-if="actionsMode === 'multiple'"
          :actions="actions!"
          iconName="ellipsis-vertical"
          variant="invisible"
          aria-label="Mostra azioni"
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
        <p
          v-bold
          class="min-w-0 flex-1 truncate"
          :id="actionsMode === 'single' ? rowTitleId : undefined"
        >
          {{ title }}
        </p>
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
