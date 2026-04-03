---
name: testing-standards
description: Testing patterns and requirements for Vue component unit tests (Vitest) and Storybook play functions
paths:
  - "packages/**/*.spec.ts"
  - "packages/**/*.test.ts"
  - "apps/storybook/**/*.stories.ts"
---

# Testing Standards

Reference: `TESTING.md` for full architecture. This skill covers the patterns and anti-patterns.

## Two-Tier Strategy

1. **Unit tests** (Vitest + Vue Test Utils) — fast, jsdom, internal logic
2. **Play functions** (Storybook) — real browser, user interactions, visual verification

Both are REQUIRED for every component.

## Unit Test Pattern (`.spec.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzComponent } from '..'

describe('FzComponent', () => {
  describe('Rendering', () => { /* default props, labels, slots */ })
  describe('Props', () => { /* each public prop, disabled, environment */ })
  describe('Events', () => { /* emitted events, blocked when disabled, v-model */ })
  describe('Accessibility', () => { /* aria-disabled, aria-invalid, keyboard focus */ })
  describe('Edge Cases', () => { /* undefined props, multiple instances */ })
  describe('Snapshots', () => { /* default, disabled, error states */ })
})
```

### v-model Testing

```typescript
it('should emit update:modelValue', async () => {
  const wrapper = mount(FzComponent, { props: { modelValue: '' } })
  await wrapper.find('input').setValue('new value')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
})
```

## Play Function Pattern (`.stories.ts`)

```typescript
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
//                                                      ^^^^^^^^^^^^^^
//                                          NOT '@storybook/test' (Storybook 10)

export const Default: Story = {
  args: { onClick: fn() },  // fn() spy in args — REQUIRED
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify renders', async () => {
      await expect(canvas.getByRole('button')).toBeInTheDocument()
    })

    await step('Verify click calls handler', async () => {
      await userEvent.click(canvas.getByRole('button'))
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
  }
}

export const Disabled: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify handler NOT called when disabled', async () => {
      await userEvent.click(canvas.getByRole('button'))
      await expect(args.onClick).not.toHaveBeenCalled()
    })
  }
}
```

### v-model Spy Pattern

```typescript
args: { 'onUpdate:modelValue': fn() },
play: async ({ args }) => {
  // after interaction:
  await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(expectedValue)
}
```

| Component Type | Event | Spy Arg Name |
|---|---|---|
| Button/Action | `@click` | `onClick: fn()` |
| Input/Textarea | `@blur`, `@focus` | `onBlur: fn()`, `onFocus: fn()` |
| Checkbox/Radio | `v-model` | `'onUpdate:modelValue': fn()` |
| Select/Typeahead | `v-model` | `'onUpdate:modelValue': fn()` |
| Dialog | `@close` | `onClose: fn()` |

## Anti-Patterns

### Never use setTimeout

```typescript
// BAD
await new Promise(resolve => setTimeout(resolve, 300))

// GOOD
await waitFor(() => {
  expect(document.querySelector('dialog')).toBeInTheDocument()
}, { timeout: 1000 })
```

### Never test CSS classes directly

```typescript
// BAD — implementation detail
expect(element.classList.contains('h-44')).toBe(true)

// GOOD — test behavior
const computedStyles = window.getComputedStyle(element)
expect(computedStyles.position).toBe('fixed')
```

### Never use module-level spies

```typescript
// BAD
const handleClick = fn()
export const MyStory: Story = {
  render: (args) => ({ setup: () => ({ handleClick }) })
}

// GOOD — spies in args
export const MyStory: Story = {
  args: { onClick: fn() },
  play: async ({ args }) => { await expect(args.onClick).toHaveBeenCalled() }
}
```

## Checklist Before Submitting

- [ ] Unit tests pass: `pnpm test`
- [ ] Storybook tests pass: `pnpm test:storybook`
- [ ] Coverage >= 80% statements, 75% branches
- [ ] Accessibility verified in both test types
- [ ] fn() spies used for all interaction verification
- [ ] No setTimeout, no CSS class assertions
- [ ] Snapshots updated if visual changes: `pnpm test -- -u`
