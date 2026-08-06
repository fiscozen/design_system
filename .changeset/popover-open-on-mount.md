---
'@fiscozen/popover': patch
---

FzPopover: show a popover whose `open` is already true at mount. The watcher only fires on change, so a popover that starts open — a docs example, a visual snapshot, a menu restored from state — rendered closed while the model said open.
