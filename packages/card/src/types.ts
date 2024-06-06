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
};

type FzCardIconButton = {
  icon: string;
};

export enum FzCardColor {
  Blue = "blue",
  Orange = "orange",
  Purple = "purple",
}
