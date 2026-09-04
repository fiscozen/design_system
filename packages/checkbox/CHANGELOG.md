# @fiscozen/checkbox

## 3.0.14

### Patch Changes

- 92c1d3a: Paragraph line-heights no longer need `!important`. The card title and subtitle (`FzRadioCard`, `FzCheckboxCard`), the avatar title and subtitle, and the alert description all set their line-height with `!leading-[…]`. On the four that carry `text-sm`, that `!` was a workaround for `@fiscozen/style`'s `p.text-sm` default, which weighed (0,1,1) and beat any plain `leading-*` utility; now that the default is `p:where(.text-sm)` at (0,0,1), the utility wins on its own. The other four never needed it — they sit on paragraphs without `text-sm`, where only the element default competed and a plain utility already won — and were cargo-culted alongside.

  Rendered line-heights are unchanged: 20px on the titles and the alert description, 16px on the subtitles, measured on every one of the eight sites before and after. What changes is that a consumer can now override them — `!important` previously made these line-heights unreachable from the outside.

  These packages don't declare `@fiscozen/style` as a dependency; the consuming app supplies the stylesheet. Upgrading them without also upgrading `@fiscozen/style` to the release that carries the `p:where(.text-sm)` fix will render the `text-sm` subtitles at 18px instead of 16px.

- Updated dependencies [92c1d3a]
  - @fiscozen/alert@3.0.6
  - @fiscozen/composables@1.1.4
  - @fiscozen/tooltip@3.0.8

## 3.0.13

### Patch Changes

- Updated dependencies [9a55c03]
  - @fiscozen/composables@1.1.3
  - @fiscozen/tooltip@3.0.7

## 3.0.12

### Patch Changes

- Updated dependencies [00173e9]
- Updated dependencies [763fa7e]
  - @fiscozen/composables@1.1.2
  - @fiscozen/tooltip@3.0.6

## 3.0.11

### Patch Changes

- Updated dependencies [404ccde]
- Updated dependencies [ea5c15c]
  - @fiscozen/icons@1.0.7
  - @fiscozen/composables@1.1.1
  - @fiscozen/tooltip@3.0.5

## 3.0.10

### Patch Changes

- Updated dependencies [1c2baef]
  - @fiscozen/composables@1.1.0
  - @fiscozen/tooltip@3.0.4
  - @fiscozen/alert@3.0.5

## 3.0.9

### Patch Changes

- 63ad153: `FzCheckbox` and `FzCheckboxGroup` now set `text-core-black` on their root container and `mb-0` on their inner `<label>` as a baseline.
  This makes the components environment-agnostic: hosts with Bootstrap reboot but without global Tailwind preflight no longer leak `body { color }` into descendant text, nor `label { margin-bottom: 0.5rem }` into the label spacing.
  No changes to the public props.

## 3.0.8

### Patch Changes

- @fiscozen/alert@3.0.4
- @fiscozen/tooltip@3.0.3

## 3.0.7

### Patch Changes

- Updated dependencies [2893adb]
  - @fiscozen/alert@3.0.3

## 3.0.6

### Patch Changes

- @fiscozen/alert@3.0.2
- @fiscozen/tooltip@3.0.3

## 3.0.5

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/tooltip@3.0.3

## 3.0.4

### Patch Changes

- Updated dependencies [351b6b7]
  - @fiscozen/badge@3.0.1

## 3.0.3

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
- Updated dependencies [6dd9ef5]
  - @fiscozen/tooltip@3.0.2
  - @fiscozen/alert@3.0.1

## 3.0.2

### Patch Changes

- 2ce9f77: Fix FzCheckboxCard spacing

## 3.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/tooltip@3.0.1

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/alert@3.0.0
  - @fiscozen/badge@3.0.0
  - @fiscozen/tooltip@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/alert@2.0.0
  - @fiscozen/badge@2.0.0
  - @fiscozen/tooltip@2.0.0

## 1.1.2

### Patch Changes

- 457253d: Use FzAlert variant text for error message

## 1.1.1

### Patch Changes

- Updated dependencies [a42b3b4]
  - @fiscozen/alert@1.1.0
