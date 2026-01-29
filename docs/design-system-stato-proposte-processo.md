---
title: Design System — Proposta di evoluzione (sintesi)
versione: 3.0
data: 2025-01-28
owner: Design System Team
destinatari: Prodotto, Design, Sviluppo, QA, Management
---

## Obiettivo

Rendere il Design System un asset condiviso che riduca il rischio di rilasci disallineati dalle aspettative degli utenti, acceleri lo sviluppo e migliori la qualità percepita del prodotto.

---

## Perché agire adesso

Il rilascio recente ha evidenziato un problema strutturale: scelte di UI percepite come "arrivate dall'alto" hanno generato feedback negativo dalla community. Non è un caso isolato — è il sintomo di un processo che non include abbastanza validazione prima del rilascio.

**Cosa vogliamo prevenire:**
- Decisioni di design che arrivano ai team senza contesto né possibilità di feedback
- Rilasci che sorprendono gli utenti invece di rispondere ai loro bisogni
- Rework costoso dopo che il danno è fatto
- Disallineamenti tra design e implementazione

**Cosa vogliamo abilitare:**
- Validazione collegiale delle scelte *prima* che diventino codice
- Feedback loop continui con chi usa il sistema
- Decisioni tracciabili e reversibili
- Governance leggera ma chiara

---

## Piano d'azione

### Fase 1 — Quick win e baseline (settimane 1-2)

Dimostrare valore subito, con azioni a basso costo.

