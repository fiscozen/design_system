---
"@fiscozen/input": patch
---

`FzInput` no longer makes the box around the input a tab stop: one Tab moves focus from one field's input straight to the next field's input, instead of stopping first on an empty container where typed characters were lost. Clicking anywhere in the box still focuses the input, and clickable icons with an aria-label stay keyboard reachable.
