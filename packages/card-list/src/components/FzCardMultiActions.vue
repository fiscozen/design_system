<script setup lang="ts">
import { computed } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzContainer } from "@fiscozen/container";
import { FzDivider } from "@fiscozen/divider";
import { FzIconButton } from "@fiscozen/button";
import { FzPopover } from "@fiscozen/popover";
import { FzAction, FzActionList, FzActionSection } from "@fiscozen/action";
import type { FzActionProps } from "@fiscozen/action";
import type { FzCardMultiActionsProps, FzCardMultiActionsEmits } from "./types";
import FzCardHeader from "./FzCardHeader.vue";
import FzCardFooter from "./FzCardFooter.vue";

const props = defineProps<FzCardMultiActionsProps>();

const emit = defineEmits<FzCardMultiActionsEmits>();

const hasTitleOnly = computed(() => !props.badge && !props.value);

/**
 * Group actions into labelled sections (mirrors FzDropdown): a `type: "section"`
 * marker opens a new group and the following actions accumulate under it.
 */
const groupedActions = computed(() => {
  const sections: Record<string, FzActionProps[]> = {};
  let section = "__default__";
  props.actions.forEach((action) => {
    if (action.type === "section") {
      section = action.label || "__default__";
      return;
    }
    (sections[section] ??= []).push(action);
  });
  return sections;
});

/**
 * Resolves the clicked action back to its index in the `actions` prop. Same lookup
 * FzDropdown does internally, on purpose: a caller that migrates from the dropdown
 * keeps receiving the same index for the same action, quirks included (with two
 * identical actions both report the first match).
 */
function handleActionClick(action: FzActionProps, close: () => void) {
  const stringified = JSON.stringify(action);
  const index = props.actions.findIndex(
    (candidate) => JSON.stringify(candidate) === stringified,
  );
  emit("fzaction:click", index, action);
  close();
}
</script>

<template>
  <FzContainer gap="xs" class="p-8 hover:bg-semantic-info-50 hover:rounded">
    <!--
      Header row layout:
      - badge present → badge + actions
      - hasTitleOnly (no badge, no value) → title + actions (inline)
      - value present, no badge → actions only; title + value are in the second row
    -->
    <FzContainer horizontal alignItems="center">
      <!-- Badge -->
      <FzBadge
        v-if="badge"
        :left-icon="badge.icon"
        :tone="badge.tone"
        variant="text"
      >
        {{ badge.text }}
      </FzBadge>
      <!-- Title only (inline with actions) -->
      <FzCardHeader
        v-else-if="hasTitleOnly"
        has-title-only
        :show-indicator="showIndicator"
        :title="title"
      />
      <!-- Multiple actions popover -->
      <FzContainer
        horizontal
        gap="xs"
        alignItems="center"
        layout="expand-last"
        class="shrink-0 ml-auto"
      >
        <!--
          The engine choice lives in FzPopover: a native popover placed in CSS where
          the browser can, FzFloating everywhere else. `bottom-end` keeps the menu
          hanging down-and-left from the ellipsis, inside the card's right edge.
        -->
        <FzPopover position="bottom-end" content-class="fz-card-actions__menu">
          <template #opener="{ toggle, isOpen }">
            <FzIconButton
              iconName="ellipsis-vertical"
              variant="secondary"
              aria-label="Mostra azioni"
              :aria-expanded="isOpen"
              @click="toggle"
            />
          </template>
          <template #default="{ close }">
            <FzActionList>
              <FzActionSection
                v-for="(section, label) in groupedActions"
                :key="label"
                :label="label !== '__default__' ? label : undefined"
                environment="frontoffice"
              >
                <FzAction
                  v-for="(action, actionIndex) in section"
                  :key="actionIndex"
                  v-bind="action"
                  environment="frontoffice"
                  @click="handleActionClick(action, close)"
                />
              </FzActionSection>
            </FzActionList>
          </template>
        </FzPopover>
      </FzContainer>
    </FzContainer>

    <!-- Title + value row (when badge or value is present) -->
    <FzCardHeader
      v-if="!hasTitleOnly"
      :show-indicator="showIndicator"
      :title="title"
      :value="value"
    />
    <FzCardFooter :descriptions="descriptions" />
  </FzContainer>

  <FzDivider margin="none" />
</template>

