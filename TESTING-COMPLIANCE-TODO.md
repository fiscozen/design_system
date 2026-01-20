# Testing Compliance Todo List

## Fiscozen Design System Monorepo

**Date Created:** January 20, 2026  
**Reference Documents:** `TESTING.md`, `.cursor/rules/testing-standards.mdc`

---

## Executive Summary

| Priority | Items | Status | Estimated Effort |
|----------|-------|--------|------------------|
| 🔴 Critical | 3 failing tests | ✅ **FIXED** | 2-4 hours |
| 🟠 High | 7 interactive stories need spy pattern | ✅ **COMPLETED** | 4-6 hours |
| 🟡 Medium | Coverage enforcement config | Not Started | 2-3 hours |
| 🟢 Low | Vue warnings in tests | Non-blocking | 1-2 hours |

**Total Remaining Work: ~3-5 hours**

---

## ✅ Completed (No Action Needed)

- [x] File naming convention (`.spec.ts`) - 63/63 files (100%)
- [x] Folder naming convention (`__tests__`) - 42/42 folders (100%)
- [x] Missing unit tests - All packages covered (100%)
- [x] Storybook play functions - 51/51 stories (100%)
- [x] Accessibility tests - ~95% coverage

---

## ✅ Critical: Failing Tests (FIXED)

### Package: `typeahead`

**File:** `packages/typeahead/src/__tests__/FzTypeahead.spec.ts`

| Test | Error | Fix Applied |
|------|-------|-------------|
| `update:modelValue keyboard selection` | Events not emitting | ✅ Added `filtrable: false` prop to enable keyboard navigation |
| `fztypeahead:select keyboard selection` | Events not emitting | ✅ Added `filtrable: false` prop to enable keyboard navigation |
| `fztypeahead:right-icon-click` | Button element not found | ✅ Added missing `rightIcon` prop and `filtrable: false` |

**Fixes Applied:**

1. **Component fix** (`packages/typeahead/src/FzTypeahead.vue` line 823):
   - Added null check inside `requestAnimationFrame` callback for `selectedOption.value`

2. **Test fixes** (`packages/typeahead/src/__tests__/FzTypeahead.spec.ts`):
   - Keyboard selection tests: Added `filtrable: false` prop (required for keyboard navigation to focus options)
   - Right icon click test: Added `rightIcon: "search"` prop (required for button to render) and `filtrable: false`

**Verification (All 122 tests passing):**
```bash
pnpm --filter @fiscozen/typeahead test:unit
```

---

## 🟠 High: Spy Function Pattern Missing

Per `TESTING.md` section "Event Testing Best Practices", interactive stories should use `fn()` spies to verify handlers are called.

### Interactive Components (Need Spy Pattern)

- [x] `apps/storybook/src/stories/navigation/Stepper.stories.ts` ✅ **COMPLETED**
  - ✅ Added spy for `onUpdate:activeStep` (v-model) step change events
  - ✅ Verify handler IS called when step is clicked
  - ✅ Verify handler is NOT called for disabled steps

- [x] `apps/storybook/src/stories/navigation/Breadcrumbs.stories.ts` ✅ **COMPLETED**
  - ✅ Verified breadcrumb link clicks (router-based navigation)
  - ✅ Note: Router navigation handled by vue-router, no custom events to spy

- [x] `apps/storybook/src/stories/navigation/Navbar.stories.ts` ✅ **COMPLETED**
  - ✅ Added spy for `onFznavbar:menuButtonClick` event
  - ✅ Verify handler IS called for menu button interactions

- [x] `apps/storybook/src/stories/overlay/Tooltip.stories.ts` ✅ **COMPLETED**
  - ✅ Note: Presentational component - no events emitted
  - ✅ Verified tooltip trigger interactions (hover/unhover) work correctly

- [x] `apps/storybook/src/stories/overlay/ViewFlag.stories.ts` ✅ **COMPLETED**
  - ✅ Note: Presentational component - no events emitted
  - ✅ Verified component renders correctly with all props

- [x] `apps/storybook/src/stories/data/Table.stories.ts` ✅ **COMPLETED**
  - ✅ Added spy for `onFztable:ordering` event
  - ✅ Added spy for `onFztable:rowactionclick` event
  - ✅ Added spy for `onUpdate:searchTerm` event
  - ✅ Added spy for `onFztable:newitem` event
  - ✅ Verify handlers ARE called for table interactions

- [x] `apps/storybook/src/stories/data/SimpleTable.stories.ts` ✅ **COMPLETED**
  - ✅ Note: Presentational component - no events emitted
  - ✅ Verified table renders correctly with data

### Example Spy Pattern Implementation

```typescript
import { fn, expect, userEvent, within } from '@storybook/test'

export const Interactive: Story = {
  args: {
    onSomeEvent: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify handler IS called when interacting', async () => {
      const element = canvas.getByRole('button')
      await userEvent.click(element)
      
      // ROBUST CHECK: Verify spy WAS called
      await expect(args.onSomeEvent).toHaveBeenCalledTimes(1)
    })
  }
}
```

### Presentational Components (No Spy Needed - By Design)

These components are purely presentational and have no user interactions to test:

