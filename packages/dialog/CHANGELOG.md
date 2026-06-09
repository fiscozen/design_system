# @fiscozen/dialog

## 0.1.32

### Patch Changes

- 172fe72: Pad dialog content by the safe-area insets so full-screen dialogs on notched
  devices (e.g. iPhone with Dynamic Island) keep their header — title and close
  button — clear of the status bar instead of rendering underneath it, where the
  close button was untappable (HD-24264). `env(safe-area-inset-*)` resolves to
  `0px` on every non-notched surface, so there is no visual change off-device.
- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 0.1.31

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1

## 0.1.30

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 0.1.29

### Patch Changes

- @fiscozen/button@3.0.0

## 0.1.28

### Patch Changes

- Updated dependencies [a26bc2c]
  - @fiscozen/style@0.3.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2

## 0.1.27

### Patch Changes

- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2

## 0.1.26

### Patch Changes

#### Modifiche dalla versione 0.1.24

- Aggiunta della prop `closeOnEscape` con valore predefinito per consentire la chiusura del dialog premendo Escape
- Updated dependencies
  - @fiscozen/button@1.0.1
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
