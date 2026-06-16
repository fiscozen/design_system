# @fiscozen/navlist

> ⚠️ **Deprecated for external use — no internal consumers.**
>
> New code must use [`@fiscozen/action`](../action/README.md) (`FzActionList` + `FzActionSection` + `FzAction`) instead.
>
> No other `@fiscozen/*` package depends on `@fiscozen/navlist`, but the package stays published on npm to preserve backward compatibility for downstream consumers. No new features will be developed and no bug fixes will be backported.

## Migration to @fiscozen/action

`FzNavlist` renders multiple sections, each containing a flat list of navigation items or **collapsible submenus**. In `@fiscozen/action` the equivalent is the composition `FzActionList` + `FzActionSection` + `FzAction`. Collapsible submenus are **not** built in: you must wrap the nested `FzActionSection` (or list) in a `FzCollapse` from `@fiscozen/collapse` yourself.

### Flat sections

```vue
<!-- Before: @fiscozen/navlist -->
<FzNavlist
  :sections="[
    {
      label: 'Account',
      items: [
        { type: 'button', label: 'Profile', iconName: 'user' },
        { type: 'link',   label: 'Logout',  meta: { name: 'logout' } }
      ]
    }
  ]"
  @fznavlink:click="onClick"
/>

<!-- After: @fiscozen/action -->
<FzActionList>
  <FzActionSection label="Account">
    <FzAction
      type="action"
      variant="textLeft"
      label="Profile"
      iconLeftName="user"
      @click="onClick(0, { type: 'button', label: 'Profile', iconName: 'user' })"
    />
    <FzAction
      type="link"
      variant="textLeft"
      label="Logout"
      :to="{ name: 'logout' }"
      @click="onClick(1, { type: 'link', label: 'Logout', meta: { name: 'logout' } })"
    />
  </FzActionSection>
</FzActionList>
```

### Sections with collapsible submenus

`FzNavlist` accepts `FzNavlistSub` entries (objects with a `subitems: FzNavlistItem[]` array, passed through to `FzCollapse`). `FzAction` does not provide collapsible submenus, so wrap the nested list explicitly:

```vue
<!-- Before: submenu inside a section -->
<FzNavlist
  :sections="[
    {
      label: 'Documents',
      items: [
        {
          title: 'Invoices',
          subitems: [
            { type: 'link', label: 'Sent',     meta: { name: 'sent' } },
            { type: 'link', label: 'Received', meta: { name: 'received' } }
          ]
        }
      ]
    }
  ]"
/>

<!-- After: FzCollapse from @fiscozen/collapse wrapping a nested FzActionSection -->
<FzActionList>
  <FzActionSection label="Documents">
    <FzCollapse>
      <template #header><span>Invoices</span></template>
      <template #content>
        <FzActionSection>
          <FzAction type="link" variant="textLeft" label="Sent"     :to="{ name: 'sent' }" />
          <FzAction type="link" variant="textLeft" label="Received" :to="{ name: 'received' }" />
        </FzActionSection>
      </template>
    </FzCollapse>
  </FzActionSection>
</FzActionList>
```

### Prop and event mapping

| `@fiscozen/navlist` | `@fiscozen/action` | Notes |
| --- | --- | --- |
| `sections: FzNavlistSection[]` | One `FzActionSection` per section | The `section.label` becomes the `label` prop on `FzActionSection`. |
| `FzNavlistItem` (`type: 'button' \| 'link'`) | `FzAction` (`type: 'action' \| 'link'`, `variant="textLeft"`) | Discriminator value renamed: `'button'` → `'action'`. Icon props change to `iconLeftName` / `iconLeftVariant`. |
| `FzNavlistSub` (collapsible submenu) | `FzCollapse` (from `@fiscozen/collapse`) wrapping a nested `FzActionSection` | No built-in equivalent — wire it up in the consumer. |
| `@fznavlink:click` (`index`, `item`) | native `click` on each `FzAction` | The aggregate `index` is no longer emitted; track it in the consumer if needed. |
