# @fiscozen/pdf-viewer

## 1.0.0

### Minor Changes

#### PDF/XML view mode toggle

- Added `xmlSrc` prop: when provided alongside `toolbarVariant="advanced"`, enables a PDF/XML tab switcher in the toolbar
- In XML mode, the XML file is rendered in an iframe; zoom and page navigation controls are hidden while the download button remains visible
- The PDF/XML tabs are only shown when `xmlSrc` is provided — existing usages with `toolbarVariant="advanced"` but no `xmlSrc` are unaffected
- `v-model:viewMode` (`"pdf" | "xml"`) exposes the current mode to the parent; the parent is responsible for handling downloads per mode via the `download` event

## 0.1.6

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1

## 0.1.5

### Patch Changes

- @fiscozen/button@3.0.0

## 0.1.4

### Patch Changes

- @fiscozen/button@2.0.0

## 0.1.3

### Patch Changes

- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2

## 0.1.2

### Patch Changes

#### Modifiche dalla versione 0.1.0

- Aggiornamento della libreria **tato30/vue-pdf** a una nuova versione
- Implementazione iniziale del componente FzPDFViewer (LIB-162)
- Updated dependencies
  - @fiscozen/button@1.0.1
