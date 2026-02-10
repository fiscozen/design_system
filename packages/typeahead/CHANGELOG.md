# @fiscozen/typeahead

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
