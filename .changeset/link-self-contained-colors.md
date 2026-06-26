---
'@fiscozen/link': patch
---

`FzLink` now ships its own color and text-decoration as a co-located stylesheet (`fz-link.css`) instead of relying solely on Tailwind utility classes.
Hosts whose Tailwind build does not scan `@fiscozen/*` never generated the DS-specific utility combos (`hover:text-blue-600`, `hover:underline`, `focus:border-blue-600`, …), so the link fell back to the host's default anchor styling.
The existing utility classes are kept on the element and the shipped CSS references the same design tokens, so the rendering is unchanged wherever the utilities already applied — it only fills the gap where they were absent. Covers all combinations: default/danger type, underline/no-underline, hover/focus/disabled.
No changes to the public props.
