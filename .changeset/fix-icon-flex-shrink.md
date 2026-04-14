---
"@fiscozen/icons": patch
---

fix(FzIcon): prevent icon shrinking in flex containers on Firefox and Safari

Add `shrink-0` to the icon container to prevent flex shrink from reducing icon dimensions below their intended size. This fixes a visual regression where icons in FzSelect (and potentially other flex-based layouts) would shrink from 20x20 to 18.5x20 in Firefox and Safari when the dropdown opens.
