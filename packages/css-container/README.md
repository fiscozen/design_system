# @fiscozen/css-container

**CSS Layout Utilities** - Container generico e riutilizzabile per layout responsive. Utility CSS-first per grid, flex, stack e spacing semantico.

## 🚀 Installazione

```bash
npm install @fiscozen/css-container
```

## 📋 Setup

Nel tuo `tailwind.config.js`:

```js
module.exports = {
  // ... altre configurazioni
  plugins: [
    require('@fiscozen/css-container'),
    // ... altri plugin
  ]
}
```

## 🏗️ Container Generico CSS-First

Sistema di utility CSS per creare layout responsive e flessibili. Tutte le classi seguono il principio **semantic-first** con prefisso `fz-container-` per il namespacing.

### 🌟 Filosofia Semantic-First

| Valore | Pixel | Tailwind | Uso |
|--------|-------|----------|-----|
| `none` | 0px | `0` | Reset, layout compatti |
| `xs` | 8px | `2` | Fine-tuning, micro-spacing |
| `sm` | 32px | `8` | Elementi correlati |
| `md` | 64px | `16` | **Default consigliato** |
| `lg` | 96px | `24` | Separazione sezioni |
| `xl` | 128px | `32` | Container principali |
| `2xl` | 192px | `48` | Large layouts |

## 📚 Categorie Principali

### 🔲 Grid Layouts
```html
<!-- 🔥 Grid intelligente (autodetect) - CONSIGLIATO per la maggior parte dei casi -->
<div class="fz-container-grid-responsive fz-container-gap-md">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <!-- Si adatta automaticamente: 1, 2, 3+ colonne in base allo spazio -->
</div>

<!-- Grid responsive specifico: 1 mobile → 2 tablet → 3 desktop -->
<div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Grid fisso -->
<div class="fz-container-grid-3 fz-container-gap-lg">
  <div>Col A</div>
  <div>Col B</div>
  <div>Col C</div>
</div>
```

### 📚 Stack Layouts
```html
<!-- Stack verticale con gap semantico -->
<div class="fz-container-stack-v fz-container-gap-md">
  <h1>Titolo</h1>
  <p>Contenuto</p>
  <button>Azione</button>
</div>

<!-- Stack orizzontale -->
<div class="fz-container-stack-h fz-container-gap-sm">
  <button>Annulla</button>
  <button>Conferma</button>
</div>

<!-- Stack responsive: verticale mobile → orizzontale tablet+ -->
<div class="fz-container-stack-responsive-v-h fz-container-gap-md">
  <div>Navigation Item 1</div>
  <div>Navigation Item 2</div>
  <div>Navigation Item 3</div>
</div>
```

### 🎯 Stack Alignments
```html
<!-- Centering perfetto -->
<div class="fz-container-stack-center min-h-screen">
  <div>Contenuto centrato</div>
</div>

<!-- Header classico -->
<header class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-lg">
  <div>Logo</div>
  <nav class="fz-container-stack-h fz-container-gap-md">
    <a href="#">Home</a>
    <a href="#">About</a>
  </nav>
</header>

<!-- Flex stretch per altezza uniforme -->
<div class="fz-container-stack-h fz-container-stack-align-cross-stretch fz-container-gap-sm h-32">
  <div class="bg-blue-100 p-3 rounded">Item stretched</div>
  <div class="bg-blue-100 p-3 rounded">All same height</div>
</div>
```

### 📏 Semantic Spacing
```html
<!-- Container con spacing semantico -->
<div class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg">
  <h3>Titolo</h3>
  <p>Contenuto generico...</p>
</div>

<!-- Form costruito con utility base -->
<form class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white rounded shadow">
  <div class="fz-container-stack-v fz-container-gap-xs">
    <label class="text-sm font-medium">Email</label>
    <input type="email" class="px-3 py-2 border rounded" />
  </div>
  
  <div class="fz-container-stack-h fz-container-gap-sm fz-container-stack-space-main-end">
    <button type="button" class="px-4 py-2 border rounded">Annulla</button>
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Invia</button>
  </div>
</form>
```

