# @fiscozen/data

## 0.2.0

### Minor Changes

- 03c563c: Add a configuration to handle the trailing slash

## 0.1.1

### Patch Changes

- 2a4bc6a: Remove pagination default params from callListActionWithDefaults helper

## 0.1.0

### Minor Changes

- **LIB-2185/LIB-2367: Nuovo pacchetto @fiscozen/data.** Data layer reattivo per Vue con supporto REST, paginazione, deduplicazione e interceptor.

### Funzionalità principali

#### Core

- **useFzFetch**: Composable per le chiamate HTTP con stato reattivo (loading, error, data)
- **setupFzFetcher**: Configurazione globale con base URL, interceptor e CSRF management
- Azioni REST: `list`, `retrieve`, `create`, `update`, `delete` con validazione automatica

#### Paginazione e filtri

- **usePaginatedList**: Azione specializzata per liste paginate con filtri reattivi (LIB-2367)
- Debounce automatico per aggiornamenti (`autoUpdate`) per ottimizzare le richieste (LIB-2367)
- Prevenzione delle race condition nelle richieste paginate (LIB-2367)
- Parametri di paginazione configurabili (`page_size` al posto di `per_page`)

#### Deduplicazione e interceptor

- **DeduplicationManager** con supporto per base URL e normalizzazione URL relative (LIB-2367)
- Normalizzazione JSON per gestire variazioni nell'ordine delle chiavi (LIB-2367)
- Interceptor di richiesta e risposta con gestione errori e re-parsing (LIB-2457)
- Cleanup automatico delle richieste pendenti per prevenire memory leak (LIB-2367)

#### Reattività

- Body e header reattivi in `useFzFetch` (next.9)
- URL reattivi per `retrieve` e `list` (LIB-2185)
- Sincronizzazione dello stato di loading per richieste reattive
- Prevenzione di stato condiviso mutabile nelle chiamate concorrenti

#### Utilities

- **Merge helpers** per azioni personalizzate e route annidate
- Gestione CSRF tramite cookie con estrazione automatica
- Normalizzazione header case-insensitive per confronti negli interceptor
- `throwOnError` per le risposte delle azioni REST
