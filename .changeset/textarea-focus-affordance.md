---
'@fiscozen/textarea': minor
---

feat(textarea): let the `bare` variant delegate its focus indicator to the container

`variant="bare"` draws a `focus-visible` outline on the field, standing in for the
border-colour cue it turns off. That outline is offset from the *field*, so inside a
container with padding of its own it lands within the visible box and reads as a field
inside a field.

`focusAffordance` moves the indicator instead of removing it:

- `'field'` (default) keeps today's behaviour exactly — existing callers are unaffected,
  and a caller who never hears of the prop cannot lose its focus indicator.
- `'container'` draws no indicator on the field and suppresses the browser's native ring
  as well, on the condition that the caller draws one on its own box (`focus-within:`).

The prop transfers a WCAG 2.4.7 (Focus Visible) obligation, it does not cancel it — the
component cannot verify the caller honoured it, which is why the default does not change.
It applies to `variant="bare"` only; setting it on the default variant, which recolours its
own border, warns and does nothing.

This replaces the `!focus-visible:outline-none` override that was previously the only way to
get that shape from a call site.
