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

Sistema ultra-semplificato con **5 classi intelligenti** per tutti i casi d'uso dei form. Layout automatico, spacing responsive e raggruppamenti semantici.

### 🌟 Filosofia Simple-First

Una classe fa tutto quello che serve. Zero cognitive load, zero configurazione manuale.

## 📚 Le 5 Classi Intelligenti

### 📋 `.fz-form-container` - Layout Principale

**La classe principale**: Layout intelligente che si adatta automaticamente.

```html
<form class="fz-form-container">
  <input type="text" placeholder="Nome" />
  <input type="email" placeholder="Email" />
  <input type="tel" placeholder="Telefono" />
  <select><option>Città</option></select>
</form>
```

**Comportamento responsive automatico:**
- 📱 **Mobile** (< 640px): 1 colonna, gap compatto (12px)
- 📱 **Tablet** (≥ 640px): Auto-fit min 200px, gap medio (16px) 
- 🖥️ **Desktop** (≥ 1024px): Auto-fit min 250px, gap ampio (24px)

### 📦 `.fz-form-group-vertical` - Raggruppamento Verticale

**Per elementi che devono stare sempre in colonna**: checkbox, radio, steps sequenziali.

```html
<div class="fz-form-group-vertical">
  <h3>Preferenze</h3>
  <label><input type="checkbox" /> Newsletter</label>
  <label><input type="checkbox" /> Promozioni</label>
  <label><input type="checkbox" /> Aggiornamenti</label>
</div>
```

### 📦 `.fz-form-group-horizontal` - Raggruppamento Orizzontale

**Per elementi che devono stare sempre in riga**: controlli correlati, piccoli input.

```html
<div class="fz-form-group-horizontal">
  <input type="search" placeholder="Cerca..." />
  <button>🔍</button>
  <button>⚙️</button>
</div>
```

### 🎬 `.fz-form-actions` - Action Buttons (Full Width)

**Per i button di azione del form**: sempre allineati a destra, occupano tutta la larghezza del form.

```html
<div class="fz-form-actions">
  <button type="button">Annulla</button>
  <button type="button">Salva</button>
  <button type="submit">Invia</button>
</div>
```

### 🎨 `.fz-form-actions-inline` - Action Buttons (Inline)

**Per button integrati nel grid**: si comportano come qualsiasi altro campo del form.

```html
<div class="fz-form-actions-inline">
  <button type="reset">Reset</button>
  <button type="submit">🔍</button>
</div>
```

## 🏗️ Pattern Composizionale

Il vero potere del sistema: **combinare le classi** per form complessi e ben organizzati.

### 📝 Form Completo Esempio

```html
<form class="fz-form-container">
  <!-- Campi principali - si adattano automaticamente al grid -->
  <input type="text" placeholder="Nome" />
  <input type="text" placeholder="Cognome" />
  <input type="email" placeholder="Email" />
  <input type="tel" placeholder="Telefono" />
  
  <!-- Raggruppamento logico verticale -->
  <fieldset class="fz-form-group-vertical">
    <legend>Indirizzo</legend>
    <input type="text" placeholder="Via" />
    <input type="text" placeholder="Città" />
    <input type="text" placeholder="CAP" />
  </fieldset>
  
  <!-- Preferenze - checkbox in colonna -->
  <div class="fz-form-group-vertical">
    <h3>Notifiche</h3>
    <label><input type="checkbox" /> Email marketing</label>
    <label><input type="checkbox" /> SMS promozionali</label>
    <label><input type="checkbox" /> Newsletter</label>
</div>

  <!-- Search inline -->
  <div class="fz-form-group-horizontal">
    <input type="search" placeholder="Codice promozionale" />
    <button type="button">Verifica</button>
  </div>
  
  <!-- Action buttons - sempre in fondo, sempre a destra -->
  <div class="fz-form-actions">
    <button type="button">Annulla</button>
    <button type="button">Salva Bozza</button>
    <button type="submit">Registrati</button>
  </div>
</form>
```

## 🤖 Gestione Automatica dei Componenti

### 📝 Textarea Full-Width Automatica

Le **textarea** (`FzTextarea` con classe `.fz-textarea`) sono gestite automaticamente dal sistema:

