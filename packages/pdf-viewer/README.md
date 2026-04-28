# @fiscozen/pdf-viewer

Vue 3 component for rendering PDF files with zoom, page navigation, and optional PDF/XML view mode toggle.

## Installation

```bash
npm install @fiscozen/pdf-viewer
```

## Usage

```vue
<script setup>
import { FzPdfViewer } from '@fiscozen/pdf-viewer'
</script>

<template>
  <FzPdfViewer src="https://example.com/document.pdf" width="100%" />
</template>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | **Required.** URL of the PDF file. |
| `xmlSrc` | `string` | — | URL of the XML file. When provided alongside `toolbarVariant="advanced"`, enables the PDF/XML view mode toggle. In XML mode, the XML is rendered in an iframe and zoom/page controls are hidden. |
| `environment` | `"frontoffice" \| "backoffice"` | `"frontoffice"` | Environment variant for sizing. |
| `height` | `string` | `"768px"` | Height of the viewer container. |
| `width` | `string` | `"512px"` | Width of the viewer container. |
| `toolbarVariant` | `"basic" \| "advanced"` | `"basic"` | `"basic"` shows zoom and page navigation. `"advanced"` adds download button and, when `xmlSrc` is provided, a PDF/XML view mode toggle. |
| `toolbarPosition` | `"top" \| "bottom"` | `"bottom"` | Position of the toolbar relative to the PDF. When `"top"`, the toolbar is only revealed on hover. |
| `initialPage` | `number` | `1` | Starting page. |
| `initialScale` | `number` | `1` | Starting zoom level (1 = 100%). |
| `minScale` | `number` | `0.25` | Minimum zoom level. |
| `maxScale` | `number` | `2` | Maximum zoom level. |
| `scaleStep` | `number` | `0.25` | Zoom increment per step. |
| `selectable` | `boolean` | `false` | When `true`, renders a text layer that allows users to select and copy text. |
| `rotatable` | `boolean` | `false` | When `true`, shows a rotate button in the advanced toolbar. Only applies when `toolbarVariant="advanced"`. |
| `containerClass` | `string` | — | Custom CSS class for the outer container. |
| `pdfContainerClass` | `string` | — | Custom CSS class for the PDF/content container. |

## v-model

| Model | Type | Default | Description |
|---|---|---|---|
| `viewMode` | `"pdf" \| "xml"` | `"pdf"` | Current view mode. Only active when `toolbarVariant="advanced"` and `xmlSrc` is provided. |

## Events

| Event | Payload | Description |
|---|---|---|
| `download` | — | Emitted when the download button is clicked. The parent is responsible for handling the actual download (e.g. downloading PDF or XML depending on current `viewMode`). |

## Examples

### Basic toolbar

```vue
<FzPdfViewer
  src="https://example.com/document.pdf"
  width="100%"
/>
```

### Advanced toolbar with download

```vue
<FzPdfViewer
  src="https://example.com/document.pdf"
  toolbarVariant="advanced"
  width="100%"
  @download="handleDownload"
/>
```

### PDF/XML toggle

When `xmlSrc` is provided alongside `toolbarVariant="advanced"`, the component shows a tab switcher to toggle between PDF view and XML view. In XML mode, the XML is rendered in an iframe; zoom and page controls are hidden while the download button remains visible.

```vue
<script setup>
import { ref } from 'vue'
import { FzPdfViewer } from '@fiscozen/pdf-viewer'

const viewMode = ref('pdf')

function handleDownload() {
  const url = viewMode.value === 'pdf' ? pdfUrl : xmlUrl
  // trigger download...
}
</script>

<template>
  <FzPdfViewer
    src="https://example.com/document.pdf"
    xmlSrc="https://example.com/document.xml"
    toolbarVariant="advanced"
    v-model:viewMode="viewMode"
    width="100%"
    @download="handleDownload"
  />
</template>
```

> **Note:** The `download` event does not automatically download anything. Use `viewMode` to determine whether to download the PDF or the XML.
