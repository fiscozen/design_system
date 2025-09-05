# @fiscozen/form-container

**Form Container Utilities** - Sistema semplificato e intelligente per layout di form responsive. Una soluzione CSS-first per creare form perfetti con layout automatico e raggruppamenti semantici.

## 🚀 Installazione

```bash
npm install @fiscozen/form-container
```

## 📋 Setup

Nel tuo `tailwind.config.js`:

```js
module.exports = {
  // ... altre configurazioni
  plugins: [
    require('@fiscozen/form-container'),
    // ... altri plugin
  ]
}
```

## 🎯 Sistema Form Container

### 🌟 Filosofia Simple-First

Una classe fa tutto quello che serve. Zero cognitive load, zero configurazione manuale.

### 📋 `.fz-form-container` - Layout Principale

**La classe principale**: Layout intelligente che si adatta automaticamente.

```html
<form class="fz-form-container">
  <FzInput label="Nome" placeholder="Nome" />
  <FzInput label="Email" placeholder="Email" type="email" />
  <FzInput label="Telefono" placeholder="Telefono" type="tel" />
</form>
```

**Comportamento responsive automatico:**
- 📱 **Mobile**: 1 colonna, gap compatto
- 📱 **Tablet**: Auto-fit min 200px, gap medio
- 🖥️ **Desktop**: Auto-fit min 250px, gap ampio

### 🎬 `.fz-form-actions` - Action Buttons (Full Width)

**Per i button di azione del form**: sempre allineati a destra, occupano tutta la larghezza del form.

```html
<fieldset class="fz-form-actions">
  <FzButton type="button">Annulla</FzButton>
  <FzButton type="button">Salva</FzButton>
  <FzButton type="submit">Invia</FzButton>
</fieldset>
```

### 🎨 `.fz-form-actions-inline` - Action Buttons (Inline)

**Per button integrati nel grid**: si comportano come qualsiasi altro campo del form.

```html
<fieldset class="fz-form-actions-inline">
  <FzButton type="reset">Reset</FzButton>
  <FzButton type="submit">🔍</FzButton>
</fieldset>
```

### 📦 `.fz-form-group-vertical` - Raggruppamento Verticale

**Per elementi che devono stare sempre in colonna**: checkbox, radio, steps sequenziali.

```html
<fieldset class="fz-form-group-vertical">
  <h3>Preferenze</h3>
  <FzInput label="Nome" placeholder="Nome" />
  <FzInput label="Email" placeholder="Email" type="email" />
  <FzInput label="Telefono" placeholder="Telefono" type="tel" />
</fieldset>
```

### 📦 `.fz-form-group-horizontal` - Raggruppamento Orizzontale

**Per elementi che devono stare sempre in riga**: controlli correlati, piccoli input.

```html
<fieldset class="fz-form-group-horizontal">
  <FzInput label="Cerca" placeholder="Cerca..." />
  <FzButton>Cerca</FzButton>
</fieldset>
```

## ⚡ Quick Start

```html
<!-- Form base - tutto automatico -->
<form class="fz-form-container">
  <FzInput type="email" placeholder="Email" label="Email" />
  <FzInput type="password" placeholder="Password" label="Password" />
  
  <fieldset class="fz-form-actions">
    <FzButton type="submit">Login</FzButton>
  </fieldset>
</form>
```

## 🎯 Vantaggi del Sistema

### Simple-First Approach
- **🧠 Zero cognitive load**: 4 classi per tutti i casi
- **⚡ Automatic**: Layout intelligente, niente configurazione manuale
- **📱 Responsive**: Progressive enhancement automatico
- **🎯 Semantic**: Nomi che descrivono esattamente l'uso

### Perfect Form UX
- **📐 Spacing progressivo**: Gap cresce con dimensione schermo
- **🎨 Layout intelligente**: Si adatta al contenuto automaticamente
- **🎯 Actions sempre a posto**: Button sempre ben posizionati
- **📦 Raggruppamenti logici**: Semantica chiara e accessibile

### Developer Experience
- **💡 Intuitive**: Nomi auto-documentanti
- **🔍 Discoverable**: Pattern facile da ricordare
- **🏷️ Namespaced**: Prefisso `fz-form-` evita conflitti
- **🎛️ Composable**: Combina liberamente per layout complessi


## 🛠️ Configurazione

Il sistema è configurabile modificando le costanti nel plugin.

## 💡 Tips & Best Practices

### 🏆 Pattern Comuni
- **📋 Form classico**: `fz-form-container` + `fz-form-actions` (barra finale)
- **🔍 Search integrato**: `fz-form-container` + `fz-form-actions-inline` (controlli inline)
- **⚙️ Settings**: `fz-form-container` + `fz-form-group-vertical` per radio/checkbox
- **📝 Form lungo**: Usa `FzTextarea` con classe `fz-textarea` (full-width automatico)
- **🏢 Wizard**: Multiple `fz-form-group-vertical` per steps

### ⚡ Performance Tips
- **🎯 Semantic HTML**: Usa `<fieldset>` e `<legend>` per raggruppamenti
- **📱 Mobile-first**: Il sistema è ottimizzato mobile-first
- **🔧 Combina liberamente**: Mix con utility Tailwind esistenti
- **🤖 Automazione**: `FzTextarea` è automaticamente full-width

### 🎨 Scegliere il Tipo di Actions
- **`fz-form-actions`**: Per azioni finali del form (Submit/Cancel)
- **`fz-form-actions-inline`**: Per controlli integrati nel flusso (Search/Reset)

### 🚫 Cosa Evitare
- **❌ Non annidare form-container**: Usa solo alla radice del form
- **❌ Non mischiare group types**: Vertical e horizontal hanno scopi diversi
- **❌ Actions ridondanti**: Scegli tra full-width o inline, non entrambi

## 🌟 Classi Disponibili (Riassunto)

```css
.fz-form-container           /* Layout principale intelligente */
.fz-form-group-vertical      /* Raggruppamento sempre verticale */
.fz-form-group-horizontal    /* Raggruppamento sempre orizzontale */
.fz-form-actions             /* Action buttons full-width */
.fz-form-actions-inline      /* Action buttons inline al grid */
```

## 🔗 Links

- [Tailwind CSS](https://tailwindcss.com/)
- [Fiscozen Design System](../README.md)

---

**Developed with ❤️ by Fiscozen Design System Team**