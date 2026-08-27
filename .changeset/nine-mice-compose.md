---
'@fiscozen/textarea': minor
---

feat(textarea): add a `bare` variant for single-line composer bars (LIB-2927)

`variant="bare"` turns off every box-drawing declaration the component owns — border, background,
padding, radius, minimum height and minimum width — so the container around the field becomes the
visible field. Everything else is unchanged: label, help text, error ARIA, `autoHeight` and
`maxRows`, which now also hold with zero padding.

Two defaults shift with the variant so a composer bar starts in the right shape: `rows` is `1` and
`resize` is `'none'`. The focus cue is replaced rather than removed — with no border to recolour, the
bare field draws a 2px `blue-600` `focus-visible` outline on itself.

The default variant is untouched, visually and behaviourally.
