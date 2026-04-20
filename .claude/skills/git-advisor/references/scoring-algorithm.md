# Git Advisor — Scoring Algorithm Reference

Reference for orchestrators that consume git-advisor output. Use this to interpret confidence scores and labels without reading the full agent prompt.

## Confidence Labels

| Label | Meaning | Action |
|-------|---------|--------|
| **STABLE** | Well-established, low churn, multiple authors | Safe to build on. Standard workflow. |
| **ACTIVE** | Under active development, recent changes | Coordinate with team. Check `active_authors_90d`. |
| **HOT** | High churn + elevated fix rate | Extra care needed. Prefer TDD. Consider stabilization. |
| **LEGACY** | Dormant (no changes in 90+ days, age >1 year) | Patterns may be outdated. Verify alignment with current conventions. |
| **VOLATILE** | High churn + many concurrent authors | Collision risk. Lock coordination recommended. |

## Classification Rules (evaluated top to bottom, first match wins)

```
VOLATILE  → churn_score > 80 AND unique_authors_90d >= 3
HOT       → churn_score > 60 AND fix_score > 60
ACTIVE    → recency_score >= 50 AND churn_score > 30
LEGACY    → recency_score == 0 AND age > 365 days
STABLE    → default (everything else)
```

## Signal Formulas

```
churn_score     = min(100, commits_90d / max(1, module_avg_commits_90d) * 50)
fix_score       = min(100, fix_ratio_12m / 0.30 * 50)
bus_factor_risk = max(0, 100 - bus_factor * 33)
age_norm        = min(100, age_days / 365 * 33)
recency_score   = 100 if commits_30d > 0
                  50  if commits_90d > 0
                  0   otherwise
```

## Confidence Score (0-100, higher = safer)

```
confidence_score = 100 - (0.30 * churn_score
                        + 0.25 * fix_score
                        + 0.25 * bus_factor_risk
                        + 0.10 * (100 - age_norm)
                        + 0.10 * (100 - recency_score))
```

## Interpretation Guide

| Score Range | Risk Level | Recommended Workflow |
|-------------|-----------|---------------------|
| 80-100 | Low | Standard implementation, haiku-eligible |
| 60-79 | Moderate | Sonnet preferred, tests recommended |
| 40-59 | Elevated | Sonnet required, TDD recommended |
| 0-39 | High | Sonnet required, TDD required, peer coordination |

## Using git-advisor in Orchestrators

### Spawning (composable mode)

```
Agent(subagent_type="git-advisor", model="sonnet")

Assess the following files. Return composable JSON only.

## Files
packages/button/src/FzButton.vue
packages/select/src/FzSelect.vue
```

### Interpreting Results

The JSON response contains a `files` array. Key fields per file:

- `confidence` — label (STABLE/ACTIVE/HOT/LEGACY/VOLATILE)
- `confidence_score` — numeric (0-100, higher = safer)
- `metrics.ownership.active_authors_90d` — who's currently working on it
- `metrics.ownership.bus_factor` — 1 = single point of failure
- `metrics.fix_density.fix_ratio_12m` — above 0.30 = elevated fix rate
- `advisory` — human-readable summary (1-3 sentences)
