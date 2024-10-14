type FzUploadProps = {
  /** Unique identifier of the input */
  id?: string;
  /** Name of the input */
  name?: string;
  /** Whether user can upload multiple files at once */
  multiple?: boolean;
  /** Pattern that dictates what files the input accepts */
  accept?: string;
  /** Size of the component */
  size?: "sm" | "md";
  /** Label of the file uploading button */
  buttonLabel?: string;
  /** Label of the drag and drop zone */
  dragAndDropLabel?: string;
};

export { FzUploadProps };
