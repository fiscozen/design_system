<!--
Sync Impact Report:
Version: 1.0.0 (initial creation)
Ratification Date: 2025-01-27
Last Amended: 2025-01-27

Principles Established:
- Accessibility First (WCAG 2.1 AA compliance)
- Component Composition
- Type Safety
- Documentation Driven
- Testing Discipline
- Design Token Consistency
- RFC Governance

Templates Status:
- ✅ Updated: .specify/templates/plan-template.md
- ✅ Updated: .specify/templates/spec-template.md
- ✅ Updated: .specify/templates/tasks-template.md
- ✅ Updated: .specify/templates/commands/constitution.md

Follow-up TODOs:
- Expand template files with detailed structure as needed
- Establish RFC review process documentation
-->

# Project Constitution

**Project:** FiscoZen Design System  
**Version:** 1.0.0  
**Ratification Date:** 2025-01-27  
**Last Amended:** 2025-01-27

## Preamble

This constitution establishes the non-negotiable principles, standards, and governance procedures for the FiscoZen Design System. All contributors MUST adhere to these principles. Violations require explicit exception documentation and approval.

## Principles

### Principle 1: Accessibility First

**MUST** implement WCAG 2.1 Level AA compliance for all components. All interactive elements MUST include proper ARIA attributes, keyboard navigation support, and screen reader compatibility. Visual-only implementations that bypass semantic HTML are prohibited unless equivalent accessibility is provided.

**Rationale:** Legal compliance and inclusive design are foundational. Components without accessibility are incomplete and unusable by a significant portion of users.

**Enforcement:**
- Storybook accessibility addon MUST pass all checks
- Manual keyboard navigation testing required
- Screen reader testing required for new components
- ARIA attributes MUST be on the interactive element (input, button, etc.), not decorative wrappers

### Principle 2: Component Composition

**MUST** design components as composable, reusable units. Components SHOULD accept props for customization rather than hardcoding behavior. Slots MUST be used for flexible content injection. Complex components MUST be built from simpler primitives.

**Rationale:** Composition enables reuse, reduces duplication, and simplifies maintenance. Monolithic components become unmaintainable as requirements evolve.

**Enforcement:**
- Components MUST export both individual and composed variants
- Props MUST have sensible defaults via `withDefaults`
- Slots MUST be documented in component JSDoc
- Complex logic MUST be extracted to composables

### Principle 3: Type Safety

**MUST** use TypeScript for all source code. Props, emits, and composable return types MUST be explicitly typed. `any` types are prohibited except for third-party library integrations where types are unavailable.

**Rationale:** Type safety prevents runtime errors, improves IDE support, and serves as inline documentation. Untyped code introduces maintenance risk.

**Enforcement:**
- All `.vue` files MUST use `<script setup lang="ts">`
- Props MUST use `defineProps<Type>()` with explicit types
- Emits MUST use `defineEmits<Type>()` with explicit types
- Utility functions MUST have explicit return types
- Type definitions MUST be exported from `types.ts`

### Principle 4: Documentation Driven

**MUST** document all public APIs, component props, slots, and usage patterns. Storybook stories MUST demonstrate all component variants and edge cases. README files MUST exist for each package with installation and usage examples.

**Rationale:** Documentation enables adoption and reduces support burden. Undocumented components are effectively unusable by consumers.

**Enforcement:**
- Each component MUST have a Storybook story
- Props MUST have JSDoc comments with descriptions
- Complex components MUST include usage examples
- RFC process REQUIRED for new components or breaking changes
- README MUST exist in each package directory

### Principle 5: Testing Discipline

**MUST** write tests for all component behavior, accessibility, and user interactions. Storybook interaction tests MUST cover primary user flows. Snapshot tests MUST capture component output for regression detection.

**Rationale:** Tests prevent regressions, document expected behavior, and enable confident refactoring. Untested code degrades over time.

