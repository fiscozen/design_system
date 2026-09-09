# Catalogo

Tutti i componenti pubblici del design system — **78, in 43 pacchetti** — in una pagina sola, e
una pagina per componente con **tutte le varianti e tutti gli stati**.

```bash
pnpm --filter @fiscozen/catalogo dev   # → http://localhost:6007
node scripts/audit-copertura.mjs       # manca qualcosa?
```

## A cosa serve, visto che c'è Storybook

Storybook (:6006) documenta le prop e i controlli: è lo strumento di chi implementa. Il catalogo
risponde a due domande diverse — *«cosa ho a disposizione?»* dalla panoramica, e *«come si comporta
questo componente in tutti i suoi stati?»* dalla pagina del singolo componente, dove varianti,
dimensioni e stati stanno **tutti sotto gli occhi insieme**, senza cliccare fra le storie.

Lo switch in alto cambia `environment` a chi lo prevede: Front Office più grande (bottone 44px),
Back Office più compatto (32px).

## Gli stati sono veri

hover, focus e active non sono prop: sono pseudo-classi. `src/stati.ts` legge le regole CSS già
caricate, prende quelle con `:hover`, `:focus`, `:focus-visible` e `:active`, e ne scrive una copia
senza pseudo-classe valida solo dentro `.forza-hover`, `.forza-focus`, `.forza-active` — è la stessa
tecnica dell'addon *pseudo-states* di Storybook. Quello che vedi nelle celle «hover» e «focus» è la
regola vera del design system, non un'imitazione.

Due cose che questo metodo rivela, e che vale la pena sapere:

- **input, select e typeahead gestiscono il focus in JavaScript** (`isFocused`), non in CSS: lì il
  focus non si può forzare, e infatti nella pagina di FzInput c'è scritto di cliccare dentro il
  campo — le celle sono vive.
- **checkbox e collapse hanno pochissimo hover dichiarato** (`hover:cursor-pointer` e poco altro):
  la cella «hover» sembra uguale a quella a riposo perché il design system non dice altro.

## Tre versioni, una tab

In cima c'è uno switch fra tre versioni del design system. Cambia solo una classe sul contenitore:
i pacchetti `@fiscozen/*` non vengono toccati, quindi **il comportamento dei componenti resta
identico in tutte e tre** — il date picker apre il calendario, l'upload carica, il dropdown si apre.

| Tab | Cosa mostra |
|---|---|
| **Attuale** | Il design system come è oggi. Non lo tocchiamo. |
| **Versione 1** | Stessa funzionalità, scocca riscritta: contrasti a norma, stati che oggi mancano, una grammatica visiva sola (`src/temi/v1.css`) |
| **Versione 2** | Lettura di **Material 3 Expressive** sui nostri componenti (`src/temi/v2.css`) |

### Versione 1 · «Carta»

Non è una passata di colore sul sistema di oggi: è un'altra grammatica.

- **La pagina è carta calda**, non bianco clinico: fondo sabbia, superfici avorio, inchiostro nero
  caldo. Il colore è tenue ovunque e forte solo dove porta un significato.
- **Le superfici perdono il bordo.** Niente filo grigio: un'ombra bassissima e larga, e angoli da 20.
  È il cambio che si vede da lontano.
- **I campi sono pieni**, non incorniciati — un rettangolo di carta più scura dentro cui si scrive.
  Il bordo non serve a dire «qui c'è un campo», lo dice il colore: serve a dire «sei qui», e quindi
  appare col fuoco. Errore e «da completare» invece si dichiarano con tre segnali insieme — tinta,
  bordo e barra sul lato — così non dipendono dal colore.
- **I bottoni sono pillole**, il primario in indaco spento invece che elettrico.
- **I badge** sono pillole di tinta tenue con testo scuro: leggibili, e non urlano.

Le tre cose prese in prestito, nessuna copiata: da **Wise** la leggibilità dichiarata, da **Revolut**
la disciplina monocroma e l'assenza di decorazione, da **Airbnb** la superficie morbida senza bordi
e l'anello di focus inequivocabile.

### Versione 2 · «Expressive»

