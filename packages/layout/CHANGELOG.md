# @fiscozen/layout

## 1.0.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 1.0.0

### Major Changes

- ee8232a: Add `threeColumns` layout variant and `hasBottomBar` prop.

  The new `threeColumns` variant implements the frontoffice three-column pattern: a collapsible `menuBar` (256px, collapses to a top bar on mobile), a `header` and `main` center column, and a `chat` right panel (320px, hidden on mobile). The `hasBottomBar` prop adds a full-width `footer` row at the bottom of the grid.

## 0.1.6

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 0.1.5

### Patch Changes

- Updated dependencies [a26bc2c]
  - @fiscozen/style@0.3.0
  - @fiscozen/composables@1.0.2

## 0.1.4

### Patch Changes

#### Modifiche dalla versione 0.1.3

- Rinominata la proprietà `isViewport` per maggiore chiarezza
- Correzione dell'altezza quando la modalità viewport è disabilitata
- Correzione della larghezza quando non utilizzato in modalità viewport
- Aggiornamento al layout a due colonne (LIB-1580)
- Updated dependencies
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
