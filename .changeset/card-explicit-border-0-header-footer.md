---
'@fiscozen/card': patch
---

`FzCard` now applies an explicit `border-0` on the header and footer by default.
Fixes cases where consumers mixing Tailwind without preflight + Bootstrap reboot saw an unwanted border because the template applied a lone `border-solid` (border-style without width → UA fallback `border-width: medium`).
Variants with a border keep working unchanged.
