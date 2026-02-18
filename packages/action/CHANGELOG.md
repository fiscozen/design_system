# @fiscozen/action

## 1.1.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.

## 1.1.0

### Minor Changes

- **LIB-1902/LIB-1909: Nuovo componente FzAction.** Componente per azioni con supporto accessibilità, gestione stato disabled, e integrazione con FzActionList.

### Funzionalità principali

- Componente **FzAction** per pulsanti azione con stili e comportamenti standardizzati (LIB-1902)
- Integrazione con **FzActionList** per liste di azioni strutturate (LIB-1909)
- Gestione avanzata del **tabindex** con possibilità di override via prop (LIB-1909)
- Prop `isInteractive` come computed property per gestione stato attivo/disattivo (LIB-1909)
- Gestione dello stato **disabled** per le opzioni delle azioni (LIB-1918)
- Miglioramenti di accessibilità conformi alle linee guida ARIA (LIB-1909)

### Patch Changes

- Updated dependencies
  - @fiscozen/link@1.0.0