## ⚡ Quick Start

```html
<!-- Container generico con layout responsive -->
<div class="fz-container-stack-v fz-container-gap-lg fz-container-padding-lg">
  <header class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center">
    <h1>Titolo</h1>
    <nav class="fz-container-stack-h fz-container-gap-md">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
    </nav>
  </header>
  
  <div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
    <div class="fz-container-stack-center fz-container-padding-md bg-gray-100 rounded">
      <p>Contenuto 1</p>
    </div>
    <div class="fz-container-stack-center fz-container-padding-md bg-gray-100 rounded">
      <p>Contenuto 2</p>
    </div>
    <div class="fz-container-stack-center fz-container-padding-md bg-gray-100 rounded">
      <p>Contenuto 3</p>
    </div>
  </div>
</div>
```

## 🎯 Vantaggi del Sistema

### CSS-First Approach
- **⚡ Performance**: Solo CSS, niente overhead JavaScript
- **🌍 Universale**: Funziona in qualsiasi framework (React, Vue, Angular, vanilla)
- **🎯 Familiar**: Sintassi CSS standard
- **📦 Lightweight**: Bundle size ridotto

### Design System Consistency
- **🎨 Semantic Spacing**: Sistema di spacing coerente e meaningful
- **📱 Responsive**: Design mobile-first built-in
- **🏗️ Patterns**: Layout comuni pre-costruiti
- **🔧 Maintainable**: Modifiche centralizzate via design tokens

### Developer Experience
- **💡 Intuitive**: Nomi di classi semantici (`fz-container-stack-v fz-container-gap-md` vs `flex flex-col gap-16`)
- **🔍 Discoverable**: Facile da ricordare e autocompletare
- **🏷️ Namespaced**: Prefisso `fz-container-` evita conflitti
- **🎛️ Flexible**: Combinabile con utility Tailwind esistenti

## 📋 Classi Disponibili

### Grid Layouts

#### Grid Fissi (Non Responsive)
- `fz-container-grid-{1-6}` - Grid fisso (1-6 colonne)

#### Grid Responsive Intelligente (Autodetect) 🔥
- `fz-container-grid-responsive` - **Default intelligente** (auto-fit, min 200px)
- `fz-container-grid-responsive-sm` - Auto-fit con min 150px
- `fz-container-grid-responsive-md` - Auto-fit con min 200px (default)  
- `fz-container-grid-responsive-lg` - Auto-fit con min 250px
- `fz-container-grid-responsive-xl` - Auto-fit con min 300px

*💡 Usa queste per layout che si adattano automaticamente allo spazio disponibile!*

#### Grid Responsive Sistematici (TUTTE le combinazioni)
Pattern: `fz-container-grid-responsive-{mobile}-{tablet}-{desktop}`

**🔢 Supporto Completo: 1-6 colonne per ogni breakpoint**

**Shortcuts:**
- `fz-container-grid-responsive-{N}` - N colonne sempre (1-6)
- `fz-container-grid-responsive-{M}-{N}` - M mobile → N tablet/desktop
- `fz-container-grid-responsive-{M}-{T}-{D}` - M mobile → T tablet → D desktop

**Totale: 258 classi generate automaticamente** 
- 6 shortcuts singoli (1, 2, 3, 4, 5, 6)
- 36 shortcuts doppi (1-1 fino a 6-6)
- 216 combinazioni triple (1-1-1 fino a 6-6-6)

