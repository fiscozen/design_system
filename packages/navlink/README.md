# @fiscozen/navlink

> ⚠️ **Deprecated for external use — internal-only until consumers migrate.**
>
> New code must use [`@fiscozen/action`](../action/README.md) (`FzAction`) instead.
>
> This package stays published on npm and remains buildable because it is still consumed internally by **`@fiscozen/actionlist`** and **`@fiscozen/navlist`** (both of which are themselves deprecated). It cannot be removed until those consumers migrate to `@fiscozen/action`. No new features will be developed and no bug fixes will be backported.

## Notes
- RouterNavlink wraps Navlink and passes all the props to the Navlink inside

## Migration to @fiscozen/action

This package exports `FzNavlink` (button-like) and `FzRouterNavlink` (router-link wrapper). Both map to `FzAction` with `variant="textLeft"`, distinguished by the `type` prop:

```vue
<!-- Before: FzNavlink (button) -->
<FzNavlink :iconName="iconName" :iconVariant="iconVariant" :disabled="disabled" @click="onClick">
  {{ label }}
</FzNavlink>

<!-- After: FzAction with type="action" -->
<FzAction
  type="action"
  variant="textLeft"
  :label="label"
  :iconLeftName="iconName"
  :iconLeftVariant="iconVariant"
  :disabled="disabled"
  @click="onClick"
/>
```

```vue
<!-- Before: FzRouterNavlink (vue-router link) -->
<FzRouterNavlink :meta="{ name: 'home' }" :iconName="iconName" :disabled="disabled">
  {{ label }}
</FzRouterNavlink>

<!-- After: FzAction with type="link" -->
<FzAction
  type="link"
  variant="textLeft"
  :label="label"
  :iconLeftName="iconName"
  :to="{ name: 'home' }"
  :disabled="disabled"
/>
```

### Prop mapping

| `@fiscozen/navlink` | `@fiscozen/action` | Notes |
| --- | --- | --- |
| `iconName` | `iconLeftName` | Default rendering is left of the label. For an icon-only layout pass `variant="onlyIcon"` and use `iconName` instead. |
| `iconVariant` | `iconLeftVariant` | Same as above for `onlyIcon`. |
| `iconSize` | — | `FzAction` derives size from `environment` and `variant`; no direct equivalent. |
| `label` | `label` | Identical. |
| `disabled` | `disabled` | Identical. Also supports `readonly` (new). |
| `meta` (on `FzRouterNavlink`) | `to` | Pass the same `vue-router` location object. |
| Default slot | Default slot (or `label`) | Identical. |
| Native `click` | `click`, plus `keydown` | `FzAction` emits keydown for keyboard activation too. |

`FzAction` adds props not available here: `subLabel`, text truncation, `environment` (backoffice/frontoffice), `role`, `ariaSelected`, and the `textCenter` / `onlyIcon` variants.
