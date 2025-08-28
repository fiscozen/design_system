# @fiscozen/container

Un componente Container versatile per costruire layout di pagina con supporto completo per Flexbox e CSS Grid.

## Caratteristiche

- 🚀 **Flessibile**: Supporta sia Flexbox che CSS Grid
- 📱 **Responsive**: Tutte le proprietà supportano breakpoint responsive  
- 🎯 **Type-safe**: Completamente tipizzato con TypeScript
- 🎨 **Personalizzabile**: Controllo completo su spacing, allineamento e dimensioni
- ⚡ **Performante**: Generazione ottimizzata delle classi CSS

## Installazione

```bash
npm install @fiscozen/container
```

## Uso Base

```vue
<template>
  <!-- Stack verticale con gap -->
  <FzContainer direction="column" gap="16">
    <div>Elemento 1</div>
    <div>Elemento 2</div>
    <div>Elemento 3</div>
  </FzContainer>

  <!-- Layout orizzontale centrato -->
  <FzContainer 
    direction="row" 
    justify="center" 
    align="center"
    gap="8"
    padding="20"
  >
    <button>Annulla</button>
    <button>Conferma</button>
  </FzContainer>

  <!-- Layout con wrap abilitato -->
  <FzContainer 
    direction="row" 
    :wrap="true"
    gap="12"
  >
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </FzContainer>

  <!-- Grid layout -->
  <FzContainer 
    display="grid" 
    gridCols="3" 
    gap="16"
    padding="20"
  >
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </FzContainer>
</template>

<script setup>
import { FzContainer } from '@fiscozen/container'
</script>
```

## Proprietà

### Layout di Base

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `display` | `'flex' \| 'grid' \| 'block' \| 'inline-flex' \| 'inline-grid'` | `'flex'` | Tipo di display del container |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | `'row'` | Direzione del flex (solo per flex) |
| `wrap` | `'wrap' \| 'nowrap' \| 'wrap-reverse' \| boolean` | `'nowrap'` | Comportamento di wrap (solo per flex). `true` = wrap, `false` = nowrap |

### Allineamento

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `justify` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly' \| 'stretch'` | `'start'` | Allineamento principale |
| `align` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | `'stretch'` | Allineamento secondario |
| `center` | `boolean` | `false` | Centra sia orizzontalmente che verticalmente |
| `centerX` | `boolean` | `false` | Centra orizzontalmente |
| `centerY` | `boolean` | `false` | Centra verticalmente |

### Spacing

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `gap` | `string` | `'0'` | Gap tra elementi |
| `rowGap` | `string` | - | Gap tra righe |
| `colGap` | `string` | - | Gap tra colonne |
| `padding` | `string` | - | Padding interno |
| `paddingX` | `string` | - | Padding orizzontale |
| `paddingY` | `string` | - | Padding verticale |
| `margin` | `string` | - | Margin esterno |
| `marginX` | `string` | - | Margin orizzontale |
| `marginY` | `string` | - | Margin verticale |

### Dimensioni

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `width` | `'auto' \| 'full' \| 'screen' \| 'fit' \| 'max' \| 'min'` | - | Larghezza del container |
| `height` | `'auto' \| 'full' \| 'screen' \| 'fit' \| 'max' \| 'min'` | - | Altezza del container |
| `fullWidth` | `boolean` | `false` | Larghezza piena |
| `fullHeight` | `boolean` | `false` | Altezza piena |

### Grid (quando display="grid")

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `gridCols` | `'1' \| '2' \| ... \| '12' \| 'none'` | - | Numero di colonne |
| `gridRows` | `'1' \| '2' \| ... \| '6' \| 'none'` | - | Numero di righe |

## Responsive Design

Tutte le proprietà supportano breakpoint responsive:

```vue
<template>
  <FzContainer 
    :direction="{ xs: 'column', md: 'row' }"
    :gap="{ xs: '8', md: '16' }"
    :padding="{ xs: '16', lg: '32' }"
  >
    <!-- Il contenuto si impila verticalmente su mobile -->
    <!-- e si dispone orizzontalmente su desktop -->
  </FzContainer>
</template>
```

I breakpoint disponibili sono: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.

## Esempi Comuni

### Layout di Pagina

```vue
<template>
  <!-- Header -->
  <FzContainer 
    tag="header"
    padding="20" 
    justify="between" 
    align="center"
    fullWidth
  >
    <div>Logo</div>
    <nav>Menu</nav>
  </FzContainer>

  <!-- Contenuto principale -->
  <FzContainer 
    tag="main"
    direction="column" 
    gap="32"
    padding="40"
    minHeight="screen"
  >
    <h1>Titolo</h1>
    <p>Contenuto...</p>
  </FzContainer>
</template>
```

### Form Layout

```vue
<template>
  <FzContainer 
    tag="form"
    direction="column" 
    gap="20"
    maxWidth="md"
    padding="24"
  >
    <FzContainer gap="16">
      <input placeholder="Nome" />
      <input placeholder="Cognome" />
    </FzContainer>
    
    <input placeholder="Email" />
    
    <FzContainer justify="end" gap="12">
      <button type="button">Annulla</button>
      <button type="submit">Invia</button>
    </FzContainer>
  </FzContainer>
</template>
```

### Card Grid

```vue
<template>
  <FzContainer 
    display="grid"
    :gridCols="{ xs: '1', sm: '2', lg: '3' }"
    gap="20"
    padding="20"
  >
    <div v-for="card in cards" :key="card.id">
      <FzContainer 
        direction="column"
        gap="12"
        padding="16"
        class="border rounded"
      >
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </FzContainer>
    </div>
  </FzContainer>
</template>
```

## Vantaggi

1. **Semplicità**: Un'unica API per tutti i layout
2. **Consistenza**: Usa il sistema di spacing del design system
3. **Flessibilità**: Supporta qualsiasi tipo di layout
4. **Performance**: Genera solo le classi CSS necessarie
5. **DX**: Completamente tipizzato per un'esperienza di sviluppo ottimale