# @fiscozen/pdf-viewer

## 1.0.3

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0

## 1.0.2

### Patch Changes

- @fiscozen/tab@3.0.5

## 1.0.1

### Patch Changes

- @fiscozen/tab@3.0.4

## 1.0.0

### Major Changes

- 470c009: Add PDF/XML view mode toggle, new toolbar props, and refactor internal components.

  **New feature — `xmlSrc` prop:**
  - Add `xmlSrc?: string` prop. When provided alongside `toolbarVariant="advanced"`, enables a PDF/XML tab switcher in the advanced toolbar
  - In XML mode, the XML is rendered in an iframe; zoom and page navigation controls are hidden while the download button remains visible
  - Tabs are only shown when `xmlSrc` is provided — existing usages with `toolbarVariant="advanced"` but no `xmlSrc` are unaffected
  - `v-model:viewMode` (`"pdf" | "xml"`) exposes the current mode to the parent; the parent is responsible for handling downloads per mode via the `download` event

  **New toolbar props:**
  - `toolbarVariant: 'basic' | 'advanced'` (default `'basic'`) — advanced toolbar adds a view mode toggle (`v-model:viewMode`), a download button (emits `download`), and a reset zoom button
  - `toolbarPosition: 'top' | 'bottom'` (default `'bottom'`) — positions the toolbar above or below the PDF
  - Page navigation is now hidden when the PDF has only one page
  - Fix `scaleStep`, `minScale`, `maxScale` props previously ignored in zoom logic
  - Upgrade `@tato30/vue-pdf` from v1.11.4 to v2.0.2

  **Refactoring:**
  - Extract `PdfZoomControls` and `PdfPageNav` as internal components to remove template duplication between basic and advanced toolbars
  - `usePDF` now receives a reactive `toRef(props, 'src')` so the PDF reloads when `src` changes at runtime
  - Add `toolbarInnerClass` computed to consolidate repeated toolbar hover opacity logic
  - Replace unsafe type cast in `handleViewModeChange` with an explicit type guard

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
