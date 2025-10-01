# storybook

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run Tests with [Cypress](https://www.cypress.io/)

> **Recommended: Storybook Component Testing**  
> Our **preferred approach** for component testing leverages existing Storybook stories, providing comprehensive accessibility validation with zero duplication effort.

We have multiple testing strategies available:

#### End-to-End Tests (Full Application Testing)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server (`http://localhost:4173`).
It is much faster than the production build and tests the complete application flow.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

These tests are ideal for:
- Full application workflows
- Integration between multiple components
- Production environment validation

#### Storybook Component Tests (**Recommended for Components**)

```sh
pnpm test:storybook:dev    # Visual test runner against Storybook stories
pnpm test:storybook        # Headless tests against Storybook stories
```

> **Why this is our preferred approach:**  
> Tests run against Storybook (`http://localhost:6006`) using your **existing stories** - no duplication, maximum coverage, same environment designers and PMs see.

These tests are perfect for:
- **Zero duplication** - Reuse existing story variants
- **Accessibility compliance** - WCAG 2.1 AA testing with real browser
- **Component behavior validation** - Hover, focus, keyboard interactions  
- **Visual consistency** - Same styling as Storybook documentation

##### Writing Storybook Tests (Recommended Pattern)

**This is our preferred approach** for component testing. Instead of recreating component setups, we test through existing Storybook stories:

```javascript
// cypress/e2e/tooltip-tests.cy.ts
describe('FzTooltip Component', () => {
  it('should render neutral tooltip correctly', () => {
    // Navigate to existing story
    cy.visitStory('overlay-fztooltip--neutral-tooltip')
    
    // Test interactions using the story
    cy.get('button').trigger('mouseenter')
    cy.get('[role="tooltip"]').should('be.visible')
  })
})
```

##### Available Custom Commands for Storybook

- `cy.visitStory(storyId)` - Navigate to a Storybook story
- `cy.waitForStorybook()` - Wait for story to load completely  
- `cy.getStoryCanvas()` - Access story content area

##### Story ID Format
Story IDs follow the pattern: `component-story--variant`
- Example: `overlay-fztooltip--neutral-tooltip`
- Find story IDs in Storybook URL or story files

#### Direct Component Tests (Advanced)

```sh
pnpm test:component:dev    # Visual test runner for isolated component tests
pnpm test:component        # Headless component tests
```

These mount Vue components directly and are useful for:
- Complex component logic testing
- Props/events testing
- Isolated component behavior

#### Complete Test Strategy

**Recommended priority order:**

1. **Storybook Tests** (`test:storybook`) - **Primary for components** - Individual variants and accessibility
2. **E2E Tests** (`test:e2e`) - Full application integration and user workflows  
3. **Unit Tests** (`test:unit`) - Pure function and utility testing
4. **Component Tests** (`test:component`) - Complex component logic when Storybook isn't sufficient

> **Our Philosophy:**  
> **Start with Storybook tests** for components. They provide the best balance of coverage, maintainability, and real-world testing. Only use direct component tests for edge cases that can't be covered through stories.

This approach ensures:
- **Maximum ROI** - Stories serve as both documentation AND tests
- **Zero duplication** - No need to recreate component setups in tests
- **Real environment** - Same browser rendering as production
- **Team alignment** - Tests match what designers/PMs review in Storybook

##### Developer Workflow (Which Scripts to Use)

For **component testing** (like FzTooltip), developers will primarily use:

```bash
# 🔧 Development: Write/debug tests interactively
pnpm test:storybook:dev
# → Opens Cypress GUI, select tests, see real browser interaction

# ✅ Verification: Quick headless check before commit
pnpm test:storybook  
# → Runs all tests, generates reports/videos
```

**Other scripts are for different use cases:**
- `test:unit` - Pure functions/utilities (not UI components)
- `test:e2e` / `test:e2e:dev` - Full application workflows
- `test:component` / `test:component:dev` - Direct component mounting (only when Storybook isn't sufficient)

**Recommended developer workflow:**
1. Write tests with `test:storybook:dev` (90% of time)
2. Verify with `test:storybook` before commit (10% of time)

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Chromatic build
We use Chromatic to host Storybook and we run interaction and visual regression tests against this statically served Storybook version.

To launch a new build in chromatic use:

```
npx chromatic --project-token=CHROMATIC_BUILD_TOKEN
```

with the appropriate environment variable set