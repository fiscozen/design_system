# @fiscozen/style

Design system package providing design tokens, CSS variables, and Vue.js custom directives to maintain visual consistency across all FiscoZen projects.

## Features

- **Design Tokens**: Single source of truth for colors, spacing, typography, and more
- **CSS Variables**: All tokens available as CSS custom properties
- **Vue Custom Directives**: Typography styling directives (`v-color`, `v-bold`, `v-small`)
- **Tailwind Integration**: Seamless integration with Tailwind CSS utility classes
- **Type Safety**: Full TypeScript support with validation rules
- **Build Pipeline**: Automated token transformation and CSS generation

## Installation

```bash
npm install @fiscozen/style
```

## Setup

Register the directives in your Vue application:

```typescript
// main.ts
import { createApp } from 'vue'
import { setupFzStyle } from '@fiscozen/style'
import '@fiscozen/style/output/global.css'
import App from './App.vue'

const app = createApp(App)

// Register FiscoZen custom directives
setupFzStyle(app)

app.mount('#app')
```

## Basic Usage

### v-color

Apply design system colors to text elements:

```vue
<template>
  <!-- Default weights (500 for base colors, 200 for semantic) -->
  <p v-color:blue>Blue text</p>
  <h1 v-color:semantic-error>Error heading</h1>
  
  <!-- Explicit weights -->
  <p v-color:blue="300">Light blue text</p>
  <h2 v-color:purple="700">Dark purple heading</h2>
</template>
```

### v-bold

Apply semibold font weight to paragraphs:

```vue
<template>
  <p v-bold>This text is bold</p>
  <p v-bold="false">This text is normal weight</p>
</template>
```

### v-small

Apply small text size to paragraphs:

```vue
<template>
  <p v-small>This text is small</p>
  <p v-small="false">This text is normal size</p>
</template>
```

## Vue Custom Directives

### v-color

Applies design system text colors to heading and paragraph elements.

**Supported Elements:**
- Paragraphs (`<p>`)
- Headings (`<h1>`, `<h2>`, `<h3>`)

**Available Colors:**

**Base Colors:**
- `blue`, `purple`, `orange`, `pink`, `yellow`, `grey`, `core`
- Weights: `50`, `100`, `200`, `300`, `400`, `500` (default), `600`, `700`, `800`, `900`
- For `core`: `white`, `black` (named values instead of numeric weights)

**Semantic Colors:**
- `semantic-error`, `semantic-warning`, `semantic-success`, `semantic-info`
- Weights: `50`, `100`, `200` (default), `300`

**Default Weights:**
- Base colors → `500`
- Semantic colors → `200`
- Core colors → `black`

**Examples:**

```vue
<template>
  <!-- Base colors with default weight -->
  <p v-color:blue>Blue text (weight 500)</p>
  <p v-color:purple>Purple text (weight 500)</p>
  
  <!-- Explicit weights -->
  <p v-color:blue="300">Light blue text</p>
  <p v-color:blue="700">Dark blue text</p>
  
  <!-- Semantic colors -->
  <p v-color:semantic-error>Error message</p>
  <p v-color:semantic-success>Success message</p>
  <h3 v-color:semantic-error="300">Critical error</h3>
  
  <!-- Headings -->
  <h1 v-color:blue="700">Main title</h1>
  <h2 v-color:grey="600">Subtitle</h2>
  
  <!-- Remove color classes -->
  <p v-color:blue="false">Removes all color classes</p>
</template>
```

### v-bold

Applies semibold font weight (`font-semibold`) to paragraph elements.

**Supported Elements:**
- Paragraphs (`<p>`)

**Examples:**

```vue
<template>
  <p v-bold>This text is bold</p>
  <p v-bold="false">This text is normal weight</p>
</template>
```

### v-small

Applies small text size (`text-sm`) to paragraph elements.

**Supported Elements:**
- Paragraphs (`<p>`)

**Examples:**

```vue
<template>
  <p v-small>This text is small</p>
  <p v-small="false">This text is normal size</p>
</template>
```

## Combining Directives

You can combine multiple directives on the same element:

```vue
<template>
  <p v-bold v-small v-color:blue>Bold, small, blue text</p>
  <p v-bold v-color:semantic-error>Bold error message</p>
</template>
```

## Examples

### Basic Typography Styling

```vue
<template>
  <div>
    <h1 v-color:blue>Welcome to FiscoZen</h1>
    <h2 v-color:grey="600">Your Financial Partner</h2>
    
    <p>Standard paragraph text</p>
    <p v-bold>Bold paragraph for emphasis</p>
    <p v-small>Small paragraph for secondary information</p>
    
    <p v-color:semantic-error>Error: Please check your input</p>
    <p v-color:semantic-success>Success: Changes saved!</p>
  </div>
</template>
```

### Form Feedback Messages

```vue
<template>
  <form>
    <div v-if="error">
      <p v-color:semantic-error v-bold>Error: {{ error }}</p>
    </div>
    <div v-if="success">
      <p v-color:semantic-success>Success: {{ success }}</p>
    </div>
  </form>
</template>
```

### Dynamic Color Changes

```vue
<script setup>
import { ref } from 'vue'

const status = ref('info')
const colorMap = {
  info: 'semantic-info',
  success: 'semantic-success',
  error: 'semantic-error',
  warning: 'semantic-warning'
}
</script>

<template>
  <p :v-color="colorMap[status]">Status message</p>
</template>
```

## Validation

The directives automatically validate that they are used on supported element types. Invalid usage will log console errors:

- `v-color` can be used on `<p>`, `<h1>`, `<h2>`, `<h3>`
- `v-bold` can only be used on `<p>`
- `v-small` can only be used on `<p>`

## Accessibility

All directives maintain semantic HTML structure and do not interfere with screen readers:

- Color directives only apply visual styling, maintaining text content
- Bold and small directives preserve text semantics
- Invalid element usage is logged but does not break functionality
- All styling is applied via CSS classes, preserving semantic meaning

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

**4. Vue Directives (`src/custom-directives/`)**
- `v-color`: Apply design system colors to text
- `v-bold`: Apply semibold font weight
- `v-small`: Apply small text size

## Build & Customization

### Regenerate Tokens

If you modify token source files:

```bash
cd packages/style
npm run build
```

### Build Steps

1. **`build:transform`**: Converts `tokens.json` to Style Dictionary format
2. **`build-sd`**: Runs Style Dictionary to generate CSS and JSON
3. **`tsc`**: Compiles TypeScript directives to JavaScript

### Extending the System

**Add New Colors:**
1. Add color to `tokens.json`
2. Add color name to `safe-colors.json` (for safelist)
3. Run `npm run build`

**Add New Semantic Colors:**
1. Add semantic color to `tokens.json` under `semantic.*`
2. Add semantic type to `safe-semantic-colors.json`
3. Run `npm run build`

**Add Custom CSS:**
1. Create CSS file in `src/` (e.g., `components.css`)
2. Add filename to `ADDITIONAL_CSS_FILES` in `build.js`
3. Run `npm run build`

## References

- **Design Tokens**: [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- **Style Dictionary**: [https://amzn.github.io/style-dictionary/](https://amzn.github.io/style-dictionary/)
- **Token Transformer**: [https://github.com/tokens-studio/figma-plugin](https://github.com/tokens-studio/figma-plugin)
