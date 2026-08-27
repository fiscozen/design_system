import { getCurrentScope, onScopeDispose, toValue } from "vue";
import { UseFileSelectOptions, UseFileSelectReturn } from "./types";

/**
 * File selection without the widget.
 *
 * `open()` shows the operating system file picker, `onDrop()` reads files off a
 * drag event, and both hand what they got to `onSelect`. `FzUpload` is built on
 * this; so is any control that needs to pick files without the dashed drop zone
 * — an icon-only clip in a chat composer, say.
 *
 * Nothing has to be rendered for `open()` to work. With no `element` passed the
 * composable creates and owns its own input, so a caller needs neither a hidden
 * `FzUpload` to host the behaviour nor a template ref to reach into it.
 *
 * @example An icon-only trigger, no upload widget in sight.
 * ```ts
 * const { open } = useFileSelect({
 *   multiple: true,
 *   accept: () => props.accept,
 *   onSelect: (files) => emit('attach', files)
 * })
 * ```
 * ```vue
 * <FzIconButton icon-name="paperclip" @click="open" />
 * ```
 */
function useFileSelect(options: UseFileSelectOptions): UseFileSelectReturn {
  /** Created by the first `open()` that needs it, never before. */
  let ownedInput: HTMLInputElement | null = null;

  function onChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files) return;
    const files = [...input.files];
    // Reset before handing the files on: without this, picking the same file
    // twice in a row fires no second `change`.
    input.value = "";
    if (files.length) options.onSelect(files);
  }

  function ownInput() {
    if (ownedInput) return ownedInput;
    if (typeof document === "undefined") return null;
    const input = document.createElement("input");
    input.type = "file";
    input.hidden = true;
    input.addEventListener("change", onChange);
    // Appended rather than left detached: Safari will not open the picker for an
    // input that is not connected to the document. This is the only place in the
    // package that touches the DOM directly, and it is undone on scope dispose.
    document.body.appendChild(input);
    ownedInput = input;
    return ownedInput;
  }

  function open() {
    const provided = toValue(options.element);
    if (provided) {
      // The caller renders it, so the caller binds `multiple` and `accept` too.
      provided.click();
      return;
    }
    const input = ownInput();
    if (!input) return;
    // Re-read on every open, so a picker configured from props or a ref stays
    // in step with them.
    input.multiple = Boolean(toValue(options.multiple));
    input.accept = toValue(options.accept) ?? "";
    input.click();
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const files = [...event.dataTransfer.items]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));
    if (files.length) options.onSelect(files);
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      ownedInput?.removeEventListener("change", onChange);
      ownedInput?.remove();
      ownedInput = null;
    });
  }

  return { open, onChange, onDrop };
}

export { useFileSelect };
