type FzPdfViewerProps = {
  /**
   * The source of the PDF file.
   */
  src: string;
  /**
   * The size of the pdf-viewer. Possible values are "sm" or "md"
   */
  size?: "sm" | "md";
  /**
   * The height of the PDF container.
   */
  height?: string;
  /**
   * The width of the PDF container.
   */
  width?: string;
  /**
   * Maximum scale of the PDF. Rapresented as a number (1 = 100%, 2 = 200%, etc.). Default is 2.
   */
  maxScale?: number;
  /**
   * Minimum scale of the PDF. Rapresented as a number (1 = 100%, 2 = 200%, etc.). Default is 0.25.
   */
  minScale?: number;
  /**
   * Scale step of the PDF. Rapresented as a number (1 = 100%, 2 = 200%, etc.). Default is 0.25.
   */
  scaleStep?: number;
  /**
   * Starting scale of the PDF. Rapresented as a number (1 = 100%, 2 = 200%, etc.). Default is 1.
   */
  initialScale?: number;
  /**
   * Starting page of the PDF. Default is 1.
   */
  initialPage?: number;
  /**
   * Custom css class for the PDF container
   */
  pdfContainerClass?: string;
  /**
   * Custom css class for the main container
   */
  containerClass?: string;
  /**
   * The toolbar variant. "basic" shows zoom and page navigation. "advanced" adds view mode toggle, download, and reset.
   * Default is "basic".
   */
  toolbarVariant?: "basic" | "advanced";
  /**
   * The position of the toolbar relative to the PDF. When set to "top", the toolbar is only revealed on hover.
   * Default is "bottom".
   */
  toolbarPosition?: "top" | "bottom";
};

export { FzPdfViewerProps };
