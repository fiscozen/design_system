import { getCurrentInstance } from "vue";

/**
 * A DOM id that is unique across the whole document, for ids that something else
 * resolves — `popovertarget`, `aria-labelledby`.
 *
 * Deliberately NOT `useId()`: that is scoped to the Vue *app*, and a document can
 * hold several (Storybook docs mode mounts one app per story; an app can have
 * several mount points), each handing out `v-0` again. Duplicated ids fail
 * silently in whoever resolves them — `popovertarget` toggles the first match, so
 * an ellipsis button opens another card's menu; `aria-labelledby` resolves to the
 * first match, so a screen reader announces another card's title. `uid` is a
 * counter inside the Vue runtime itself, shared across apps.
 *
 * `useId()` would be the better choice for SSR (it is built to survive
 * hydration); this package has no SSR target, so document uniqueness wins.
 *
 * Call from `setup()` — it needs the current instance.
 */
export function useUniqueId(prefix: string): string {
  return `${prefix}-${getCurrentInstance()!.uid}`;
}

