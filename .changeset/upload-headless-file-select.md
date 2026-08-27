---
"@fiscozen/upload": minor
---

FzUpload: `useFileSelect`, a headless file picker, plus an `opener` slot

`FzUpload` welded the behaviour of picking files to the presentation of picking files. It rendered a hidden `input type="file"` and its own `FzButton` inside a dashed drop zone, and exposed neither, so a control that needed the picker without the widget had exactly one road: render `FzUpload` with `class="hidden"`, bind a `v-model` only to drain it — otherwise the hidden `<ul>` mints object URLs for files nobody will ever see — and reach the input through the component's root element. That is a dependency on private DOM, and it is what the chat composer in `@fzp/customers` currently does.

The fix is a layer down rather than an escape hatch on top. `useFileSelect` is the file-selection behaviour on its own:

```ts
const { open } = useFileSelect({
  multiple: true,
  accept: () => props.accept,
  onSelect: (files) => emit('attach', files)
})
```
```vue
<FzIconButton icon-name="paperclip" @click="open" />
```

Nothing is rendered for that to work. With no `element` passed the composable creates and owns its own input, so there is no hidden component to mount, no model to drain, and no template ref to null-check. The "must work while the component is `display: none`" problem disappears instead of being tested around, and because the input comes from design-system code, a consumer bound by a lint rule against raw `<input>` stays inside it.

`FzUpload` is now built on the same composable, so the widget and a bare `useFileSelect` call cannot drift apart. Its rendered output is unchanged.

Two smaller additions, for when the widget itself is still right:

- **`opener` slot** — replaces the button that opens the picker and receives `open`, the way `FzDropdown`'s `opener` slot works. The drop zone, the file list and the model keep working around it.
- **`defineExpose({ open })`** — the imperative way in, for a caller that holds a ref to the component.

One behavioural change comes with the refactor: an empty selection no longer reaches the model. Dropping a drag event that carries no files used to emit `fzupload:add`/`fzupload:change`, and with `multiple: false` it pushed `[undefined]` into the model — a limitation the spec had documented rather than fixed. `onSelect` is now never called with an empty list.
