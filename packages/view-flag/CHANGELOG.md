# @fiscozen/view-flag

## 1.0.0

### Major Changes

- f4999cc: Refactored FzViewFlag to a slot-only API to remove business logic. The component now renders a fixed border overlay with a default slot for custom content and a named `banner` slot (shown when the `open` prop is `true`) for optional expanded content.

## 0.1.6

### Patch Changes

- @fiscozen/badge@3.0.0

## 0.1.5

### Patch Changes

- @fiscozen/badge@2.0.0

## 0.1.4

### Patch Changes

- Updated dependencies [1a2df8c]
  - @fiscozen/badge@1.0.1

## 0.1.3

### Patch Changes

#### Modifiche dalla versione 0.1.2

- Aggiunto **default slot** per contenuto personalizzabile nel view flag (LIB-1651)
- Correzione dello z-index della parte di posizionamento
- Correzione del layering (LIB-1274)
- Updated dependencies
  - @fiscozen/badge@1.0.0
