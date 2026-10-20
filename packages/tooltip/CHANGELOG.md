# @fiscozen/tooltip

## 3.1.0

### Minor Changes

- 65d8e36: `FzTooltip` takes a `truncate` prop: the content stays on one line, cut with an ellipsis when it does not fit, and the tooltip opens only while the content is cut. The trigger takes no tab stop and no `aria-describedby`, since the full content is already in the DOM. In a flex layout, the flex ancestors need `min-w-0` for the content to be cut.

  `FzTooltip` takes an `externalFocus` prop: while focus sits on an element the trigger stands for but does not contain, such as the control a label names, the tooltip behaves as if the trigger had focus, and Escape pressed anywhere hides it.

  New `FzTruncatedLabel` component: a field label kept on one line, with the full text in a tooltip on hover and while the labelled control has focus. `FzInput`, `FzSelect` and `FzTextarea` render it with `truncateLabel`.

### Patch Changes

- Updated dependencies [65d8e36]
  - @fiscozen/composables@1.1.6

## 3.0.9

### Patch Changes

- Updated dependencies [fbf556a]
  - @fiscozen/composables@1.1.5

## 3.0.8

### Patch Changes

- @fiscozen/composables@1.1.4

## 3.0.7

### Patch Changes

- Updated dependencies [9a55c03]
  - @fiscozen/composables@1.1.3

## 3.0.6

### Patch Changes

- Updated dependencies [00173e9]
- Updated dependencies [763fa7e]
  - @fiscozen/composables@1.1.2

## 3.0.5

### Patch Changes

- Updated dependencies [404ccde]
- Updated dependencies [ea5c15c]
  - @fiscozen/icons@1.0.7
  - @fiscozen/composables@1.1.1

## 3.0.4

### Patch Changes

- Updated dependencies [1c2baef]
  - @fiscozen/composables@1.1.0

## 3.0.3

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 3.0.2

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

- 6dd9ef5: Remove `@fiscozen/button` and `@fiscozen/link` from runtime dependencies. After the `__fzKind` refactor, `FzTooltip` no longer imports those packages as values — auto-detection of interactive children works via primitive string markers read off the slot vnode. Both packages are kept in `devDependencies` because the tooltip test suite still mounts `FzButton`/`FzLink` to verify the auto-detection behavior.

  Pure dependency-graph cleanup; no behavior change. Consumers using `<FzTooltip>` around `<FzButton>` or `<FzLink>` already have those packages in their own dependency tree.

## 3.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/button@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
