# @fiscozen/radio

## 3.0.9

### Patch Changes

- 6305a78: `FzRadio` and `FzRadioGroup` now set `mb-0` on their `<label>` (and on `FzRadioGroup`'s help `<p>`) as a baseline.
  This makes the label spacing environment-agnostic: hosts with Bootstrap reboot but without global Tailwind preflight no longer leak `label { margin-bottom: 0.5rem }` / `p { margin-bottom: 1rem }` into the layout.
  The other baselines the shim covered (`display: flex`, `text-core-black`, disabled `grey-300`, and the `text-semantic-error` palette default) were already present in the components.
  No changes to the public props.

## 3.0.8

### Patch Changes

- 55dff5c: fix(HD-24543): render identically under a hostile global stylesheet

  Three issues caused `FzRadioCard` to render differently when the host
  application ships a global stylesheet (e.g. Bootstrap) than it did in a clean
  environment:
  1. **Native radio leaked.** The input was collapsed only by the Tailwind
     utilities `h-0 w-0 absolute` (specificity `(0,1,0)`); the matching
     `.fz-hidden-input` rule lived in a `<style scoped>` block in `FzRadio.vue` and
     never applied to the card. A host `input[type="radio"]` rule `(0,1,1)` then
     overrode the utilities and the native control reappeared. Fixed by adding a
     hardened, non-scoped `.fz-hidden-input` rule to the shared `fz-radio.css`
     (already imported by the card) with `!important`, so the input stays
     collapsed regardless of host CSS load order or specificity.
  2. **Subtitle gained a top margin.** The subtitle carried a `mt-4` class that was
     already a no-op (overridden by `!m-0`; spacing comes from the flex `gap-4`),
     but it collided with Bootstrap's `.mt-4` utility (`margin-top: 1.5rem
!important`), which won by load order and pushed the subtitle down. Removed
     the dead `mt-4` class.
  3. **Card gained a bottom margin.** The card container is a `<label>`, and
     Bootstrap's reboot applies `label { margin-bottom: .5rem }`. Added `m-0` to
     the label (a class selector outranks the element rule) to reset it.

## 3.0.7

### Patch Changes

- @fiscozen/alert@3.0.4
- @fiscozen/tooltip@3.0.3

## 3.0.6

### Patch Changes

- Updated dependencies [2893adb]
  - @fiscozen/alert@3.0.3

## 3.0.5

### Patch Changes

- @fiscozen/alert@3.0.2
- @fiscozen/tooltip@3.0.3

## 3.0.4

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4
  - @fiscozen/tooltip@3.0.3

## 3.0.3

### Patch Changes

- Updated dependencies [351b6b7]
  - @fiscozen/badge@3.0.1

## 3.0.2

### Patch Changes

- Updated dependencies [a9c33b8]
- Updated dependencies [6dd9ef5]
  - @fiscozen/tooltip@3.0.2
  - @fiscozen/alert@3.0.1

## 3.0.1

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3
  - @fiscozen/tooltip@3.0.1

## 3.0.0

### Patch Changes

- Updated dependencies
  - @fiscozen/icons@1.0.0
  - @fiscozen/alert@3.0.0
  - @fiscozen/badge@3.0.0
  - @fiscozen/tooltip@3.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [a26bc2c]
- Updated dependencies [2d4fc5e]
  - @fiscozen/icons@0.2.0
  - @fiscozen/composables@1.0.2
  - @fiscozen/alert@2.0.0
  - @fiscozen/badge@2.0.0
  - @fiscozen/tooltip@2.0.0

## 1.0.3

### Patch Changes

- 457253d: Use FzAlert variant text for error message

## 1.0.2

### Patch Changes

- Updated dependencies [a42b3b4]
  - @fiscozen/alert@1.1.0

## 1.0.1

### Patch Changes

- 1a2df8c: Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
- Updated dependencies [1a2df8c]
  - @fiscozen/alert@1.0.1
  - @fiscozen/badge@1.0.1
  - @fiscozen/tooltip@1.0.3

## 1.0.0

### Major Changes

- **Redesign completo di FzRadio.** Nuova API con supporto `tone`, ErrorAlert integrato, e introduzione di FzRadioCard.

### Modifiche dalla versione 0.1.10

#### Nuove funzionalità

- Nuovo componente **FzRadioCard** con supporto per immagini e layout personalizzabile
- Integrazione con FzAlert per la visualizzazione degli errori (`tone` prop)
- Dimensione predefinita del gruppo radio impostata a `md`

#### Correzioni

- Correzione dello stile dell'input nascosto in FzRadio (LIB-820)
- Correzione dell'evento `onChange` che veniva emesso alla creazione (LIB-569)
- Correzioni al design e allo stile del radio e del radio group (LIB-491)
- Correzione della gestione di `id` e `label` per valori non univoci (LIB-436)
- Migrazione degli stili da inline a classi Tailwind (LIB-436)

### Patch Changes

- Updated dependencies
  - @fiscozen/alert@1.0.0
  - @fiscozen/badge@1.0.0
  - @fiscozen/tooltip@1.0.2
  - @fiscozen/composables@1.0.1
