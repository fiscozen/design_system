# @fiscozen/card-list

> For usage documentation, see [Storybook Documentation](https://storybook-url/Documentation/Panel/FzCardList)

## Development

### Architecture

`FzCardList` is a thin wrapper that maps the `items` array to one `FzCardListItem` per entry. It does not render a section title, spacing tokens, or flex direction options—the layout is fixed inside each row component.

`FzCardListItem` is the presentational row: optional badge (text + tone), optional row actions, optional status indicator, bold title, optional right-aligned value (e.g. amount), optional description lines, and a divider after each row.

**Key state:**

- No reactive state in `FzCardList`; `FzCardListItem` uses small computed helpers for action mode and layout variants (`actionsMode`, `hasTitleOnly`, `hasAmount`).

**Layout flow:**

- **Badge vs. title-only**: If there is no badge and no `value`, the title (and optional indicator) sits in the top row; the second row is omitted. If there is a badge or a `value`, the badge/action row is separate from the title/value row.
- **Actions**: `actions` omitted or empty (`[]`) renders no trailing control. Exactly one action shows an arrow icon button (`FzIconButton`); more than one uses `FzIconDropdown` with ellipsis.
- Each row is wrapped in hover styles (`hover:bg-semantic-info-50`, padding, rounded corners) and followed by `FzDivider`.

### Code organization

- `src/FzCardList.vue`: Maps `items` to `FzCardListItem`; forwards row events to the list consumer.
- `src/FzCardListItem.vue`: Row UI and action behavior.
- `src/types.ts`: `FzCardListProps`, `FzCardListEmits`, `FzCardListItemProps`, `FzCardListItemEmits`, `FzCardListItem`.
- `src/index.ts`: Exports `FzCardList`, `FzCardListItem`, and types.

### Key concepts

#### Data-driven list only

`FzCardList` accepts `items: FzCardListItem[]` and renders only from that array. There is no default slot; empty `items` yields an empty container. For fully custom markup, compose `FzCardListItem` (or other components) yourself outside `FzCardList`.

#### Item shape

Each list element matches `FzCardListItemProps`: `title` (required), optional `badge` (`text`, `tone`), `value`, `descriptions`, `showIndicator`, and `actions` (typed as in `@fiscozen/action`).

#### Events

- **`FzCardListItem`** emits `fzaction:click` with `(actionIndex, action)` when the arrow or one dropdown entry is chosen, and `update:isOpen` when the dropdown open state changes.
- **`FzCardList`** re-emits `fzaction:click` as `(itemIndex, actionIndex, action)` so the consumer knows which row was acted on. It also listens for `fzmenu:click` on each row and re-emits with `itemIndex` (useful if you wrap or extend rows that emit that event).

### Design decisions

#### Why keep `FzCardList` separate from `FzCardListItem`?

The list component centralizes the `v-for` + keyed rows and attaches the item index to action events. Consumers with a single static column can still import `FzCardListItem` only.

#### Why one arrow vs. dropdown?

A single primary action is surfaced as a direct affordance; multiple actions stay in an overflow menu for a consistent density.

### Known limitations

- **No list chrome**: No built-in list title, outer gap system, or horizontal/grid layout on `FzCardList`.
- **No selection state**: Selected/active row state is up to the app.
- **No virtualization or pagination**: Large lists render in full unless the app slices data or uses another container.
