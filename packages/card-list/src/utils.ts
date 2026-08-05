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
