type FzPdfViewerProps = {
  /**
   * The source of the PDF file.
   */
  src: string;
  /**
   * The environment variant for sizing. "frontoffice" is smaller, "backoffice" is larger.
   * Default is "frontoffice".
   */
  environment?: "frontoffice" | "backoffice";
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
  /**
   * When true, renders an invisible text layer over the PDF canvas that allows users to select and copy text.
   * Drag-to-pan remains active when clicking on the canvas background; clicking on text initiates native
   * browser selection instead.
   * Default is false.
   */
  selectable?: boolean;
  /**
   * When true, shows a rotate button in the advanced toolbar that lets the user rotate the PDF by 90° steps.
   * Only applies when toolbarVariant is "advanced". Default is false.
   * Note: "rotatable" is a valid English word (capable of being rotated), not a typo.
   */
  rotatable?: boolean;
  /**
   * The source of the XML file. When provided alongside toolbarVariant="advanced", enables the PDF/XML
   * view mode toggle. In XML mode, the XML is rendered in an iframe and zoom/page controls are hidden.
   */
  xmlSrc?: string;
  /**
   * Accessible label for the "previous page" button. Default: "Pagina precedente".
   */
  prevPageLabel?: string;
  /**
   * Accessible label for the "next page" button. Default: "Pagina successiva".
   */
  nextPageLabel?: string;
  /**
   * Accessible label for the "zoom in" button. Default: "Aumenta zoom".
   */
  zoomInLabel?: string;
  /**
   * Accessible label for the "zoom out" button. Default: "Riduci zoom".
   */
  zoomOutLabel?: string;
};

export { FzPdfViewerProps };
