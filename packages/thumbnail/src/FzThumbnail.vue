<script setup lang="ts">
/**
 * FzThumbnail – shows an image from a URL inside a box the caller sizes.
 *
 * The design system had no way to render an arbitrary image (LIB-2918): the only
 * three components that render an `<img>` are `FzAvatar` — round, with hardwired
 * sizes — and `FzRadioCard` / `FzCheckboxCard`, where the image is an
 * illustration inside a selectable card. This generalises that second pattern.
 *
 * **The caller imposes the dimensions.** This component hardwires none, so that
 * it does not repeat `FzAvatar`'s mistake of owning a size — but it takes them as
 * *props* rather than leaving them to a class, because the consuming apps forbid
 * `class` at the organism, template and page layers and `style` above an atom.
 * Give it `width` + `height`, or one of them + `aspectRatio`; with no dimension
 * at all it collapses and the image will not be visible.
 *
 * @component
 * @example
 * <FzThumbnail src="/receipt.jpg" alt="Scontrino di marzo" width="158px" height="108px" />
 *
 * @example A download action over a scrim, as in the customer chat feed.
 * <FzThumbnail :src="a.url" alt="" scrim bordered width="100%" height="168px">
 *   <template #overlay>
 *     <FzIconButton iconName="arrow-down-to-line" ariaLabel="Scarica" @click="download(a)" />
 *   </template>
 * </FzThumbnail>
 */
import { computed, ref, watch } from "vue";
import { FzIcon } from "@fiscozen/icons";
import type {
  FzThumbnailOverlayPosition,
  FzThumbnailProps,
  FzThumbnailRadius,
} from "./types";

const props = withDefaults(defineProps<FzThumbnailProps>(), {
  radius: "base",
  bordered: false,
  scrim: false,
  overlayPosition: "bottom-end",
  placeholderIcon: "file",
  loading: "lazy",
});

const emit = defineEmits<{
  /**
   * The image could not be loaded and the placeholder is showing. The caller can
   * use it to fall back to something else entirely — a file card, say.
   */
  error: [src: string];
}>();

const failed = ref(false);

// A new URL deserves a new attempt: without this, one broken image would pin the
// placeholder for every later `src` the same instance is given.
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

const showImage = computed(() => !!props.src && !failed.value);

// The placeholder speaks only when a *named* image failed. Three cases, and they
// are not the same thing:
//   - `src` empty      → nothing was ever meant to be here; stay silent.
//   - failed, alt ""   → the caller called it decorative; stay silent.
//   - failed, alt set  → the caller named it, and a native <img> whose resource
//                        404s would still expose that name in the accessibility
//                        tree. Swapping the element out must not throw it away.
const placeholderLabel = computed(() =>
  failed.value && props.alt ? props.alt : undefined,
);

const radiusClasses: Record<FzThumbnailRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  base: "rounded",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

const overlayPositionClasses: Record<FzThumbnailOverlayPosition, string> = {
  "top-start": "items-start justify-start",
  "top-end": "items-start justify-end",
  "bottom-start": "items-end justify-start",
  "bottom-end": "items-end justify-end",
  center: "items-center justify-center",
};

// Only the keys the caller actually set, so an unset dimension stays absent from
// the style attribute rather than landing there as `undefined`.
const boxStyle = computed(() => ({
  ...(props.width ? { width: props.width } : {}),
  ...(props.height ? { height: props.height } : {}),
  ...(props.aspectRatio ? { aspectRatio: props.aspectRatio } : {}),
}));

const onError = () => {
  failed.value = true;
  emit("error", props.src);
};
</script>

<template>
  <div
    class="fz-thumbnail relative overflow-hidden bg-core-white"
    :class="[
      radiusClasses[radius],
      { 'border-1 border-solid border-grey-100': bordered },
    ]"
    :style="boxStyle"
  >
    <img
      v-if="showImage"
      v-bind="imgProps"
      :src="src"
      :alt="alt"
      :loading="loading"
      class="block size-full object-cover"
      @error="onError"
    />

    <!-- Placeholder. Fills the same box, so a broken URL leaves the layout alone
         instead of collapsing the row around it. -->
    <div
      v-else
      class="grid size-full place-content-center bg-grey-100"
      :role="placeholderLabel ? 'img' : undefined"
      :aria-label="placeholderLabel"
      data-testid="fz-thumbnail-placeholder"
    >
      <FzIcon :name="placeholderIcon" size="lg" class="text-grey-300" />
    </div>

    <div
      v-if="scrim && showImage"
      class="fz-thumbnail__scrim absolute inset-0"
      data-testid="fz-thumbnail-scrim"
    />

    <!-- Overlay layer. Inert itself so it does not swallow clicks meant for the
         image, with pointer events handed back to whatever the caller puts in
         it. A flex box rather than bare `absolute inset-0`, so that dropping a
         button in the slot places it without the call site writing a class —
         which the organism, template and page layers may not do. -->
    <div
      v-if="$slots.overlay"
      class="pointer-events-none absolute inset-0 flex p-8 [&>*]:pointer-events-auto"
      :class="overlayPositionClasses[overlayPosition]"
      data-testid="fz-thumbnail-overlay"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<style scoped>
/* Why this is not `bg-grey-500/20`: the design system's colours resolve to
   `var(--grey-500, #596167)`, and Tailwind cannot decompose a `var()` into
   channels — so an opacity modifier on a token colour generates *no rule at
   all*, silently. Verified against the DS preset with the Tailwind CLI. The
   value is `grey-500` at 20% opacity, matching the design's
   `rgba(74, 85, 101, 0.2)` re-expressed on the DS palette. The custom property
   is the consumer's escape hatch, as with `--fz-navbar-shadow`. */
.fz-thumbnail__scrim {
  background-color: var(--fz-thumbnail-scrim, rgba(89, 97, 103, 0.2));
}
</style>
