# @fiscozen/container

Un componente Container **semantic-first** per costruire layout di pagina con supporto completo per Flexbox e CSS Grid.

## Caratteristiche

- 🚀 **Flessibile**: Supporta sia Flexbox che CSS Grid
- 📱 **Responsive**: Tutte le proprietà supportano breakpoint responsive
- ⭐ **Semantic-First**: Sistema di valori semantici per spacing coerente (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`)
- ⚡ **Performante**: Generazione ottimizzata delle classi CSS

## Installazione

```bash
npm install @fiscozen/container
```

## Uso Base (Semantic-First) ⭐

```vue
<script setup>
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <!-- Stack verticale con spacing semantico -->
  <FzContainer direction="column" gap="md">
    <div>Elemento 1</div>
    <div>Elemento 2</div>
    <div>Elemento 3</div>
  </FzContainer>

  <!-- Layout orizzontale centrato -->
  <FzContainer 
    direction="row" 
    justify="center" 
    align="center"
    gap="sm"
    padding="lg"
  >
    <div>Elemento 1</div>
    <div>Elemento 2</div>
  </FzContainer>

  <!-- Layout responsive con valori semantici -->
  <FzContainer 
    direction="row" 
    :wrap="true"
    :gap="{ xs: 'xs', md: 'md', lg: 'lg' }"
  >
    <div>Elemento 1</div>
    <div>Elemento 2</div>
    <div>Elemento 3</div>
  </FzContainer>

  <!-- Grid layout semantico -->
  <FzContainer 
    display="grid" 
    gridCols="3" 
    gap="md"
    padding="lg"
  >
    <div>Elemento 1</div>
    <div>Elemento 2</div>
    <div>Elemento 3</div>
  </FzContainer>
</template>
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
| `gap` | `string` | `'none'` | Gap tra elementi. **RACCOMANDATO**: valori semantici (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`). Valori numerici Tailwind disponibili per casi specifici |
| `rowGap` | `string` | - | Gap tra righe (supporta valori semantici) |
| `colGap` | `string` | - | Gap tra colonne (supporta valori semantici) |
| `padding` | `string` | - | Padding interno. **RACCOMANDATO**: valori semantici |
| `paddingX` | `string` | - | Padding orizzontale (supporta valori semantici) |
| `paddingY` | `string` | - | Padding verticale (supporta valori semantici) |
| `margin` | `string` | - | Margin esterno. **RACCOMANDATO**: valori semantici |
| `marginX` | `string` | - | Margin orizzontale (supporta valori semantici) |
| `marginY` | `string` | - | Margin verticale (supporta valori semantici) |

#### Sistema di Spacing Semantico ⭐ 

**I valori semantici sono la scelta consigliata** per un design system coerente e maintainable:

| Valore Semantico | Pixel | Uso Consigliato | Esempi |
|------------------|-------|-----------------|---------|
| **`none`** | 0px | Reset, layout compatti | `gap="none"`, `padding="none"` |
| **`xs`** | 8px | Fine-tuning, micro-spacing | Gap tra icona e testo |
| **`sm`** | 32px | Elementi correlati | Pulsanti in gruppo, form inline |
| **`md`** ⭐ | 64px | **Default consigliato** | Content spacing, card padding |
| **`lg`** | 96px | Separazione sezioni | Header padding, section gaps |
| **`xl`** | 128px | Container principali | Page padding, hero sections |
| **`2xl`** | 192px | Spaziature generous | Large containers, landing pages |

#### Valori Numerici Tailwind (Fallback)

Per casi specifici dove serve controllo granulare: `0`, `1`, `2`, `4`, `6`, `8`, `10`, `12`, `14`, `16`, `20`, `24`, `32`, `40`, `48`, `64`

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

## Best Practices: Approccio Semantic-First ⭐

### ✅ Raccomandato: Valori Semantici

```vue
<template>
  <!-- 🎯 PERFECT: Design system approach -->
  <FzContainer 
    direction="column" 
    gap="lg"
    padding="xl"
  >
    <h1>Titolo</h1>
    
    <!-- Card con spacing semantico coerente -->
    <FzContainer 
      direction="column"
      gap="md"
      padding="lg"
      class="bg-white rounded shadow"
    >
      <h2>Card Title</h2>
      <p>Contenuto della card</p>
      
      <!-- Actions con gap semantico -->
      <FzContainer gap="sm" justify="end">
        <button>Annulla</button>
        <button>Conferma</button>
      </FzContainer>
    </FzContainer>
  </FzContainer>

  <!-- 🎯 PERFECT: Responsive semantico -->
  <FzContainer 
    :gap="{ xs: 'none', sm: 'sm', md: 'lg' }"
    :padding="{ xs: 'md', lg: 'xl' }"
  >
    <!-- Scaling perfetto su tutti i device -->
  </FzContainer>

  <!-- 🎯 PERFECT: Reset semantico -->
  <FzContainer gap="none" padding="none">
    <!-- Layout compatto quando necessario -->
  </FzContainer>
</template>
```

### ⚠️ Evita: Valori Numerici (solo per casi specifici)

```vue
<template>
  <!-- ❌ AVOID: Perdita di coerenza del design system -->
  <FzContainer gap="12" padding="20">
    <!-- Meglio usare gap="sm" padding="lg" -->
  </FzContainer>

  <!-- ✅ OK: Solo per fine-tuning specifico -->
  <FzContainer gap="md" padding="6">
    <!-- Valore numerico solo se semantico non basta -->
  </FzContainer>
</template>
```

## Esempi Comuni

### Layout di Pagina

```vue
<template>
  <!-- Header -->
  <FzContainer 
    tag="header"
    padding="lg" 
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
    gap="xl"
    padding="2xl"
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
    gap="lg"
    maxWidth="md"
    padding="xl"
  >
    <FzContainer gap="md">
      <input placeholder="Nome" />
      <input placeholder="Cognome" />
    </FzContainer>
    
    <input placeholder="Email" />
    
    <FzContainer justify="end" gap="sm">
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
    gap="lg"
    padding="lg"
  >
    <div v-for="card in cards" :key="card.id">
      <FzContainer 
        direction="column"
        gap="sm"
        padding="md"
        class="border rounded"
      >
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </FzContainer>
    </div>
  </FzContainer>
</template>
```

## Vantaggi del Sistema Semantic-First

### 🎨 Design System Benefits
1. **Consistency**: Scale di spacing predefinita garantisce coerenza visuale
2. **Maintainability**: Cambi globali modificando solo il mapping semantico
3. **Designer-Friendly**: Valori pensati per designer, non pixel

### 🚀 Developer Experience  
4. **Intuitive API**: `gap="lg"` più chiaro di `gap="24"`
5. **Type Safety**: Autocompletamento intelligente con valori semantici prioritari
6. **Responsive Design**: Perfetta integrazione con breakpoint responsive

### ⚡ Technical Advantages
7. **Performance**: Generazione ottimizzata delle classi CSS
8. **Flexibility**: Fallback numerico per casi edge specifici  
9. **Future-Proof**: Facile evoluzione della scala di spacing