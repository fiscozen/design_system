type IconVariant = 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fass' | 'fasr' | 'fasl' | 'fast' | 'fak'
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface IconProps {
  name: string | string[];
  size?: IconSize;
  variant?: IconVariant;
  spin?: boolean;
}

export type { IconVariant, IconSize, IconProps }