**Esempi Comuni:**
- `fz-container-grid-responsive-1-2` - 1 mobile → 2 tablet/desktop  
- `fz-container-grid-responsive-1-2-3` - 1 mobile → 2 tablet → 3 desktop
- `fz-container-grid-responsive-2-4-6` - 2 mobile → 4 tablet → 6 desktop
- `fz-container-grid-responsive-3` - 3 colonne sempre
- `fz-container-grid-responsive-1-1-4` - 1 mobile → 1 tablet → 4 desktop
- `fz-container-grid-responsive-2-3` - 2 mobile → 3 tablet/desktop

### Stack Layouts

#### Stack Direzioni Base
- `fz-container-stack-v` - Stack verticale (flex-col)
- `fz-container-stack-h` - Stack orizzontale (flex-row)
- `fz-container-stack-vr` - Stack verticale reverse (flex-col-reverse)
- `fz-container-stack-hr` - Stack orizzontale reverse (flex-row-reverse)

#### Stack Responsive Sistematici (TUTTE le combinazioni)
Pattern: `fz-container-stack-responsive-{mobile}-{tablet}-{desktop}`

**🔄 Supporto Completo: direzioni v/h/vr/hr per ogni breakpoint**

**Shortcuts:**
- `fz-container-stack-responsive-{D}` - D direzione sempre (v, h, vr, hr)
- `fz-container-stack-responsive-{M}-{T}` - M mobile → T tablet/desktop  
- `fz-container-stack-responsive-{M}-{T}-{D}` - M mobile → T tablet → D desktop

**Totale: 84 classi generate automaticamente** 
- 4 shortcuts singoli (v, h, vr, hr)
- 16 shortcuts doppi (v-v, v-h, v-vr, v-hr, h-v, h-h, h-vr, h-hr, ecc.)
- 64 combinazioni triple (v-v-v, v-v-h, v-h-vr, h-vr-hr, ecc.)

**Esempi Comuni:**
- `fz-container-stack-responsive-v-h` - v mobile → h tablet/desktop  
- `fz-container-stack-responsive-v-v-h` - v mobile → v tablet → h desktop
- `fz-container-stack-responsive-h-v` - h mobile → v tablet/desktop
- `fz-container-stack-responsive-v` - verticale sempre
- `fz-container-stack-responsive-hr-vr` - hr mobile → vr tablet/desktop
- `fz-container-stack-responsive-v-h-vr` - v mobile → h tablet → vr desktop

*Nota: Le classi stack sono separate dal gap. Combina con `fz-container-gap-*` per aggiungere spaziatura.*

### Stack Alignments

#### Centering Shortcuts
- `fz-container-stack-center` - Centering completo (main + cross axis)
- `fz-container-stack-center-main` - Centering main axis (justify-center)
- `fz-container-stack-center-cross` - Centering cross axis (items-center)

#### Main Axis Alignment (Positioning)
- `fz-container-stack-align-main-start` - Align start (justify-start)
- `fz-container-stack-align-main-center` - Align center (justify-center)
- `fz-container-stack-align-main-end` - Align end (justify-end)

#### Cross Axis Alignment (Positioning)
- `fz-container-stack-align-cross-start` - Align start (items-start)
- `fz-container-stack-align-cross-center` - Align center (items-center)
- `fz-container-stack-align-cross-end` - Align end (items-end)
- `fz-container-stack-align-cross-stretch` - Stretch items (items-stretch)

#### Main Axis Space Distribution
- `fz-container-stack-space-main-between` - Space between (justify-between)
- `fz-container-stack-space-main-around` - Space around (justify-around)
- `fz-container-stack-space-main-evenly` - Space evenly (justify-evenly)

#### Cross Axis Space Distribution (Multi-line)
- `fz-container-stack-space-cross-between` - Lines between (content-between)
- `fz-container-stack-space-cross-around` - Lines around (content-around)
- `fz-container-stack-space-cross-evenly` - Lines evenly (content-evenly)
- `fz-container-stack-space-cross-stretch` - Stretch lines (content-stretch)

