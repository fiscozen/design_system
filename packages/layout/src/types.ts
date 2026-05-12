type FzLayoutProps = {
  layout:
    | "oneColumn"
    | "oneColumnHeader"
    | "twoColumns"
    | "leftShoulder"
    | "multipleAreas"
    | "rightShoulder"
    | "threeColumns";
  isViewport?: boolean;
  hasBottomBar?: boolean;
};

export { FzLayoutProps };
