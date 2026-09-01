---
"@fiscozen/navbar": minor
---

`FzNavbar`: new `elevation` prop (`'raised' | 'flat'`, default `'raised'`) to switch the elevation shadow off — for a navbar that sits _on_ the page background rather than above it, like the backoffice rail inside `FzFrameTemplate`, where a shadow draws a fake edge along a surface with nothing behind it.

It has to be a prop. The shadow is declared by this package's own `.fz-navbar` rule, at the same specificity as any Tailwind utility, so whether a `shadow-none` added at the call site wins comes down to stylesheet order rather than intent; and the documented escape hatch, `--fz-navbar-shadow`, needs `style`, which consuming repos block under their compose-only styling policy exactly as they block `class`. Deciding it inside the component is the only way the capability exists for them. `elevation` takes precedence over `--fz-navbar-shadow` on purpose.

The redundant Tailwind `shadow` utility is gone from the root's class list: the package's stylesheet already declared the same value, and leaving the utility in place is what made the shadow unswitchable. **No visual change at the default** — the rendered shadow is identical, and it now has exactly one source. Consumers whose build skips this package's CSS would lose the shadow, but they already lose padding, height, z-index and background, which have only ever lived there.

Not coupled to `variant`: the frontoffice renders a vertical rail with a shadow today, and inferring elevation from the variant would change that silently.
