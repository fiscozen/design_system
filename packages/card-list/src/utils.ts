import { getCurrentInstance } from "vue";

/**
 * A DOM id that is unique across the whole document, for ids that something else
 * resolves — `popovertarget`, `aria-labelledby`.
 *
 * Deliberately NOT `useId()`: that is scoped to the Vue *app*, and a document can
 * hold several (Storybook docs mode mounts one app per story; an app can have
 * several mount points), each handing out `v-0` again. Duplicated ids fail
 * silently in whoever resolves them — `popovertarget` toggles the first match, so
 * an ellipsis button opens another card's menu; `aria-labelledby` resolves to the
 * first match, so a screen reader announces another card's title. `uid` is a
 * counter inside the Vue runtime itself, shared across apps.
 *
 * `useId()` would be the better choice for SSR (it is built to survive
 * hydration); this package has no SSR target, so document uniqueness wins.
 *
 * Call from `setup()` — it needs the current instance.
 */
export function useUniqueId(prefix: string): string {
  return `${prefix}-${getCurrentInstance()!.uid}`;
}

/**
 * Feature-detects the two platform features the anchored actions menu of
 * `FzCardMultiActions` is built on:
 *
 * 1. the **Popover API** (`[popover]` + `popovertarget`) — top layer, light
 *    dismiss and Esc handling for free, no JS;
 * 2. **CSS anchor positioning** (`anchor()`) — places the menu against its
 *    opener without measuring anything in JS.
 *
 * (1) has been broadly available since 2024; (2) only reached Baseline in 2026,
 * so a non-trivial slice of users (slightly older Safari and Firefox) is still
 * without it. Browsers missing either feature get the `FzIconDropdown` fallback
 * (JS-positioned `FzFloating`) — the menu this component used before.
 *
 * Deliberately not memoized: the checks are two cheap lookups, and keeping them
 * live lets tests toggle support per case. `window.CSS` is guarded because it is
 * absent in jsdom.
 */
export function supportsAnchoredPopover(): boolean {
  if (typeof HTMLElement === "undefined" || typeof window === "undefined") {
    return false;
  }
  if (!("popover" in HTMLElement.prototype)) return false;
  return (
    typeof window.CSS?.supports === "function" &&
    window.CSS.supports("anchor-name: --fz")
  );
}
