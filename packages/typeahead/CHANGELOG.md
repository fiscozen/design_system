# @fiscozen/typeahead

## 3.0.12

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0
  - @fiscozen/alert@3.0.2
  - @fiscozen/input@3.4.2

## 3.0.11

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/input@3.4.1

## 3.0.10

### Patch Changes

- Updated dependencies [c77895b]
  - @fiscozen/input@3.4.0

## 3.0.9

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/alert@3.0.1
  - @fiscozen/input@3.3.1
  - @fiscozen/action@3.0.1

## 3.0.8

### Patch Changes

- Updated dependencies [7a81fcd]
  - @fiscozen/progress@4.0.0

## 3.0.7

### Patch Changes

- Updated dependencies [4a4cde6]
  - @fiscozen/input@3.3.0

## 3.0.6

### Patch Changes

- Updated dependencies [b4ae9e4]
- Updated dependencies [3428436]
  - @fiscozen/input@3.2.0
  - @fiscozen/icons@1.0.3

## 3.0.5

### Patch Changes

- Updated dependencies [9b12cbf]
  - @fiscozen/input@3.1.0

## 3.0.4

### Patch Changes

- Updated dependencies [d706523]
  - @fiscozen/progress@3.0.1

## 3.0.3

### Patch Changes

- Updated dependencies [c2a049e]
  - @fiscozen/input@3.0.3

## 3.0.2

### Patch Changes

- Updated dependencies [d662a78]
  - @fiscozen/input@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/input@3.0.1

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/action@3.0.0
  - @fiscozen/alert@3.0.0
  - @fiscozen/button@3.0.0
  - @fiscozen/input@3.0.0
  - @fiscozen/progress@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/progress@2.0.0
  - @fiscozen/action@2.0.0
  - @fiscozen/alert@2.0.0
  - @fiscozen/input@2.0.0

## 1.0.4

### Patch Changes

- 457253d: Use FzAlert variant text for error message

## 1.0.3

### Patch Changes

- Updated dependencies [a42b3b4]
- Updated dependencies [26cd2bf]
  - @fiscozen/alert@1.1.0
  - @fiscozen/input@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies [640ed46]
  - @fiscozen/progress@1.1.0

## 1.0.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/action@1.1.1
  - @fiscozen/alert@1.0.1
  - @fiscozen/button@1.0.2
  - @fiscozen/input@1.0.1
  - @fiscozen/progress@1.0.2

## 1.0.0

### Major Changes

- **LIB-1909/LIB-1918: Redesign completo di FzTypeahead.** Merge architetturale con FzSelect, nuova API con supporto ricerca fuzzy, action, alert e progress integrati.

### Modifiche dalla versione 0.1.16

#### Nuove funzionalità

- **Ricerca fuzzy** con Fuse.js tramite la prop `fuzzySearch` (LIB-1918)
- Pulsante icona a destra con gestione personalizzata (LIB-1918)
- Evento rinominato in `fztypeahead:select` con namespace (LIB-1918)
- Chiusura del dropdown con Escape anche senza opzioni visibili (LIB-1918)
- Debounce migliorato per le chiamate di ricerca (LIB-1918)
- Floating label con altezza adattata (LIB-1918)

#### Refactoring

- Merge architetturale con FzSelect: componenti condivisi e logica unificata (LIB-1918)
- Deprecation warnings aggiornati per le prop legacy (LIB-1918)
- Semplificazione della computation di `selectedOption` (LIB-1918)

#### Dalla versione 0.1.16 (pre-redesign)

- Fix per la preselezione tramite input che ora cerca nella label (non nel valore)
- Slot `label` personalizzabile
- Prop `allowFreeInput` per consentire input libero
- Fix per `disableFreeInput` con gestione coerente dell'input
- Gestione reattiva delle opzioni di `selectProps`
- Fix per l'override dell'input in stato "dirty"
- Fix per l'aggiornamento del model quando `selectProps.options` cambia
- Reset dell'input quando il model viene impostato a stringa vuota

### Patch Changes

- Updated dependencies
  - @fiscozen/action@1.1.0
  - @fiscozen/alert@1.0.0
  - @fiscozen/button@1.0.1
  - @fiscozen/input@1.0.0
  - @fiscozen/composables@1.0.1
  - @fiscozen/progress@1.0.1
