---
'@fiscozen/progress': major
'@fiscozen/table': patch
---

`FzProgress` API simplified and made accessibility-compliant.

**API changes**
- Only `size` (default `'lg'`) and the new `label` prop (default `'Caricamento…'`) are exposed.
- The previously inherited `name`, `variant`, and `spin` props were either ignored by the template or implementation details and have been removed.

**Accessibility improvements**
- The component now renders a `role="status"` wrapper with an `aria-label` (mirrored as visually-hidden text), so screen readers announce the loading state when the spinner appears.
- The spin animation is disabled under `@media (prefers-reduced-motion: reduce)` (WCAG 2.3.3).

**Migration**: drop `name`, `variant`, and `spin` from any `<FzProgress />` usage. The icon (`spinner-third`), variant (`fas`), and spin behavior are now fixed internally. If your container already had a screen-reader announcement for the loading state, consider whether it now duplicates the one provided by `FzProgress`.
