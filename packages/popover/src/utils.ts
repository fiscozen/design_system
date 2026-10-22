import { getCurrentInstance, type CSSProperties } from "vue";
import type { FzFloatingPosition } from "@fiscozen/composables";

/**
 * A DOM id / CSS ident unique across the whole document.
 *
 * Deliberately NOT `useId()`: that is scoped to the Vue *app*, and a document can
 * hold several (Storybook docs mode mounts one app per story; an app can have
 * several mount points), each handing out `v-0` again. Anything another element
 * resolves — `position-anchor`, `aria-controls` — then points at the wrong box,
 * silently. `uid` is a counter inside the Vue runtime itself, shared across apps.
 *
 * Call from `setup()`.
 */
export function useUniqueId(prefix: string): string {
  return `${prefix}-${getCurrentInstance()!.uid}`;
}

/**
 * Feature-detects what the CSS engine of `FzPopover` needs:
 *
 * 1. the **Popover API** (`[popover]`) — top layer, light dismiss and Esc for free;
 * 2. **CSS anchor positioning** (`anchor-name` / `position-anchor`);
 * 3. **`position-area`** — places the box in one of the 9 areas around its anchor,
 *    which is how the 12 `FzFloatingPosition` values are expressed without JS.
 *
 * The Popover API has been broadly available since 2024; anchor positioning only
 * reached Baseline in 2026. Where any of the three is missing, `FzPopover` falls
 * back to `FzFloating` — the JS engine the design system already ships.
 *
 * Not memoized: the checks are cheap, and keeping them live lets tests toggle
 * support per case. `window.CSS` is guarded because jsdom has no such global.
 */
export function supportsCssAnchoring(): boolean {
  if (typeof HTMLElement === "undefined" || typeof window === "undefined")
    return false;
  if (!("popover" in HTMLElement.prototype)) return false;
  if (typeof window.CSS?.supports !== "function") return false;
  return (
    window.CSS.supports("anchor-name: --fz") &&
    window.CSS.supports("position-area: block-end")
  );
}

/**
 * `auto` and `auto-vertical` mean "the side with the most available space", which
 * needs measuring — `position-try-fallbacks` only abandons a placement that
 * *overflows*, and `position-try-order` reorders the fallback list without
 * replacing the base placement. So auto positions always take the JS engine.
 */
export function isAutoPosition(position: FzFloatingPosition): boolean {
  return position.startsWith("auto");
}

/**
 * `FzFloatingPosition` → `position-area`.
 *
 * The area grid is 3×3 around the anchor. `span-inline-end` occupies the centre
 * column plus the inline-end one, i.e. it aligns with the anchor's inline-start
 * edge and grows towards inline-end — which is what `-start` means in the
 * FzFloating/Floating UI vocabulary. `-end` is its mirror, and a bare side centres.
 */
const POSITION_AREA: Record<string, string> = {
  bottom: "block-end center",
  "bottom-start": "block-end span-inline-end",
  "bottom-end": "block-end span-inline-start",
  top: "block-start center",
  "top-start": "block-start span-inline-end",
  "top-end": "block-start span-inline-start",
  left: "inline-start center",
  "left-start": "inline-start span-block-end",
  "left-end": "inline-start span-block-start",
  right: "inline-end center",
  "right-start": "inline-end span-block-end",
  "right-end": "inline-end span-block-start",
};

/** The offset lives on the side facing the anchor, mirroring FzFloating's margins. */
function offsetStyle(
  position: FzFloatingPosition,
  offset: number,
): CSSProperties {
  const px = `${offset}px`;
  if (position.startsWith("bottom")) return { marginTop: px };
  if (position.startsWith("top")) return { marginBottom: px };
  if (position.startsWith("left")) return { marginRight: px };
  if (position.startsWith("right")) return { marginLeft: px };
  return { marginTop: px };
}

/**
 * Inline style that pins the content to its anchor. Everything about placement
 * lives here, so the browser keeps the two glued on scroll and resize with no JS.
 *
 * No `max-height`: capping the box would make it shrink instead of overflow, and a
 * box that never overflows never triggers `position-try-fallbacks` — verified in
 * Chromium 143, where a shrink-to-fit menu stayed in a 22px slot rather than
 * flipping above. Flipping is the more useful of the two for a popover, so content
 * that can outgrow the viewport should cap itself (or use the JS engine).
 */
export function anchoredContentStyle(
  position: FzFloatingPosition,
  offset: number,
  anchorName: string,
  matchOpenerWidth: boolean,
): CSSProperties {
  const vertical = position.startsWith("bottom") || position.startsWith("top");
  return {
    position: "fixed",
    positionAnchor: anchorName,
    positionArea: POSITION_AREA[position] ?? POSITION_AREA["bottom-start"],
    positionTryFallbacks: vertical ? "flip-block" : "flip-inline",
    width: "max-content",
    ...(matchOpenerWidth
      ? { minWidth: `anchor-size(${anchorName} width)` }
      : {}),
    ...offsetStyle(position, offset),
  } as CSSProperties;
}
