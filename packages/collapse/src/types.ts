import type { InjectionKey } from 'vue'

export type FzCollapseVariant = 'button' | 'section'

export interface FzCollapseProps {
  title?: string
  subtitle?: string
  icon?: string
  variant?: FzCollapseVariant
  headerClass?: string
  contentClass?: string
}

export interface FzAccordionProps {
  multiple?: boolean
  ariaLabel?: string
}

export interface AccordionContext {
  register: (id: string, close: () => void) => void
  unregister: (id: string) => void
  notifyOpen: (id: string) => void
}

export const ACCORDION_KEY: InjectionKey<AccordionContext> = Symbol('FzAccordion')
