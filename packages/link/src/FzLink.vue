<script setup lang="ts">
/**
 * FzLink Component
 *
 * Flexible link component supporting internal routing (vue-router) and external navigation.
 * Automatically renders as router-link for internal routes, anchor tag for external URLs,
 * or non-interactive span when disabled. Provides consistent styling and accessibility.
 *
 * TypeScript enforces correct prop types:
 * - Internal links (external=false or undefined): to accepts RouteLocationRaw (string or object)
 * - External links (external=true): to must be a string URL
 *
 * @component
 * @example
 * <FzLink to="/dashboard" size="md">Go to Dashboard</FzLink>
 * 
 * @example
 * <FzLink :to="{ name: 'user', params: { id: 123 }}">User Profile</FzLink>
 * 
 * @example
 * <FzLink to="https://example.com" external target="_blank">External Site</FzLink>
 */
import { computed } from 'vue'
import { FzLinkProps } from './types'

const props = withDefaults(defineProps<FzLinkProps>(), {
  type: 'default',
  linkStyle: 'default',
  size: 'lg',
  disabled: false,
  replace: false,
  external: false
})

/**
 * Base classes shared between link and disabled span states.
 * 
 * Includes size-based text classes and conditional underline styling.
 * Border classes provide consistent spacing for focus indicators.
 */
const commonClass = computed(() => [
  'border-1 border-transparent inline-block',
  {
    'text-xs': props.size === 'xs',
    'text-sm': props.size === 'sm',
    'text-md': props.size === 'md',
    'text-lg': props.size === 'lg',
    underline: props.linkStyle === 'underline'
  }
])

/**
 * CSS classes for interactive link states (router-link and anchor).
 * 
 * Combines common classes with type-specific color schemes and hover effects.
 * Always includes hover:underline for consistent interaction feedback.
 */
const linkClass = computed(() => [
  ...commonClass.value,
  'hover:underline',
  {
    'text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:border-blue-600':
      props.type === 'default',
    'text-semantic-error hover:text-red-600 focus:text-red-600 focus:border-red-600':
      props.type === 'danger'
  }
])

/**
 * CSS classes for disabled link state (rendered as span).
 * 
 * Uses muted color variants of type colors and cursor-not-allowed
 * to clearly indicate non-interactive state.
 */
const spanClass = computed(() => [
  ...commonClass.value,
  'cursor-not-allowed',
  {
    'text-red-200': props.type === 'danger',
    'text-blue-200': props.type === 'default'
  }
])

/**
 * Href value for external links.
 * 
 * When external is true, TypeScript guarantees to is a string.
 * This computed ensures type safety in the template.
 */
const externalHref = computed(() => {
  if (props.external) {
    // TypeScript narrows to to string when external is true
    return props.to as string
  }
  return ''
})

/**
 * Rel attribute for external links with target="_blank".
 * 
 * Adds security attributes (noopener noreferrer) when opening links in new tab
 * to prevent security vulnerabilities and improve privacy.
 */
const externalRel = computed(() => {
  if (props.external && props.target === '_blank') {
    return 'noopener noreferrer'
  }
  return undefined
})
</script>

<template>
  <span
    v-if="disabled"
    :class="spanClass"
    :aria-disabled="disabled ? 'true' : 'false'"
    role="link"
    aria-label="Link disabled"
  >
    <slot></slot>
  </span>
  <a
    v-else-if="external"
    :href="externalHref"
    :class="linkClass"
    :target="target"
    :rel="externalRel"
  >
    <slot></slot>
  </a>
  <router-link
    v-else
    :to="to"
    :replace="replace"
    :class="linkClass"
    :target="target"
  >
    <slot></slot>
  </router-link>
</template>