### Semantic Spacing
- `fz-container-gap-{size}` - Gap semantico
- `fz-container-padding-{size}` - Padding semantico
- `fz-container-margin-{size}` - Margin semantico



## 🎨 Esempi di Utilizzo

### Grid Layout Generico
```html
<!-- Grid responsive con spacing semantico: 1 mobile → 2 tablet → 3 desktop -->
<div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
  <div class="fz-container-stack-center fz-container-padding-md bg-blue-100 rounded">
    Item 1
  </div>
  <div class="fz-container-stack-center fz-container-padding-md bg-blue-100 rounded">
    Item 2  
  </div>
  <div class="fz-container-stack-center fz-container-padding-md bg-blue-100 rounded">
    Item 3
  </div>
</div>

<!-- Grid autodetect intelligente (consigliato) -->
<div class="fz-container-grid-responsive fz-container-gap-lg">
  <div class="fz-container-stack-center fz-container-padding-md bg-green-100 rounded">
    Auto Item 1
  </div>
  <div class="fz-container-stack-center fz-container-padding-md bg-green-100 rounded">
    Auto Item 2
  </div>
  <div class="fz-container-stack-center fz-container-padding-md bg-green-100 rounded">
    Auto Item 3
  </div>
  <!-- Si adatta automaticamente al numero di items e allo spazio disponibile -->
</div>
```

### Form Container
```html
<form class="fz-container-stack-v fz-container-gap-md fz-container-padding-lg bg-white rounded shadow">
  <h2 class="text-xl font-semibold">Form di Contatto</h2>
  
  <div class="fz-container-grid-responsive-1-2 fz-container-gap-md">
    <div class="fz-container-stack-v fz-container-gap-xs">
      <label class="text-sm font-medium">Nome</label>
      <input type="text" class="px-3 py-2 border rounded" required />
    </div>
    <div class="fz-container-stack-v fz-container-gap-xs">
      <label class="text-sm font-medium">Email</label>
      <input type="email" class="px-3 py-2 border rounded" required />
    </div>
  </div>
  
  <div class="fz-container-stack-v fz-container-gap-xs">
    <label class="text-sm font-medium">Messaggio</label>
    <textarea rows="4" class="px-3 py-2 border rounded" required></textarea>
  </div>
  
  <div class="fz-container-stack-h fz-container-gap-sm fz-container-stack-space-main-end">
    <button type="button" class="px-4 py-2 border rounded hover:bg-gray-50">
      Annulla
    </button>
    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Invia
    </button>
  </div>
</form>
```

### Header Generico
```html
<header class="fz-container-stack-h fz-container-stack-space-main-between fz-container-stack-align-cross-center fz-container-padding-lg">
  <div class="fz-container-stack-h fz-container-gap-sm fz-container-stack-align-cross-center">
    <img src="logo.svg" alt="Logo" class="h-8 w-8" />
    <h1 class="text-xl font-bold">Nome App</h1>
  </div>
  
  <nav class="fz-container-stack-h fz-container-gap-md">
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 1</a>
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 2</a>
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 3</a>
  </nav>
</header>

<!-- Stack responsive header: verticale mobile → orizzontale desktop -->
<header class="fz-container-stack-responsive-v-v-h fz-container-gap-md fz-container-stack-align-cross-center fz-container-padding-lg">
  <div class="fz-container-stack-h fz-container-gap-sm fz-container-stack-align-cross-center">
    <img src="logo.svg" alt="Logo" class="h-8 w-8" />
    <h1 class="text-xl font-bold">Nome App</h1>
  </div>
  
  <nav class="fz-container-stack-responsive-v-v-h fz-container-gap-md">
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 1</a>
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 2</a>
    <a href="#" class="text-blue-600 hover:text-blue-800">Link 3</a>
  </nav>
</header>
```

## 📱 Responsive Best Practices

