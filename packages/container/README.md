# @fiscozen/container

Un componente Container **semplice e focalizzato** per creare stack verticali con controllo del gap.

## Installazione

```bash
npm install @fiscozen/container
```

## Uso Base

```vue
<script setup>
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <FzContainer main>

    <FzContainer>
      <div>Elemento 1</div>
      <div>Elemento 2</div>
      <div>Elemento 3</div>
    </FzContainer>

    <FzContainer>
      <div>Elemento 1</div>
      <div>Elemento 2</div>
      <div>Elemento 3</div>
    </FzContainer>

  </FzContainer>

</template>
```

## Proprietà

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `main` | `boolean` | `false` | Se `true` indica che FzContainer è il container principale della pagina |
| `gap` | `'sm' \| 'base' \| 'lg'` | `'base'` | Dimensione del gap tra elementi dello stack |
| `tag` | `string` | `'div'` | Tag HTML da utilizzare per il container |

### Gap Sizes

| Size | Main Container | Section Container |
|------|---------------|------------------|
| `sm` | --main-content-sm | --section-content-sm |
| `base` | --main-content-base | --section-content-base |
| `lg` | --main-content-lg | --section-content-lg |
