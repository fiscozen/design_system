# @fiscozen/style

Design system package providing design tokens, CSS variables, and Vue.js directives to maintain visual consistency across all FiscoZen projects.

## Installation

```bash
npm install @fiscozen/style
```

## Setup

```typescript
// main.ts
import { createApp } from 'vue'
import { setupFzStyle } from '@fiscozen/style'
import '@fiscozen/style/output/global.css'
import App from './App.vue'

const app = createApp(App)

// Register FiscoZen directives
setupFzStyle(app)

app.mount('#app')
```

## Architecture

### Token Flow

```
tokens.json (Design tokens)
    ↓
token-transformer (Figma format → Style Dictionary format)
    ↓
tokens/global.json
    ↓
Style Dictionary (Custom formatters & transformers)
    ↓
    ├── output/global.css (CSS variables)
    └── output/global.json (JSON tokens)
    ↓
tailwind.config.js (Integrates tokens with Tailwind)
    ↓
Utility classes (text-blue-500, gap-4, etc.)
```

### Key Components

**1. Design Tokens (`tokens.json`)**
- Single source of truth for design values
- Managed via Figma Tokens plugin or manual editing
- Contains colors, spacing, typography, etc.

**2. Build Pipeline (`build.js`)**
- Orchestrates token transformation
- Generates CSS variables and JSON output
- Appends additional CSS (typography, components)

**3. Tailwind Integration (`tailwind.config.js`)**
- Transforms tokens into Tailwind theme
- Generates safelist for dynamically-used classes
- Provides semantic spacing and color defaults

**4. Vue Directives (`src/custom-directives.ts`)**
- `v-color`: Apply design system colors to text
- `v-bold`: Apply semibold font weight
- `v-small`: Apply small text size

## Vue Directives

The package includes custom Vue directives for consistent typography:

### v-color

Apply design system colors to text elements (`p`, `h1`, `h2`, `h3`):

```vue
<template>
  <!-- Default weights (500 for base colors, 200 for semantic) -->
  <p v-color:blue>Blue text</p>
  <h1 v-color:semantic-error>Error heading</h1>
  
  <!-- Explicit weights -->
  <p v-color:blue="300">Light blue text</p>
  <h2 v-color:purple="700">Dark purple heading</h2>
  <p v-color:semantic-warning="100">Light warning text</p>
</template>
```

**Available Colors:**
- **Base colors**: `blue`, `purple`, `orange`, `pink`, `yellow`, `grey`, `core`
  - Weights: `50`, `100`, `200`, `300`, `400`, `500` (default), `600`, `700`, `800`, `900`
  - For `core`: `white`, `black`
- **Semantic colors**: `semantic-error`, `semantic-warning`, `semantic-success`, `semantic-info`
  - Weights: `50`, `100`, `200` (default), `300`

**Default Behavior:**
- Base colors → weight `500`
- Semantic colors → weight `200`

### v-bold

Apply semibold font weight to paragraphs:

```vue
<template>
  <p v-bold>This text is bold</p>
</template>
```

### v-small

Apply small font size to paragraphs:

```vue
<template>
  <p v-small>This text is small</p>
</template>
```

## Default Styling

The package includes predefined styles for common HTML elements:

- `h1`, `h2`, `h3`
- `p`
  - `v-bold`
  - `v-small`

## Build & Customization

### Regenerate Tokens

If you modify token source files:

```bash
cd packages/style
pnpm run build
```

### Build Steps

1. **`build:transform`**: Converts `tokens.json` to Style Dictionary format
2. **`build-sd`**: Runs Style Dictionary to generate CSS and JSON
3. **`tsc`**: Compiles TypeScript directives to JavaScript

### Extending the System

**Add New Colors:**
1. Add color to `tokens.json`
2. Add color name to `safe-colors.json` (for safelist)
3. Run `pnpm run build`

**Add New Semantic Colors:**
1. Add semantic color to `tokens.json` under `semantic.*`
2. Add semantic type to `safe-semantic-colors.json`
3. Run `pnpm run build`

**Add Custom CSS:**
1. Create CSS file in `src/` (e.g., `components.css`)
2. Add filename to `ADDITIONAL_CSS_FILES` in `build.js`
3. Run `pnpm run build`

## References

- **Design Tokens**: [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- **Style Dictionary**: [https://amzn.github.io/style-dictionary/](https://amzn.github.io/style-dictionary/)
- **Token Transformer**: [https://github.com/tokens-studio/figma-plugin](https://github.com/tokens-studio/figma-plugin)
