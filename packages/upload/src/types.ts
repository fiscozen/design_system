import type { MaybeRefOrGetter, VNode } from "vue";

type FzUploadProps = {
  /** Unique identifier of the input */
  id?: string;
  /** Name of the input */
  name?: string;
  /** Whether user can upload multiple files at once */
  multiple?: boolean;
  /** Maximum number of files that can be uploaded */
  fileLimit?: number;
  /** Pattern that dictates what files the input accepts */
  accept?: string;
  /** Size of the component */
  size?: "sm" | "md";
  /** Label of the file uploading button */
  buttonLabel?: string;
  /** Label of the drag and drop zone */
  dragAndDropLabel?: string;
  /** Enable the scrollable filelist container. It will set a max-height of 82px and enable the overflow of the container */
  isScrollable?: boolean;
};

type FzUploadSlots = {
  /**
   * Use this to replace the button that opens the file picker. Call `open` to
   * open it; the drop zone around the slot keeps working either way.
   *
   * When the trigger cannot live inside the component at all — an icon-only
   * control elsewhere in a toolbar, say — reach for `useFileSelect` instead of
   * rendering a hidden `FzUpload`.
   */
  opener(props: { open: () => void }): VNode | VNode[];
};

type UseFileSelectOptions = {
  /**
   * Called with the files the user picked or dropped. Never called with an
   * empty list.
   */
  onSelect: (files: File[]) => void;
  /** Whether the picker accepts more than one file. Re-read on every `open()`. */
  multiple?: MaybeRefOrGetter<boolean | undefined>;
  /**
   * Pattern that dictates what files the picker accepts. Re-read on every
   * `open()`.
   */
  accept?: MaybeRefOrGetter<string | undefined>;
  /**
   * An `input type="file"` the caller already renders, if there is one. Leave it
   * out and the composable creates and owns a detached input, which is what lets
   * `open()` work with no visible affordance at all.
   *
   * When it is provided, `multiple` and `accept` are the caller's business —
   * they are bound in the caller's template, so `open()` does not touch them.
   */
  element?: MaybeRefOrGetter<HTMLInputElement | null | undefined>;
};

type UseFileSelectReturn = {
  /** Opens the operating system file picker. */
  open: () => void;
  /** `change` handler for a caller-rendered input: `@change="onChange"`. */
  onChange: (event: Event) => void;
  /** `drop` handler for a drop target. Pair it with `@dragover.prevent`. */
  onDrop: (event: DragEvent) => void;
};

export {
  FzUploadProps,
  FzUploadSlots,
  UseFileSelectOptions,
  UseFileSelectReturn,
};
