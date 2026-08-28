---
"@fiscozen/radio": minor
---

feat(radio): add FzRadioIconTile, a selectable icon-only tile (LIB-2928)

A single-select tile whose whole content is one icon: full height, full column width, icon centred, colour by accent. It fills the gap between `FzIconButton` (fixed, toolbar-sized) and `FzRadioCard` (a card with image, title and subtitle), so consumers no longer have to reshape `FzButton` from the outside with `!h-[82px] !w-full !rounded !border-1` plus per-tone tints.

It is a native radio rather than a toggle button: the selected state reaches assistive technology through `:checked` instead of a hand-maintained `aria-pressed`, and inside `FzRadioGroup` it inherits `role="radiogroup"`, a shared `name` and native arrow-key navigation.

- `label` is required by the type and rendered visually hidden — colour and icon alone must never be the only way to tell the options apart.
- `accent` (`neutral` | `success` | `warning` | `error`) maps onto the `@fiscozen/style` semantic token families and stays independent from the radio family's validation `tone`, which `FzRadioGroup` spreads to every child.
- Selection shows on three vectors: native checked state, 1px → 2px border, accent tint.
