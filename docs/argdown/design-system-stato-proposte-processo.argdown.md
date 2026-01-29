===
title: Design System — Sintesi Argdown
subTitle: Statement & Argument dall'analisi principale
author: Design System Team
date: 2025-01-28
model:
  removeTagsFromText: true
===

# Estratto argomentativo dal documento "design-system-stato-proposte-processo.md"

## Motivazione e Urgenza

[Agire adesso è necessario]: Il rilascio recente ha evidenziato un problema strutturale — scelte di UI percepite come "arrivate dall'alto" hanno generato feedback negativo.
  + <Sintomo di processo carente>: Non è un caso isolato, è il sintomo di un processo che non include abbastanza validazione prima del rilascio. #pro
  + <Prevenire è meglio che curare>: Il rework costoso dopo il danno è fatto è evitabile con validazione anticipata. #pro

[Cosa prevenire]: Decisioni di design senza contesto, rilasci che sorprendono gli utenti, rework costoso, disallineamenti design-implementazione.
  - <Top-down genera resistenza>: Scelte che arrivano ai team senza possibilità di feedback producono pushback e adozione forzata. #con

[Cosa abilitare]: Validazione collegiale, feedback loop continui, decisioni tracciabili e reversibili, governance leggera ma chiara.
  + <Trasparenza costruisce fiducia>: Decisioni tracciabili e reversibili aumentano la fiducia nel sistema. #pro

## Piano d'Azione — Fasi

[Fase 1 — Quick win]: Dimostrare valore subito con azioni a basso costo (audit, canale feedback, prima office hour, baseline metriche).
  + <Dati prima di tutto>: Avere dati concreti dà credibilità e aiuta a prioritizzare. #pro
  + <Audit componenti>: Lista dei 10 componenti più usati distingue "molecole" applicative vs DS. #pro

[Fase 2 — Processo minimo]: Introdurre meccanismi base per evitare decisioni top-down (template intake, checklist review, DoD, spec walkthrough).
  + <Spec Walkthrough è il cambio chiave>: 30 minuti con designer, dev e QA prima di scrivere codice; si validano naming API, edge case, stati, token, copy. #pro

[Fase 3 — Governance]: Una volta che il processo funziona, formalizzare ruoli e valori (workshop principi, ruoli RACI, office hours regolari, linee guida contenuti).
  + <Principi dopo l'esperienza>: Definire principi senza aver sperimentato il processo produce valori astratti. #pro

[Fase 4 — Scaling]: Consolidare, automatizzare e misurare (visual regression, roadmap pubblica, survey soddisfazione, tooling CI).
  + <Automazione riduce errori>: Test automatici e CI garantiscono qualità costante nel tempo. #pro

## Principi e Fondazione

[Stakeholder alignment]: Il design system esiste e crea valore solo se tutti gli stakeholder si sentono parte attiva.
  + <Coinvolgimento distribuito riduce pushback>: Coinvolgere in modo continuo e leggero (office hours, show & tell, canali asincroni) riduce resistenze e aumenta l'adozione. #pro

[Principi condivisi necessari]: Serve un set di principi comuni per guidare scelte coerenti nel tempo.
  + <Workshop principi crea orientamento condiviso>: Un workshop trasversale definisce 5–7 principi, con revisione trimestrale ed esempi operativi. #pro
  + <Esempi applicativi e do/don't>: I principi devono includere mapping verso Design Heuristics consolidate. #pro

[Design Heuristics come quadro]: I principi del sistema dovrebbero mappare a euristiche di usabilità generali (Nielsen/Norman).
  + <Heuristics garantiscono qualità trasversale>: Mappare principi↔euristiche migliora coerenza e riduce difetti di usabilità. #pro

## Pattern prima dei componenti

[Pattern-first approach]: I design pattern — combinazioni riusabili di elementi con uno scopo — devono essere l'unità primaria di pensiero e riuso.
  + <Pattern allinea design e API>: Proprietà e varianti dei pattern guidano le API dei componenti, riducendo rework. #pro
  + <Inventario e discovery>: Inventariare pattern esistenti e segnalare pattern emergenti accelera riuso e convergenza. #pro
  + <Componenti implementano pattern>: I componenti sono mattoni; i pattern sono soluzioni. Il valore del DS si sblocca pensando in pattern riusabili. #pro

[Documentazione pattern-centrica]: Ogni pattern ha una pagina con scopo, proprietà, varianti, esempi e dipendenze.
  + <Single source of truth>: Documentare pattern come fonte unica allinea design, API componenti e test. #pro
  + <Pattern reuse come KPI>: Il riuso dei pattern è un indicatore primario di impatto del sistema. #pro

## Governance e Collaborazione

