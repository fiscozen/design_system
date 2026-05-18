---
"@fiscozen/button": minor
---

Self-contained DS baselines on the root `<button>`

  - Emit `.fz-button` as a stable marker class on the component root, mirroring the `.fz-icon-button-wrapper` / `.fz-button-group` marker pattern. Consumer-side stylesheets can now target `FzButton` via a stable class instead of a brittle utility fingerprint.
  - Pair `border-1` with `border-solid` so the 1px border renders correctly in host environments without a global Tailwind preflight.
  - Add `appearance-none` to neutralise UA-stylesheet `appearance: button` (in particular the iOS Safari native button chrome that Tailwind preflight explicitly preserves).

No prop changes; the `tooltip` prop stays deprecated for removal in the next major.
