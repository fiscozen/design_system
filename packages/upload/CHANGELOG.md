# @fiscozen/upload

## 1.1.1

### Patch Changes

- @fiscozen/button@3.1.3

## 1.1.0

### Minor Changes

- 5d928c4: FzUpload: `useFileSelect`, a headless file picker, plus an `opener` slot

  `FzUpload` welded the behaviour of picking files to the presentation of picking files. It rendered a hidden `input type="file"` and its own `FzButton` inside a dashed drop zone, and exposed neither, so a control that needed the picker without the widget had exactly one road: render `FzUpload` with `class="hidden"`, bind a `v-model` only to drain it — otherwise the hidden `<ul>` mints object URLs for files nobody will ever see — and reach the input through the component's root element. That is a dependency on private DOM, and it is what the chat composer in `@fzp/customers` currently does.

  The fix is a layer down rather than an escape hatch on top. `useFileSelect` is the file-selection behaviour on its own:

  ```ts
  const { open } = useFileSelect({
    multiple: true,
    accept: () => props.accept,
    onSelect: (files) => emit("attach", files),
  });
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

## 1.0.7

### Patch Changes

- @fiscozen/button@3.1.2

## 1.0.6

### Patch Changes

- @fiscozen/button@3.1.1

## 1.0.5

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0

## 1.0.4

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/link@1.0.1

## 1.0.3

### Patch Changes

- @fiscozen/button@3.0.0

## 1.0.2

### Patch Changes

- @fiscozen/button@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2

## 1.0.0

### Major Changes

- **LIB-1919: Redesign completo di FzUpload.** Nuova API con supporto multi-file e limite massimo di file caricabili.

### Modifiche dalla versione 0.1.4

#### Nuove funzionalità

- Supporto per caricamento **multi-file**
- Prop per configurare il **limite massimo** di file caricabili
- Nuova interfaccia utente allineata al design system 1.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/button@1.0.1
  - @fiscozen/link@1.0.0
