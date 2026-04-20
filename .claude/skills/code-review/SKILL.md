---
name: code-review
description: Design system code review with accessibility, API stability, and performance focus. 4 commission agents + prosecutor triage + adversarial challenger with gate checks and clean context.
trigger: /code-review [path|PR#]
---

# Code Review — Fiscozen Design System

Multi-agent adversarial review tailored for a published Vue 3 component library. Up to 7 agents across 5 phases: optional git-history profiling, commission investigation, prosecution triage, adversarial challenge, and report assembly.

## Architecture

```
Phase 0: Input Parsing
  Parse target -> read code/diff -> measure change size
  FAST PATH: if < 50 lines changed -> Quick Check (skip full pipeline)
                           |
Phase 0.5: Git Advisor Profiling (1 optional agent)
  Extract touched files -> git-advisor JSON -> confidence context
  SKIP if: no files with git history, or --no-git flag
                           |
Phase 1: Commission (4 parallel agents)
  Component Quality + Accessibility + Performance + Maintainability
  (each agent receives file-confidence context from Phase 0.5)
                           |
Phase 2: Prosecutor (1 sequential agent)
  Triage findings -> Build exhibits with evidence triples
  (uses confidence context to calibrate severity: HOT/VOLATILE files -> +1 severity)
  GATE: if 0 substantive -> skip Phase 3, report trivial only
                           |
Phase 3: Adversarial Challenger (1 sequential agent, FRESH context)
  5-check challenge on each exhibit -> confidence tiers
                           |
Phase 4: Orchestrator assembles report with three-tier findings
```

**Total: up to 7 agent spawns** (1 git-advisor + 4 commission + 1 prosecutor + 1 challenger)

---

## Quick Check (< 50 lines changed)

For small changes, skip the full pipeline. Apply these checks directly against REVIEW.md rules:

1. **Accessibility**: New interactive elements have aria-* and keyboard support?
2. **API**: Any prop/event/slot changes? Breaking = major bump needed?
3. **Tests**: Both .spec.ts and .stories.ts updated?
4. **Types**: Props in types.ts with JSDoc?
5. **Externals**: New @fiscozen/* deps in vite.config.ts externals?
6. **Changeset**: Present for packages/*/src/ changes?

Output a brief report with findings and the design system checklist. Done.

---

## Phase 0: Input Parsing

Parse the user's input to determine the review target.

### PR Mode
If the input contains a PR number (e.g., `#123` or just `123`):
```bash
gh pr diff {number}
gh pr view {number}
```

### Branch Diff Mode
If no PR number but current branch differs from main:
```bash
git diff main...HEAD
```

### File/Path Mode
If a file or directory path is provided, read the files directly.

### Prepare Context

1. Read the code/diff into a variable (passed to commission agents)
2. Note the target description and scope for the report header
3. Count lines changed — if < 50, use Quick Check instead
4. Create scratchpad directory for inter-phase communication:
   ```bash
   SCRATCHPAD=$(mktemp -d)
   mkdir -p "$SCRATCHPAD/review"
   ```
5. Extract the list of touched files for Phase 0.5 (skip if `--no-git` appears in input):
   ```bash
   # PR mode
   gh pr diff {number} --name-only
   # Branch diff mode
   git diff --name-only main...HEAD
   # File/Path mode: use the input paths directly
   ```
   Filter to `.vue|.ts|.tsx|.mdx` under `packages/` or `apps/storybook/src/`. Keep only files that exist in git history (`git log -1 -- <file>` returns a commit). Write the list to `{SCRATCHPAD}/review/touched-files.txt`.

---

## Phase 0.5: Git Advisor Profiling (Optional, 1 Agent)

**Skip conditions:**
- `--no-git` flag in input
- `touched-files.txt` is empty (all files are brand new, no history)
- Quick Check path was taken

**Otherwise**, spawn one `git-advisor` agent in composable mode:

```
Agent(subagent_type="git-advisor", model="sonnet")
Prompt: "Assess the following files. Return composable JSON only.

## Files
{contents of SCRATCHPAD/review/touched-files.txt}
"
```

Write the returned JSON to `{SCRATCHPAD}/review/git-confidence.json`.

**Report to user**: `Git advisor: profiled {N} files — {hot} hot, {volatile} volatile, {stable} stable. Feeding context to commission agents.`

**Degrade gracefully**: if the git-advisor agent fails or returns invalid JSON, write an empty `{"files": []}` object to the scratchpad file and continue. Note the degradation in the final report.

---

## Phase 1: Commission Investigation (4 Parallel Agents)

Spawn 4 design-system-specialized agents IN PARALLEL. Each receives the code under review and produces structured JSON with evidence triples.

Read each agent's prompt from `.claude/agents/{slug}.md` before spawning.

```
For each of [component-reviewer, a11y-reviewer, performance-reviewer, maintainability-reviewer]:

  Agent(subagent_type="general-purpose", model="sonnet")
  Prompt: "{contents of .claude/agents/{slug}.md}

  ## Code Under Review
  {code content or diff}

  ## Project Review Rules
  {contents of REVIEW.md}

  ## File Confidence Context (from git-advisor)
  {contents of SCRATCHPAD/review/git-confidence.json, or "skipped" if Phase 0.5 was skipped}

  Use the confidence context to calibrate your findings:
  - HOT/VOLATILE files: apply stricter scrutiny; assume the file has churn-driven bugs
  - Bus factor 1: flag any change that widens the API surface (harder to review without the original author)
  - Coupling drift: if the component file is changing without its stories/tests, flag it
  - Do NOT invent findings just because a file is hot — only weight findings you already have

  Return your findings as the JSON specified in your role definition."
```

**After Phase 1**: Collect all 4 agent outputs.

**Write commission findings to scratchpad**: Write combined output to `{SCRATCHPAD}/review/commission-findings.md` so the prosecutor can read it without bloating the orchestrator's context:

```markdown
# Commission Findings

## Component Quality
{agent output JSON}

## Accessibility
{agent output JSON}

## Performance
{agent output JSON}

## Maintainability
{agent output JSON}
```

**Report to user**: "Commission complete: 4 agents have analyzed the code. Proceeding to triage."

---

## Phase 2: Prosecution — Triage & Exhibit Construction (1 Sequential Agent)

Spawn the prosecutor to triage commission findings. It reads from the scratchpad file and the actual source code — not from the orchestrator's context.

```
Agent(subagent_type="code-review-prosecutor", model="sonnet")
Prompt: "Review findings for a published Vue 3 component library (@fiscozen/*).
This is a design system consumed by all Fiscozen products — API stability and
accessibility are paramount. Security threats are minimal (no auth, no network
requests, no direct user input handling).

## Code Under Review
Read the target file(s): {file path(s)}

## Commission Findings
Read: {SCRATCHPAD}/review/commission-findings.md

## Design System Triage Context
Apply these domain-specific triage adjustments:
- Accessibility violations tagged BLOCK in REVIEW.md = always substantive
- API stability violations tagged BLOCK in REVIEW.md = always substantive
- Generic web security findings (XSS, injection, CSRF) = likely trivial for a component library
- Performance findings without bundle size or render cost measurement = likely trivial
- Missing features that are not bugs in existing code = trivial (scope confusion)

## File Confidence Context (from git-advisor)
Read: {SCRATCHPAD}/review/git-confidence.json (may be empty if Phase 0.5 was skipped)

Use this to calibrate severity, NOT to invent findings:
- Findings on HOT/VOLATILE files -> keep or bump severity one level (regression risk is high)
- Findings on STABLE files with bus factor >= 2 -> severity is fine as stated
- Missing test/story co-changes when the file's coupling metric says they normally co-change -> promote from trivial to substantive
- If a finding targets a file with `confidence: LEGACY`, note in the exhibit that the file is dormant (context for reviewer priority)

## REVIEW.md Rules (for reference)
{contents of REVIEW.md}

Process per your role specification. Return complete output JSON."
```

**After Phase 2**: Parse prosecutor output. Write to `{SCRATCHPAD}/review/prosecution-exhibits.md`.

### GATE CHECK

If `exhibits` array is empty (0 substantive findings after triage):
- **Skip Phase 3** entirely
- Proceed directly to Phase 4 with trivial findings only
- Report: "Triage complete: all {N} findings were trivial. No substantive issues found."

If exhibits exist:
- Report: "Triage: {substantive} substantive from {total} total ({noise_reduction}% noise reduction). {exhibit_count} exhibits filed. Proceeding to adversarial challenge."

---

## Phase 3: Adversarial Challenge (1 Sequential Agent, FRESH Context)

**CRITICAL**: The challenger MUST be a fresh agent spawn with NO context from Phases 1-2. It receives only the exhibits and the code — never commission findings, triage reasoning, or orchestrator state. This prevents confirmation bias.

```
Agent(subagent_type="code-review-challenger", model="sonnet")
Prompt: "You are challenging exhibits from a code review of a published Vue 3
component library (@fiscozen/*). This is a design system — NOT a web application.

Key context for your threat model checks:
- Components do NOT handle authentication, authorization, or network requests
- Consumers are frontend developers importing the library via npm
- The attack surface is prop inputs and slot content, not HTTP endpoints
- Accessibility (WCAG 2.1 AA) is a legal/compliance requirement, not optional
- API stability matters enormously — breaking changes cascade to all consuming apps
- Tailwind CSS for styling — no CSS-in-JS runtime

## Exhibits to Challenge
Read: {SCRATCHPAD}/review/prosecution-exhibits.md

## Code Under Review
Read the target file(s): {file path(s)}

Apply all 5 failure-mode checks to every exhibit per your role specification.
Return complete output JSON."
```

**After Phase 3**: Parse challenger output. Write to `{SCRATCHPAD}/review/challenge-results.md`.

Report: "Adversarial challenge complete: {survived} survived, {weakened} weakened, {challenged} challenged. Assembling report."

---

## Phase 4: Report Assembly (Orchestrator)

The orchestrator assembles the final report directly (no subagent). Read structured data from scratchpad files.

### Data Sources

- `{SCRATCHPAD}/review/prosecution-exhibits.md` — exhibits with evidence
- `{SCRATCHPAD}/review/challenge-results.md` — challenge verdicts (if Phase 3 ran)

### Merge Logic

For each exhibit, combine the prosecutor's evidence with the challenger's verdict:

```
For each exhibit in prosecutor_output.exhibits:
  challenge = challenger_output.challenged_exhibits.find(e => e.exhibit_id == exhibit.id)
  merged = {
    ...exhibit,
    confidence_tier: challenge.confidence_tier,
    recommended_severity: challenge.recommended_severity,
    challenge_checks: challenge.checks,
    honest_concession: challenge.honest_concession,
    revised_harm: challenge.revised_harm
  }
```

Group merged findings into three tiers:
1. **Survived** (confidence_tier == "survived") — sorted by severity
2. **Weakened** (confidence_tier == "weakened") — sorted by recommended_severity
3. **Challenged** (confidence_tier == "challenged") — sorted by original severity

### Report Template

```markdown
# Code Review: {target}

**Date:** {timestamp}
**Process:** Design system multi-agent review (git-advisor + 4 commission + prosecutor + challenger)

## File Confidence (git-advisor)

If Phase 0.5 ran, render a table of touched files from `{SCRATCHPAD}/review/git-confidence.json`:

| File | Confidence | Score | Bus Factor | Fix Ratio | Advisory |
|------|-----------|-------|------------|-----------|----------|
| {path} | {label} | {score}/100 | {n} | {pct} | {advisory} |

Otherwise: `_git-advisor was skipped (quick-check / no git history / --no-git flag)._`

## Verdict Summary

| Metric | Count |
|--------|-------|
| Raw findings from commission | {total_raw} |
| After triage (substantive) | {substantive} |
| Noise reduction | {pct}% |
| Exhibits filed | {count} |
| **Survived** (action required) | {survived} |
| **Weakened** (reduced severity) | {weakened} |
| **Challenged** (informational) | {challenged} |

## Scores

| Area | Score |
|------|-------|
| Component Quality | {score}/10 |
| Accessibility | {score}/10 |
| Performance | {score}/10 |
| Maintainability | {score}/10 |
| **Overall** | **{avg}/10** |

## Survived Findings (Action Required)

These findings passed all 5 adversarial checks. Evidence is solid, severity is calibrated.

### {EX-ID}: {title}
**Severity:** {recommended_severity} | **Category:** {category} | **REVIEW.md rule:** {rule ref if applicable}

**Code:**
> {file}:{lines}
> {code_quote}

**Source:** {authority} — {reference}
**Harm:** {harm}
**Checks passed:** All 5

---

## Weakened Findings (Recommended Action)

Core finding is valid but severity reduced after adversarial challenge.

### {EX-ID}: {title}
**Severity:** {original} -> {recommended} | **Category:** {category}

**Code:**
> {file}:{lines}
> {code_quote}

**Original harm:** {harm}
**Revised harm:** {revised_harm}
**Checks flagged:** {list of failed checks with reasoning}

---

## Challenged Findings (Informational Only)

Failed adversarial scrutiny. Likely false positives, but honest concessions noted.

### {EX-ID}: {title}
**Original severity:** {original} -> downgraded to informational
**Why challenged:** {summary of failed checks}
**Honest concession:** {honest_concession}

---

## Trivial Findings (Appendix)

{count} findings triaged as trivial.

| # | Agent | Summary | Suggested Fix |
|---|-------|---------|---------------|
| TT-001 | {agent} | {summary} | {fix} |

## Design System Checklist

- [ ] Accessibility attributes verified (REVIEW.md Accessibility)
- [ ] API changes have changeset + correct bump level (REVIEW.md API Stability)
- [ ] Both unit tests (.spec.ts) and play functions (.stories.ts) present
- [ ] fn() spies used for interaction verification
- [ ] MDX documentation updated for public API changes
- [ ] No heavy dependencies added (REVIEW.md Performance)
- [ ] Internal @fiscozen/* deps in vite.config.ts externals
- [ ] Props in types.ts with JSDoc
- [ ] Tree-shakeable exports (named only, no side effects)

## Prioritized Action Items

From survived and weakened findings only:

1. [{severity}] {action item}
2. [{severity}] {action item}
```

---

## Error Handling

- **Git advisor (Phase 0.5) fails or times out**: Write `{"files": []}` to `git-confidence.json`, continue without confidence context. Note "git-advisor skipped due to failure" in the final report.
- **Commission agent fails**: Proceed with remaining agents. Note the gap in the report header ("3/4 commission agents completed").
- **Prosecutor fails**: Fall back to presenting raw commission findings grouped by agent. Skip Phase 3 (no exhibits to challenge). Mark report as "degraded — no triage applied".
- **Challenger fails**: Present all exhibits as "unchallenged" with a note that adversarial validation was skipped. Exhibits keep prosecutor severity ratings.
- **Always produce a report**, even if degraded. Never leave the user with nothing.

---

## Configuration

```yaml
models:
  git_advisor: sonnet     # Phase 0.5 file confidence profiling
  commission: sonnet      # 4 domain-specific agents
  prosecutor: sonnet      # Triage + exhibit construction
  challenger: sonnet      # Adversarial 5-check challenge

agents:
  git_advisor: git-advisor              # .claude/agents/git-advisor.md (optional Phase 0.5)
  commission:
    - .claude/agents/component-reviewer.md    # API stability, naming, exports, props
    - .claude/agents/a11y-reviewer.md         # WCAG 2.1 AA, keyboard nav, aria-*
    - .claude/agents/performance-reviewer.md  # Bundle size, tree-shaking, render perf
    - .claude/agents/maintainability-reviewer.md  # Cross-package consistency, conventions
  prosecutor: code-review-prosecutor   # Built-in subagent type
  challenger: code-review-challenger   # Built-in subagent type (FRESH context)

context_management:
  strategy: scratchpad            # Phase outputs written to temp files
  orchestrator_holds: structured_data  # Only parsed JSON for report assembly
  challenger_context: fresh       # NO prior phase context — prevents confirmation bias

gate_check:
  condition: "exhibits.length == 0"
  action: skip_phase_3

quick_check:
  threshold: 50  # lines changed
  action: skip_full_pipeline  # also skips Phase 0.5

phase_0_5:
  skip_conditions:
    - "--no-git flag in input"
    - "touched-files.txt empty (no files with git history)"
    - "quick-check path taken"
  timeout_seconds: 60
```
