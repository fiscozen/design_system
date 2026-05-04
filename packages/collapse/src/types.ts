import type { InjectionKey } from 'vue'

export type FzCollapseVariant = 'button' | 'section'

export interface FzCollapseProps {
  title?: string
  subtitle?: string
  icon?: string
  /** CSS class applied to the leading icon (default: `'text-blue-500'`) */
  iconClass?: string
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

/**
 * Injection key for the accordion context provided by FzAccordion to its
 * FzCollapse children.
 *
 * Uses a namespaced primitive string rather than `Symbol(...)` so the key
 * stays value-equal across module instances. This matters in Vite dev mode
 * when consuming apps exclude `@fiscozen/*` packages from optimizeDeps and
 * the same `.ts` file may be loaded as multiple module instances. The cast
 * preserves the typed `InjectionKey<T>` API at provide/inject call sites.
 */
export const ACCORDION_KEY = '@fiscozen/collapse/Accordion' as unknown as InjectionKey<AccordionContext>
