---
name: git-advisor
description: Git repository analysis and file confidence reporting for the Fiscozen Design System. Analyze Vue/TS component stability, churn, ownership, and coupling. Trigger with "/git-advisor <path>" for standalone reports. Also used composably by other skills (code-review).
---

# Git Advisor — Design System Repository Intelligence

Analyze git history to produce file confidence scores, ownership maps, and codebase health reports for `@fiscozen/*` packages.

```
Mode A (composable): Direct delegation to git-advisor agent → JSON
Mode B (standalone): Discovery → parallel analysis → synthesis → markdown report
```

## Phase 0: Input Parsing

Determine the operating mode:

- **Composable**: Input specifies `--assess <file1> [file2...]` or is spawned by another skill with a file list → delegate directly to a single `git-advisor` agent. Return the JSON response. Done.
- **Standalone**: Input specifies a path/directory/package → proceed to Phase 1 for report generation.

Extract the target scope from the input. Default to current working directory if no path given. Common scopes:
- A single package: `packages/select`
- All components: `packages`
- A single file: `packages/select/src/FzSelect.vue`
- The storybook app: `apps/storybook/src/stories/Form`

## Phase 1: Discovery

Enumerate source files in scope:

```bash
git ls-files -- <scope> | grep -E '\.(vue|ts|tsx|mdx)$' | grep -vE '(node_modules/|dist/|storybook-static/|\.d\.ts$|__mocks__/|__tests__/.*\.snap$)' | head -50
```

If the file count exceeds 50, inform the user and suggest narrowing the scope (e.g. single package rather than `packages/`).

Group files into batches of ~10-12 for parallel processing. If ≤12 files, use a single batch.

**Design-system-aware batching**: keep each component's cluster together when possible — `FzFoo.vue`, `types.ts`, `index.ts`, `__tests__/FzFoo.spec.ts` in the same batch so the agent can see their co-change relationships clearly.

## Phase 2: Analysis (max 4 parallel agents)

Spawn up to 4 `git-advisor` agents in parallel, one per batch:

```
Agent(subagent_type="git-advisor", model="sonnet")

Assess the following files. Return composable JSON only.

## Files
{batch file list}
```

Each agent returns the composable JSON schema (see `.claude/agents/git-advisor.md`).

## Phase 3: Synthesis & Visual Report

Merge all JSON responses from Phase 2 into a visual HTML report.

### Aggregation

1. **Combine file arrays** from all agent responses (normalize paths to relative)
2. **Compute module-level stats**:
   - Total files analyzed, unique active contributors (90d)
   - Average bus factor across files
   - Confidence label distribution (count per label)
3. **Cross-file coupling**: Identify coupling pairs that span file boundaries. For the design system, also flag "cluster drift" — a `.vue` that rarely co-changes with its `.stories.ts` or `.spec.ts`
4. **Sort files**: HOT/VOLATILE first, then by confidence_score ascending
5. **Identify clusters**: Component clusters (`.vue` + `types.ts` + `__tests__` + `.stories.ts` + `.mdx`) and any cross-package clusters
6. **Build ownership table**: Authors ranked by files where they own >30% of lines
7. **Write action items**: Prioritized list (HIGH/MEDIUM/LOW) based on findings — prefer design-system-specific callouts (API stability, a11y rule drift, changeset discipline)

### Build REPORT_DATA JSON

Construct the following JSON object from the aggregated data:

```javascript
{
  meta: {
    scope: "packages/select",                 // the input path
    date: "2026-04-17",                       // today
    filesAnalyzed: 12,
    timeWindow: "12 months",
    commonPrefix: "packages/select/"          // longest common path prefix
  },
  summary: {
    activeContributors: ["Name1", "Name2"],   // unique authors active in 90d
    avgBusFactor: 1.2,                        // mean bus_factor across files
    hotCount: 1,                              // files with confidence=HOT
    volatileCount: 0                          // files with confidence=VOLATILE
  },
  distribution: [
    { label: "HOT",      count: 1,  color: "#f85149" },
    { label: "VOLATILE", count: 0,  color: "#d29922" },
    { label: "ACTIVE",   count: 4,  color: "#58a6ff" },
    { label: "STABLE",   count: 5,  color: "#3fb950" },
    { label: "LEGACY",   count: 2,  color: "#7d8590" }
  ],
  files: [
    // Same structure as agent JSON — merged from all agents
    // Each file: { path, confidence, confidence_score, metrics: {...}, advisory }
  ],
  churn: [
    // Top 15 files sorted by monthly_avg_12m descending
    { path: "FzSelect.vue", fullPath: "packages/select/src/FzSelect.vue", rate: 2.6 }
  ],
  coupling: [
    // Top 15 co-change pairs, deduplicated, sorted by count desc
    { fileA: "packages/select/src/FzSelect.vue", fileB: "apps/storybook/src/stories/Form/Select.stories.ts", count: 21 }
  ],
  ownership: [
    // Authors sorted by filesOwned desc
    {
      author: "Riccardo Agnoletto",
      filesOwned: 22,
      active: true,         // has commits in 90d window
      domain: "select, input, datepicker",
      files: ["packages/select/src/FzSelect.vue", ...]  // list of owned file paths
    }
  ],
  clusters: [
    // Groups of files that always co-change (component clusters)
    {
      name: "FzSelect component cluster",
      files: ["packages/select/src/FzSelect.vue", "packages/select/src/types.ts", "packages/select/src/__tests__/FzSelect.spec.ts", "apps/storybook/src/stories/Form/Select.stories.ts"],
      description: "Always co-change as a unit"
    }
  ],
  actions: [
    // Prioritized action items — tuned for a design system
    { severity: "HIGH", text: "FzSelect.vue is a coordination bottleneck with bus factor 1; pair-review required before API changes." },
    { severity: "MEDIUM", text: "FzDatepicker.vue changed 6 times in 90d without .stories.ts updates — Chromatic coverage may be stale." },
    { severity: "LOW", text: "12 dormant legacy components — verify alignment with current design tokens and Tailwind classes." }
  ]
}
```

### Generate HTML

1. Read the template from `.claude/skills/git-advisor/template.html`
2. Replace the literal string `__REPORT_DATA__` with the JSON object
3. Write the result to `/tmp/git-advisor-report.html`
4. Open the file with `open /tmp/git-advisor-report.html`
5. Output a brief chat summary: scope, file count, hot/volatile count, and top 2-3 action items

### Chat Summary

After opening the HTML report, output a short markdown summary in chat:

```
**Git Advisor Report opened in browser** — /tmp/git-advisor-report.html

{scope}: {N} files analyzed, {hot} hot, {volatile} volatile
Top actions:
- [HIGH] {first action}
- [MEDIUM] {second action}
```

Keep the chat output brief — the visual report has the full details.

## Error Handling

- Agent fails → proceed with partial results from remaining agents; note the gap in the report
- No files found → report "No source files found in scope"
- Git commands fail → the git-advisor agent handles this internally; if it returns empty metrics, mark the file as "analysis failed"

## Configuration

```yaml
models:
  analysis: sonnet
max_files: 50
max_parallel_agents: 4
batch_size: 10-12
time_window: 12 months
file_extensions: [vue, ts, tsx, mdx]
exclude_patterns:
  - node_modules/
  - dist/
  - storybook-static/
  - .d.ts
  - __mocks__/
```

## Input

$ARGUMENTS
