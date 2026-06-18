# @fiscozen/select

## 3.1.10

### Patch Changes

- 0b68151: fix(FzSelect): preserve falsy option values (`0`, `""`) in v-model

  The `selectedOption` computed short-circuited on `!model.value`, which is
  truthy for any falsy value. Selecting an option whose `value` is the
  number `0` or the empty string was therefore matched and emitted
  correctly but never reflected back: the opener kept showing the
  placeholder instead of the selected option label.

  Switched the guard to an explicit `undefined`/`null` check so only
  "no selection" short-circuits — actual option values pass through to
  `Array.prototype.find` and are matched by strict equality as before.

## 3.1.9

### Patch Changes

- 47fe215: FzInput: add `type="currency"` and step controls for `type="number"`; deprecate FzCurrencyInput
  - `FzInput` now supports `type="currency"`: locale-aware currency formatting, min/max clamping, step quantization and a numeric v-model (`number | null | undefined`), powered by the new internal `useCurrencyInput` composable. The component is now generic over its `type` prop, so the v-model stays `string` for every other type.
  - `type="number"` inputs show the same up/down step controls in place of the native browser spinners (stepping uses the native algorithm and respects `min`/`max`/`step`).
  - `type="number"` inputs now rescue pasted content the native input would reject or blank out (e.g. Italian-formatted "1.234,56" or padded spreadsheet copies): it is normalized to a plain decimal string and replaces the whole value. Natively-valid clipboard text keeps the default browser behavior (cursor-position insertion); unparseable text is ignored, keeping the previous value. No decimal truncation or min/max clamping is applied — validation semantics stay native.
  - New `FzInput` props: `min`, `max`, `step`, `forceStep`, `minimumFractionDigits`, `maximumFractionDigits`, `nullOnEmpty`, `zeroOnEmpty`, `stepUpAriaLabel`, `stepDownAriaLabel`.
  - `type` now also accepts the native `search` and `file` types (rendered via passthrough).
  - New exported types: `FzInputType`, `FzInputModelValue`, `FzInputInstance` (use the latter instead of `InstanceType<typeof FzInput>`, which no longer applies to generic components).
  - `FzCurrencyInput` is now a deprecated thin wrapper around `<FzInput type="currency">` with unchanged behavior and API; it will be removed once all consumers have migrated.
  - `@fiscozen/select`, `@fiscozen/typeahead`: internal `InstanceType<typeof FzInput>` usages replaced with `FzInputInstance`.
  - `@fiscozen/table`: internal `compatConfig` assignment on FzInput adapted to the generic component type.

- Updated dependencies [47fe215]
- Updated dependencies [5586027]
  - @fiscozen/input@3.5.0

## 3.1.8

### Patch Changes

- @fiscozen/alert@3.0.4
- @fiscozen/button@3.1.1
- @fiscozen/input@3.4.4

## 3.1.7

### Patch Changes

- Updated dependencies [2893adb]
  - @fiscozen/alert@3.0.3
  - @fiscozen/input@3.4.3

## 3.1.6

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0
  - @fiscozen/alert@3.0.2
  - @fiscozen/input@3.4.2

## 3.1.5

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/input@3.4.1

## 3.1.4

### Patch Changes

- df0e173: Fix HD-23713 (space-strip in filterable mode) and align DS baselines
  - 🚨 HD-23713: in `filterable` mode the search input now accepts space characters. `event.preventDefault()` in `handleOptionsKeydown` for the `Enter`/`Space` cases is now guarded by the `focusedIndex >= 0` check, so when the input is focused with no option highlighted the Space keystroke is no longer swallowed.
  - Pair `border-1` with `border-solid` on the opener button so the 1px border renders correctly in host environments without a global Tailwind preflight.
  - Apply `text-core-black` on the floating root so descendant text inherits the design's neutral colour instead of an ambient host colour.
  - Align `FzSelectLabel` styling to `FzInput`: `font-normal text-base mb-0` (identical for `frontoffice` and `backoffice`), preserving the existing `text-grey-500` / `text-grey-300` disabled-readonly mapping.

- Updated dependencies [c77895b]
  - @fiscozen/input@3.4.0

## 3.1.3

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/alert@3.0.1
  - @fiscozen/input@3.3.1
  - @fiscozen/action@3.0.1

## 3.1.2

### Patch Changes

- Updated dependencies [7a81fcd]
  - @fiscozen/progress@4.0.0

## 3.1.1

### Patch Changes

