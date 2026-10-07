import { watch } from "vue";
import type { Ref } from "vue";

const TEXT_LAYER_SELECTOR = ".textLayer";
const SENTINEL_SELECTOR = ".endOfContent";
const SELECTING_CLASS = "selecting";

/** Text layer element mapped to its `.endOfContent` sentinel. */
type TextLayers = Map<HTMLElement, HTMLElement>;

/**
 * Text layers rendered inside `container`, each with its sentinel. VuePDF rebuilds the
 * layer on every page or zoom change, so it is looked up per event and never cached.
 */
function findTextLayers(container: HTMLElement): TextLayers {
  const layers: TextLayers = new Map();
  container
    .querySelectorAll<HTMLElement>(TEXT_LAYER_SELECTOR)
    .forEach((layer) => {
      const sentinel = layer.querySelector<HTMLElement>(SENTINEL_SELECTOR);
      if (sentinel) layers.set(layer, sentinel);
    });
  return layers;
}

/** Puts the sentinel back at the end of its layer and leaves the selecting state. */
function resetSentinel(sentinel: HTMLElement, layer: HTMLElement) {
  layer.append(sentinel);
  sentinel.style.width = "";
  sentinel.style.height = "";
  layer.classList.remove(SELECTING_CLASS);
}

function selectionRanges(selection: Selection): Range[] {
  return Array.from({ length: selection.rangeCount }, (_, index) =>
    selection.getRangeAt(index),
  );
}

/** Keeps `.selecting` on the layers the selection crosses and resets the others. */
function markSelectingLayers(layers: TextLayers, ranges: Range[]) {
  layers.forEach((sentinel, layer) => {
    const isCrossed = ranges.some((range) => range.intersectsNode(layer));
    if (isCrossed) {
      layer.classList.add(SELECTING_CLASS);
    } else {
      resetSentinel(sentinel, layer);
    }
  });
}

/** Whether `range` has the same start and end as `previous`. */
function isSameRange(range: Range, previous: Range | undefined): boolean {
  if (!previous) return false;
  const startUnchanged =
    range.compareBoundaryPoints(Range.START_TO_START, previous) === 0;
  const endUnchanged =
    range.compareBoundaryPoints(Range.END_TO_END, previous) === 0;
  return startUnchanged && endUnchanged;
}

/**
 * Whether the last change moved the start of the selection: the end did not move, or the
 * new end sits where the previous start was (a backward drag crossing its anchor).
 */
function isStartMoving(range: Range, previous: Range | undefined): boolean {
  if (!previous) return false;
  const endUnchanged =
    range.compareBoundaryPoints(Range.END_TO_END, previous) === 0;
  const endOnPreviousStart =
    range.compareBoundaryPoints(Range.START_TO_END, previous) === 0;
  return endUnchanged || endOnPreviousStart;
}

/** Closest preceding node, climbing through ancestors, that has child nodes. */
function previousNodeWithContent(node: Node): Node | null {
  let current: Node | null = node;
  do {
    while (current && !current.previousSibling) current = current.parentNode;
    current = current?.previousSibling ?? null;
  } while (current && !current.hasChildNodes());
  return current;
}

/**
 * Element at the moving boundary of the selection. A range ending at offset 0 of a node
 * visually ends on the text before it, so the boundary walks back to that text.
 */
function movingBoundaryNode(range: Range, startMoving: boolean): Node | null {
  const container = startMoving ? range.startContainer : range.endContainer;
  const isText = container.nodeType === Node.TEXT_NODE;
  const boundary = isText ? container.parentNode : container;
  if (startMoving || range.endOffset !== 0 || !boundary) return boundary;
  return previousNodeWithContent(boundary);
}

/**
 * Moves the sentinel of the layer holding `boundary` in front of `reference`, sized to the
 * whole layer: the pointer then hovers the sentinel in the gaps between the absolutely
 * positioned spans, instead of letting the browser resolve the selection focus to an
 * arbitrary DOM position elsewhere in the layer.
 */
function placeSentinel(
  layers: TextLayers,
  boundary: Node,
  reference: Node | null,
) {
  const parent = boundary.parentElement;
  const layer = parent?.closest<HTMLElement>(TEXT_LAYER_SELECTOR);
  const sentinel = layer ? layers.get(layer) : undefined;
  if (!parent || !layer || !sentinel) return;
  sentinel.style.width = layer.style.width;
  sentinel.style.height = layer.style.height;
  sentinel.style.userSelect = "text";
  parent.insertBefore(sentinel, reference);
}

