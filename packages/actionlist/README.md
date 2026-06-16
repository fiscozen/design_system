# @fiscozen/actionlist

> ⚠️ **Deprecated for external use — internal-only until consumers migrate.**
>
> New code must use [`@fiscozen/action`](../action/README.md) (`FzActionList` + `FzActionSection` + `FzAction`) instead.
>
> This package stays published on npm and remains buildable because it is still consumed internally by **`@fiscozen/table`**. It cannot be removed until that consumer migrates to `@fiscozen/action`. No new features will be developed and no bug fixes will be backported. The Storybook page `Navigation/FzActionList` already documents the replacement.

Action list is a vertical list of interactive actions or options. It's composed of items presented in a consistent, single-column format.

## Migration to @fiscozen/action

`FzActionlist` from this package maps to a composition of three components from `@fiscozen/action`:

```vue
<!-- Before: @fiscozen/actionlist -->
<FzActionlist
  :label="label"
  :items="items"
  @fzaction:click="onClick"
/>

<!-- After: @fiscozen/action -->
<FzActionList :listClass="listClass">
  <FzActionSection :label="label">
    <FzAction
      v-for="(item, index) in items"
      :key="index"
      :type="item.type === 'link' ? 'link' : 'action'"
      variant="textLeft"
      :label="item.label"
      v-bind="item"
      @click="onClick(index, item)"
    />
  </FzActionSection>
</FzActionList>
```

Notable differences:

| Concept | `@fiscozen/actionlist` | `@fiscozen/action` |
| --- | --- | --- |
| Container | `FzActionlist` (single component) | `FzActionList` + `FzActionSection` (composition) |
| Section label | `label` prop on `FzActionlist` | `label` prop on `FzActionSection` |
| Item type discriminator | `item.type: 'button' \| 'link'` | `FzAction` `type: 'action' \| 'link'` (note `'button'` → `'action'`) |
| Icon API | single `iconName` / `iconVariant` (inherited from `FzNavlink`) | `iconLeftName` / `iconLeftVariant` / `iconRightName` / `iconRightVariant` (or `iconName` for `variant="onlyIcon"`) |
| Click event | `fzaction:click` with `(index, item)` | native `click` on each `FzAction` |
| Per-item slot | `#fzaction-item-${index}` | default slot of each `FzAction` |
| Extra features | — | `subLabel`, text truncation, `readonly`, `environment`, `role`, `ariaSelected`, multiple visual variants |

See `apps/storybook/src/stories/navigation/Actionlist.stories.ts` for the canonical examples written against the replacement.
