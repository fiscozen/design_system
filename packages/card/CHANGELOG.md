# @fiscozen/card

## 3.0.6

### Patch Changes

- ec39750: `FzCard` now applies an explicit `border-0` on the header and footer by default.
  Fixes cases where consumers mixing Tailwind without preflight + Bootstrap reboot saw an unwanted border because the template applied a lone `border-solid` (border-style without width → UA fallback `border-width: medium`).
  Variants with a border keep working unchanged.

## 3.0.5

### Patch Changes

- Updated dependencies [5be1040]
  - @fiscozen/container@0.5.0
  - @fiscozen/button@3.1.1

## 3.0.4

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0

## 3.0.3

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 3.0.2

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1

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
- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/style@0.3.0
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/container@0.4.2

## 1.1.0

### Minor Changes

- 2cc511a: Add yellow and red color variants

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2

## 1.0.2

### Minor Changes

- **LIB-1889: Aggiornamento di FzCard al design 1.0.0.** Nuovo layout, gestione dello stile e rimozione di IconButton.

### Patch Changes

- Aggiunta possibilità di disabilitare i pulsanti nelle card (SQA-2250)
- Rimozione della dipendenza da IconButton (LIB-1889)
- Aggiornamento dello stile e del padding dell'articolo principale (LIB-1889)
- Updated dependencies
  - @fiscozen/button@1.0.1
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
  - @fiscozen/container@0.4.1
