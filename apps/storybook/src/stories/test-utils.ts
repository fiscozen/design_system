/**
 * Shared test helper utilities for Storybook play functions.
 * 
 * These utilities help avoid common testing anti-patterns and ensure
 * consistent test behavior across stories per testing-standards.mdc.
 */

import { expect, within, waitFor, userEvent } from 'storybook/test'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

// ============================================
// ELEMENT QUERY HELPERS
// ============================================

/**
 * Asserts an element exists and returns it, failing early if not found.
 * Use this to reduce nesting by handling null checks upfront.
 * 
 * @example
 * const button = assertElementExists(
 *   canvas.queryByRole('button'),
 *   'Button should be present'
 * )
 * // button is now guaranteed to be non-null
 */
export function assertElementExists<T extends Element>(
  element: T | null,
  errorMessage: string
): T {
  if (!element) {
    throw new Error(errorMessage)
  }
  return element
}

/**
 * Queries for an element and throws if not found.
 * Useful for early guard patterns.
 * 
 * @example
 * const link = requireElement(
 *   canvasElement,
 *   'a[href="#/foo"]',
 *   'Navigation link'
 * )
 */
export function requireElement<T extends Element = Element>(
  container: HTMLElement,
  selector: string,
  description: string
): T {
  const element = container.querySelector<T>(selector)
  if (!element) {
    throw new Error(`${description} not found using selector: ${selector}`)
  }
  return element
}

// ============================================
// BUTTON TEST HELPERS
// ============================================

/**
 * Common verification steps for icon button grids (backoffice/frontoffice rows).
 * Reduces duplication in IconButton stories.
 */
export async function verifyIconButtonGrid(
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  step: PlayFunctionContext['step']
) {
  await step('Verify all buttons render', async () => {
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(8)
  })

  await step('Verify backoffice buttons have correct height', async () => {
    const buttons = canvas.getAllByRole('button')
    for (let i = 0; i < 4; i++) {
      await expect(buttons[i].classList.contains('h-32')).toBe(true)
    }
  })

  await step('Verify frontoffice buttons have correct height', async () => {
    const buttons = canvas.getAllByRole('button')
    for (let i = 4; i < 8; i++) {
      await expect(buttons[i].classList.contains('h-44')).toBe(true)
    }
  })

  await step('Verify notification badges are present', async () => {
    const badges = canvasElement.querySelectorAll('div[aria-hidden="true"]')
    await expect(badges.length).toBe(4)
  })

  await step('Verify disabled states', async () => {
    const buttons = canvas.getAllByRole('button')
    // 3rd and 4th button in each row should be disabled
    await expect(buttons[2].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[3].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[6].getAttribute('aria-disabled')).toBe('true')
    await expect(buttons[7].getAttribute('aria-disabled')).toBe('true')
  })
}

/**
 * Verifies click handlers for enabled/disabled button sets.
 * Implements robust verification per testing-standards.mdc.
 */
export async function verifyButtonClickHandlers(
  canvas: ReturnType<typeof within>,
  args: { onClick: { mockClear: () => void } },
  step: PlayFunctionContext['step'],
  userEvent: typeof import('@storybook/test').userEvent
) {
  await step('Verify enabled buttons call click handler', async () => {
    const buttons = canvas.getAllByRole('button')
    const enabledButtons = [buttons[0], buttons[1], buttons[4], buttons[5]]
    
    args.onClick.mockClear()
    
    for (const button of enabledButtons) {
      await userEvent.click(button)
    }
    
    await expect(args.onClick).toHaveBeenCalledTimes(4)
  })

  await step('Verify disabled buttons do NOT call click handler', async () => {
    const buttons = canvas.getAllByRole('button')
    const disabledButtons = [buttons[2], buttons[3], buttons[6], buttons[7]]
    
    args.onClick.mockClear()
    
    for (const button of disabledButtons) {
      await userEvent.click(button)
    }
    
    await expect(args.onClick).not.toHaveBeenCalled()
  })
}

// ============================================
// COLLAPSE/DETAILS TEST HELPERS  
// ============================================

/**
 * Verifies collapse open/close behavior with proper async handling.
 * Uses waitFor instead of setTimeout per testing-standards.mdc.
 */
export async function verifyCollapseToggle(
  canvasElement: HTMLElement,
  step: PlayFunctionContext['step'],
  userEvent: typeof import('@storybook/test').userEvent,
  args?: { 'onUpdate:open': { mockClear: () => void; toHaveBeenLastCalledWith: (v: boolean) => void } }
) {
  await step('Toggle collapse open', async () => {
    const summary = requireElement(canvasElement, 'summary', 'Collapse summary')
    
    if (args) {
      args['onUpdate:open'].mockClear()
    }
    
    await userEvent.click(summary)
    
    await waitFor(() => {
      const details = canvasElement.querySelector('details')
      expect(details).toHaveAttribute('open')
    }, { timeout: 500 })
  })
}