**Enforcement:**
- Storybook interaction tests REQUIRED for interactive components
- Accessibility tests REQUIRED via @storybook/addon-a11y
- Snapshot tests REQUIRED for component rendering
- Test coverage SHOULD exceed 80% for new code
- Tests MUST run in CI/CD pipeline

### Principle 6: Design Token Consistency

**MUST** use design tokens from `@fiscozen/style` for all styling values. Hardcoded colors, spacing, typography, or other design values are prohibited. Tailwind utility classes MUST reference token-based theme values.

**Rationale:** Design tokens ensure visual consistency and enable theme updates across the entire system. Hardcoded values create maintenance debt.

**Enforcement:**
- Colors MUST use semantic tokens (e.g., `text-semantic-error`, `bg-core-black`)
- Spacing MUST use Tailwind spacing scale (token-based)
- Typography MUST use design system font sizes
- Custom CSS MUST reference CSS variables from tokens
- No inline styles except for dynamic values

### Principle 7: RFC Governance

**MUST** create an RFC (Request for Comments) document for new components, significant API changes, or architectural decisions. RFCs MUST follow the template in `docs/RFC/TEMPLATE.md` and include motivation, design details, drawbacks, and alternatives.

**Rationale:** RFCs ensure thoughtful design, capture context for future maintainers, and enable team review before implementation.

**Enforcement:**
- New components REQUIRE RFC approval
- Breaking API changes REQUIRE RFC
- Architectural changes REQUIRE RFC
- RFCs MUST be reviewed before implementation begins
- Approved RFCs MUST be stored in `docs/RFC/[component-name]/`

## Governance

### Amendment Procedure

1. Propose amendment via RFC or issue discussion
2. Gather team consensus on proposed changes
3. Update constitution file with version bump
4. Update Sync Impact Report in constitution header
5. Propagate changes to dependent templates and documentation
6. Commit with message: `docs: amend constitution to vX.Y.Z (description)`

### Versioning Policy

Constitution versions follow semantic versioning:
- **MAJOR**: Backward incompatible principle removals or redefinitions
- **MINOR**: New principle added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes

Current version: 1.0.0

### Compliance Review

- New code MUST be reviewed against constitution principles
- PR reviews MUST flag constitution violations
- Quarterly review of constitution effectiveness
- Update constitution when patterns emerge that contradict principles

### Exception Process

When a principle cannot be followed:
1. Document the exception in code comments with `@constitution-exception`
2. Explain why the exception is necessary
3. Reference the specific principle being violated
4. Propose timeline for resolution if temporary
5. Require explicit approval from maintainers

## Technical Standards

### Technology Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (token-based)
- **Build**: Nx monorepo
- **Package Manager**: pnpm (^10.0.0)
- **Node.js**: ^22.12.0
- **Testing**: Vitest + Storybook Test
- **Documentation**: Storybook

### Code Style

- Follow Vue 3 Composition API best practices
- Use `withDefaults` for prop defaults
- Extract complex logic to composables
- Use computed properties for derived state
- Prefer template refs over DOM queries
- Use PascalCase for component file names (e.g., `FzRadio.vue`)
- Use PascalCase for component names in templates

### File Structure

```
packages/[component-name]/
├── src/
│   ├── Fz[Component].vue          # Main component
│   ├── types.ts                    # TypeScript definitions
│   ├── common.ts                   # Shared utilities
│   ├── components/                 # Sub-components
│   ├── __test__/                   # Test files
│   └── index.ts                    # Public exports
├── package.json
├── README.md                        # Package documentation
└── tsconfig.json
```

## Dependencies

This constitution depends on the following template files (which MUST be kept in sync):
- `.specify/templates/plan-template.md` - Planning template referencing principles
- `.specify/templates/spec-template.md` - Specification template with constitution checks
- `.specify/templates/tasks-template.md` - Task categorization aligned with principles
- `.specify/templates/commands/*.md` - Command templates referencing governance

When constitution principles change, these templates MUST be updated accordingly.
