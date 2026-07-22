---
"@fiscozen/composables": patch
---

FzFloating: keep floating content inside the viewport horizontally and vertically

`useFloating`'s boundary correction previously clamped the floating element to the resolved container rect only. For openerless / container-less consumers (e.g. `FzDropdown`) the container resolves to `document.body`, whose rect can be wider than — or extend below — the visible viewport on narrow/mobile screens. A dropdown opened from a control near the right edge (such as a per-row kebab menu in a table) could therefore render overflowing off the right edge or overlapping adjacent menus.

Boundary correction now clamps against the intersection of the container and the viewport (`window.innerWidth`/`innerHeight`, mirroring the auto-positioning util) and keeps an 8px safety margin: if the element would overflow the right edge it is shifted left so its right edge stays on screen, the left edge is clamped to the margin, and the same is applied vertically. Behaviour is unchanged when there is enough room.