### Mobile-First Approach
```html
<!-- ✅ GOOD: Stack responsive sistematico -->
<div class="fz-container-stack-responsive-v-h fz-container-gap-sm">
  <!-- Stack verticale mobile → orizzontale tablet/desktop -->
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>

<!-- ✅ GOOD: Stack responsive completo -->
<div class="fz-container-stack-responsive-v-v-h fz-container-gap-md">
  <!-- Stack v mobile → v tablet → h desktop -->
  <div>Item A</div>
  <div>Item B</div>
  <div>Item C</div>
</div>

<!-- ✅ GOOD: Grid responsive sistematico -->
<div class="fz-container-grid-responsive-1-2-3 fz-container-gap-md">
  <!-- 1 mobile → 2 tablet → 3 desktop -->
  <div class="bg-gray-100 p-4 rounded">Card 1</div>
  <div class="bg-gray-100 p-4 rounded">Card 2</div>
  <div class="bg-gray-100 p-4 rounded">Card 3</div>
</div>

<!-- ✅ GOOD: Grid autodetect intelligente (CONSIGLIATO) -->
<div class="fz-container-grid-responsive fz-container-gap-lg">
  <!-- Si adatta automaticamente al contenuto e spazio disponibile -->
  <div class="bg-blue-100 p-4 rounded">Auto Card 1</div>
  <div class="bg-blue-100 p-4 rounded">Auto Card 2</div>
  <div class="bg-blue-100 p-4 rounded">Auto Card 3</div>
  <div class="bg-blue-100 p-4 rounded">Auto Card 4</div>
</div>

<!-- ✅ GOOD: Stack reverse per layout speciali -->
<div class="fz-container-stack-responsive-hr-vr fz-container-gap-sm">
  <!-- Stack hr mobile → vr tablet/desktop -->
  <div>First (appears right on mobile, bottom on desktop)</div>
  <div>Second</div>
  <div>Third (appears left on mobile, top on desktop)</div>
</div>
```

## 🌟 Utility Essenziali (TOP 10)

Inizia con queste classi per il 90% dei casi d'uso:

### 🏆 **Must-Have per Layouts**
1. **`fz-container-grid-responsive`** - Grid autodetect intelligente (la scelta più smart)
2. **`fz-container-stack-v`** - Stack verticale base 
3. **`fz-container-stack-h`** - Stack orizzontale base
4. **`fz-container-gap-md`** - Gap semantico standard

### 🎯 **Must-Have per Alignments**
5. **`fz-container-stack-center`** - Centering perfetto
6. **`fz-container-stack-space-main-between`** - Distribuzione spazio (justify-between)
7. **`fz-container-stack-align-cross-center`** - Allineamento cross-axis

### 📱 **Must-Have per Responsive**
8. **`fz-container-stack-responsive-v-h`** - Stack responsive più comune
9. **`fz-container-grid-responsive-1-2-3`** - Grid responsive più comune
10. **`fz-container-padding-lg`** - Spacing interno generoso

## 💡 Tips & Best Practices

- **🚀 Inizia Smart**: `fz-container-grid-responsive` è il miglior default per grid (si adatta automaticamente!)
- **📏 Semantic Spacing**: `md` è il default consigliato, `lg` per spazi generosi, `xs` per fine-tuning
- **📱 Mobile-first**: Le classi responsive seguono il pattern mobile → tablet → desktop
- **🔧 Stack Separation**: Le classi stack controllano direzione, aggiungi `fz-container-gap-*` per spaziatura
- **🎨 Combina liberamente**: Mix utility con classi Tailwind esistenti
- **⚡ Performance**: Usa le 10 utility essenziali per coprire il 90% dei casi
- **🏷️ Semantic Names**: `fz-container-stack-space-main-between` è più chiaro di `justify-between`

## 🔗 Links

- [Tailwind CSS](https://tailwindcss.com/)
- [Fiscozen Design System](../README.md)

---

**Developed with ❤️ by Fiscozen Design System Team**