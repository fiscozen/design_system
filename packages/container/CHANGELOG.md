# @fiscozen/container

## 0.4.1

### Minor Changes (dalla creazione del componente)

- **LIB-2229/LIB-2309: Componente FzContainer.** Layout container flessibile con orientamento orizzontale/verticale, gap semantici e opzioni di layout avanzate.

### Funzionalità principali

- Layout **verticale** (default) e **orizzontale** con prop `horizontal` (LIB-2309)
- **Gap semantici** con valori da `none` a `xl` basati sui design token (LIB-2229)
- Opzioni di layout: `space-between`, `expand-all`, `expand-last` (LIB-2309)
- Prop `alignItems` per allineamento cross-axis nei container (LIB-2309)
- Gestione dello spacing tra paragrafi tramite variabile CSS (LIB-2252)
- Classi utility Tailwind per il gap del container (LIB-2229)
- Valori di wrap personalizzabili (LIB-2229)

### Patch Changes

- Updated dependencies
  - @fiscozen/style@0.2.0
