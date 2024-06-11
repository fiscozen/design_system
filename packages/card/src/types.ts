export type FzCardProps = {
  title: string;
  color?: FzCardColor;
  primaryAction?: FzCardButton;
  secondaryAction?: FzCardButton;
  tertiaryAction?: FzCardIconButton;
  contentClass?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
};

type FzCardButton = {
  label: string;
};

type FzCardIconButton = {
  icon: string;
};

export type FzCardColor = "purple" | "orange" | "blue";
