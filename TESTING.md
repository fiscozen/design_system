# Testing Architecture & Best Practices

This document outlines the testing architecture, patterns, and best practices for the Fiscozen Design System monorepo.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Unit Testing with Vitest](#unit-testing-with-vitest)
- [Component/Interaction Testing with Storybook](#componentinteraction-testing-with-storybook)
- [Test Structure & Naming Conventions](#test-structure--naming-conventions)
- [Test Coverage Requirements](#test-coverage-requirements)
- [Writing Effective Tests](#writing-effective-tests)
- [Accessibility Testing](#accessibility-testing)
- [Running Tests](#running-tests)
- [CI/CD Integration](#cicd-integration)

---

## Testing Philosophy

Our testing strategy follows these core principles:

1. **Test Behavior, Not Implementation** — Tests should validate what the component does, not how it does it internally.
2. **Confidence Over Coverage** — Aim for meaningful tests that catch real bugs, not arbitrary coverage numbers.
3. **User-Centric Testing** — Test components as users would interact with them.
4. **Fast Feedback Loop** — Unit tests must be fast; interaction tests should run in CI.
5. **Accessibility First** — Every component must be tested for WCAG compliance.

---

## Testing Pyramid

```
                    ┌──────────────────┐
                    │   E2E Tests      │  ← Minimal, critical user flows only
                    │   (Playwright)   │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │    Component/Interaction    │  ← Storybook Play Functions
              │         Tests               │    Real browser, real CSS
              │   (Storybook + Vitest)      │    User interaction simulation
              └──────────────┬──────────────┘
                             │
    ┌────────────────────────┴────────────────────────┐
    │              Unit Tests                         │  ← Vitest + Vue Test Utils
    │         (Vitest + @vue/test-utils)              │    Fast, isolated, no browser
    │                                                 │    Props, events, logic, a11y attrs
    └─────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Tool | Purpose | Speed | Browser |
|-------|------|---------|-------|---------|
| **Unit Tests** | Vitest + Vue Test Utils | Props, events, computed values, internal logic, ARIA attributes | ⚡ Fast | ❌ jsdom |
| **Component Tests** | Storybook Play Functions | User interactions, visual states, real DOM behavior, CSS validation | 🔄 Medium | ✅ Chromium |
| **E2E Tests** | Playwright (if needed) | Critical user journeys across multiple components | 🐢 Slow | ✅ Real browsers |

---

## Unit Testing with Vitest

### Location & Naming

```
packages/
└── component-name/
    └── src/
        ├── FzComponentName.vue
        ├── types.ts
        └── __tests__/                    # Always use __tests__ (plural)
            ├── FzComponentName.spec.ts   # Always use .spec.ts extension
            └── __snapshots__/
                └── FzComponentName.spec.ts.snap
```

### Configuration

Each package includes a `vitest.config.ts`:

```typescript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        include: ['**/src/**'],
        exclude: ['**/index.ts', '**/__tests__/**', '**/*.stories.ts']
      }
    }
  })
)
```

### Test Structure

Use the following structure for all unit tests:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import FzComponentName from '../FzComponentName.vue'

describe('FzComponentName', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzComponentName)
      expect(wrapper.exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzComponentName, {
        props: { label: 'Test Label' }
      })
      expect(wrapper.text()).toContain('Test Label')
    })

    it('should render slot content', () => {
      const wrapper = mount(FzComponentName, {
        slots: { default: 'Slot Content' }
      })
      expect(wrapper.text()).toContain('Slot Content')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('variant prop', () => {
      it.each([
        ['primary', 'bg-blue-500'],
        ['secondary', 'bg-core-white'],
        ['danger', 'bg-semantic-error-200'],
        ['success', 'bg-semantic-success-200']
      ])('should apply %s variant classes', (variant, expectedClass) => {
        const wrapper = mount(FzComponentName, {
          props: { variant }
        })
        expect(wrapper.find('button').classes()).toContain(expectedClass)
      })
    })

    describe('disabled prop', () => {
      it('should apply disabled attribute when true', () => {
        const wrapper = mount(FzComponentName, {
          props: { disabled: true }
        })
        expect(wrapper.find('button').attributes('disabled')).toBeDefined()
      })

      it('should prevent click events when disabled', async () => {
        const wrapper = mount(FzComponentName, {
          props: { disabled: true }
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit click event with payload', async () => {
      const wrapper = mount(FzComponentName)
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')![0]).toEqual([expect.any(MouseEvent)])
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(FzComponentName, {
        props: { modelValue: '' }
      })
      await wrapper.find('input').setValue('new value')
      
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have correct aria-disabled when disabled', () => {
        const wrapper = mount(FzComponentName, {
          props: { disabled: true }
        })
        expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
      })

      it('should have correct aria-invalid when error', () => {
        const wrapper = mount(FzComponentName, {
          props: { error: true }
        })
        expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
      })

      it('should have aria-labelledby linking to label', () => {
        const wrapper = mount(FzComponentName, {
          props: { label: 'Test Label' }
        })
        const input = wrapper.find('input')
        const labelId = input.attributes('aria-labelledby')
        expect(labelId).toBeTruthy()
        expect(wrapper.find(`#${labelId}`).exists()).toBe(true)
      })

      it('should have aria-describedby linking to error message', () => {
        const wrapper = mount(FzComponentName, {
          props: { error: true },
          slots: { errorMessage: 'Error text' }
        })
        const input = wrapper.find('input')
        const errorId = input.attributes('aria-describedby')
        expect(errorId).toBeTruthy()
        expect(wrapper.find(`#${errorId}`).text()).toContain('Error text')
      })

      it('should have role="alert" on error message', () => {
        const wrapper = mount(FzComponentName, {
          props: { error: true },
          slots: { errorMessage: 'Error text' }
        })
        expect(wrapper.find('[role="alert"]').exists()).toBe(true)
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when not disabled', () => {
        const wrapper = mount(FzComponentName)
        const element = wrapper.find('button')
        expect(element.attributes('tabindex')).not.toBe('-1')
      })

      it('should not be in tab order when disabled', () => {
        const wrapper = mount(FzComponentName, {
          props: { disabled: true }
        })
        // Implementation depends on component behavior
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzComponentName)
      const element = wrapper.find('button')
      expect(element.classes()).toContain('rounded')
      expect(element.classes()).toContain('flex')
    })

    it('should apply environment-specific height', () => {
      const wrapperFO = mount(FzComponentName, {
        props: { environment: 'frontoffice' }
      })
      expect(wrapperFO.find('button').classes()).toContain('h-44')

      const wrapperBO = mount(FzComponentName, {
        props: { environment: 'backoffice' }
      })
      expect(wrapperBO.find('button').classes()).toContain('h-32')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined modelValue gracefully', () => {
      const wrapper = mount(FzComponentName, {
        props: { modelValue: undefined }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should generate unique IDs for multiple instances', async () => {
      const wrappers = Array.from({ length: 100 }).map(() =>
        mount(FzComponentName, { props: { label: 'Label' } })
      )
      await Promise.all(wrappers.map(w => w.vm.$nextTick()))
      
      const ids = wrappers.map(w => w.find('input').attributes('id'))
      expect(new Set(ids).size).toBe(100)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzComponentName, {
        props: { label: 'Test' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - error state', () => {
      const wrapper = mount(FzComponentName, {
        props: { label: 'Test', error: true },
        slots: { errorMessage: 'Error message' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzComponentName, {
        props: { label: 'Test', disabled: true }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
```

### Testing Utilities

#### Mocking

```typescript
import { vi } from 'vitest'

// Mock console warnings for deprecation tests
const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()

// Mock window properties
global.innerWidth = 768
```

#### Testing Composables

```typescript
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useComposable } from '../useComposable'

function withSetup<T>(composable: () => T): { result: T; wrapper: VueWrapper } {
  let result!: T
  const wrapper = mount(defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    }
  }))
  return { result, wrapper }
}

describe('useComposable', () => {
  it('should return expected values', () => {
    const { result } = withSetup(() => useComposable())
    expect(result.value).toBe(expectedValue)
  })
})
```

---

## Component/Interaction Testing with Storybook

### Location & Naming

```
apps/storybook/
└── src/
    └── stories/
        ├── button/
        │   ├── Button.stories.ts
        │   ├── ButtonGroup.stories.ts
        │   └── IconButton.stories.ts
        ├── form/
        │   ├── Input.stories.ts
        │   ├── Select.stories.ts
        │   └── Checkbox.stories.ts
        └── overlay/
            ├── Dialog.stories.ts
            └── Tooltip.stories.ts
```

### Story Structure with Play Functions

```typescript
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { ref } from 'vue'
import { FzComponentName } from '@fiscozen/component-name'

const meta = {
  title: 'Category/FzComponentName',
  component: FzComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success']
    },
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice']
    },
    disabled: { control: 'boolean' },
    // Hide deprecated props
    deprecatedProp: { table: { disable: true } }
  },
  args: {
    // Default args for all stories
    label: 'Component Label',
    variant: 'primary'
  }
} satisfies Meta<typeof FzComponentName>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// BASIC STORIES
// ============================================

export const Default: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify component renders correctly', async () => {
      const element = canvas.getByRole('button', { name: /component label/i })
      await expect(element).toBeInTheDocument()
      await expect(element).toBeVisible()
    })
    
    await step('Verify default ARIA attributes', async () => {
      const element = canvas.getByRole('button')
      await expect(element).toHaveAttribute('aria-disabled', 'false')
      await expect(element).toHaveAttribute('type', 'button')
    })
    
    await step('Verify default styling', async () => {
      const element = canvas.getByRole('button')
      await expect(element.classList.contains('bg-blue-500')).toBe(true)
      await expect(element.classList.contains('h-44')).toBe(true) // frontoffice default
    })
  }
}

