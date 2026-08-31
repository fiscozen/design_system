<script setup lang="ts">
/**
 * FzPopover — floating content that prefers the platform.
 *
 * Two engines behind one API:
 *
 * - **CSS engine** (default where the browser allows): a native `[popover]`, so
 *   the box lives in the top layer — never clipped by an ancestor's overflow, no
 *   z-index to arbitrate — and its placement is CSS (`position-anchor` +
 *   `position-area`), so the browser keeps it glued to its anchor on scroll and
 *   resize without a line of JS. Light dismiss and Esc come from the platform.
 * - **JS engine** (fallback): `FzFloating`, the measured-rect implementation the
 *   design system already ships, plus `useClickOutside` / `useKeyDown` for
 *   dismissal. Taken when the browser lacks CSS anchor positioning, when the
 *   placement is an `auto` one (see isAutoPosition), or on `forceFallback`.
 *
 * The fallback is meant to die: when CSS anchor positioning is everywhere, this
 * component drops the second engine and `FzFloating` goes with it.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { FzFloating, useClickOutside, useKeyDown } from "@fiscozen/composables";
import type { FzPopoverEmits, FzPopoverProps, FzPopoverSlots } from "./types";
import {
  anchoredContentStyle,
  isAutoPosition,
  supportsCssAnchoring,
  useUniqueId,
} from "./utils";

const props = withDefaults(defineProps<FzPopoverProps>(), {
  position: "bottom-start",
  offset: 4,
  matchOpenerWidth: false,
  anchor: null,
  forceFallback: false,
});

const emit = defineEmits<FzPopoverEmits>();
defineSlots<FzPopoverSlots>();

const isOpen = defineModel<boolean>("open", { default: false });

/**
 * Which engine runs. Read once per instance: browser capabilities don't change at
 * runtime, and `position` changing between an auto and a fixed placement would be
 * an odd thing for a caller to do mid-life — if it happens, the engine stays put
 * rather than tearing the popover down and rebuilding it.
 */
const cssEngine =
  !props.forceFallback &&
  !isAutoPosition(props.position) &&
  supportsCssAnchoring();

/** Dashed ident for `anchor-name`; unique per document, not per app. */
const anchorName = `--${useUniqueId("fz-popover")}`;
const contentId = useUniqueId("fz-popover-content");

const root = ref<HTMLElement>();
const openerWrapper = ref<HTMLElement>();
const content = ref<HTMLElement>();

const anchorElement = computed(
  () => props.anchor ?? openerWrapper.value ?? null,
);

const contentStyle = computed(() =>
  anchoredContentStyle(
    props.position,
    props.offset,
    anchorName,
    props.matchOpenerWidth,
  ),
);

function open() {
  isOpen.value = true;
}
function close() {
  isOpen.value = false;
}
function toggle() {
  isOpen.value = !isOpen.value;
}

/**
 * `anchor-name` has to sit on the anchor itself, which may be an element we were
 * handed (`anchor` prop) rather than one we render — hence the imperative set,
 * and the cleanup when it changes so we don't leave a stale name behind.
 */
let namedAnchor: HTMLElement | null = null;
function applyAnchorName() {
  if (!cssEngine) return;
  if (namedAnchor && namedAnchor !== anchorElement.value) {
    namedAnchor.style.removeProperty("anchor-name");
  }
  const element = anchorElement.value;
  if (!element) return;
  element.style.setProperty("anchor-name", anchorName);
  namedAnchor = element;
}

watch(anchorElement, applyAnchorName, { immediate: true, flush: "post" });

onBeforeUnmount(() => {
  namedAnchor?.style.removeProperty("anchor-name");
  namedAnchor = null;
});

