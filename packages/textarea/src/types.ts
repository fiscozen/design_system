/**
 * Type definitions for the Fiscozen Textarea component library.
 *
 * @module @fiscozen/textarea/types
 */

/**
 * Visual variants of the FzTextarea field.
 *
 * `bare` strips the component's own box (border, background, padding, minimum
 * height) so that the container around it can be the visible field.
 */
type FzTextareaVariant = 'default' | 'bare'

/**
 * Which element is responsible for the focus indicator of the `bare` variant.
 *
 * `field` keeps the indicator on the textarea; `container` hands the obligation
 * to the caller's box. It is a transfer of responsibility, never a removal —
 * see the `focusAffordance` prop.
 */
type FzTextareaFocusAffordance = 'field' | 'container'

/**
 * Props for the FzTextarea component.
 *
 * Multi-line text input with label, validation states, resize control,
 * and full WCAG 2.1 AA accessibility support. Error and help content
 * are provided via slots (errorMessage, helpText) following the same
 * pattern as FzInput.
 *
 * @example
 * <FzTextarea label="Notes" v-model="notes" resize="vertical">
 *   <template #helpText>Max 500 characters</template>
 * </FzTextarea>
 */
type FzTextareaProps = {
  /**
   * HTML id attribute. Falls back to auto-generated ID for label association.
   */
  id?: string
  /**
   * Form field name for submission and identification
   */
  name?: string
  /**
   * @deprecated Not part of the Figma design. Will be removed in the next major version.
   * The textarea always uses text-base (16px). This prop is accepted but ignored.
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Text label displayed above the textarea. When omitted, no label element is rendered.
   */
  label?: string
  /**
   * Marks field as required. Adds asterisk to label and sets native required attribute.
   * @default false
   */
  required?: boolean
  /**
   * Placeholder text shown when textarea is empty
   */
  placeholder?: string
  /**
   * Enables error state with red border. Paired with errorMessage slot
   * to display error via FzAlert. Works with disabled (both states reflected in ARIA).
   * @default false
   */
  error?: boolean
  /**
   * Disables interaction and applies muted styling
   * @default false
   */
  disabled?: boolean
  /**
   * Visual variant of the field.
   *
   * - `default`: the component draws the field — 1px border, white background,
   *   10px padding, rounded corners and a 77px minimum height.
   * - `bare`: the component draws no box of its own — no border, no background,
   *   no padding, no minimum height and no minimum width — and sets no font
   *   size, so type is inherited from the container along with the box. The
   *   surrounding container becomes the visible field, which is what a
   *   single-line composer bar needs. Everything else (label, help text, error
   *   ARIA, `autoHeight`, `maxRows`) is unchanged, and focus stays visible
   *   through a `focus-visible` outline drawn on the field itself.
   *
   *   Because the box belongs to the caller in this variant, the error state has
   *   no border to colour: `error` still drives `aria-invalid` and the
   *   `errorMessage` slot, but the caller is responsible for any visual error
   *   affordance on its own container.
   * @default 'default'
   */
  variant?: FzTextareaVariant
  /**
   * Which element draws the focus indicator, in the `bare` variant only.
   *
   * - `field` — the component draws a 2px `blue-600` `focus-visible` outline on
   *   the textarea itself, standing in for the border-colour cue the `default`
   *   variant uses. Nothing is required of the caller.
   * - `container` — the component draws no focus indicator, and the caller
   *   **must** draw one on the box it owns (typically `focus-within:` on that
   *   box). Use this when the field sits inside a padded container, where an
   *   outline on the field falls *inside* the box and reads as a field within a
   *   field.
   *
   * This prop **moves** the obligation, it does not cancel it: a field with no
   * visible focus indicator is a WCAG 2.4.7 (Focus Visible) failure. Pass
   * `container` only together with a focus treatment on your own box — the
   * component cannot verify that you did, which is why the default stays on
   * `field`.
   *
   * Has no effect in the `default` variant, which recolours its own border; a
   * runtime warning is emitted if set there.
   * @default 'field'
   */
  focusAffordance?: FzTextareaFocusAffordance
  /**
   * Controls resize behavior of the textarea
   * @default 'all' — `'none'` when `variant="bare"`, where a resize grabber would
   * break the container that draws the field
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'all'
  /**
   * Number of visible text rows
   * @default 2 — `1` when `variant="bare"`, so a composer bar starts on a single line
   */
  rows?: number
  /**
   * Visible width in average character widths
   */
  cols?: number
  /**
   * Shows success checkmark icon when true
   * @default false
   */
  valid?: boolean
  /**
   * Native minlength constraint
   */
  minlength?: number
  /**
   * Native maxlength constraint
   */
  maxlength?: number
  /**
   * Prevents editing while keeping field focusable and selectable
   * @default false
   */
  readonly?: boolean
  /**
   * Enables automatic height adjustment based on content.
   * The textarea grows as the user types and shrinks when content is removed.
   * Uses `rows` as minimum height and `maxRows` as the ceiling.
   * Vertical resize is disabled when enabled; horizontal resize is preserved.
   *
   * Must be set at mount time — changing at runtime is not supported.
   * @default false
   */
  autoHeight?: boolean
  /**
   * Maximum number of visible rows before scrollbar appears.
   * Only effective when `autoHeight` is true; a runtime warning is
   * emitted if set without `autoHeight`.
   */
  maxRows?: number
}

export { FzTextareaProps, FzTextareaVariant, FzTextareaFocusAffordance }
