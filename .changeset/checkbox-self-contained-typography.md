---
'@fiscozen/checkbox': patch
---

`FzCheckbox` and `FzCheckboxGroup` now set `text-core-black` on their root container and `mb-0` on their inner `<label>` as a baseline.
This makes the components environment-agnostic: hosts with Bootstrap reboot but without global Tailwind preflight no longer leak `body { color }` into descendant text, nor `label { margin-bottom: 0.5rem }` into the label spacing.
No changes to the public props.
