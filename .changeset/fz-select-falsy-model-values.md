---
"@fiscozen/select": patch
---

fix(FzSelect): preserve falsy option values (`0`, `""`) in v-model

The `selectedOption` computed short-circuited on `!model.value`, which is
truthy for any falsy value. Selecting an option whose `value` is the
number `0` or the empty string was therefore matched and emitted
correctly but never reflected back: the opener kept showing the
placeholder instead of the selected option label.

Switched the guard to an explicit `undefined`/`null` check so only
"no selection" short-circuits — actual option values pass through to
`Array.prototype.find` and are matched by strict equality as before.
