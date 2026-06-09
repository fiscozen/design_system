# @fiscozen/table

## 2.1.10

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0
  - @fiscozen/dialog@0.1.33
  - @fiscozen/dropdown@1.0.9
  - @fiscozen/input@3.4.2
  - @fiscozen/checkbox@3.0.6
  - @fiscozen/radio@3.0.5

## 2.1.9

### Patch Changes

- Updated dependencies [172fe72]
- Updated dependencies [a243ebb]
  - @fiscozen/dialog@0.1.32
  - @fiscozen/composables@1.0.4
  - @fiscozen/dropdown@1.0.8
  - @fiscozen/checkbox@3.0.5
  - @fiscozen/input@3.4.1
  - @fiscozen/radio@3.0.4

## 2.1.8

### Patch Changes

- Updated dependencies [c77895b]
  - @fiscozen/input@3.4.0

## 2.1.7

### Patch Changes

- @fiscozen/checkbox@3.0.4
- @fiscozen/radio@3.0.3

## 2.1.6

### Patch Changes

- a9c33b8: Replace fragile reference-identity slot filtering and provide/inject keys with namespaced primitive strings.

  Two related Vite dev-mode regressions are fixed at the same time, both rooted in module-instance duplication that occurs when consuming apps exclude `@fiscozen/*` packages from `optimizeDeps` (needed to preserve nested npm resolution for version-conflicting transitives). When the same `.vue` or `.ts` file is loaded as multiple distinct module instances, reference-identity comparisons (`vnode.type === Component` for slot filtering, `Symbol(...)` for provide/inject keys) silently fail.

  **Slot filtering** — child components now expose a `__fzKind` marker via `defineOptions({ __fzKind: "@fiscozen/<package>/<Component>" })`, and parents filter by reading that string instead of comparing references. Affected:
  - `FzTabs` filtering `FzTab` children
  - `FzSimpleTable` filtering `FzColumn` children
  - `FzTable` filtering `FzColumn`/`FzRow` children
  - `FzButtonGroup` validating `FzButton` children
  - `FzTooltip` auto-detecting `FzButton`/`FzIconButton`/`FzLink` for interactive-element handling

  **Provide/inject keys** — the two module-scoped `Symbol(...)` injection keys are now namespaced primitive strings, applying the same value-equality property to provide/inject. Affected:
  - `@fiscozen/checkbox` `CHECKED_SET_KEY`
  - `@fiscozen/collapse` `ACCORDION_KEY`

  No public API changes; consumers do not need to update their templates or call sites.

- Updated dependencies [a9c33b8]
  - @fiscozen/simple-table@0.1.6
  - @fiscozen/button@3.0.1
  - @fiscozen/checkbox@3.0.3
  - @fiscozen/dialog@0.1.31
  - @fiscozen/dropdown@1.0.7
  - @fiscozen/input@3.3.1
  - @fiscozen/action@3.0.1
  - @fiscozen/radio@3.0.2
  - @fiscozen/actionlist@0.1.14

## 2.1.5

### Patch Changes

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

- Updated dependencies [7a81fcd]
  - @fiscozen/progress@4.0.0

## 2.1.4

### Patch Changes

- Updated dependencies [4a4cde6]
  - @fiscozen/input@3.3.0

## 2.1.3

### Patch Changes

- Updated dependencies [b4ae9e4]
- Updated dependencies [3428436]
  - @fiscozen/input@3.2.0
  - @fiscozen/icons@1.0.3

## 2.1.2

### Patch Changes

- Updated dependencies [9b12cbf]
  - @fiscozen/input@3.1.0

## 2.1.1

### Patch Changes

- @fiscozen/actionlist@0.1.13

## 2.1.0

### Minor Changes

- 0fd9f63: Add `openRowIds` v-model to FzTable for programmatic control of accordion row expansion

### Patch Changes

- 9a63193: Fix accordion sub-row action cell background and hover not matching the rest of the row

## 2.0.6

### Patch Changes

- Updated dependencies [2ce9f77]
  - @fiscozen/checkbox@3.0.2

## 2.0.5

### Patch Changes

- Updated dependencies [d706523]
  - @fiscozen/progress@3.0.1

## 2.0.4

### Patch Changes

- Updated dependencies [c2a049e]
  - @fiscozen/input@3.0.3

## 2.0.3

### Patch Changes

- Updated dependencies [d662a78]
  - @fiscozen/input@3.0.2

## 2.0.2

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/input@3.0.1
  - @fiscozen/checkbox@3.0.1
  - @fiscozen/dialog@0.1.30
  - @fiscozen/dropdown@1.0.6
  - @fiscozen/radio@3.0.1

## 2.0.1

### Patch Changes

- eeed311: Fix accordion rows without subRows: hide expand icon but keep left column cell for alignment. Fix subrow actions to receive subrow data instead of parent row data. Use fixed 40px column for accordion left column.
  Fixed an issue with accordion variant in combination with rows using custom ids.

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/action@3.0.0
  - @fiscozen/button@3.0.0
  - @fiscozen/checkbox@3.0.0
  - @fiscozen/input@3.0.0
  - @fiscozen/progress@3.0.0
  - @fiscozen/radio@3.0.0
  - @fiscozen/dropdown@1.0.5
  - @fiscozen/dialog@0.1.29
  - @fiscozen/actionlist@0.1.12

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/dialog@0.1.28
  - @fiscozen/progress@2.0.0
  - @fiscozen/action@2.0.0
  - @fiscozen/checkbox@2.0.0
  - @fiscozen/input@2.0.0
  - @fiscozen/radio@2.0.0
  - @fiscozen/dropdown@1.0.4
  - @fiscozen/actionlist@0.1.11

## 0.1.18

### Patch Changes

- Updated dependencies [457253d]
  - @fiscozen/checkbox@1.1.2
  - @fiscozen/radio@1.0.3

## 0.1.17

### Patch Changes

- Updated dependencies [26cd2bf]
  - @fiscozen/input@1.0.2
  - @fiscozen/checkbox@1.1.1
  - @fiscozen/radio@1.0.2

## 0.1.16

### Patch Changes

- Updated dependencies [04244a5]
  - @fiscozen/checkbox@1.1.0

## 0.1.15

### Patch Changes

- Updated dependencies [640ed46]
  - @fiscozen/progress@1.1.0

## 0.1.14

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/action@1.1.1
  - @fiscozen/button@1.0.2
  - @fiscozen/checkbox@1.0.1
  - @fiscozen/input@1.0.1
  - @fiscozen/progress@1.0.2
  - @fiscozen/radio@1.0.1
  - @fiscozen/dropdown@1.0.3
  - @fiscozen/dialog@0.1.27
  - @fiscozen/actionlist@0.1.10

## 0.1.13

### Patch Changes

- Nessuna modifica diretta al componente. Aggiornamento per allineamento alle nuove versioni delle dipendenze.
- Updated dependencies
  - @fiscozen/action@1.1.0
  - @fiscozen/checkbox@1.0.0
  - @fiscozen/button@1.0.1
  - @fiscozen/input@1.0.0
  - @fiscozen/radio@1.0.0
  - @fiscozen/dropdown@1.0.2
  - @fiscozen/dialog@0.1.26
  - @fiscozen/composables@1.0.1
  - @fiscozen/progress@1.0.1