Material 3 Expressive applicato ai componenti Fiscozen. I numeri non sono a memoria: vengono dai
token di [matraic/m3e](https://github.com/matraic/m3e) — *Material 3 Expressive Web Components* —
cioè `ShapeToken`, `MotionToken`, `StateToken` e la tabella `ButtonSizeToken`.

| Cosa | Valore, e da dove viene |
|---|---|
| Scala delle forme | 4 · 8 · 12 · 16 · 20 · 28 · 32 · 48 · pillola (`ShapeToken`) |
| Molle «spatial» | `350ms cubic-bezier(0.27, 1.06, 0.18, 1)` — muovono forma e posizione, e superano il bersaglio |
| Molle «effects» | `200ms cubic-bezier(0.34, 0.8, 0.34, 1)` — muovono colore e opacità, e non rimbalzano |
| Strati di stato | hover 8%, focus 10%, pressed 10% (`StateToken`) |
| Bottone premuto | dalla pillola a **8px** (`shape-pressed-morph`, taglia small) |
| Bottone selezionato | dalla pillola a **12px** (`selected-shape-round`): la forma si inverte |
| Altezze | 32 · 40 · 56 · 96 · 136 (`ButtonSizeToken`) |

Le pagine di m3.material.io **non si scaricano**: rispondono 61 KB di HTML con dentro 47 caratteri
di testo, perché il contenuto lo costruisce JavaScript. Si leggono però **renderizzandole** —
`scripts/leggi-m3.mjs` fa esattamente questo, e da lì vengono le misure dei gruppi di bottoni:
spaziatura interna 12dp alla taglia S (18 alla XS, per tenere il bersaglio accessibile), il cambio
di larghezza «breve» mentre quello di forma resta, e il bersaglio minimo di 48dp anche quando il
bottone è alto 40 — qui esteso con uno pseudo-elemento, così l'aspetto non cambia.

Il resto della grammatica:

- **Roboto e superfici lavanda.** I neutri di Material non sono grigi: sono tinti verso il primario.
  Il carattere e il bianco lavanda dello schema chiaro sono le due cose che si riconoscono prima
  della forma.
- **Ruoli di colore, non colori.** primary, on-primary, primary-container, surface e i suoi livelli
  di contenitore: la card non ha un bordo, è un contenitore di tono diverso.
- **Nel gruppo, chi premi si allarga e i vicini si stringono** — è l'`adjacent-shrink` dei token:
  misurato, da 464px a 570 mentre il vicino scende a 358, e la riga non si sposta.
- **Campi pieni con la sottolineatura**, il filled text field di Material.

### La corrispondenza con i componenti di Material

I nomi restano i nostri. Per ogni componente ho letto **tutte e tre le tab** — specs, guidelines,
accessibility — con `scripts/leggi-m3.mjs`, e ho portato dentro non solo i token ma **l'anatomia e
i casi d'uso**: nelle pagine del catalogo, sotto le gallerie, c'è una sezione che li mostra composti
con i nostri componenti.

| Nostro | Pagina di Material | Anatomia e casi portati dentro |
|---|---|---|
| `FzCard` | Cards | media a filo in cima, headline / subhead / testo di supporto, azioni in fondo a destra, menu di troppo pieno in alto a destra; e il contenuto che **su desktop scorre dentro la card con il titolo fermo**, mentre su mobile la card si espande e non scorre mai (due barre di scorrimento sono un errore) |
| `FzInput` e famiglia | Text fields | contenitore 56dp, icona iniziale e finale, **testo di supporto e contatore di caratteri** a 4dp sotto il campo, e l'errore che occupa lo stesso posto del supporto — così non sposta niente quando compare |
| `FzCardList`, `FzCardListItem` | Lists | voci da una, due e tre righe; davanti icona, avatar o media; in fondo testo, icona o controllo di selezione; testo di supporto troncato a tre righe; forma segmentata che si chiude in 16dp quando la voce è attiva |
| `FzDialog`, `FzConfirmDialog` | Dialogs | contenitore, headline, testo di supporto, azioni in fondo a destra, scrim; e la variante a schermo intero con la barra in testa. Headline: una frase breve, senza scuse, allarmi o «sei sicuro?» |
| `FzButton` | Buttons | i **cinque stili di colore** (elevated, filled, tonal, outlined, text), le taglie 32 · 40 · 56 · 96, le due forme che premute convergono sulla stessa |
| `FzIconButton` | Icon buttons + FAB menu | quattro stili di colore, **tre larghezze**, bersaglio 48dp anche a 40 di altezza, e il menu con la scocca del FAB menu |
| `FzButtonGroup` | Button groups + Segmented buttons | spaziatura 12dp, larghezza che cambia *brevemente* alla pressione, mai a piena larghezza su schermi larghi |
| `FzDatepicker` | Date + Time pickers | i tre modi di chiedere una data — docked, modale, scritta a mano — e il calendario su surface-container-high |
| `FzNavlist`, `FzNavlink`, `FzNavbar` | Navigation rail + drawer | **rail compresso** (icona sopra, etichetta sotto, indicatore a pillola attorno all'icona) e **drawer espanso** (icona prima del testo, sezioni, divisore, etichette troncate); il baseline rail non è più consigliato |
| `FzTabs`, `FzTab` | Tabs | **primarie** con icona e indicatore che abbraccia il contenuto, **secondarie** con indicatore a tutta larghezza; divisore sul bordo inferiore del contenitore |
| `FzCheckbox` e famiglia | Checkbox | angolo del quadratino 2dp, riga da 48dp per il bersaglio |
| `FzBadge`, `FzAlert`, `FzAvatar`, `FzStepper`, `FzPagination`… | *nessuna pagina inviata* | seguono la stessa grammatica per coerenza |

Due cose che il tema non può risolvere: **FzTabs non espone i ruoli ARIA** (`tablist`, `tab`,
`tabpanel`) e **FzNavlink non espone lo stato selezionato**. Sono modifiche da fare nei componenti.

### E l'accessibilità, misurata

`node scripts/audit-contrasto.mjs` apre ogni pagina, prende ogni testo renderizzato dentro gli
esempi e lo confronta con le soglie WCAG 2.1 AA.

    tema attuale   93 testi sotto soglia, su 34 pagine
    tema v1         0
    tema v2         0

I difetti trovati nel sistema di oggi: il disabilitato a 1,38:1, il link disabilitato a 1,67:1, i
bordi dei campi a 1,38:1, i placeholder a 2,4:1, il badge giallo con testo nero a 3,55:1, il bianco
sul bottone primario a 4,11:1 — sotto la soglia di 4,5 per il testo normale.

Oltre ai contrasti, la v1 aggiunge quello che manca:

- **Focus** — un anello nero di 2px staccato di 2 su tutto quello che il fuoco lo prende,
  `:focus-visible` e non `:focus`: chi usa il mouse non lo vede, chi usa la tastiera non lo perde.
- **Hover** su ogni cosa premibile, con una velatura interna che funziona sopra qualunque variante
  senza conoscerne il fondo — la variante invisibile smette di essere l'unica che non risponde.
- **Selezionato** dichiarato con bordo e peso, non solo con il colore.
- **Disabilitato** leggibile: carta spenta e testo a 7,4:1.

## Com'è fatto

Un'app Vite dentro il monorepo che importa i pacchetti come workspace dependency: mostra i
componenti **a HEAD**, non le versioni pubblicate.

| File | Cosa |
|---|---|
| `src/registro/*.ts` | Il registro: un file per gruppo, una voce per componente, con le sue gallerie |
| `src/tipi.ts` | Voce, Galleria, Cella: il modello dei dati |
| `src/Vetrina.vue` | Disegna una galleria: le celle con dentro il componente vero, e sono interattive |
| `src/Pagina.vue` | La pagina di un componente |
| `src/demo/*.vue` | Gli esempi che i dati non bastano a descrivere: tabs, tabelle, dialoghi, navigazione, strutture |
| `src/stati.ts` | Il motore che forza hover, focus e active |
| `src/temi/v1.css`, `src/temi/v2.css` | Le versioni: solo CSS, applicato dall'esterno |
| `scripts/audit-copertura.mjs` | Confronta il registro con i componenti pubblici del DS |
| `scripts/audit-contrasto.mjs` | Misura il contrasto del testo renderizzato, tema per tema |
| `scripts/verifica.mjs` | Cammina tutte le pagine e riporta errori in console |
| `scripts/audit-layout.mjs` | Cerca i componenti rotti a vista: esempi che traboccano, testi tagliati, riquadri schiacciati |
| `scripts/leggi-m3.mjs` | Legge una pagina di m3.material.io renderizzandola: `node scripts/leggi-m3.mjs components/button-groups/specs` |

Il router in `main.ts` serve anche agli esempi: link, briciole e azioni dei dropdown sono
router-aware e senza non si montano.

## Aggiungere o approfondire un componente

Nel file del gruppo giusto in `src/registro/`, aggiungi una voce con `nome`, `pkg`, `gruppo`,
`comp`, `nota` e le `gallerie`. Ogni galleria è un titolo più una lista di celle: ogni cella ha
un'etichetta, le sue `props` e, se serve, `stato: 'hover' | 'focus' | 'active'`. Quando i dati non
bastano — perché il componente vuole figli o uno stato aperto — si scrive un componente in
`src/demo/` e lo si passa come `demo`.

Poi `node scripts/audit-copertura.mjs`: se il registro e il design system non combaciano, lo dice.