[Governance leggera necessaria]: Una governance leggera con ruoli, intake e SLA chiarisce responsabilità e velocizza decisioni.
  + <Chiarezza riduce attrito>: Ruoli (maintainers, stewards, contributors, advisory) e review duale (design+dev) riducono incertezza. #pro
  + <RACI esplicito>: Matrice RACI per roadmap, nuovi componenti, review PR, principi e changelog. #pro

[Office hours utili]: Office hours quindicinali come spazio di supporto e allineamento continuo.
  + <Rituali abbattono handoff>: Spazi leggeri e ricorrenti sostituiscono handoff pesanti e favoriscono contributi. #pro
  + <Target partecipazione>: > 5 persone come metrica di engagement. #pro

[Meccanismi operativi]: Intake form unico, review duale, tacit approval entro SLA, semver con changelog human-readable.
  + <SLA realistici>: Decisione tacita entro 5gg o escalation ai Maintainers evita blocchi. #pro

## Allineamento Design ↔ Sviluppo

[Coinvolgimento anticipato]: Dev partecipa alla review del mockup hi-fi prima dell'implementazione.
  + <Checkpoint pre-hifi>: Prima di iniziare l'hi-fi di un nuovo pattern, 30 min con uno steward dev. #pro

[Spec walkthrough prima del build]: Una breve review con Figma + requisiti tecnici prima dell'implementazione riduce rework.
  + <Allineamento anticipato>: La spec condivisa esplicita varianti, a11y, content, test e token. #pro
  + <Checklist validata>: Output della sessione: checklist validata, dubbi risolti. #pro

[Pairing su componenti complessi]: Per componenti con molti stati o interazioni, pairing design-dev invece di handoff asincrono.
  + <Collaborazione sincrona riduce ambiguità>: Il pairing elimina interpretazioni errate e accelera l'implementazione. #pro

[Check coerenza pre-merge]: Audit rapido su token usati, pattern rispettati, naming consistente.
  + <Qualità al merge>: Verifica coerenza prima del merge previene drift stilistico. #pro

## Contenuti e Microcopy

[Content integrato al sistema]: Linee guida di contenuto (voice & tone, microcopy, naming, localizzazione) integrate nelle review.
  + <Coerenza testo-interazione>: Il contenuto è parte della UX e va validato insieme ai componenti. #pro

## QA e Testing

[QA sistematico richiesto]: Definition of Done estesa per i componenti DS.
  + <Test prevengono regressioni>: Una test matrix concordata e regressioni visive sui core riducono rischi. #pro

[Definition of Done]: Requisiti minimi per ogni componente.
  + <Accessibilità WCAG AA>: Focus, contrast, keyboard nav obbligatori. #pro
  + <Test visivo>: Almeno 1 snapshot per variante principale. #pro
  + <Test interattivo>: Stati hover, focus, disabled, error coperti. #pro
  + <Browser support>: Chrome, Firefox, Safari (ultime 2 versioni), Edge. #pro
  + <Viewport>: 320px, 768px, 1024px, 1440px testati. #pro

[Strumenti QA]: Storybook come ambiente di verifica, visual regression (Chromatic/Percy), smoke test.
  + <Stories = casi controllati>: Storybook stories rappresentano scenari verificabili. #pro

## Metriche

[Metriche di adozione]: Tracciare uso dei componenti e riuso dei pattern per orientare roadmap e priorità.
  + <Adoption rate>: % import @fiscozen/* vs custom, target baseline + trend positivo. #pro
  + <Tempo issue → release>: < 4 settimane per enhancement. #pro
  + <Soddisfazione>: Survey trimestrale > 3.5/5. #pro
  + <Pattern reuse>: Trend positivo come indicatore primario di impatto. #pro

## Rischi e Mitigazioni

[Rischio top-down]: Ritorno a decisioni calate dall'alto.
  - <Probabilità media, impatto alto>: Mitigazione: rituali collegiali obbligatori, principi espliciti. #con

[Rischio overload maintainer]: Sovraccarico del team core.
  - <Probabilità alta, impatto medio>: Mitigazione: stewardship distribuita, SLA realistici, intake chiaro. #con

[Rischio bassa adozione]: Il sistema non viene usato dai team.
  - <Probabilità media, impatto alto>: Mitigazione: metriche visibili, guide migrazione, supporto continuo. #con

[Rischio regressioni QA]: Bug e regressioni visive sfuggono.
  - <Probabilità media, impatto alto>: Mitigazione: DoD esteso, visual regression, test matrix. #con

[Rischio incoerenza contenuti]: Copy e naming disallineati.
  - <Probabilità bassa, impatto medio>: Mitigazione: content nelle review, linee guida microcopy. #con
