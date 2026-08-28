---
'@fiscozen/textarea': minor
---

feat(textarea): add a `bare` variant for single-line composer bars (LIB-2927)

`variant="bare"` turns off every box-drawing declaration the component owns — border, background,
padding, radius, minimum height and minimum width — and declares no font size, so the container
around the field becomes the visible field and owns the type: a `text-sm` on the box carries the
field and anything else inside it on one scale. Everything else is unchanged: label, help text,
error ARIA, `autoHeight` and `maxRows`, which now also hold with zero padding.

`maxRows` also gained a fallback for a line height that computes to `normal` (possible now that the
bare field inherits its type): the ceiling uses the browser's ~1.2 ratio instead of going unbounded.
The default variant, with its fixed `text-base`, was never exposed to that.

Two defaults shift with the variant so a composer bar starts in the right shape: `rows` is `1` and
`resize` is `'none'`. The focus cue is replaced rather than removed — with no border to recolour, the
bare field draws a 2px `blue-600` `focus-visible` outline on itself.

The default variant is untouched, visually and behaviourally.
