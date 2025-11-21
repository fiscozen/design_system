# Analisi Pacchetto @fiscozen/input

## Conformità alle Cursorrules

### ✅ Punti di Forza

1. **JSDoc**: Presente e in stile SSE (concise, purposeful)
2. **TypeScript**: Strict mode, tipi corretti
3. **Testing**: >90% coverage, test completi
4. **Accessibility**: WCAG 2.1 AA compliance (ARIA attributes corretti)
5. **Documentation**: README e MDX aggiornati
6. **Code Quality**: DRY principle applicato, configurazione centralizzata

### ❌ Bug e Problemi Trovati

#### 1. **FzInput.vue - Linea 300: Classe CSS non valida**
```vue
<div class="flex flex-col space-around min-w-0 grow">
```
**Problema**: `space-around` non è una classe Tailwind valida. Dovrebbe essere `justify-around` o `justify-between`.

**Fix suggerito**:
```vue
<div class="flex flex-col justify-around min-w-0 grow">
```

#### 2. **FzInput.vue - Linea 303: Inconsistenza colori design system**
```vue
class="text-xs text-gray-300 grow-0 overflow-hidden text-ellipsis whitespace-nowrap"
```
**Problema**: Usa `text-gray-300` invece di `text-grey-300` (inconsistenza con design system).

**Fix suggerito**:
```vue
class="text-xs text-grey-300 grow-0 overflow-hidden text-ellipsis whitespace-nowrap"
```

#### 3. **FzInput.vue - Linea 379 e 415: Inconsistenza colori design system**
```vue
{ 'bg-grey-100 !text-gray-300': isReadonlyOrDisabled }
```
**Problema**: Usa `!text-gray-300` invece di `!text-grey-300`.

**Fix suggerito**:
```vue
{ 'bg-grey-100 !text-grey-300': isReadonlyOrDisabled }
```

#### 4. **FzInput.vue - Linea 199: Logica errata per isLeftIconClickable**
```typescript
const isLeftIconClickable = computed(() => !!props.leftIcon);
```
**Problema**: Verifica solo se `leftIcon` esiste, ma l'icona è sempre clickable (ha sempre `@click.stop`). Il nome è fuorviante.

**Fix suggerito**: Rimuovere questa computed non utilizzata o rinominarla in modo più accurato.

#### 5. **FzInput.vue - Linea 280, 344, 372, 386, 408, 422, 439: Size hardcoded**
```vue
size="md"
```
**Problema**: Tutte le icone usano `size="md"` hardcoded. Secondo le cursorrules, dovrebbe esserci un mapping basato su environment.

**Nota**: Questo potrebbe essere intenzionale se le icone hanno una dimensione fissa, ma dovrebbe essere documentato.

#### 6. **README.md - Linea 69: Documentazione obsoleta**
```markdown
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size affecting height, padding, and text size |
```
**Problema**: La tabella props menziona `size` con default 'md', ma:
- Il default è ora 'frontoffice' per `environment`
- `size` è deprecato
- La tabella non menziona `environment`

**Fix suggerito**: Aggiornare la tabella per includere `environment` e marcare `size` come deprecated.

#### 7. **FzInput.vue - Linea 319-321: ARIA attributes corretti**
✅ **OK**: Gli attributi ARIA usano correttamente i ternari con stringhe "true"/"false" per compatibilità Vue 3.

### ⚠️ Possibili Miglioramenti

#### 1. **Centralizzazione dimensione icone**
Le icone usano tutte `size="md"` hardcoded. Se questo è intenzionale, dovrebbe essere:
- Documentato nel README
- Centralizzato in una costante/config

#### 2. **Rimozione codice morto**
- `isLeftIconClickable` computed non è utilizzata (solo `isLeftIconAccessible` è usata)

#### 3. **Consistenza colori**
Verificare che tutti i colori usino la convenzione `grey-*` invece di `gray-*`.

#### 4. **Documentazione environment prop**
Il README dovrebbe menzionare `environment` come prop principale e `size` come deprecated.

#### 5. **Test coverage**
Verificare che tutti i casi edge siano coperti, specialmente:
- Combinazioni di `environment` e `size` deprecato
- Tutti i tipi di input
- Tutte le varianti

### 📋 Checklist Conformità

- [x] JSDoc presente e in stile SSE
- [x] TypeScript strict mode
- [x] Testing >90% coverage
- [x] Accessibility WCAG 2.1 AA
- [x] README aggiornato
- [x] MDX documentation aggiornato
- [x] DRY principle applicato
- [x] Configurazione centralizzata
- [ ] **Consistenza colori design system** (bug trovato)
- [ ] **Classi CSS valide** (bug trovato)
- [ ] **Documentazione props aggiornata** (bug trovato)

### 🔧 Priorità Fix

**Alta Priorità:**
1. Fix classe CSS `space-around` → `justify-around`
2. Fix colori `gray-*` → `grey-*`
3. Aggiornare README con `environment` prop

**Media Priorità:**
4. Rimuovere/rinominare `isLeftIconClickable` se non utilizzata
5. Documentare dimensione fissa icone se intenzionale

**Bassa Priorità:**
6. Centralizzare dimensione icone se necessario

