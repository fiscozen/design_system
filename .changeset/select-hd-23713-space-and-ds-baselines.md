---
"@fiscozen/select": patch
---

Fix HD-23713 (space-strip in filterable mode) and align DS baselines

  - 🚨 HD-23713: in `filterable` mode the search input now accepts space characters. `event.preventDefault()` in `handleOptionsKeydown` for the `Enter`/`Space` cases is now guarded by the `focusedIndex >= 0` check, so when the input is focused with no option highlighted the Space keystroke is no longer swallowed.
  - Pair `border-1` with `border-solid` on the opener button so the 1px border renders correctly in host environments without a global Tailwind preflight.
  - Apply `text-core-black` on the floating root so descendant text inherits the design's neutral colour instead of an ambient host colour.
  - Align `FzSelectLabel` styling to `FzInput`: `font-normal text-base mb-0` (identical for `frontoffice` and `backoffice`), preserving the existing `text-grey-500` / `text-grey-300` disabled-readonly mapping.
