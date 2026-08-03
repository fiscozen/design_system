---
"@fiscozen/composables": patch
---

FzFloating: stop pinning the panel to a narrow opener below the `xs` breakpoint

On viewports at or below the `xs` breakpoint (376px) `FzFloating` forced the floating panel's width to the opener's width, so the panel would cover its opener — the intent behind the `FzTab` mobile picker and select-like inputs, whose openers span the available width.

For a narrow opener the same rule broke the panel: a 44px icon button (`FzIconDropdown`, e.g. a per-row kebab menu) collapsed the panel box to 44px while its action list kept painting at its intrinsic width, outside the box. The viewport clamp added in 1.1.1 could not correct this — it measures the panel box, which at 44px was already comfortably on screen — so on a 360px-wide device the menu rendered roughly 190px off the right edge, half visible.

The rule is now expressed as a minimum instead of a fixed width: `width` stays `auto` and `min-width` is set to the opener's width on `xs`. Full-width openers still get a panel that covers them, while a narrow opener's panel takes its content width, at which point the existing boundary correction keeps it inside the viewport. Above `xs` nothing changes.
