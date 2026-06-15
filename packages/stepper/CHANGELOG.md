# @fiscozen/stepper

## 3.0.3

### Patch Changes

- @fiscozen/dropdown@1.0.10

## 3.0.2

### Patch Changes

- @fiscozen/dropdown@1.0.9

## 3.0.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/dropdown@1.0.8

## 3.0.0

### Major Changes

- 6ec3eb4: FzStepper review feedback.

  BREAKING CHANGE: remove the `environment` prop and the `FzStepperEnvironment` exported type. The prop was declarative-only (never affected rendering); consumers passing `environment="frontoffice" | "backoffice"` must drop the prop.

  Other changes:
  - Align the step badge with the step title using `items-baseline` across the desktop layout, the mobile dropdown opener, and the mobile-without-list layout (was a mix of `items-start` and `items-center`).
  - Mobile: make the action-list popup span the full row width across all mobile breakpoints by overriding the FzDropdown actionList slot and pinning the FzActionList width to the opener row.
  - Fix the mobile title/description truncation by adding the missing `min-w-0` constraints on the opener flex containers.

## 2.1.0

### Minor Changes

- 351b6b7: Align FzStepper with Figma design: new props, visual improvements and refactoring

### Patch Changes

- Updated dependencies [351b6b7]
  - @fiscozen/badge@3.0.1

## 2.0.2

### Patch Changes

- @fiscozen/dropdown@1.0.7

## 2.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/dropdown@1.0.6

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/badge@3.0.0
  - @fiscozen/dropdown@1.0.5

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/style@0.3.0
  - @fiscozen/icons@0.2.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/badge@2.0.0
  - @fiscozen/dropdown@1.0.4

## 0.1.4

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/badge@1.0.1
  - @fiscozen/dropdown@1.0.3

## 0.1.3

### Patch Changes

- Nessuna modifica diretta al componente. Aggiornamento per allineamento alle nuove versioni delle dipendenze.
- Updated dependencies
  - @fiscozen/badge@1.0.0
  - @fiscozen/style@0.2.0
  - @fiscozen/dropdown@1.0.2
  - @fiscozen/composables@1.0.1
