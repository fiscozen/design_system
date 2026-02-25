type IconVariant = 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fass' | 'fasr' | 'fasl' | 'fast' | 'fak'
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface IconProps {
  name: string | string[];
  size?: IconSize;
  variant?: IconVariant;
  spin?: boolean;
}

interface IconBackgroundProps extends IconProps {
  backgroundColor?: string;
}

export type { IconVariant, IconSize, IconProps, IconBackgroundProps }
