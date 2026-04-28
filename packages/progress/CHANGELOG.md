# @fiscozen/progress

## 4.0.0

### Major Changes

- 7a81fcd: `FzProgress` and `FzProgressBar` API alignment + accessibility improvements.

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

## 3.0.1

### Patch Changes

- d706523: Make name prop optional in FzProgressProps to match withDefaults behavior

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/style@0.3.0
  - @fiscozen/icons@0.2.0

## 1.1.0

### Minor Changes

- 640ed46: Add red color variant

## 1.0.2

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.

## 1.0.1

### Minor Changes (dalla versione 0.1.0)

- **LIB-2361/LIB-2341: Nuovo componente FzProgressBar e miglioramenti a FzProgress.**

### Modifiche dalla versione 0.1.0

#### Nuove funzionalità

- Nuovo componente **FzProgressBar** con barra di avanzamento visuale (LIB-2341)
- Prop `color` per personalizzare il colore della barra di progresso (LIB-2361)
- Prop `size` per controllare la dimensione del componente (LIB-2361)
- Sanitizzazione degli attributi ARIA per accessibilità (LIB-2361)

### Patch Changes

- Updated dependencies
  - @fiscozen/style@0.2.0