// ============================================
// LAYOUT TEST HELPERS
// ============================================

/**
 * Verifies a layout area exists and is visible.
 * Reduces repetitive layout area checks.
 */
export async function verifyLayoutArea(
  canvasElement: HTMLElement,
  areaClass: string,
  areaName: string
): Promise<HTMLElement> {
  const area = canvasElement.querySelector(`.fz-layout__${areaClass}`)
  await expect(area).toBeInTheDocument()
  await expect(area).toBeVisible()
  return area as HTMLElement
}

// ============================================
// ACCESSIBILITY HELPERS
// ============================================

/**
 * Verifies disabled state attributes for a button element.
 */
export async function verifyDisabledState(
  button: HTMLElement,
  useAriaDisabled = true
) {
  if (useAriaDisabled) {
    await expect(button).toHaveAttribute('aria-disabled', 'true')
  }
  await expect(button).toBeDisabled()
}

// ============================================
// TRUNCATED LABEL HELPERS
// ============================================

/** A label too long for a 200px field, shared by the `truncateLabel` stories. */
export const LONG_FIELD_LABEL = 'Data di versamento dell’imposta sostitutiva'

/**
 * Verifies a row of fields rendered with `truncateLabel`, one of which carries
 * {@link LONG_FIELD_LABEL}: the controls stay aligned, the long field keeps its
 * full label as accessible name, and the cut label shows in full in a tooltip on
 * hover and while the field has keyboard focus, until Escape dismisses it.
 *
 * @param controls - the row's controls, in order
 * @param longControl - the control whose label is {@link LONG_FIELD_LABEL}, first tab stop of the canvas
 */
export async function verifyTruncatedLabelRow(
  { canvasElement, step }: Pick<PlayFunctionContext, 'canvasElement' | 'step'>,
  controls: HTMLElement[],
  longControl: HTMLElement
) {
  const canvas = within(canvasElement)

  await step('the controls stay aligned and share the row equally', async () => {
    const boxes = controls.map((control) => control.getBoundingClientRect())
    await expect(new Set(boxes.map((box) => Math.round(box.top))).size).toBe(1)
    await expect(new Set(boxes.map((box) => Math.round(box.width))).size).toBe(1)
  })

  await step('the field keeps its full label as accessible name', async () => {
    const labelId = longControl.getAttribute('aria-labelledby') ?? ''
    await expect(canvasElement.querySelector(`[id="${labelId}"]`)).toHaveTextContent(LONG_FIELD_LABEL)
  })

  await step('hovering the cut label shows it in full', async () => {
    await userEvent.hover(canvas.getByText(LONG_FIELD_LABEL))
    await waitFor(() =>
      expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toHaveTextContent(LONG_FIELD_LABEL)
    )
  })

  await step('tabbing into the field shows the cut label in full', async () => {
    await userEvent.unhover(canvas.getByText(LONG_FIELD_LABEL))
    await waitFor(() => expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toBeNull())

    await userEvent.tab()

    await expect(longControl).toHaveFocus()
    await waitFor(() =>
      expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toHaveTextContent(LONG_FIELD_LABEL)
    )
  })

  await step('Escape hides the label tooltip and keeps focus on the field', async () => {
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toBeNull())
    await expect(longControl).toHaveFocus()
  })
}

// ============================================
// LABEL ASIDE HELPERS
// ============================================

/** The `labelAside` text shared by the `labelAside` stories. */
export const LABEL_ASIDE = 'calcolato 971,65'

/** The nearest ancestor of `element` that clips its overflow, if any. */
function clipOf(element: HTMLElement): HTMLElement | null {
  let clip = element.parentElement
  while (clip && getComputedStyle(clip).overflowX === 'visible') {
    clip = clip.parentElement
  }
  return clip
}

/** Whether the text of `element` is wider than the nearest ancestor that clips it. */
function isTextCut(element: HTMLElement): boolean {
  const clip = clipOf(element)
  return clip !== null && element.getBoundingClientRect().width > clip.getBoundingClientRect().width
}

/** Whether `element` shows its whole text on a single line, neither clipped by itself nor wrapped. */
function isWholeOnOneLine(element: HTMLElement): boolean {
  const isUnclipped = element.scrollWidth <= element.clientWidth
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
  return isUnclipped && element.getBoundingClientRect().height < lineHeight * 1.5
}

