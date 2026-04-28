---
"@fiscozen/pdf-viewer": major
---

Add PDF/XML view mode toggle, new toolbar props, and refactor internal components.

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
