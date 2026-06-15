# @fiscozen/collapse

## 3.0.2

### Patch Changes

- Updated dependencies [5be1040]
  - @fiscozen/container@0.5.0

## 3.0.1

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

## 3.0.0

### Major Changes

- 267ce05: Redesign FzCollapse and add FzAccordion component.

  Breaking changes:
  - `summary` prop renamed to `title`
  - `summaryClass` prop renamed to `headerClass`
  - `content` prop removed (use `#content` slot instead)
  - Summary slot renamed to `#header`
  - Icon slot renamed to `#chevron`
  - Open-state blue highlight styling removed
  - Chevron icons changed from `chevron-down`/`chevron-up` to `angle-down`/`angle-up`

  New features:
  - `variant` prop (`'button' | 'section'`, default `'section'`) with different sizing/typography
  - `subtitle` prop (section variant, visible when closed)
  - `icon` prop (optional leading icon with content indentation)
  - `#rightContent` slot (button variant only)
  - New `FzAccordion` wrapper component with `multiple` prop for exclusive/multi-panel mode

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