/** A field's control with the label and the label aside it references. */
interface LabelRow {
  control: HTMLElement
  label: HTMLElement
  aside: HTMLElement
}

/** The control, its label and its label aside, found through the control's ARIA references. */
function labelRowOf(control: HTMLElement): LabelRow {
  return {
    control,
    label: document.getElementById(control.getAttribute('aria-labelledby') ?? '') as HTMLElement,
    aside: document.getElementById(control.getAttribute('aria-describedby') ?? '') as HTMLElement
  }
}

/** The box of the field: the nearest ancestor holding both the control and its label. */
function fieldBoxOf({ control, label }: LabelRow): DOMRect {
  let field = control.parentElement as HTMLElement
  while (!field.contains(label)) {
    field = field.parentElement as HTMLElement
  }
  return field.getBoundingClientRect()
}

const shownTooltipTexts = () =>
  Array.from(document.querySelectorAll('[role="tooltip"][aria-hidden="false"]')).map(
    (tooltip) => tooltip.textContent ?? ''
  )

/**
 * Verifies six fields rendered with {@link LABEL_ASIDE}, in this order: a short
 * label; {@link LONG_FIELD_LABEL} with `truncateLabel`; {@link LONG_FIELD_LABEL}
 * without it; then, side by side in half the width, {@link LONG_FIELD_LABEL} and a
 * short label, both with `truncateLabel`; last, {@link LONG_FIELD_LABEL} with
 * `truncateLabel` in a field narrower than twelve characters.
 *
 * @param controls - the controls of the six fields, in order
 */
export async function verifyLabelAsideFields(
  { step }: Pick<PlayFunctionContext, 'step'>,
  controls: HTMLElement[]
) {
  const rows = controls.map(labelRowOf)
  const [short, truncated, wrapped, halfLong, halfShort, narrow] = rows

  await step('each field is described by its label aside', async () => {
    const descriptions = rows.map((row) => row.aside.textContent)
    await expect(descriptions).toEqual(Array(6).fill(LABEL_ASIDE))
  })

  await step('a short label leaves the aside whole, on its right', async () => {
    await expect(isWholeOnOneLine(short.aside)).toBe(true)
    await expect(short.aside.getBoundingClientRect().left).toBeGreaterThan(short.label.getBoundingClientRect().right)
  })

  await step('with truncateLabel a long label is cut before the aside', async () => {
    await expect(isTextCut(truncated.label)).toBe(true)
    await expect(isTextCut(truncated.aside)).toBe(false)
  })

  await step('without truncateLabel a long label wraps and the aside stays on its first line', async () => {
    const lineHeight = short.label.getBoundingClientRect().height
    const label = wrapped.label.getBoundingClientRect()
    await expect(label.height).toBeGreaterThan(lineHeight * 1.5)
    await expect(wrapped.aside.getBoundingClientRect().top).toBeLessThan(label.top + lineHeight)
    await expect(isWholeOnOneLine(wrapped.aside)).toBe(true)
  })

  await step('in a half-width field a long label is cut down to its minimum, then the aside', async () => {
    await expect(isTextCut(halfLong.label)).toBe(true)
    await expect(isTextCut(halfLong.aside)).toBe(true)
  })

  await step('in a half-width field a short label leaves the aside whole', async () => {
    await expect(isTextCut(halfShort.label)).toBe(false)
    await expect(isTextCut(halfShort.aside)).toBe(false)
  })

  await step('in a field narrower than twelve characters the label is cut inside the field', async () => {
    const visibleLabel = (clipOf(narrow.label) as HTMLElement).getBoundingClientRect()
    await expect(isTextCut(narrow.label)).toBe(true)
    await expect(visibleLabel.right).toBeLessThanOrEqual(fieldBoxOf(narrow).right)
  })

  await step('hovering a cut aside shows it in full', async () => {
    await userEvent.hover(halfLong.aside)
    await waitFor(() =>
      expect(document.querySelector('[role="tooltip"][aria-hidden="false"]')).toHaveTextContent(LABEL_ASIDE)
    )
    await userEvent.unhover(halfLong.aside)
    await waitFor(() => expect(shownTooltipTexts()).toEqual([]))
  })

  await step('focusing a field with a cut aside shows it in full, leaving it hides it', async () => {
    halfLong.control.focus()
    await waitFor(() => expect(shownTooltipTexts()).toContainEqual(expect.stringContaining(LABEL_ASIDE)))
    halfLong.control.blur()
    await waitFor(() => expect(shownTooltipTexts()).toEqual([]))
  })
}
