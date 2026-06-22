---
"@fiscozen/card-list": patch
---

Re-export `FzActionProps` and `FzBadgeTone` from the package entry

  - `@fiscozen/card-list` now re-exports `FzActionProps` (originally from `@fiscozen/action`) and `FzBadgeTone` (originally from `@fiscozen/badge`). Both types are part of the public surface of `FzCardList` (used in `FzCardListItemProps.actions` and `FzCardListItemProps.badge`).
  - Consumers can now import everything from the single package entry, without adding `@fiscozen/action` or `@fiscozen/badge` as direct dependencies just to obtain typings.

No behavior change.
