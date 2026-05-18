---
"@fiscozen/textarea": minor
---

Align label baselines with FzInput / FzSelect

  - The `<label>` now renders as `font-normal text-base mb-0`, with
    `text-grey-500` (default) and `text-grey-300` (disabled, readonly).
    Same baseline as `FzInput` and `FzSelect` — consumers no longer need
    a per-component-specific theme for the label.
  - Visual change: label color moves from `text-core-black` (near black)
    to `text-grey-500` (medium grey), and the `mb-0` baseline removes
    any residual margin-bottom added by host CSS resets. Font-size stays
    `text-base` in every context (the previous backoffice convention
    based on the consumer `.fz-textarea-full` SCSS marker rendered the
    label as `text-sm` — that override is now intentionally dropped).

No API changes.
