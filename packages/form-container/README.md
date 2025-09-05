# @fiscozen/form-container

**CSS Grid-based Form Layout System** - High-performance Tailwind CSS plugin for responsive form layouts with intelligent auto-fitting grid behavior and semantic field grouping.

## Installation

```bash
npm install @fiscozen/form-container
```

## Configuration

### Tailwind Plugin Registration

Add the plugin to your `tailwind.config.js`:

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}'],
  plugins: [
    require('@fiscozen/form-container'),
  ],
}
```

### Plugin Architecture

The plugin generates utility classes using Tailwind's `@apply` directive with responsive breakpoints and configurable parameters.

## API Reference

> **⚠️ Architecture Guidance**: 90% of forms should use only `.fz-form-container` + `.fz-form-actions`. The grouping classes (`.fz-form-group-*`) are designed for edge cases and complex layouts only. Start simple and add complexity only when the auto-fit behavior is insufficient.

### Core Layout Classes

#### `.fz-form-container`

**Primary form layout container** with intelligent responsive grid behavior.

**Algorithm:** Uses `repeat(auto-fit, minmax(max(min-width, percentage), 1fr))` to balance minimum usable field width with maximum column constraints.

**Usage:**
```html
<form class="fz-form-container">
  <FzInput type="text" placeholder="Field 1" />
  <FzInput type="text" placeholder="Field 2" />
  <FzInput type="text" placeholder="Field 3" />
  <!-- Auto-arranges in 1-3 columns based on viewport -->
</form>
```

#### `.fz-form-group-vertical` ⚠️ **Edge Case Only**

**Flexbox-based vertical grouping** for semantically related fields that must maintain vertical stacking regardless of viewport. Use only when the natural grid flow breaks semantic grouping (e.g., radio button groups, wizard steps).

**Usage (Edge Case):**
```html
<form class="fz-form-container">
  <fieldset class="fz-form-group-vertical">
    <legend>Contact Preferences</legend><!-- or <h1-6> -->
    <FzInput type="radio" name="contact" value="email" label="Email" />
    <FzInput type="radio" name="contact" value="phone" label="Phone" />
    <FzInput type="radio" name="contact" value="both" label="Both" />
  </fieldset>
</form>
```

#### `.fz-form-group-horizontal` ⚠️ **Edge Case Only**

**Flexbox-based horizontal grouping** for fields that should remain inline across all viewports. Use only for tightly coupled controls (e.g., search input + button, date range pairs).

**Usage (Edge Case):**
```html
<form class="fz-form-container">
  <fieldset class="fz-form-group-horizontal">
    <FzInput type="text" placeholder="Search..." />
    <FzButton type="submit">Search</FzButton>
  </fieldset>
</form>
```

### Action Button Classes

#### `.fz-form-actions`

**Full-width action bar** that spans entire form width and right-aligns buttons.

**Usage:**
```html
<form class="fz-form-container">
  <fieldset class="fz-form-actions">
    <FzButton type="button">Cancel</FzButton>
    <FzButton type="submit">Submit</FzButton>
  </fieldset>
</form>
```

#### `.fz-form-actions-inline`

**Inline action controls** that participate in the grid layout as regular form elements.

**Usage:**
```html
<form class="fz-form-container">
  <fieldset class="fz-form-actions-inline">
    <FzButton type="button">Cancel</FzButton>
    <FzButton type="submit">Submit</FzButton>
  </fieldset>
</form>
```

### Automatic Layout Behaviors

#### Textarea Auto-Spanning

Elements with class `.fz-textarea` automatically span the full width of the form container:

**Usage:**
```html
<form class="fz-form-container">
  <FzInput type="text" placeholder="Name" />
  <FzInput type="email" placeholder="Email" />
  
  <FzTextarea class="fz-textarea" placeholder="Description..." />

  <!-- Grid resumes normal behavior after textarea -->
  <FzInput type="date" placeholder="Date" />
  <FzInput type="url" placeholder="Website" />
</form>
```

## Usage Guidelines

### Simple vs Complex

**✅ PREFERRED (90% of cases):**
```html
<form class="fz-form-container">
  <FzInput type="text" name="name" placeholder="Name" label="Name" />
  <FzInput type="email" name="email" placeholder="Email" label="Email" />
  <FzInput type="tel" name="phone" placeholder="Phone" label="Phone" />
  
  <fieldset class="fz-form-actions">
    <FzButton type="submit">Submit</FzButton>
  </fieldset>
</form>
```

**⚠️ COMPLEX (Edge cases only):**
```html
<form class="fz-form-container">
  <!-- Most fields use auto-layout -->
  <FzInput type="text" name="name" placeholder="Name" label="Name" />
  <FzInput type="email" name="email" placeholder="Email" label="Email" />
  
  <!-- Only group when semantic meaning requires it -->
  <fieldset class="fz-form-group-vertical">
    <FzInput type="text" placeholder="Nome" label="Nome" />
    <FzInput type="text" placeholder="Cognome" label="Cognome" />
  </fieldset>
  
  <fieldset class="fz-form-actions">
    <FzButton type="submit">Submit</FzButton>
  </fieldset>
</form>
```

### Performance Impact

- **`.fz-form-container`**: Optimal CSS Grid performance, minimal DOM
- **`.fz-form-group-*`**: Additional flex container, increased layout cost
- **Recommendation**: Use grouping sparingly to maintain performance
