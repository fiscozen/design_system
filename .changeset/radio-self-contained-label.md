---
'@fiscozen/radio': patch
---

`FzRadio` and `FzRadioGroup` now set `mb-0` on their `<label>` (and on `FzRadioGroup`'s help `<p>`) as a baseline.
This makes the label spacing environment-agnostic: hosts with Bootstrap reboot but without global Tailwind preflight no longer leak `label { margin-bottom: 0.5rem }` / `p { margin-bottom: 1rem }` into the layout.
The other baselines the shim covered (`display: flex`, `text-core-black`, disabled `grey-300`, and the `text-semantic-error` palette default) were already present in the components.
No changes to the public props.
