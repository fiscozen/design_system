# @fiscozen/card-list

## 1.3.0

### Minor Changes

- beabe52: FzCardListItem: the multi-action menu is an `FzPopover` now, so it renders in the top layer — never clipped by the row — and comes with light dismiss and Esc. Which engine places it (native popover in CSS, or `FzFloating`) is the popover's business; the card only says `bottom-end`. Same actions, same sections, same `fzaction:click` payload as the `FzIconDropdown` it replaces, and the ellipsis opener is now labelled "Mostra azioni" (it previously exposed the default "Open dropdown" label) and reports its state through `aria-expanded`.

  `@fiscozen/dropdown` is no longer a dependency of this package; `@fiscozen/popover` is.

  Fixes ids that other elements resolve: they were generated with `useId()`, which is scoped to the Vue app, so a document holding several apps (Storybook docs mode, or an app with several mount points) reused them. An ellipsis button could open another card's menu, and the `aria-labelledby` of a link row could make a screen reader announce another card's title. Both are now unique document-wide.

### Patch Changes

- Updated dependencies [beabe52]
- Updated dependencies [beabe52]
  - @fiscozen/popover@0.2.0
  - @fiscozen/button@3.1.3
  - @fiscozen/container@0.5.2

## 1.2.5

### Patch Changes

- @fiscozen/dropdown@1.0.14

## 1.2.4

### Patch Changes

- @fiscozen/dropdown@1.0.13

## 1.2.3

### Patch Changes

- Updated dependencies [404ccde]
  - @fiscozen/icons@1.0.7
  - @fiscozen/dropdown@1.0.12

## 1.2.2

### Patch Changes

- @fiscozen/dropdown@1.0.11
- @fiscozen/button@3.1.2
- @fiscozen/container@0.5.1

## 1.2.1

### Patch Changes

- Updated dependencies [5be1040]
  - @fiscozen/container@0.5.0
  - @fiscozen/button@3.1.1
  - @fiscozen/dropdown@1.0.10

## 1.2.0

### Minor Changes

- b717ba3: FzCardList / FzCardListItem: support an optional `icon` on the `badge` object.

  When provided it is forwarded to `FzBadge.leftIcon`, rendering a Font Awesome
  icon to the left of the badge text. Existing badge usages without `icon` are
  unchanged. Works across the three internal rendering variants (no-action,
  single-link action, multi-actions dropdown).

## 1.1.2

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0
  - @fiscozen/dropdown@1.0.9

## 1.1.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/dropdown@1.0.8

## 1.1.0

### Minor Changes

- b19e9df: Allow grouping a row's kebab actions into labeled sections by passing
  `{ type: 'section', label }` markers inside the `actions` array, mirroring
  the `FzActionSection` pattern already supported by `FzDropdown`. Existing
  flat-array usages are unaffected.

## 1.0.3

### Patch Changes

- Updated dependencies [351b6b7]
  - @fiscozen/badge@3.0.1

## 1.0.2

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/dropdown@1.0.7
  - @fiscozen/action@3.0.1

## 1.0.1

### Patch Changes

- 0f07343: Update FzCardListItem chevron-right icon variant

## 1.0.0

### Major Changes

- 4fccea4: Created new FzCardList component that renders card items in three interaction modes — link navigation (arrow row), action dropdown (ellipsis menu), or read-only — each composed from focused sub-components (FzCardActionLink, FzCardMultiActions, FzCardNoAction).
