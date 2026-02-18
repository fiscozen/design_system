# @fiscozen/select

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

- **LIB-1909/LIB-1918: Redesign completo di FzSelect.** Nuova architettura con FzActionList, funzionalità di filtro con Fuse.js, e integrazione di alert e progress.

### Modifiche dalla versione 0.1.14

#### Nuove funzionalità

- Filtro integrato con ricerca fuzzy tramite **Fuse.js** (LIB-1918)
- Prop `clearable` per svuotare la selezione con un'icona dedicata (LIB-1909, LIB-1918)
- Integrazione con **FzActionList** per le opzioni (LIB-1909)
- Integrazione con **FzAlert** per messaggi di errore/avviso (LIB-1909)
- Floating label con variante ad altezza adattata (LIB-1918)
- Gestione migliorata della tastiera: chiusura del dropdown con Enter/Space (LIB-1909)
- Scroll handler migliorato per le liste di opzioni (LIB-1909)
- Gestione dei `disabled` e `readonly` centralizzata (LIB-1909)

#### Refactoring

- Ristrutturazione completa del componente con nuovi componenti presentazionali (FzSelectButton, ecc.) (LIB-1909)
- Rimozione dei componenti deprecati FzSelectLabel e FzSelectOption (LIB-1909)
- Deprecation warnings per le prop `size` e `rightIconLast` (LIB-1909, LIB-1918)
- Nuovo model tipizzato come `string | undefined` (LIB-1909)
- Miglioramenti di accessibilità nei componenti FzAction e FzSelect (LIB-1909)

#### Dalla versione 0.1.14 (pre-redesign)

- Supporto sottotitoli nelle opzioni (LIB-1452)
- Label su FzSelect (LIB-1360)
- Floating label e right icon click (LIB-1062)
- Gestione layering con z-index (LIB-1274)
- Fix larghezza e posizionamento floating (LIB-1268)

### Patch Changes

- Updated dependencies
  - @fiscozen/action@1.1.0
  - @fiscozen/alert@1.0.0
  - @fiscozen/button@1.0.1
  - @fiscozen/input@1.0.0
  - @fiscozen/composables@1.0.1
  - @fiscozen/progress@1.0.1
