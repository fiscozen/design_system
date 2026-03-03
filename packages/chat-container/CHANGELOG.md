# @fiscozen/chat-container

## 2.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/button@3.0.0
  - @fiscozen/card@3.0.0

## 1.0.1

### Patch Changes

- 4ab39fe: fix(chat-container): refine waiting for response message and message alignment
  - Remove unnecessary v-bold directive from waiting for response message text
  - Unify message card content alignment to start (alignItems="start") for consistent formatting
  - Remove getMessageAlignment helper in favor of fixed alignment

## 1.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/card@2.0.0
  - @fiscozen/container@0.4.2

## 0.1.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
- Updated dependencies [2cc511a]
  - @fiscozen/button@1.0.2
  - @fiscozen/card@1.1.0
