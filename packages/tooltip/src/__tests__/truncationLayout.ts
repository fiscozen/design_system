import { vi } from 'vitest'

const rectOfWidth = (width: number) =>
  ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: 16,
    width,
    height: 16,
    toJSON: () => ({})
  }) as DOMRect

/**
 * Gives a truncated trigger the widths a browser would measure, since jsdom lays
 * nothing out: `box` for the trigger, the element carrying `truncate`, and `content`
 * for every other element, the inline content inside it among them.
 */
export function stubTruncationWidths({ content, box }: { content: number; box: number }) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element
  ) {
    return rectOfWidth(this.classList.contains('truncate') ? box : content)
  })
}