- Updated dependencies [4a4cde6]
  - @fiscozen/input@3.3.0

## 3.1.0

### Minor Changes

- b4ae9e4: feat(FzSelect): add highlighted and aiReasoning visual emphasis props

  Add `highlighted` and `aiReasoning` props to FzSelect, mirroring FzInput's emphasis API.
  Both props reset to default on user selection or clear, emitting `update:highlighted` /
  `update:aiReasoning` for v-model two-way binding.

  Also adds `disableEmphasisReset` to FzInput to allow FzSelect to control the emphasis
  lifecycle when using FzInput internally in filterable mode.

### Patch Changes

- Updated dependencies [b4ae9e4]
- Updated dependencies [3428436]
  - @fiscozen/input@3.2.0
  - @fiscozen/icons@1.0.3

## 3.0.6

### Patch Changes

- Updated dependencies [9b12cbf]
  - @fiscozen/input@3.1.0

## 3.0.5

### Patch Changes

- Updated dependencies [d706523]
  - @fiscozen/progress@3.0.1

## 3.0.4

### Patch Changes

- Handle empty slot forwarding for help and error messages

## 3.0.3

### Patch Changes

- Updated dependencies [c2a049e]
  - @fiscozen/input@3.0.3

## 3.0.2

### Patch Changes

- Updated dependencies [d662a78]
  - @fiscozen/input@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/input@3.0.1

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/action@3.0.0
  - @fiscozen/alert@3.0.0
  - @fiscozen/button@3.0.0
  - @fiscozen/input@3.0.0
  - @fiscozen/progress@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/progress@2.0.0
  - @fiscozen/action@2.0.0
  - @fiscozen/alert@2.0.0
  - @fiscozen/input@2.0.0

## 1.0.4

### Patch Changes

- 457253d: Use FzAlert variant text for error message

## 1.0.3

### Patch Changes

- 26cd2bf: Use FzAlert to display the error message
- Updated dependencies [a42b3b4]
- Updated dependencies [26cd2bf]
  - @fiscozen/alert@1.1.0
  - @fiscozen/input@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies [640ed46]
  - @fiscozen/progress@1.1.0

## 1.0.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/action@1.1.1
  - @fiscozen/alert@1.0.1
  - @fiscozen/button@1.0.2
  - @fiscozen/input@1.0.1
  - @fiscozen/progress@1.0.2

## 1.0.0

### Major Changes

- **LIB-1909/LIB-1918: Redesign completo di FzSelect.** Nuova architettura con FzActionList, funzionalità di filtro con Fuse.js, e integrazione di alert e progress.

### Modifiche dalla versione 0.1.14

#### Nuove funzionalità

- Filtro integrato con ricerca fuzzy tramite **Fuse.js** (LIB-1918)
- Prop `clearable` per svuotare la selezione con un'icona dedicata (LIB-1909, LIB-1918)
- Integrazione con **FzActionList** per le opzioni (LIB-1909)
- Integrazione con **FzAlert** per messaggi di errore/avviso (LIB-1909)
- Floating label con variante ad altezza adattata (LIB-1918)
- Gestione migliorata della tastiera: chiusura del dropdown con Enter/Space (LIB-1909)
- Scroll handler migliorato per le liste di opzioni (LIB-1909)
- Gestione dei `disabled` e `readonly` centralizzata (LIB-1909)

#### Refactoring

- Ristrutturazione completa del componente con nuovi componenti presentazionali (FzSelectButton, ecc.) (LIB-1909)
- Rimozione dei componenti deprecati FzSelectLabel e FzSelectOption (LIB-1909)
- Deprecation warnings per le prop `size` e `rightIconLast` (LIB-1909, LIB-1918)
- Nuovo model tipizzato come `string | undefined` (LIB-1909)
- Miglioramenti di accessibilità nei componenti FzAction e FzSelect (LIB-1909)

#### Dalla versione 0.1.14 (pre-redesign)

- Supporto sottotitoli nelle opzioni (LIB-1452)
- Label su FzSelect (LIB-1360)
- Floating label e right icon click (LIB-1062)
- Gestione layering con z-index (LIB-1274)
- Fix larghezza e posizionamento floating (LIB-1268)

### Patch Changes

- Updated dependencies
  - @fiscozen/action@1.1.0
  - @fiscozen/alert@1.0.0
  - @fiscozen/button@1.0.1
  - @fiscozen/input@1.0.0
  - @fiscozen/composables@1.0.1
  - @fiscozen/progress@1.0.1
