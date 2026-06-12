---
"@fiscozen/card-list": minor
---

FzCardList / FzCardListItem: support an optional `icon` on the `badge` object.

When provided it is forwarded to `FzBadge.leftIcon`, rendering a Font Awesome
icon to the left of the badge text. Existing badge usages without `icon` are
unchanged. Works across the three internal rendering variants (no-action,
single-link action, multi-actions dropdown).