```html
<form class="fz-form-container">
  <!-- Questi si distribuiscono su più colonne (desktop) -->
  <input type="text" placeholder="Nome" />
  <input type="email" placeholder="Email" />
  <input type="tel" placeholder="Telefono" />
  
  <!-- Textarea AUTOMATICAMENTE full-width (grid breaker) -->
  <FzTextarea 
    class="fz-textarea" 
    placeholder="Descrivi la tua richiesta..." 
    rows="4" 
  />
  
  <!-- Il layout multi-colonna riprende dopo la textarea -->
  <select><option>Priorità</option></select>
  <input type="date" />
  
  <div class="fz-form-actions">
    <button type="submit">Invia</button>
  </div>
</form>
```

**Comportamento automatico:**
- 📱 **Mobile:** Normale (tutto in colonna)
- 🖥️ **Desktop:** Textarea interrompe il grid e occupa tutta la larghezza, poi il layout multi-colonna riprende

### 🔍 Search Form con Actions Inline

```html
<form class="fz-form-container">
  <!-- Ricerca principale e filtri - grid intelligente -->
  <input type="search" placeholder="Cerca prodotti..." />
  <select><option>Categoria</option></select>
  
  <!-- Actions integrate nel grid come normale campo -->
  <div class="fz-form-actions-inline">
    <button type="reset">Reset</button>
    <button type="submit">🔍 Cerca</button>
  </div>
  
  <select><option>Prezzo</option></select>
  <select><option>Brand</option></select>
  <input type="number" placeholder="Sconto min %" />
</form>
```

### 🏢 Form Aziendale con Actions Finali

```html
<form class="fz-form-container">
  <!-- Campi aziendali si distribuiscono automaticamente -->
  <input type="text" placeholder="Ragione Sociale" />
  <input type="text" placeholder="Partita IVA" />
  <input type="email" placeholder="Email aziendale" />
  <input type="tel" placeholder="Telefono" />
  
  <!-- Textarea full-width automatica -->
  <FzTextarea 
    class="fz-textarea"
    placeholder="Note aggiuntive..."
    rows="3"
  />
  
  <!-- Actions finali a piena larghezza -->
  <div class="fz-form-actions">
    <button type="button">Salva Bozza</button>
    <button type="submit">Registra Azienda</button>
  </div>
</form>
```

### ⚙️ Settings Panel

```html
<form class="fz-form-container">
  <!-- Configurazioni principali -->
  <input type="text" placeholder="Nome app" />
  <select><option>Tema</option></select>
  <input type="number" placeholder="Timeout sessione" />
  
  <!-- Radio group per notifiche -->
  <div class="fz-form-group-vertical">
    <h3>Notifiche</h3>
    <label><input type="radio" name="notif" /> Tutte</label>
    <label><input type="radio" name="notif" /> Solo importanti</label>
    <label><input type="radio" name="notif" /> Disabilitate</label>
  </div>
  
  <!-- Toggle privacy -->
  <div class="fz-form-group-vertical">
    <h3>Privacy</h3>
    <label><input type="checkbox" /> Profilo pubblico</label>
    <label><input type="checkbox" /> Mostra email</label>
    <label><input type="checkbox" /> Analytics</label>
  </div>
  
  <!-- Azioni multiple con wrap automatico -->
  <div class="fz-form-actions">
    <button type="button">Ripristina Default</button>
    <button type="button">Importa</button>
    <button type="button">Esporta</button>
    <button type="submit">Salva</button>
  </div>
</form>
```

## ⚡ Quick Start

```html
<!-- Form base - tutto automatico -->
<form class="fz-form-container">
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  
  <div class="fz-form-actions">
    <button type="submit">Login</button>
  </div>
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

## 📐 Sistema di Gap Responsive

Tutte le classi condividono lo stesso sistema di spacing progressivo:

| Breakpoint | Gap | Pixel | Uso |
|------------|-----|-------|-----|
| **📱 Mobile** | `gap-3` | 12px | Compatto per spazio limitato |
| **📱 Tablet** | `gap-4` | 16px | Equilibrato |
| **🖥️ Desktop** | `gap-6` | 24px | Generoso per schermi grandi |

## 🛠️ Configurazione (Avanzata)

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

**+ Gestione automatica:**
```css
.fz-form-container .fz-textarea  /* Textarea sempre full-width */
```

**5 classi + automazione intelligente. Infinite possibilità. Zero configurazione.** ✨

## 🔗 Links

- [Tailwind CSS](https://tailwindcss.com/)
- [Fiscozen Design System](../README.md)

---

**Developed with ❤️ by Fiscozen Design System Team**