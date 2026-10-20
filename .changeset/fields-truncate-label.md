---
"@fiscozen/input": minor
"@fiscozen/select": minor
"@fiscozen/textarea": minor
---

`FzInput`, `FzSelect` and `FzTextarea` take a `truncateLabel` prop: the label stays on one line, cut with an ellipsis when it is wider than the field, and a cut label shows in full in a tooltip on hover and while the field has focus. Fields laid side by side stay aligned whatever their labels' length, and the required asterisk stays visible past the cut. The field keeps the full label as its accessible name. `FzDatepicker` gets it through `inputProps`. Without the prop nothing changes.
