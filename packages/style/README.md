# @fiscozen/style

Design System package che fornisce design token, variabili CSS e direttive Vue.js per mantenere coerenza visiva in tutti i progetti FiscoZen.

## Installazione

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

// Registra le direttive FiscoZen
setupFzStyle(app)

app.mount('#app')
```

## Direttive Vue.js

Il pacchetto include direttive Vue personalizzate per una tipografia consistente:

### v-bold
Applica il font-weight semibold ai paragrafi:

```vue
<template>
  <!-- Paragrafo con testo bold -->
  <p v-bold>Questo testo è in grassetto</p>
</template>
```

### v-small
Applica la dimensione small ai paragrafi:

```vue
<template>
  <!-- Paragrafo con testo piccolo -->
  <p v-small>Questo testo è piccolo</p>
</template>
```

## 🎨 Styling Predefinito per Elementi HTML

Il pacchetto include stili predefiniti per elementi HTML comuni:

- h1
- h2
- h3
- p
  - v-bold
  - v-small

## 🔧 Build e Customizzazione

### Rigenerare i Token

Se modifichi i file sorgente dei token:

```bash
cd packages/style
pnpm run build
```

## 📖 Riferimenti

- **Design Token**: Sistema basato su [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- **Style Dictionary**: [https://amzn.github.io/style-dictionary/](https://amzn.github.io/style-dictionary/)
- **Token Transformer**: [https://github.com/tokens-studio/figma-plugin](https://github.com/tokens-studio/figma-plugin)
