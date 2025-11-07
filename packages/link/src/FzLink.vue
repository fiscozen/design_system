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
  size: 'md',
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
    'text-sm leading-xs': props.size === 'sm',
    'text-base leading-base': props.size === 'md',
    underline: props.linkStyle === 'underline'
  }
])

/**
 * Helper functions to identify UI states.
 * 
 * These functions explicitly describe when each UI representation should be applied,
 * making the component logic more declarative and maintainable.
 */
const isDefaultUnderline = (p: typeof props) => p.type === 'default' && p.linkStyle === 'underline'
const isDefaultNoUnderline = (p: typeof props) => p.type === 'default' && p.linkStyle !== 'underline'
const isDangerUnderline = (p: typeof props) => p.type === 'danger' && p.linkStyle === 'underline'
const isDangerNoUnderline = (p: typeof props) => p.type === 'danger' && p.linkStyle !== 'underline'
const isDefaultDisabled = (p: typeof props) => p.type === 'default' && p.disabled
const isDangerDisabled = (p: typeof props) => p.type === 'danger' && p.disabled

/**
 * CSS classes for interactive link states (router-link and anchor).
 */
const linkClass = computed(() => {
  const baseClasses = [...commonClass.value]
  
  switch (true) {
    case isDefaultUnderline(props):
      baseClasses.push('text-blue-500', 'hover:text-blue-600', 'focus:text-blue-600')
      break
      
    case isDefaultNoUnderline(props):
      baseClasses.push('text-blue-500', 'hover:text-blue-600', 'hover:underline', 'focus:text-blue-600')
      break
      
    case isDangerUnderline(props):
      baseClasses.push('text-semantic-error-200', 'hover:text-semantic-error-300', 'focus:text-semantic-error-300')
      break
      
    case isDangerNoUnderline(props):
      baseClasses.push('text-semantic-error-200', 'hover:text-semantic-error-300', 'hover:underline', 'focus:text-semantic-error-300')
      break
  }
  
  return baseClasses
})

/**
 * CSS classes for disabled link state (rendered as span).
 * 
 * Uses switch(true) pattern to explicitly map disabled UI states to their styling.
 * Each case represents a distinct visual representation of the disabled link.
 */
const spanClass = computed(() => {
  const baseClasses = [...commonClass.value, 'cursor-not-allowed']
  
  switch (true) {
    case isDefaultDisabled(props):
      // Default type disabled: blue-200, underline preserved if linkStyle is underline
      baseClasses.push('text-blue-200')
      break
      
    case isDangerDisabled(props):
      // Danger type disabled: semantic-error-100, underline preserved if linkStyle is underline
      baseClasses.push('text-semantic-error-100')
      break
  }
  
  return baseClasses
})

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