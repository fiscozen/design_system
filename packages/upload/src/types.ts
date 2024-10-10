type FzUploadProps = {
  /** Unique identifier of the input */
  id?: string;
  /** Name of the input */
  name?: string;
  /** Whether user can upload multiple files at once */
  multiple?: boolean;
  /** Pattern that dictates what files the input accepts */
  accept?: string;
};

export { FzUploadProps };
