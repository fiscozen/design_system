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
 *   @fzmenu:click="onMenuClick"
 * />
 */
import { computed } from 'vue';
import { FzBadge } from '@fiscozen/badge';
import { FzIconButton } from '@fiscozen/button';
import { FzIconDropdown } from '@fiscozen/dropdown';
import { FzIcon } from '@fiscozen/icons';
import { FzDivider } from '@fiscozen/divider';
import type { FzCardListItemProps, FzCardListItemEmits } from './types';
import type { FzActionProps } from '@fiscozen/action';

const { actions, badge, value } = defineProps<FzCardListItemProps>();

const emit = defineEmits<FzCardListItemEmits>();

type ActionsMode = 'none' | 'single' | 'multiple';

const actionsMode = computed<ActionsMode>(() => {
  if (!actions?.length) return 'none';
  if (actions.length === 1) return 'single';
  return 'multiple';
});

function emitSingleAction() {
  if (!actions || actions.length !== 1) {
    return;
  }
  emit('fzaction:click', 0, actions[0]);
}

function emitActionClick(actionIndex: number, action: FzActionProps) {
  emit('fzaction:click', actionIndex, action);
}

const hasTitleOnly = computed(() => !badge && !value);
const hasAmount = computed(() => !hasTitleOnly.value && !!value);
</script>

<template>
  <div class="hover:bg-semantic-info-50 p-8 rounded my-8 cursor-pointer">
    <div class="flex items-center justify-between mb-4">
      <FzBadge
        v-if="badge"
        :tone="badge.tone"
        variant="text"
      >
        {{ badge.text }}
      </FzBadge>
      <div v-else-if="hasTitleOnly" class="flex min-w-0 flex-1 items-center gap-8">
        <FzIcon
          v-if="showIndicator"
          name="circle"
          size="xs"
          variant="fas"
          v-color:blue
        />
        <p v-bold class="min-w-0 flex-1 truncate">{{ title }}</p>
      </div>
      <div v-else></div>
      <div
        v-if="actionsMode !== 'none'"
        class="shrink-0 flex items-center justify-end"
      >
        <FzIconButton
          v-if="actionsMode === 'single'"
          iconName="arrow-right"
          variant="invisible"
          environment="frontoffice"
          aria-label="Open"
          @click.stop="emitSingleAction"
        />
        <FzIconDropdown
          v-else
          :actions="actions!"
          iconName="ellipsis-vertical"
          variant="invisible"
          aria-label="Open menu"
          @fzaction:click="emitActionClick"
          @update:isOpen="emit('update:isOpen', $event)"
        />
      </div>
    </div>

    <div class="flex items-center justify-between gap-8 mb-4" v-if="!hasTitleOnly">
      <div class="flex min-w-0 flex-1 items-center gap-8">
        <FzIcon
          v-if="showIndicator"
          name="circle-small"
          size="xs"
          variant="fas"
          v-color:blue
        />
        <p v-bold class="min-w-0 flex-1 truncate">{{ title }}</p>
      </div>
      <p
        v-if="hasAmount"
        v-bold
        class="text-blue-500 text-base whitespace-nowrap"
      >
        {{ value }}
      </p>
    </div>

    <p
      v-for="(desc, i) in descriptions"
      :key="i"
      class="text-sm text-grey-500 m-0 p-0 mb-4"
    >
      {{ desc }}
    </p>
  </div>
  <FzDivider margin="none" />
</template>
