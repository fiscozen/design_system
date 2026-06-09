# @fiscozen/card-list

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
