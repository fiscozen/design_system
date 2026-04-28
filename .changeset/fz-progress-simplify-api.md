---
'@fiscozen/progress': major
'@fiscozen/table': patch
---

`FzProgress` and `FzProgressBar` API alignment + accessibility improvements.

## FzProgress

**API changes**
- Only `size` (default `'lg'`) and the new `label` prop (default `'Caricamento…'`) are exposed.
- The previously inherited `name`, `variant`, and `spin` props were either ignored by the template or implementation details and have been removed.

**Accessibility improvements**
- The component now renders a `role="status"` wrapper with an `aria-label` (mirrored as visually-hidden text), so screen readers announce the loading state when the spinner appears.
- The spin animation is disabled under `@media (prefers-reduced-motion: reduce)` (handled by FontAwesome's stylesheet, WCAG 2.3.3).

**Migration**: drop `name`, `variant`, and `spin` from any `<FzProgress />` usage. The icon (`spinner-third`), variant (`fas`), and spin behavior are now fixed internally. If your container already had a screen-reader announcement for the loading state, consider whether it now duplicates the one provided by `FzProgress`.

## FzProgressBar

**API changes**
- Renamed prop `name` → `label` (default `'Avanzamento'`) for alignment with `FzProgress`.
- New optional prop `valueText?: string`, passed to `aria-valuetext` for human-readable contextual progress (e.g. `'Caricamento file 3 di 10'`).

**Accessibility improvements**
- Width transition now uses `motion-safe:` Tailwind utilities, so it is automatically disabled under `prefers-reduced-motion: reduce` (WCAG 2.3.3).
- `aria-valuetext` support for screen readers (ARIA Authoring Practices).

**Migration**: rename the `name` prop to `label` on any `<FzProgressBar />` usage. The default value also changes from `'progress-bar'` to `'Avanzamento'`.
