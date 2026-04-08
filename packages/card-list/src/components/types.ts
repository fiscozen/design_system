import { FzActionLinkProps, FzActionProps } from "@fiscozen/action";
import { FzBadgeTone } from "@fiscozen/badge";

export type FzCardBadge = {
  text: string;
  tone: FzBadgeTone;
};

export interface FzCardTitleProps {
  showIndicator?: boolean;
  title: string;
  titleId?: string;
}

export interface FzCardHeaderProps extends FzCardTitleProps {
  hasTitleOnly?: boolean;
  value?: string;
}

export interface FzCardListFooterProps {
  descriptions?: string[];
}

export interface FzCardNoActionProps
  extends FzCardHeaderProps, FzCardListFooterProps {
  badge?: FzCardBadge;
}

export interface FzCardSingleActionProps
  extends FzCardHeaderProps, FzCardListFooterProps, FzCardNoActionProps {
  action?: FzActionLinkProps;
}

export interface FzCardSingleActionEmits {
  (event: "fzaction:click", action: FzActionLinkProps): void;
}

export interface FzCardMultiActionsProps
  extends FzCardHeaderProps, FzCardListFooterProps, FzCardNoActionProps {
  actions: FzActionProps[];
}

export interface FzCardMultiActionsEmits {
  (event: "fzaction:click", actionIndex: number, action: FzActionProps): void;
}
