---
"@fiscozen/datepicker": patch
---

Fix HD-23714 (name via inputAttrs not propagated) and align DS baselines

  - 🚨 HD-23714: `safeInputProps` now falls back to `inputAttrs.name` so the visible `<FzInput>` rendered in VueDatePicker's `#dp-input` slot receives the `name` attribute also when callers pass it via `:inputAttrs="{ name: '...' }"` (the LIB-2583 / VueDatePicker v12 style). Precedence is preserved: `props.name` > `inputProps.name` > `inputAttrs.name`.
  - Pair `border-1` with `border-solid` on `.dp__input_wrap .rounded` so the input border renders in host environments without a global Tailwind preflight.
  - Reset `border: 0` on internal `button.dp__btn` (calendar header arrows, year/month nav, time-picker controls) so the UA native border doesn't leak into the calendar UI.