| Azione | Output | Owner |
|--------|--------|-------|
| **Audit componenti** | Lista dei 10 componenti più usati, "molecole" applicative vs DS | TBD |
| **Canale feedback** | Channel dedicato per segnalazioni e domande sul DS | TBD |
| **Prima Office Hour** | Sessione di 30-45 min, aperta a tutti, per raccogliere pain point | TBD |
| **Baseline metriche** | % import @fiscozen/* vs "molecole" custom | TBD |

**Perché prima l'audit:** avere dati concreti dà credibilità e aiuta a prioritizzare.

---

### Fase 2 — Processo minimo (settimane 3-4)

Introdurre i meccanismi base per evitare che le decisioni "arrivino dall'alto".

| Azione | Output | Owner |
|--------|--------|-------|
| **Template intake** | Issue template per richieste con campo "contesto d'uso" obbligatorio | TBD |
| **Checklist review** | Checklist per PR: design, dev, a11y, content, test | TBD |
| **Definition of Done** | Requisiti minimi: WCAG AA, test visivo, story Storybook | TBD |
| **Primo Spec Walkthrough** | Sessione pilota: design + dev + QA insieme prima dell'implementazione | TBD |

**Il Spec Walkthrough è il cambio chiave:** 30 minuti con designer, dev e QA *prima* di scrivere codice. Si validano: naming API, edge case, stati, token, copy. Le obiezioni emergono qui, non dopo il merge.

---

### Fase 3 — Governance e principi (mese 2)

Una volta che il processo funziona, formalizziamo ruoli e valori.

| Azione | Output | Owner |
|--------|--------|-------|
| **Workshop principi** | 2 ore, rappresentanza cross-funzionale. Output: 5-7 principi operativi | TBD |
| **Formalizzazione ruoli** | Documento RACI: Maintainers, Stewards, Contributors, Advisory | TBD |
| **Office Hours regolari** | Cadenza quindicinale, 45 min, orario fisso | TBD |
| **Linee guida contenuti** | Voice & tone, microcopy, naming, localizzazione | TBD |
| **Prima retro** | Retrospettiva sul processo: cosa funziona, cosa cambiare | TBD |

**Perché i principi vengono dopo:** definire principi senza aver sperimentato il processo produce valori astratti. Dopo 4-6 settimane sapremo *quali* principi ci servono.

---

### Fase 4 — Scaling (mese 3)

Consolidare, automatizzare e misurare.

| Azione | Output | Owner |
|--------|--------|-------|
| **Visual regression** | Test automatici sui componenti core | TBD |
| **Roadmap pubblica** | Backlog visibile con priorità e stato | TBD |
| **Survey soddisfazione** | Questionario breve a dev e designer | TBD |
| **Tooling automation** | integrazione CI | TBD |

---

## Principi guida del sistema

Necessitiamo di un set di valori co-definiti per orientare decisioni. Il workshop (Fase 3) produrrà 5-7 principi operativi con:
- Esempi applicativi e do/don't
- Mapping verso Design Heuristics consolidate (vedi Appendice B)
- Revisione trimestrale con retrospettiva sull'efficacia

### Pattern prima dei componenti

I componenti sono mattoni; i pattern sono soluzioni. Il valore del DS si sblocca quando pensiamo in termini di **pattern riusabili**.

**Cosa cambia:**
- Ogni pattern ha una pagina dedicata: scopo, proprietà, varianti, esempi, dipendenze
- I componenti *implementano* pattern, non viceversa
- Le API dei componenti riflettono le proprietà del pattern
- Misuriamo il riuso dei pattern come KPI primario

**Azioni:**
- Inventario pattern esistenti (impliciti nell'app)
- Naming consistente
- Promozione a pattern di ciò che ricorre con frequenza

---

## Allineamento Design ↔ Sviluppo

Il disallineamento design-dev è una delle cause principali di rilasci problematici.

1. **Coinvolgimento anticipato:** dev partecipa alla review del mockup hi-fi. Checkpoint: *prima di iniziare l'hi-fi di un nuovo pattern, 30 min con uno steward dev*.

2. **Spec Walkthrough pre-implementazione:** sessione breve (30 min) con Figma + requisiti tecnici. Partecipanti: designer owner, dev implementatore, QA. Output: checklist validata, dubbi risolti.

3. **Pairing su componenti complessi:** per componenti con molti stati o interazioni, pairing design-dev invece di handoff asincrono.

4. **Check di coerenza pre-merge:** audit rapido su token usati, pattern rispettati, naming consistente.

---

## QA e testing

### Definition of Done estesa

| Categoria | Requisiti |
|-----------|-----------|
| **Accessibilità** | WCAG AA (focus, contrast, keyboard nav) |
| **Test visivo** | Almeno 1 snapshot per variante principale |
| **Test interattivo** | Stati hover, focus, disabled, error |
| **Browser support** | Chrome, Firefox, Safari (ultime 2 versioni), Edge |
| **Viewport** | 320px, 768px, 1024px, 1440px |

### Strumenti
- Storybook come ambiente di verifica (stories = casi controllati)
- Visual regression su componenti core (Chromatic o Percy)
- Smoke test sui pacchetti secondari

---

## Metriche

| Metrica | Come misurarla | Target iniziale |
|---------|----------------|-----------------|
| **Adoption rate** | % import @fiscozen/* vs custom | Baseline + trend positivo |
| **Tempo issue → release** | Data apertura → data release | < 4 settimane (enhancement) |
| **Soddisfazione** | Survey trimestrale (scala 1-5) | > 3.5/5 |
| **Partecipazione** | Presenze medie Office Hours | > 5 persone |
| **Pattern reuse** | Riuso pattern nel design e nel codice | Trend positivo |

---

## Rischi e mitigazioni

| Rischio | Prob. | Impatto | Mitigazione |
|---------|-------|---------|-------------|
| Ritorno al top-down | Media | Alto | Rituali collegiali obbligatori, principi espliciti |
| Overload maintainer | Alta | Medio | Stewardship distribuita, SLA realistici, intake chiaro |
| Bassa adozione | Media | Alto | Metriche visibili, guide migrazione, supporto continuo |
| Regressioni QA | Media | Alto | DoD esteso, visual regression, test matrix |
| Incoerenza contenuti | Bassa | Medio | Content nelle review, linee guida microcopy |


---

## Appendice A: Governance e ruoli

### Ruoli

| Ruolo | Responsabilità | Chi |
|-------|----------------|-----|
| **Maintainers** | Visione, qualità, release, roadmap, sblocco decisioni | Core DS team |
| **Stewards** | Referenti per componenti/aree, pairing, review | Designer + Dev senior (rotazione) |
| **Contributors** | Propongono componenti, bugfix, miglioramenti doc | Chiunque |
| **Advisory Circle** | Input periodico su priorità e impatti | 1 rappresentante per area |

### RACI

| Attività | Maintainers | Stewards | Contributors | Advisory |
|----------|-------------|----------|--------------|----------|
| Roadmap DS | A/R | C | I | C |
| Nuovo componente | A | R | C | I |
| Review PR | A | R | C | - |
| Principi sistema | A/R | C | C | C |
| Changelog/Migrazioni | A/R | C | I | I |

Legenda: R = Responsible, A = Accountable, C = Consulted, I = Informed

### Meccanismi operativi

- **Intake:** form unico o issue template per tutte le richieste
- **Review duale:** design + dev con checklist (a11y, token, API, content, test)
- **Decisione:** tacit approval entro SLA (5gg) o escalation ai Maintainers
- **Versioning:** semver, changelog human-readable, guida migrazione
- **Ritmo:** retro mensile su flusso contributi e colli di bottiglia

---

## Appendice B: Design Heuristics

Adottiamo le euristiche di Nielsen/Norman come riferimento esterno. Ogni principio del sistema dovrebbe mappare ad almeno una euristica:

1. **Visibility of system status** — Il sistema informa sempre l'utente su cosa sta succedendo
2. **Match between system and real world** — Linguaggio familiare all'utente
3. **User control and freedom** — Uscite di emergenza, undo/redo
4. **Consistency and standards** — Convenzioni di piattaforma rispettate
5. **Error prevention** — Prevenire errori è meglio che gestirli
6. **Recognition rather than recall** — Minimizzare il carico cognitivo
7. **Flexibility and efficiency of use** — Acceleratori per utenti esperti
8. **Aesthetic and minimalist design** — Solo informazioni rilevanti
9. **Help users recognize, diagnose, recover from errors** — Messaggi di errore utili
10. **Help and documentation** — Documentazione accessibile quando serve

La pagina "System Principles" includerà il mapping principio ↔ euristica.

---

## Appendice C: Bibliografia

- Redesigning Design Systems — Workshop & Engagement: https://redesigningdesign.systems/tactics/workshop-and-engagement
- Smashing Magazine — Design Patterns Are A Better Way To Collaborate: https://www.smashingmagazine.com/2023/05/design-patterns-collaborate-design-system/
- Nielsen Norman Group — Design Heuristics: https://www.nngroup.com/articles/design-guidance/
- Figma Config 2024 — Design System Best Practices: https://www.youtube.com/watch?v=MJTCfSFLUGE
- Nielsen Norman Group — Design Systems 101: https://www.nngroup.com/articles/design-systems-101/