// ============================================
// VARIANT STORIES
// ============================================

export const Primary: Story = {
  args: { variant: 'primary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    // Verify primary variant classes
    await expect(button.classList.contains('bg-blue-500')).toBe(true)
    await expect(button.classList.contains('text-core-white')).toBe(true)
    
    // Verify hover state class exists (CSS class presence, not visual)
    await expect(button.classList.contains('hover:bg-blue-600')).toBe(true)
  }
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    await expect(button.classList.contains('bg-core-white')).toBe(true)
    await expect(button.classList.contains('text-grey-500')).toBe(true)
  }
}

// ============================================
// STATE STORIES
// ============================================

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    
    await step('Verify disabled state', async () => {
      await expect(button).toBeDisabled()
      await expect(button).toHaveAttribute('aria-disabled', 'true')
    })
    
    await step('Verify disabled styling', async () => {
      await expect(button.classList.contains('disabled:bg-blue-200')).toBe(true)
    })
    
    await step('Verify click does not fire when disabled', async () => {
      // Click should not trigger any action
      await userEvent.click(button)
      // No error should occur, but no action should happen either
    })
  }
}

export const Error: Story = {
  args: { error: true },
  render: (args) => ({
    components: { FzComponentName },
    setup: () => ({ args }),
    template: `
      <FzComponentName v-bind="args">
        <template #errorMessage>This field is required</template>
      </FzComponentName>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify error message is displayed', async () => {
      const errorMessage = canvas.getByText('This field is required')
      await expect(errorMessage).toBeVisible()
    })
    
    await step('Verify error ARIA attributes', async () => {
      const input = canvas.getByRole('textbox')
      await expect(input).toHaveAttribute('aria-invalid', 'true')
      
      const errorId = input.getAttribute('aria-describedby')
      await expect(errorId).toBeTruthy()
      
      const errorElement = canvasElement.querySelector(`#${errorId}`)
      await expect(errorElement).toHaveAttribute('role', 'alert')
    })
    
    await step('Verify error styling', async () => {
      const input = canvas.getByRole('textbox')
      const container = input.closest('.fz-input')
      await expect(container).toBeInTheDocument()
    })
  }
}

