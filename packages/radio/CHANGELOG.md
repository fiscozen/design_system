# @fiscozen/radio

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
