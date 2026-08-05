<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzContainer } from "@fiscozen/container";
import { FzDivider } from "@fiscozen/divider";
import { FzIconButton } from "@fiscozen/button";
import { FzIconDropdown } from "@fiscozen/dropdown";
import { FzAction, FzActionList, FzActionSection } from "@fiscozen/action";
import type { FzActionProps } from "@fiscozen/action";
import type { FzCardMultiActionsProps, FzCardMultiActionsEmits } from "./types";
import FzCardHeader from "./FzCardHeader.vue";
import FzCardFooter from "./FzCardFooter.vue";
import { supportsAnchoredPopover } from "../utils";

const props = defineProps<FzCardMultiActionsProps>();

const emit = defineEmits<FzCardMultiActionsEmits>();

const hasTitleOnly = computed(() => !props.badge && !props.value);

/**
 * Which actions menu to render: the native popover where the browser supports
 * it, `FzIconDropdown` everywhere else. Read once per instance — browser
 * capabilities don't change at runtime, so this needs no reactivity.
 */
const anchoredPopover = supportsAnchoredPopover();

/**
 * Target id for the native Popover API. The ellipsis button references it via
 * `popovertarget`, which (a) lets the browser toggle + light-dismiss the menu
 * with no JS, and (b) makes that button the popover's *implicit anchor* for CSS
 * anchor positioning — so `.fz-card-actions__popover` can position itself with
 * `anchor()` without a per-instance `anchor-name`.
 *
 * The suffix is the instance's `uid` and NOT `useId()`: `useId()` is scoped to
 * the Vue *app*, so two apps in the same document (Storybook docs mode, or a page
 * with several mount points) both hand out `v-0`. `popovertarget` resolves by id
 * and takes the first match, so every opener would toggle the first card's menu,
 * anchored to a button the user never clicked. `uid` is a counter inside the Vue
 * runtime, shared across apps, so it is unique document-wide.
 */
const popoverId = `fz-card-actions-${getCurrentInstance()!.uid}`;
const popover = ref<HTMLElement>();

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
 * Resolves the clicked action back to its index in the `actions` prop. Same
 * lookup FzDropdown does internally, on purpose: both menus must emit the same
 * index for the same action, quirks included (with two identical actions both
 * report the first match).
 */
function handleActionClick(action: FzActionProps) {
  const stringified = JSON.stringify(action);
  const index = props.actions.findIndex(
    (candidate) => JSON.stringify(candidate) === stringified,
  );
  emit("fzaction:click", index, action);
  // Optional chaining: `hidePopover` is absent in the jsdom test env (the
  // Popover API only lands in jsdom 24); the real browser closes the menu here.
  popover.value?.hidePopover?.();
}

/** Fallback path: FzIconDropdown already resolves the index for us. */
function emitActionClick(actionIndex: number, action: FzActionProps) {
  emit("fzaction:click", actionIndex, action);
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
        <template v-if="anchoredPopover">
          <!--
            Ellipsis opener. `popovertarget` toggles the native popover below and
            makes this button the popover's implicit anchor: the menu is placed
            entirely in CSS (see `.fz-card-actions__popover`), no JS positioning.
          -->
          <FzIconButton
            iconName="ellipsis-vertical"
            variant="secondary"
            aria-label="Mostra azioni"
            :popovertarget="popoverId"
          />
          <div
            :id="popoverId"
            ref="popover"
            popover
            class="fz-card-actions__popover"
          >
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
                  @click="handleActionClick(action)"
                />
              </FzActionSection>
            </FzActionList>
          </div>
        </template>
        <!--
          Fallback for browsers without the Popover API / CSS anchor positioning:
          the JS-positioned dropdown this component used before. Same opener look
          (FzIconDropdown defaults to the secondary icon button) and same
          `fzaction:click` payload.
        -->
        <FzIconDropdown
          v-else
          :actions="actions!"
          iconName="ellipsis-vertical"
          buttonVariant="secondary"
          label="Mostra azioni"
          @fzaction:click="emitActionClick"
        />
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

<style scoped>
.fz-card-actions__popover {
  /* Reset the UA popover box (`inset: 0; margin: auto`) — we drive placement
     ourselves through anchor(). Kept `fixed` so it lives in the top layer and
     is never clipped by the card's overflow. */
  position: fixed;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  width: max-content;

  /* Anchor to the ellipsis button (implicit anchor via `popovertarget`):
     drop below it with right edges aligned, so the menu grows down-and-left. */
  top: anchor(bottom);
  right: anchor(right);
  bottom: auto;
  left: auto;
  margin-top: 4px; /* gap — mirrors the previous `mt-4` (4px in the DS scale) */

  /* Flip above the button when there isn't room below. */
  position-try-fallbacks: flip-block;
}
</style>
