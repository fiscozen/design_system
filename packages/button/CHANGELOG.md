# @fiscozen/button

## 3.1.0

### Minor Changes

- d835f37: Self-contained DS baselines on the root `<button>`
  - Emit `.fz-button` as a stable marker class on the component root, mirroring the `.fz-icon-button-wrapper` / `.fz-button-group` marker pattern. Consumer-side stylesheets can now target `FzButton` via a stable class instead of a brittle utility fingerprint.
  - Pair `border-1` with `border-solid` so the 1px border renders correctly in host environments without a global Tailwind preflight.
  - Add `appearance-none` to neutralise UA-stylesheet `appearance: button` (in particular the iOS Safari native button chrome that Tailwind preflight explicitly preserves).

  No prop changes; the `tooltip` prop stays deprecated for removal in the next major.

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
  - @fiscozen/container@0.4.2
