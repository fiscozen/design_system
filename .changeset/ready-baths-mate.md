---
"@fiscozen/view-flag": major
---

Refactored FzViewFlag to a slot-only API to remove business logic. The component now renders a fixed border overlay with a default slot for custom content and a named `banner` slot (shown when the `open` prop is `true`) for optional expanded content.
