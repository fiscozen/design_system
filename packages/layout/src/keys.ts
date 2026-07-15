import type { InjectionKey, Ref } from 'vue'

/**
 * Injection key for the bottom-bar teleport target.
 *
 * `FzAppTemplate` owns a bottom-bar region (`FzLayoutBottomBar`) and `provide()`s
 * that region's root element through this key, so deep page components can render
 * bottom-bar content at the shell level without the app owning a magic DOM id
 * (RFC §4 bottom-bar ADR, decision D1).
 *
 * Consumer side — a component anywhere inside the template teleports into it:
 *
 * ```ts
 * import { inject } from 'vue'
 * import { FZ_BOTTOM_BAR_TARGET } from '@fiscozen/layout'
 *
 * const bottomBarTarget = inject(FZ_BOTTOM_BAR_TARGET, null)
 * // <Teleport v-if="bottomBarTarget" :to="bottomBarTarget" defer> … </Teleport>
 * ```
 *
 * The ref is `null` until the template has mounted its region, and when no
 * `FzAppTemplate` is an ancestor — guard the `null` case (which turns a
 * would-be silent teleport soft-fail into an explicit, debuggable miss).
 *
 * A namespaced string (cast to `InjectionKey`) is used rather than a
 * module-scope `Symbol`, per the repo's provide/inject convention: strings are
 * value-equal across duplicate module instances, symbols are not (see the root
 * `CLAUDE.md` "Container component slot identification" note).
 */
export const FZ_BOTTOM_BAR_TARGET = '@fiscozen/layout/bottomBarTarget' as unknown as InjectionKey<
  Readonly<Ref<HTMLElement | null>>
>
