---
"@fiscozen/pdf-viewer": patch
---

`FzPdfViewer` renders PDFs with pdf.js 6.4.299 (through `@tato30/vue-pdf` 2.2.1), which fixes CSS injection and viewer/worker hangs on crafted PDFs (AIKIDO-2026-169371). pdf.js 6 needs `Map.prototype.getOrInsertComputed`, which only Chrome 145, Firefox 144 and Safari 26.2 have: `FzPdfViewer` now polyfills it on the main thread and runs the pdf.js legacy worker, so PDFs keep rendering on older browsers and on iOS/Android WebViews.