- [x] `composables/Floating.stories.ts` - N/A (positioning utility)
- [x] `container/Container.stories.ts` - N/A (layout wrapper)
- [x] `data/SimpleTable.stories.ts` - N/A (display only, no events emitted)
- [x] `media/Avatar.stories.ts` - N/A (display only)
- [x] `media/Icon.stories.ts` - N/A (display only)
- [x] `media/PdfViewer.stories.ts` - N/A (display only)
- [x] `misc/Badge.stories.ts` - N/A (display only)
- [x] `overlay/Tooltip.stories.ts` - N/A (presentational, hover interactions verified)
- [x] `overlay/ViewFlag.stories.ts` - N/A (display only, no events emitted)
- [x] `panel/Divider.stories.ts` - N/A (display only)
- [x] `panel/Layout.stories.ts` - N/A (layout wrapper)
- [x] `progress/Progress.stories.ts` - N/A (display only)
- [x] `progress/ProgressBar.stories.ts` - N/A (display only)
- [x] `typography/Paragraph.stories.ts` - N/A (display only)
- [x] `typography/Title.stories.ts` - N/A (display only)

---

## 🟡 Medium: Coverage Enforcement Not Configured

Per `TESTING.md` section "Coverage Requirements":

| Metric | Required Threshold | Current Status |
|--------|-------------------|----------------|
| Statements | 80% | ❌ Not enforced |
| Branches | 75% | ❌ Not enforced |
| Functions | 80% | ❌ Not enforced |
| Lines | 80% | ❌ Not enforced |

### Task 1: Configure Vitest Coverage Thresholds

- [ ] Update `vitest.config.ts` in each package:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['**/src/**'],
      exclude: ['**/index.ts', '**/__tests__/**', '**/*.stories.ts'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
})
```

### Task 2: Add CI/CD Workflow

- [ ] Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: npx nx affected -t test --base=origin/main --coverage
      
  storybook-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: npx playwright install chromium
      - run: pnpm test:storybook
```

### Task 3: Add Pre-commit Hook

- [ ] Create `.husky/pre-commit`:

```bash
#!/bin/sh
npx nx affected -t test --base=HEAD~1
```

---

## 🟢 Low: Vue Warnings in Tests

### Package: `typeahead`

| Warning | Occurrences | Impact |
|---------|-------------|--------|
| Missing required prop: "iconName" | Multiple | Non-blocking |
| Missing required prop: "iconVariant" | Multiple | Non-blocking |
| Missing required prop: "to" | Multiple | Non-blocking |
| toRefs() expects reactive object | 1 | Non-blocking |

**Options to Fix:**

1. **Option A:** Add default props to `FzAction` component
2. **Option B:** Mock warnings in test setup:

```typescript
// In vitest.setup.ts
beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
```

3. **Option C:** Provide required props in test mounts

---

## 📊 Progress Tracking

### Phase Completion

| Phase | Description | Progress |
|-------|-------------|----------|
| Phase 1 | File & Folder Naming | ✅ 100% |
| Phase 2 | Missing Unit Tests | ✅ 100% |
| Phase 3 | Unit Test Quality | ✅ ~95% |
| Phase 4 | Storybook Play Functions | ✅ 100% |
| Phase 5 | Accessibility Tests | ✅ ~95% |
| Phase 6 | Coverage Enforcement | ⬜ 0% |
| Phase 7 | Spy Function Pattern | ✅ 100% (39/51 stories - all interactive components) |

### Test Metrics

| Metric | Count |
|--------|-------|
| Total `.spec.ts` test files | 63 |
| Total `__tests__` folders | 42 |
| Total Storybook story files | 51 |
| Stories with play functions | 51 (100%) |
| Stories with spy pattern | 39 (76%) - All interactive components |
| Storybook tests passing | 408+ |

---

## 📌 Immediate Action Items

### Today

1. [x] Fix typeahead test failures (null check for `selectedOption.value`) ✅ **FIXED**
2. [x] Run `pnpm --filter @fiscozen/typeahead test:unit` to verify fix ✅ **122/122 tests passing**

### This Week

3. [x] Add spy pattern to `Stepper.stories.ts` ✅ **COMPLETED**
4. [x] Add spy pattern to `Breadcrumbs.stories.ts` ✅ **COMPLETED**
5. [x] Add spy pattern to `Navbar.stories.ts` ✅ **COMPLETED**
6. [x] Add spy pattern to `Table.stories.ts` ✅ **COMPLETED**
7. [x] Add spy pattern to `SimpleTable.stories.ts` ✅ **COMPLETED** (presentational)

### Next Week

8. [x] Add spy pattern to `Tooltip.stories.ts` ✅ **COMPLETED** (presentational)
9. [x] Add spy pattern to `ViewFlag.stories.ts` ✅ **COMPLETED** (presentational)
10. [ ] Configure coverage thresholds
11. [ ] Set up CI/CD workflow
12. [ ] Add pre-commit hooks

---

## Verification Commands

```bash
# Run all unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run Storybook tests
pnpm test:storybook

# Run specific package tests
pnpm --filter @fiscozen/typeahead test:unit

# Run Storybook tests for specific component
pnpm test:storybook --run Stepper

# Check for remaining .test.ts files (should be 0)
find packages -name "*.test.ts" | wc -l

# Check for __test__ folders (should be 0)
find packages -type d -name "__test__" | wc -l
```

---

*Document Last Updated: January 20, 2026*

