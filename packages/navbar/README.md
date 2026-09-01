# @fiscozen/navbar
RFC: https://github.com/fiscozen/knowledge-base/pull/91

Navbar skeleton component meant for primary navigation.

## Elevation (`elevation`)

`FzNavbar` casts an elevation shadow by default. Pass `elevation="flat"` for a
navbar that sits **on** the page background rather than above it — the backoffice
rail inside `FzFrameTemplate` is the case it exists for: with nothing behind the
rail, a shadow draws a fake edge along a seamless surface.

```vue
<FzNavbar variant="vertical" elevation="flat" />
```

| Value | |
| --- | --- |
| `raised` *(default)* | the elevation shadow — unchanged from every version before the prop existed |
| `flat` | no shadow |

**Why a prop and not a class at the call site.** The shadow is declared by this
package's own `.fz-navbar` rule, which sits at the same specificity as a Tailwind
utility — so whether a `shadow-none` added at the call site wins comes down to
stylesheet order, not intent. The `--fz-navbar-shadow` custom property is not an
answer either: setting it needs `style`, which consuming repos block under their
compose-only styling policy exactly as they block `class`. Deciding it inside the
component is the only way the capability exists for them at all. `elevation` also
takes precedence over `--fz-navbar-shadow`, deliberately — an explicit API should
beat a property set further up.

The other layout values (`--fz-navbar-padding`, `--fz-navbar-height`,
`--fz-navbar-bg`, …) are still custom properties, with the same caveat: they are
out of reach for a compose-only consumer. Promote one to a prop when a consumer
actually needs it.
