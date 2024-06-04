export type FzCardProps = {
  title: string;
  color?: FzCardColor;
  primaryAction?: FzCardButton;
  secondaryAction?: FzCardButton;
  tertiaryAction?: FzCardIconButton;
  contentClass?: string;
};

type FzCardButton = {
  label: string;
  callback: () => void;
};

type FzCardIconButton = {
  icon: string;
  callback: () => void;
};

export enum FzCardColor {
  Blue = "blue",
  Orange = "orange",
  Purple = "purple",
}
