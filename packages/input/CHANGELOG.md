# @fiscozen/input

## 3.5.0

### Minor Changes

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

### Patch Changes

- 5586027: FzInput: remove the `any` from `useInputStyle`'s props parameter. The composable only reads visual-state props (`variant`, `disabled`, `readonly`, `error`, `highlighted`, `aiReasoning`), none of which depend on the input `type`, so it now takes a `Pick`ed `ToRefs<FzInputStyleProps>` instead of `ToRefs<FzInputProps<any>>`. Type-level cleanup only — no API or runtime change.

## 3.4.4

### Patch Changes

- @fiscozen/alert@3.0.4
- @fiscozen/button@3.1.1

## 3.4.3

### Patch Changes

- Updated dependencies [2893adb]
  - @fiscozen/alert@3.0.3

## 3.4.2

### Patch Changes

- Updated dependencies [d835f37]
  - @fiscozen/button@3.1.0
  - @fiscozen/alert@3.0.2

## 3.4.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 3.4.0

### Minor Changes

- c77895b: Add `id` prop and align DS baselines
  - NEW: `FzInput` accepts an optional `id` prop. When provided, it sets the underlying `<input>`'s `id` and the `<label>`'s `for` attribute to the same value so the label-input binding stays intact. When omitted, the component continues to generate a stable internal id. Aligns the component with `FzTextarea`'s `effectiveId` pattern.
  - Apply `text-core-black` baseline on the root wrapper so descendant text inherits the design's neutral colour.
  - Pair `border-1` with `border-solid` on the input container so the 1px border renders in host environments without a global Tailwind preflight.
  - Apply `mb-0` baseline on the label so it does not collide with host `<label>` reboots that add margin-bottom.
  - Style disabled and readonly value text intrinsically: the `<input>` now carries `disabled:text-grey-300` and `read-only:text-grey-300` Tailwind variants (the placeholder is already `placeholder:text-grey-300` by default). This removes the dependency on a `.text-grey-300`-on-container class convention to color the value text in host environments where the input would otherwise keep the UA default color.
  - Drop the inline `style="width: ..."` previously applied to the helper text and error message elements. Their width is now set by the natural document flow.

## 3.3.1

### Patch Changes

- Updated dependencies [a9c33b8]
  - @fiscozen/button@3.0.1
  - @fiscozen/alert@3.0.1

## 3.3.0

### Minor Changes

- 4a4cde6: Add clearable prop. When enabled, a clear (×) icon appears when the input has a value.

## 3.2.0

### Minor Changes

- b4ae9e4: feat(FzSelect): add highlighted and aiReasoning visual emphasis props

  Add `highlighted` and `aiReasoning` props to FzSelect, mirroring FzInput's emphasis API.
  Both props reset to default on user selection or clear, emitting `update:highlighted` /
  `update:aiReasoning` for v-model two-way binding.

  Also adds `disableEmphasisReset` to FzInput to allow FzSelect to control the emphasis
  lifecycle when using FzInput internally in filterable mode.

### Patch Changes

- Updated dependencies [3428436]
  - @fiscozen/icons@1.0.3

## 3.1.0

### Minor Changes

- 9b12cbf: Add emphasis reset on user input: highlighted and aiReasoning states revert to default when the user types, while programmatic value changes preserve emphasis. Sparkles icon now uses solid variant.

## 3.0.3

### Patch Changes

- c2a049e: Hide helpText and errorMessage slot when empty

## 3.0.2

### Patch Changes

- d662a78: Disable attrs fallthrough duplication on FzInput root element

## 3.0.1

### Patch Changes

- 34a7934: Fix decimal precision (IEEE 754 floating-point drift)
- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/alert@3.0.0
  - @fiscozen/button@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/button@2.0.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/alert@2.0.0

## 1.0.2

### Patch Changes

- 26cd2bf: Use FzAlert to display the error message
- Updated dependencies [a42b3b4]
  - @fiscozen/alert@1.1.0

## 1.0.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/button@1.0.2

## 1.0.0

### Major Changes

- **LIB-1898: Redesign completo di FzInput.** Floating label, nuova API per gli slot, e introduzione di FzCurrencyInput.

### Modifiche dalla versione 0.1.17

#### Nuove funzionalità

- Floating label con supporto per tutti i tipi di input (email, telefono, URL)
- Nuovo componente **FzCurrencyInput** con formattazione automatica, supporto per valori negativi, gestione min/max, e step con `forceStep`
- Secondo pulsante icona a destra (`rightIconLast`) con gestione accessibilità
- Prop `environment` per sostituire la deprecata prop `size`
- Prop `autocomplete` per il controllo dell'autocompletamento
- Slot `left-icon` per FzCurrencyInput

#### Miglioramenti

- Gestione migliorata degli eventi di tastiera: il tasto Enter ora consente il submit del form
- Gestione incolla migliorata per FzCurrencyInput con supporto formati italiani
- Prevenzione delle race condition negli aggiornamenti del model
- Click sulle icone disabilitato quando l'input è `disabled` o `readonly`
- Miglioramento accessibilità con `aria-labelledby` e `aria-describedby`

### Patch Changes

- Updated dependencies
  - @fiscozen/button@1.0.1
  - @fiscozen/composables@1.0.1
