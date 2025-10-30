---
title: Design System — Stato attuale, necessità di cambiamento e piano d’azione
versione: 1.0
data: 2025-10-30
owner: Design System Team
destinatari: Prodotto, Design, Sviluppo, QA, Management, Marketing, Customer Success, Customer Relationship
---

## Obiettivo del documento
Allineare gli stakeholder su: (1) problemi attuali, (2) principi e governance necessari a rendere il Design System sostenibile e adottato, (3) un piano d’azione a breve e medio termine per sbloccare valore concreto.

## Contesto e problemi attuali (sintesi)
- Approccio prevalentemente top‑down: spazio di miglioramento nella validazione collegiale e con utenti, per favorire adozione e allineamento.
- Alcuni disallineamenti tra design e implementazione: in alcuni casi i design non riflettono lo stato reale dei componenti o la documentazione non è aggiornata.
- Coinvolgimento da anticipare: sviluppatori e altri team possono essere ingaggiati prima e in modo leggero, con rituali e spazi di feedback continui.
- Governance non ancora formalizzata: chiarire ruoli/ownership aiuterebbe a rendere più fluide comunicazione e decisioni.
- Processi QA e testing da rendere più sistematici per ridurre il rischio di regressioni e incoerenze multi‑dispositivo.
- Strategia dei contenuti da integrare meglio: microcopy, naming e linee guida allineate al sistema.

Nota: i riferimenti metodologici sono elencati in Bibliografia.

## Principi guida condivisi (fondazione)
Necessitiamo di un set di valori e principi co-definiti per orientare decisioni di design e sviluppo. Proposta: workshop di 2 ore con rappresentanza trasversale (Prodotto, Design, Dev, QA, Marketing, CS, Management) per convergere su 5–7 principi operativi.

- Metodologia: breve icebreaker sugli obiettivi, raccolta divergenze (brainwriting), clustering, priorità, naming dei principi, criteri di verifica. Output: pagina “System Principles” in docs, con esempi applicativi e do/don’t.
- Ritmo di revisione: revisione trimestrale dei principi con retrospettiva sull’efficacia.

### Design pattern prima dei componenti
I componenti sono importanti, ma il valore organizzativo si sblocca rendendo i design pattern — combinazioni riusabili di elementi con uno scopo — la nostra unità principale di pensiero, discussione e riuso.

- Inventario: individuare i pattern già presenti in applicazione, nominarli coerentemente, documentarne scopo, proprietà rilevanti, varianti e dipendenze.
- Discovery: segnalare pattern emergenti durante il lavoro di prodotto; promuovere a pattern ciò che ricorre con frequenza e valore.
- Implementazione e documentazione: partire dal pattern (contesto, proprietà, contratti) e poi dettagliare come i componenti lo realizzano; le API dei componenti riflettono le proprietà chiave del pattern.

### Design Heuristics (quadro di riferimento)
Oltre ai nostri principi, adottiamo un set di Design Heuristics universali come riferimento indipendente dal sistema. Ogni principio del sistema dovrebbe poter essere mappato ad almeno una euristica (tracciabilità), così da mantenere coerenza con buone pratiche generali di usabilità e UX. La pagina “System Principles” includerà il mapping principio ↔ euristica e casi d’uso.

## Governance leggera e chiara
Obiettivo: favorire contributi e velocità, mantenendo qualità e chiarezza decisionale.

- Ruoli consigliati:
  - Maintainers (core DS): curano visione, qualità, versioning, roadmap.
  - Component Stewards: referenti per componenti/aree (design+dev). Possono ruotare.
  - Contributors: chiunque proponga miglioramenti/nuovi componenti.
  - Advisory Circle: rappresentanza dei team (Prodotto/Marketing/CS/QA) per input periodici.
- Meccanismi:
  - Intake: form unico o issue template per richieste (nuovi componenti, bug, enhancement).
  - Review duale: design+dev con checklist (accessibilità, token, API, content, test).
  - Decisione: tacit approval entro SLA (es. 5gg) o escalation ai Maintainers.
  - Versioning: semver, changelog umano-leggibile, guida di migrazione.
  - Ritmo: retro mensile breve su flusso contributi e colli di bottiglia.

### RACI sintetico (esempio)
| Attività | Maintainers | Stewards | Contributors | Advisory |
| --- | --- | --- | --- | --- |
| Definire principi | A/R | C | C | C |
| Roadmap DS | A/R | C | C | C |
| Nuovo componente | A | R | C | C |
| Review PR | A | R | C | C |
| Changelog/Migrazioni | A/R | C | C | C |

Legenda: R = Responsible, A = Accountable, C = Consulted.

## Engagement continuo e spazi di feedback
- Design System Office Hours (pilota 6 settimane):
  - Cadenza: quindicinale, 45–60 minuti, orario fisso.
  - Agenda: aggiornamenti rapidi, backlog triage, demo/sharing, Q&A.
  - Facilitazione: rotazione tra designer e developer; nota azioni e decisioni.
  - Regole: problem statements chiari, richieste con contesto, follow-up documentato.
