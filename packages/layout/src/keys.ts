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

/**
 * Injection key for the page scroll container.
 *
 * `FzFrameTemplate` owns the app's scroll container — under
 * `contentHeight="scroll"` the window no longer scrolls, the shell's content
 * region does — and `provide()`s that region's element through this key, so app
 * code can scroll the page without knowing the shell's DOM (RFC
 * `frame-shell-promotion.md` §6). Same pattern, and the same reasoning, as
 * `FZ_BOTTOM_BAR_TARGET` above — including the namespaced string rather than a
 * module-scope `Symbol`.
 *
 * Consumer side — scroll the page to the top on a route change:
 *
 * ```ts
 * import { inject } from 'vue'
 * import { FZ_PAGE_SCROLL_TARGET } from '@fiscozen/layout'
 *
 * const pageScroll = inject(FZ_PAGE_SCROLL_TARGET, null)
 * // pageScroll?.value?.scrollTo({ top: 0 })
 * ```
 *
 * The ref is `null` until the region has mounted, and when no shell that owns a
 * scroll container is an ancestor — guard it, so a miss is an explicit,
 * debuggable one rather than a silently ineffective scroll.
 *
 * **The element is provided in both height contracts, but it only *scrolls*
 * under `contentHeight="scroll"`.** Under `bounded` the region clips and hands
 * its height to the page layout inside it, which scrolls its own regions; the
 * provided element's `scrollTop` stays 0 and writing to it does nothing. That is
 * the correct behaviour — a bounded page has no single page scroll — but it is
 * worth knowing before debugging a scroll that "does not work".
 */
export const FZ_PAGE_SCROLL_TARGET = '@fiscozen/layout/pageScrollTarget' as unknown as InjectionKey<
  Readonly<Ref<HTMLElement | null>>
>
