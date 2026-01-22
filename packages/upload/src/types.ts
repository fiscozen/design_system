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

export { FzUploadProps };