- Cross-functional Show & Tell: slot mensile per condividere progressi ed esperienze di adozione.
- Canali asincroni: backlog pubblico, bacheca “Need Input”, sondaggi trimestrali di soddisfazione/adoption.

## Allineamento Design ↔ Sviluppo (Design-to-Code)
- Coinvolgimento anticipato: dev nelle fasi di discovery e durante le iterazioni di design per fattibilità, naming API, performance, a11y.
- Spec Walkthrough pre-implementazione: breve review con Figma + requisiti tecnici, prima della costruzione.
- Component Discovery & Review: validare l’opportunità del componente, varianti, stati edge, token.
- Pairing mirato: design–dev su componenti complessi; evitare lunghi handoff asincroni.
- Check di coerenza: audit token e uso pattern prima del merge.
 - Pattern-centrico: definire e mantenere una pagina per ogni pattern (scopo, proprietà, varianti, esempi) come fonte unica di verità a cui allineare design e API dei componenti.

## Strategia dei contenuti integrata
- Linee guida contenuti: voice & tone, microcopy, naming, localizzazione, accessibilità.
- Coinvolgimento content nelle review dei componenti che espongono testo (labelling, errori, help, tooltip).
- Documentazione: esempi di testo consigliati/contro-esempi, glossario condiviso.

## QA e testing multi-piattaforma
- Definition of Done estesa: a11y baseline (es. WCAG AA), test visivi, test interattivi base, compatibilità browser/device concordata.
- Test matrix: browser support policy, viewport chiave, input metodi (mouse, touch, keyboard).
- Storybook come ambiente di verifica: casi controllati, snapshot visivi, interazioni.
- Regressioni: visual regression su componenti critici, smoke sui pacchetti secondari.

## Metriche e adozione
- Misurare utilizzo componenti: telemetria o code search periodica per tracciare adozione e duplicati.
- Audit miglioramenti & usage: mappare journey reali per scoprire gap del sistema.
- Tooling integration: controllare integrazione con stack (bundler, theming, i18n, test).
- KPI proposti: adoption per team, % componenti DS vs custom, tempo medio issue→release, soddisfazione stakeholder.
 - Pattern reuse: misurare riuso dei pattern (nel design e nel codice) come indicatore primario di impatto.

## Piano d’azione

### Breve termine (0–4 settimane)
1) Avvio workshop “Principi del Sistema” e bozza pagina principi.
2) Pilota Office Hours (6 settimane) e canale feedback strutturato.
3) Definizione governance leggera (ruoli, intake, SLA, review duale).
4) Template Spec Walkthrough + checklist review (design, dev, content, a11y, test).
5) DoD per componenti con QA/a11y minimi e story di riferimento.
6) Baseline metriche di adozione + inventario componenti e duplicati.
7) Skeleton documentazione: guida contributi, principi, changelog, migrazioni.

### Medio termine (1–3 mesi)
1) Ratifica principi e pubblicazione esempi applicativi.
2) Governance in esercizio: contribution model e calendario review.
3) Linee guida contenuti integrate nelle pagine componenti.
4) Audit globale componenti: retire & replace e allineamento cross-piattaforma.
5) Tooling/Automation: test visivi su componenti core, lints su token/pattern.
6) Roadmap trimestrale pubblica (priorità per impatto utente e adozione).

## Ruoli chiave e responsabilità (estratto operativo)
- Maintainers: visione, qualità, release, sblocco decisioni, roadmap, metriche.
- Stewards: qualità dei componenti, guidance, pairing, review mirate.
- Contributors: proposta/mantenimento componenti, bugfix, doc.
- Advisory: feedback di contesto, priorità d’area, validazione impatti.

## Rischi e mitigazioni
- Rischio: ritorno al top-down. Mitigazione: rituali collegiali (office hours, review duale, retro) e principi espliciti.
- Rischio: overload dei maintainer. Mitigazione: stewardship distribuita, SLA realistici, intake chiaro.
- Rischio: bassa adozione. Mitigazione: misure di adoption, guide migrazione, supporto e show & tell continui.
- Rischio: incoerenza contenuti. Mitigazione: content nelle review, linee guida attive.
- Rischio: regressioni QA. Mitigazione: DoD esteso, visual regression su core, test matrix condivisa.

---

## Bibliografia
- Redesigning Design Systems — Tactics: Workshop & Engagement. https://redesigningdesign.systems/tactics/workshop-and-engagement
 - Smashing Magazine — Design Patterns Are A Better Way To Collaborate On Your Design System. https://www.smashingmagazine.com/2023/05/design-patterns-collaborate-design-system/
 - Nielsen Norman Group — Design Guidance (Design Heuristics). https://www.nngroup.com/articles/design-guidance/
 - Figma config 2024 -  Design system best practices. https://www.youtube.com/watch?v=MJTCfSFLUGE
 - Nielsen Norman Group - Design systems 101. https://www.nngroup.com/articles/design-systems-101/
