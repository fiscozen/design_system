# @fiscozen/card

> For usage documentation, see [Storybook Documentation](https://storybook-url/Documentation/Panel/FzCard)

## Development

### Architecture

The `FzCard` component is a layout container that groups related content and actions. It provides a consistent structure: optional header (title + slots), main content area, and optional footer (default action buttons or custom slot). It supports multiple background color variants, collapsible content with configurable default state, and optional info icon. All action buttons and the info icon use the same `environment` prop for visual context (backoffice vs frontoffice).

**Key state:**
- `isOpen`: Ref controlling expanded/collapsed state when `collapsible` is true; initial value from `defaultExpanded ?? false`
- `normalizedColor`: Computed mapping deprecated color values (e.g. `aliceblue` → `blue`) for internal styling
- `showContent`: Computed — true when not collapsible or when expanded
- `isAlive`: Computed — true when `alwaysAlive` or `showContent`; drives whether article/footer are in DOM (v-if)
- `existHeader`: Computed — true when title or header/header-content slots are provided
- `atLeastOneButton`: Computed — true when any of primary/secondary/tertiary action is set

**Color and styling flow:**
- `normalizedColor` feeds `backgroundColor` and `borderColor` computed properties
- Background/border use Tailwind classes: design tokens for default/blue/orange/purple/grey; semantic tokens for yellow (`--semantic-warning-50`) and red (`--semantic-error-50`)
- Text color is always `text-core-black` for all variants

### Code Organization

- `src/FzCard.vue`: Single-file component; all logic and template in one place
- `src/types.ts`: `FzCardProps`, `FzCardColor`, `FzCardEnvironment`, `FzCardEvents`, `FzCardSlots`, and internal action types
- `src/index.ts`: Exports component and types

No subcomponents or `utils`/`common` modules; color mapping and layout logic live in the main component.

### Key Concepts

#### Color Variants and Normalization

The `color` prop accepts: `default`, `blue`, `orange`, `purple`, `grey`, `yellow`, `red`, and deprecated `aliceblue`. All styling uses `normalizedColor` so that:
- `aliceblue` is mapped to `blue` (same visual result)
- A `watch` with `immediate: true` logs a deprecation warning when `color === 'aliceblue'`

Background and border classes are resolved in two computed properties (`backgroundColor`, `borderColor`) with a `switch (normalizedColor.value)` over the normalized value. Adding a new color requires adding a case in both computeds and extending `FzCardColor` in `types.ts`.

#### Collapsible and Content Visibility

- When `collapsible` is false: content and footer are always visible; `isAlive` and `showContent` are true
- When `collapsible` is true: header click toggles `isOpen`; `showContent` follows `isOpen`; article uses `v-show="showContent"` so it can be hidden without destroy
- `isAlive`: When true, article and footer are rendered (v-if). When false (collapsible and collapsed and not `alwaysAlive`), article is not in DOM. So: `alwaysAlive` keeps content in DOM when collapsed; otherwise collapsed state removes article (and footer when no actions/slot)

Footer is shown only when `(slots.footer || atLeastOneButton) && isAlive` and `v-show="showContent"`, so it hides with content when collapsed unless overridden by slot usage.

#### Action Buttons and Warnings

Primary, secondary, and tertiary actions are rendered in the default footer slot via `FzContainer` + `FzButton` / `FzIconButton`. Order in template: tertiary (icon), secondary, primary. On mount, the component warns if:
- `tertiaryAction` is set without both `primaryAction` and `secondaryAction`
- `secondaryAction` is set without `primaryAction`

These are guidance only; rendering still proceeds.

#### Responsive Footer

`useMediaQuery` from `@fiscozen/composables` and `breakpoints` from `@fiscozen/style` drive `smOrSmaller`. When true, footer has `w-full` on the container and `flex-grow` on secondary/primary buttons; footer layout uses `justify-end` when not `smOrSmaller`.

### Internal Logic

#### Color Class Mapping

- `backgroundColor`: `default` → `bg-core-white`; `blue` → `bg-background-alice-blue`; `orange` → `bg-background-seashell`; `purple` → `bg-background-pale-purple`; `grey` → `bg-background-white-smoke`; `yellow` → `bg-semantic-warning-50`; `red` → `bg-semantic-error-50`
- `borderColor`: same keys → `border-grey-100` (default), `border-background-alice-blue`, `border-background-seashell`, `border-background-pale-purple`, `border-background-white-smoke`, `border-semantic-warning-50`, `border-semantic-error-50`

All other colors (e.g. future tokens) require adding a case in both computeds and ensuring the Tailwind/semantic token exists in the design system.

#### Footer Visibility

Footer is rendered (v-if) when there is something to show and content is “alive”:
- Condition: `(slots.footer || atLeastOneButton) && isAlive`
- Visibility: `v-show="showContent"` so it hides when collapsible and collapsed
- When only actions exist, default footer slot renders `FzContainer` with tertiary (FzIconButton), secondary (FzButton), primary (FzButton). Custom footer replaces this entirely via `#footer`.

#### defineExpose

Only `toggleOpen` is exposed; used for programmatic expand/collapse when `collapsible` is true.

### Design Decisions

#### Why Normalize Color Instead of Removing aliceblue?

Keeping `aliceblue` in the type and normalizing to `blue` preserves backward compatibility. Consumers can migrate at their own pace while receiving a single deprecation warning. Removing it would be a breaking change.

#### Why v-if for Article/Footer and v-show for Visibility?

`v-if="isAlive"` controls whether the content block exists at all (e.g. when collapsed and not `alwaysAlive`). `v-show="showContent"` only hides the block visually when collapsible and collapsed but still “alive”. This allows optional DOM removal for performance while supporting `alwaysAlive` for stateful content that must stay mounted.

#### Why Action Warnings on Mount?

Tertiary/secondary without primary are allowed by the type system but are considered poor UX. The onMounted warnings guide consumers toward recommended usage without breaking existing code.

### Known Limitations

- **No built-in loading/error state**: Card does not provide loading or error UI; consumers can use slots or contentClass
- **Action order fixed**: Tertiary, secondary, primary order is not configurable via prop
- **Single expand state**: No accordion/group behavior; each card manages its own `isOpen`
