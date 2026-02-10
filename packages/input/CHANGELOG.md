# @fiscozen/input

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
  - @fiscozen/button@1.0.0
  - @fiscozen/composables@1.0.1
