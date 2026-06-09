---
"@fiscozen/dialog": patch
---

Pad dialog content by the safe-area insets so full-screen dialogs on notched
devices (e.g. iPhone with Dynamic Island) keep their header — title and close
button — clear of the status bar instead of rendering underneath it, where the
close button was untappable (HD-24264). `env(safe-area-inset-*)` resolves to
`0px` on every non-notched surface, so there is no visual change off-device.