async function syncEngineWithModel(value: boolean) {
  if (!cssEngine) {
    // The JS engine only needs the width sync; FzFloating reacts to isOpen itself.
    if (value && props.matchOpenerWidth) await syncFallbackWidth();
    return;
  }
  await nextTick();
  const element = content.value;
  if (!element?.isConnected) return;
  // Guarded against the current state because showPopover/hidePopover throw when
  // called against it. The flag is tracked rather than read back with
  // `matches(':popover-open')`: that pseudo-class is unknown to jsdom, where the
  // selector throws. `onNativeToggle` keeps the flag honest, since it fires however
  // the popover opened or closed. The optional calls cover jsdom too, which has no
  // Popover API before v24.
  if (value && !nativeShown) element.showPopover?.();
  if (!value && nativeShown) element.hidePopover?.();
}

watch(isOpen, (value) => {
  emit("fzpopover:toggle", value);
  syncEngineWithModel(value);
});

/**
 * An `open` that is already true at mount needs the same push: the watcher only
 * fires on change, so a popover that starts open — a docs example, a visual
 * snapshot, a menu restored from state — would otherwise render closed.
 */
onMounted(() => {
  if (isOpen.value) syncEngineWithModel(true);
});

/**
 * Whether the native popover is currently showing. Esc and light dismiss close it
 * without going through us, so this — and the model — are synced from the platform's
 * own toggle event.
 */
let nativeShown = false;
function onNativeToggle(event: Event) {
  const next = (event as ToggleEvent).newState === "open";
  nativeShown = next;
  if (isOpen.value !== next) isOpen.value = next;
}

/**
 * `matchOpenerWidth` is `anchor-size()` in the CSS engine. FzFloating only matches
 * the opener's width below the xs breakpoint, so in the fallback we set it
 * ourselves on its content box — reached by class because FzFloating exposes only
 * `setPosition`.
 */
async function syncFallbackWidth() {
  await nextTick();
  const box = root.value?.querySelector<HTMLElement>(".fz__floating__content");
  // FzFloating's own opener box — we don't wrap the slot in this engine.
  const width = root.value
    ?.querySelector<HTMLElement>(".inline-flex")
    ?.getBoundingClientRect().width;
  if (box && width) box.style.minWidth = `${width}px`;
}

// Dismissal for the JS engine. Both composables attach on mount and would throw on
// an empty ref, so they always get the real root and no-op when CSS is driving.
useClickOutside(root, () => {
  if (!cssEngine && isOpen.value) close();
});
useKeyDown(root, (event) => {
  if (!cssEngine && event.key === "Escape" && isOpen.value) close();
});

defineExpose({ open, close, toggle });
</script>

<template>
  <div ref="root" class="fz-popover">
    <template v-if="cssEngine">
      <span ref="openerWrapper" class="fz-popover__opener inline-flex">
        <slot
          name="opener"
          :is-open="isOpen"
          :toggle="toggle"
          :open="open"
          :close="close"
        />
      </span>
      <div
        ref="content"
        :id="contentId"
        popover
        class="fz-popover__content"
        :class="contentClass"
        :style="contentStyle"
        @toggle="onNativeToggle"
      >
        <slot :is-open="isOpen" :close="close" />
      </div>
    </template>

    <!--
      `use-viewport` makes FzFloating resolve auto placements against the viewport
      rather than the container. The collision boundary is already the viewport when
      the container is `document.body` — LIB-2825 fixed that upstream.
    -->
    <FzFloating
      v-else
      :is-open="isOpen"
      :position="position"
      :content-class="contentClass"
      :use-viewport="true"
    >
      <!--
        The slot goes straight through: FzFloating already wraps it in the box it
        measures, so a wrapper of ours would only add a layer. The width sync below
        reads that same box.
      -->
      <template #opener>
        <slot
          name="opener"
          :is-open="isOpen"
          :toggle="toggle"
          :open="open"
          :close="close"
        />
      </template>
      <slot :is-open="isOpen" :close="close" />
    </FzFloating>
  </div>
</template>

<style scoped>
.fz-popover__content {
  /* Reset the UA popover box (`inset: 0; margin: auto`, a border): placement comes
     from the inline style, chrome from the caller. */
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}
</style>
