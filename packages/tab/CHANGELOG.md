# @fiscozen/tab

## 1.0.0

### Major Changes

- 98d491d: Updated FzTabs to reflect new design system specs

  ### BREAKING CHANGES

  `FzTabs` doesn't automatically handle tab overflow; it is now controlled by the user via the `tabStyle` prop. Now is developer responsibility to handle the overflow of the tabs based on his use cases.

  ### NEW FEATURES
  - New `tabStyle="fullWidth"` variant: the tab container stretches to fill the full available width and each tab expands equally with centered text
  - The `tone` prop (`'neutral' | 'alert'`) is now set on individual `FzTab` components instead of the `FzTabs` container, allowing specific tabs to be highlighted independently
  - New `environment` prop (`'backoffice' | 'frontoffice'`) for sizing, replacing the deprecated `size` prop
  - New `tabStyle` prop (`'scroll' | 'picker' | 'fullWidth'`) to control tab style and overflow behavior
  - The `change` event now also emits the selected button DOM element as a second argument: `(title: string, element: HTMLElement | null)`

  ### DEPRECATED FEATURES
  - The `size` prop is deprecated: use `environment` instead
  - The `horizontalOverflow` prop is deprecated: use `tabStyle` instead

  ### DOCUMENTATION
  - Updated `FzTabs.mdx` documentation to reflect the new specifications

## 0.1.12

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/badge@1.0.1

## 0.1.11

### Patch Changes

#### Modifiche dalla versione 0.1.8

- Layout **full width** del picker su dispositivi mobile
- Nuovo layout con correzioni di stile e refactoring del componente
- Gestione dell'overflow con resize automatico e `v-if` corretto
- Correzione del border radius per i tab (LIB-487)
- Rimozione dell'emit inutilizzato (LIB-478)
- Cambio automatico a un tab esistente dopo la cancellazione (LIB-478)
- Nuovi slot `tabs-end` e `tabs-content-ends` (LIB-477)
- Correzione del rendering dei figli dei tab (LIB-462)
- Hotfix per il rendering con `v-for` (LIB-460)
- Gap corretto e layout verticale con emissione dell'evento `onChange` (LIB-388)
- Updated dependencies
  - @fiscozen/badge@1.0.0
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
