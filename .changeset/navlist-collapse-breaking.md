---
"@fiscozen/navlist": major
---

Breaking change: `FzNavlistSub` extends `FzCollapseProps` which renamed `summary` to `title`.

Consumers passing `summary` in navlist sub-menu items must rename the property to `title`.