// ============================================
// INTERACTION STORIES
// ============================================

export const UserInteraction: Story = {
  args: { label: 'Input Label' },
  render: (args) => ({
    components: { FzComponentName },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: `<FzComponentName v-bind="args" v-model="value" />`
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Type in input field', async () => {
      const input = canvas.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, 'Test value')
      await expect(input).toHaveValue('Test value')
    })
    
    await step('Clear input field', async () => {
      const input = canvas.getByRole('textbox')
      await userEvent.clear(input)
      await expect(input).toHaveValue('')
    })
  }
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus element', async () => {
      await userEvent.tab()
      const focusedElement = document.activeElement
      await expect(focusedElement).toBe(canvas.getByRole('button'))
    })
    
    await step('Activate with Enter key', async () => {
      await userEvent.keyboard('{Enter}')
      // Verify expected action occurred
    })
    
    await step('Activate with Space key', async () => {
      await userEvent.keyboard(' ')
      // Verify expected action occurred
    })
  }
}

// ============================================
// ASYNC / LOADING STORIES
// ============================================

export const AsyncLoading: Story = {
  render: (args) => ({
    components: { FzComponentName },
    setup: () => {
      const loading = ref(true)
      const data = ref([])
      
      // Simulate async data loading
      setTimeout(() => {
        data.value = [{ id: 1, name: 'Item 1' }]
        loading.value = false
      }, 500)
      
      return { args, loading, data }
    },
    template: `
      <FzComponentName v-bind="args" :loading="loading" :options="data" />
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify loading state initially', async () => {
      // Check for loading indicator
      const progress = canvasElement.querySelector('[role="progressbar"]')
      // Loading state may or may not show progress indicator
    })
    
    await step('Wait for data to load', async () => {
      await new Promise(resolve => setTimeout(resolve, 700))
    })
    
    await step('Verify data is loaded', async () => {
      const opener = canvas.getByRole('button')
      await userEvent.click(opener)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const options = document.querySelectorAll('[role="option"]')
      await expect(options.length).toBeGreaterThan(0)
    })
  }
}

// ============================================
// RESPONSIVE STORIES
// ============================================

export const MobileViewport: Story = {
  args: {},
  globals: {
    viewport: {
      value: 'xs',
      isRotated: false
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button')
    
    // Verify responsive behavior
    await expect(element.classList.contains('w-full')).toBe(true)
  }
}

// ============================================
// COMBINATION STORIES
// ============================================

export const AllVariants: Story = {
  render: () => ({
    components: { FzComponentName },
    template: `
      <div class="flex flex-col gap-4">
        <FzComponentName variant="primary" label="Primary" />
        <FzComponentName variant="secondary" label="Secondary" />
        <FzComponentName variant="danger" label="Danger" />
        <FzComponentName variant="success" label="Success" />
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button')
    await expect(buttons.length).toBe(4)
    
    // Verify each variant
    await expect(buttons[0].classList.contains('bg-blue-500')).toBe(true)
    await expect(buttons[1].classList.contains('bg-core-white')).toBe(true)
    await expect(buttons[2].classList.contains('bg-semantic-error-200')).toBe(true)
    await expect(buttons[3].classList.contains('bg-semantic-success-200')).toBe(true)
  }
}
```

### Play Function Best Practices

#### Use `step()` for Organization

```typescript
play: async ({ canvasElement, step }) => {
  await step('Setup: Open dropdown', async () => {
    // Setup actions
  })
  
  await step('Action: Select first option', async () => {
    // User action
  })
  
  await step('Assertion: Verify selection', async () => {
    // Verify results
  })
}
```

#### Handle Async Operations

```typescript
// Wait for animations/transitions
await new Promise(resolve => setTimeout(resolve, 300))

// Wait for element to appear
await waitFor(() => {
  expect(canvas.getByRole('listbox')).toBeInTheDocument()
})

// Wait for element to disappear
await waitFor(() => {
  expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
})
```

#### Query Teleported Content

```typescript
// For teleported elements (dialogs, dropdowns), search in document
const options = document.querySelectorAll('[role="option"]')
await expect(options.length).toBeGreaterThan(0)
```

#### Reliable User Interactions

```typescript
// Click
await userEvent.click(element)

// Type with delay for better reliability
await userEvent.type(input, 'text', { delay: 50 })

// Clear and type
await userEvent.clear(input)
await userEvent.type(input, 'new text')

// Keyboard navigation
await userEvent.tab()
await userEvent.keyboard('{Enter}')
await userEvent.keyboard('{ArrowDown}')
await userEvent.keyboard('{Escape}')

// Focus
element.focus()
await userEvent.keyboard('{Enter}')
```

---

## Test Structure & Naming Conventions

### File Naming

| Type | Location | Pattern | Example |
|------|----------|---------|---------|
| Unit Test | `packages/*/src/__tests__/` | `FzComponentName.spec.ts` | `FzButton.spec.ts` |
| Story | `apps/storybook/src/stories/category/` | `ComponentName.stories.ts` | `Button.stories.ts` |

### Test Description Conventions

```typescript
// Use 'should' for expected behavior
it('should render with default props')
it('should emit click event when clicked')
it('should not emit events when disabled')

// Use 'matches snapshot' for snapshots
it('matches snapshot - default state')
it('matches snapshot - error variant')

// Use descriptive describe blocks
describe('Props', () => {
  describe('variant prop', () => { ... })
  describe('disabled prop', () => { ... })
})
```

---

## Test Coverage Requirements

### Minimum Coverage by Category

| Category | Target | Enforced |
|----------|--------|----------|
| Statements | 80% | ✅ |
| Branches | 75% | ✅ |
| Functions | 80% | ✅ |
| Lines | 80% | ✅ |

### Required Test Categories

Every component MUST have tests for:

#### Unit Tests (Vitest)
- [ ] Rendering with default props
- [ ] All public props
- [ ] All emitted events
- [ ] All slots
- [ ] Disabled state
- [ ] Error state (if applicable)
- [ ] ARIA attributes
- [ ] Unique ID generation (for form elements)
- [ ] Edge cases (null/undefined values)
- [ ] Snapshot tests for key states

#### Storybook Play Functions
- [ ] Default story with basic assertions
- [ ] Each variant/state as separate story
- [ ] User interactions (click, type, select)
- [ ] Keyboard navigation
- [ ] Disabled/readonly behavior
- [ ] Error state with error message
- [ ] Required indicator
- [ ] Async loading (if applicable)

---

## Writing Effective Tests

### DO ✅

```typescript
// Test behavior from user perspective
it('should display selected value after selection', async () => {
  await userEvent.click(opener)
  await userEvent.click(options[0])
  expect(opener.textContent).toContain('Option 1')
})

// Use semantic queries
const button = canvas.getByRole('button', { name: /submit/i })
const input = canvas.getByLabelText(/email/i)
const error = canvas.getByRole('alert')

// Test accessibility
expect(input).toHaveAttribute('aria-invalid', 'true')
expect(input).toHaveAttribute('aria-describedby', expect.any(String))

// Group related tests
describe('disabled state', () => {
  it('should have disabled attribute')
  it('should have aria-disabled true')
  it('should not emit click events')
  it('should apply disabled styling')
})
```

### DON'T ❌

```typescript
// Don't test implementation details
it('should call internal method', () => {
  wrapper.vm.internalMethod() // ❌ Testing implementation
})

// Don't test third-party libraries
it('should use Vue reactive system correctly') // ❌

// Don't use brittle selectors
const el = wrapper.find('.some-class > div:nth-child(2)') // ❌

// Don't duplicate unit tests in play functions
play: async () => {
  // ❌ These should be in unit tests
  expect(button.classList.contains('h-44')).toBe(true)
  expect(button.classList.contains('h-32')).toBe(false)
}
```

### Testing Priority Matrix

| Priority | What to Test | Where |
|----------|--------------|-------|
| 🔴 Critical | ARIA attributes, keyboard a11y | Unit + Play |
| 🔴 Critical | User interactions | Play Functions |
| 🟠 High | Prop effects on rendering | Unit Tests |
| 🟠 High | Event emissions | Unit Tests |
| 🟡 Medium | CSS class application | Unit Tests |
| 🟡 Medium | Visual states | Play Functions |
| 🟢 Low | Snapshots | Unit Tests |

---

## Accessibility Testing

### Automated Checks (Unit Tests)

```typescript
describe('Accessibility', () => {
  describe('ARIA attributes', () => {
    it('should have aria-label or aria-labelledby', () => {
      // For inputs with visible label
      expect(input.attributes('aria-labelledby')).toBeTruthy()
      
      // For standalone buttons
      expect(button.attributes('aria-label')).toBe('Close')
    })
    
    it('should have aria-describedby for errors/help', () => {
      expect(input.attributes('aria-describedby')).toBeTruthy()
    })
    
    it('should indicate required state', () => {
      expect(input.attributes('aria-required')).toBe('true')
      expect(input.attributes('required')).toBeDefined()
    })
    
    it('should indicate invalid state', () => {
      expect(input.attributes('aria-invalid')).toBe('true')
    })
    
    it('should indicate disabled state', () => {
      expect(button.attributes('aria-disabled')).toBe('true')
    })
    
    it('should have aria-checked for checkboxes', () => {
      expect(checkbox.attributes('aria-checked')).toBe('true')
    })
    
    it('should have aria-expanded for expandable elements', () => {
      expect(opener.attributes('aria-expanded')).toBe('false')
    })
    
    it('should have aria-haspopup for dropdowns', () => {
      expect(opener.attributes('aria-haspopup')).toBe('listbox')
    })
  })
  
  describe('Keyboard navigation', () => {
    it('should be focusable', () => {
      expect(element.attributes('tabindex')).not.toBe('-1')
    })
    
    it('should support Enter activation', () => {
      // Test in play functions with userEvent.keyboard
    })
    
    it('should support arrow key navigation', () => {
      // Test in play functions
    })
    
    it('should support Escape to close', () => {
      // Test in play functions
    })
  })
  
  describe('Decorative elements', () => {
    it('should hide decorative icons from screen readers', () => {
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.attributes('aria-hidden')).toBe('true')
    })
  })
})
```

### Manual Checks (Storybook)

Use the `@storybook/addon-a11y` panel to verify:
- Color contrast ratios
- Focus indicators visibility
- Screen reader announcements
- Touch target sizes (minimum 44x44px)

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests in a package
cd packages/button
pnpm test

# Run with watch mode
pnpm test -- --watch

# Run with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test -- FzButton.spec.ts

# Run from root with nx
npx nx run @fiscozen/button:test
```

### Storybook Tests

```bash
# From root directory
pnpm test:storybook              # Run once
pnpm test:storybook:watch        # Watch mode (recommended for development)
pnpm test:storybook:coverage     # With coverage
pnpm test:storybook:ui           # Interactive UI

# From apps/storybook directory
cd apps/storybook
pnpm test:storybook
```

### Running All Tests

```bash
# Run all unit tests across all packages
npx nx run-many -t test

# Run tests for affected packages only
npx nx affected -t test

# Run with verbose output
npx nx run-many -t test -- --reporter verbose
```

---

## CI/CD Integration

### GitHub Actions Workflow

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
      - run: npx nx affected -t test --base=origin/main

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

### Pre-commit Hooks

Consider adding to `.husky/pre-commit`:

```bash
#!/bin/sh
npx nx affected -t test --base=HEAD~1
```

---

## Checklist for New Components

When creating a new component, ensure:

### Unit Tests

- [ ] Created `__tests__/FzComponentName.spec.ts` file
- [ ] Tests for all props
- [ ] Tests for all events
- [ ] Tests for all slots
- [ ] Tests for disabled state
- [ ] Tests for error state (if applicable)
- [ ] ARIA attribute tests
- [ ] Unique ID generation tests (for form elements)
- [ ] Edge case tests
- [ ] Snapshot tests for key states

### Storybook Stories

- [ ] Created `ComponentName.stories.ts` file
- [ ] Default story with play function
- [ ] Stories for each variant
- [ ] Stories for each state (disabled, error, loading)
- [ ] Play functions with user interactions
- [ ] Play functions with keyboard navigation tests
- [ ] Play functions with accessibility assertions
- [ ] Step-based organization for complex interactions

### Documentation

- [ ] Updated component README if needed
- [ ] Added JSDoc comments to props
- [ ] Added examples in story docs

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Playwright Test](https://playwright.dev/)