/**
 * Firefox resolves the selection in the gaps by itself, and pdf.js leaves the sentinel
 * alone there; it is recognised by its `-moz-user-select` property.
 */
function hasMozUserSelectNone(layer: HTMLElement): boolean {
  const style = getComputedStyle(layer);
  return style.getPropertyValue("-moz-user-select") === "none";
}

/**
 * Selected text when the selection crosses a text layer of `container`, normalised like the
 * pdf.js viewer does on copy; `null` when the selection is elsewhere.
 */
function selectedLayerText(container: HTMLElement): string | null {
  const selection = document.getSelection();
  if (!selection?.rangeCount) return null;
  const ranges = selectionRanges(selection);
  const layers = Array.from(container.querySelectorAll(TEXT_LAYER_SELECTOR));
  const crossesLayer = ranges.some((range) =>
    layers.some((layer) => range.intersectsNode(layer)),
  );
  if (!crossesLayer) return null;
  return selection.toString().normalize("NFKC").replace(/\0/g, "");
}

/** Enters the selecting state on mousedown in a layer, and owns copies from a layer. */
function bindLayerListeners(container: HTMLElement, signal: AbortSignal) {
  const startSelecting = (event: MouseEvent) => {
    const target = event.target as Element | null;
    target?.closest?.(TEXT_LAYER_SELECTOR)?.classList.add(SELECTING_CLASS);
  };
  const copySelection = (event: ClipboardEvent) => {
    const text = selectedLayerText(container);
    if (text === null || !event.clipboardData) return;
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
  };
  container.addEventListener("mousedown", startSelecting, { signal });
  container.addEventListener("copy", copySelection, { signal });
}

/** Resets every layer when the drag ends, the window loses focus, or a key edits the selection. */
function bindResetListeners(container: HTMLElement, signal: AbortSignal) {
  let isPointerDown = false;
  const resetAll = () => findTextLayers(container).forEach(resetSentinel);
  const releasePointer = () => {
    isPointerDown = false;
    resetAll();
  };
  const pressPointer = () => {
    isPointerDown = true;
  };
  const releaseKey = () => {
    if (!isPointerDown) resetAll();
  };
  document.addEventListener("pointerdown", pressPointer, { signal });
  document.addEventListener("pointerup", releasePointer, { signal });
  window.addEventListener("blur", releasePointer, { signal });
  document.addEventListener("keyup", releaseKey, { signal });
}

/** Keeps the sentinel next to the moving boundary of the selection while it changes. */
function bindSelectionTracking(container: HTMLElement, signal: AbortSignal) {
  let previousRange: Range | undefined;
  let isFirefox: boolean | undefined;
  const followSelection = () => {
    const selection = document.getSelection();
    const layers = findTextLayers(container);
    const ranges = selection ? selectionRanges(selection) : [];
    markSelectingLayers(layers, ranges);
    const [firstLayer] = layers.keys();
    if (!firstLayer || ranges.length === 0) return;
    isFirefox ??= hasMozUserSelectNone(firstLayer);
    if (isFirefox) return;
    const range = ranges[0];
    // Chrome fires selectionchange with an unchanged range; isStartMoving would read it as a
    // moving start and put the sentinel in front of the word, where the next pointer move
    // lands and collapses the selection.
    if (isSameRange(range, previousRange)) return;
    const startMoving = isStartMoving(range, previousRange);
    const boundary = movingBoundaryNode(range, startMoving);
    if (boundary) {
      placeSentinel(
        layers,
        boundary,
        startMoving ? boundary : boundary.nextSibling,
      );
    }
    previousRange = range.cloneRange();
  };
  document.addEventListener("selectionchange", followSelection, { signal });
}

/**
 * Brings the text selection handling of the pdf.js viewer (`TextLayerBuilder`) to the text
 * layer VuePDF renders inside `container`, which ships the `.endOfContent` sentinel and its
 * CSS but nothing that moves it. Without it, dragging past the end of a line selects
 * unrelated lines. Active while `enabled` is true and the container is mounted.
 */
export function useTextLayerSelection(
  container: Ref<HTMLElement | undefined>,
  enabled: Ref<boolean>,
) {
  watch(
    [container, enabled],
    ([element, isEnabled], _previous, onCleanup) => {
      if (!element || !isEnabled) return;
      const controller = new AbortController();
      bindLayerListeners(element, controller.signal);
      bindResetListeners(element, controller.signal);
      bindSelectionTracking(element, controller.signal);
      onCleanup(() => controller.abort());
    },
    { immediate: true },
  );
}
