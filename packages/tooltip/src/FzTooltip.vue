<script lang="ts" setup>
  /**
   * FzTooltip - Accessible tooltip component
   * 
   * A tooltip component with WCAG 2.1 AA compliance features including
   * keyboard navigation, screen reader support, and hover persistence
   * as per WCAG 1.4.13 Content on Hover or Focus criteria.
   * 
   * Automatically detects interactive components (FzButton, FzLink) to prevent
   * double tab stops. The wrapper adds tabindex="0" only for non-interactive content.
   * 
   * @prop {boolean | 'auto'} interactive - Controls interactive behavior:
   *   - undefined/'auto': Auto-detects FzButton and FzLink (recommended)
   *   - true: Forces interactive (no wrapper tabindex)
   *   - false: Forces non-interactive (adds wrapper tabindex="0")
   * 
   * @example Auto-detection (recommended)
   * <FzTooltip text="Save changes">
   *   <FzButton>Save</FzButton> // Automatically detected
   * </FzTooltip>
   * 
   * @example Non-interactive element
   * <FzTooltip text="User settings">
   *   Settings // Wrapper gets tabindex="0"
   * </FzTooltip>
   * 
   * @example Force interactive override
   * <FzTooltip text="Custom action" :interactive="true">
   *   <span @click="handleClick">Action</span>
   * </FzTooltip>
   */
  import { computed, ref, useSlots, onUnmounted, VNode } from 'vue'

  import { FzFloating } from '@fiscozen/composables'
  import { FzIcon } from '@fiscozen/icons'
  
  import { FzTooltipProps, FzTooltipStatus } from './types'

  const props = withDefaults(defineProps<FzTooltipProps>(), {
    position: 'auto',
    status: 'neutral',
    withIcon: false,
    interactive: 'auto',
  })

  const slots = useSlots()

  /* ========================================================================
   * AUTO-DETECTION OF INTERACTIVE ELEMENTS
   * Automatically detects components listed in INTERACTIVE_COMPONENTS
   * to prevent double tab stops without requiring manual interactive prop.
   * ======================================================================== */

  /**
   * List of interactive component names for auto-detection.
   * These components are considered interactive and won't receive
   * an additional tabindex="0" on the tooltip wrapper.
   * 
   * Add component names here to extend auto-detection support.
   */
  const INTERACTIVE_COMPONENTS = ['FzButton', 'FzLink'] as const;

  /**
   * Checks if a VNode represents an interactive component.
   * 
   * Vue 3 components with <script setup> have a `__name` property
   * accessible via vnode.type. This allows component identification
   * without importing them directly, avoiding circular dependencies
   * and reducing bundle size.
   * 
   * @param vnode - The VNode to check
   * @returns true if the VNode matches a component in INTERACTIVE_COMPONENTS
   */
  function isInteractiveComponent(vnode: VNode): boolean {
    const componentType = vnode.type as any;
    
    // Components using <script setup> generate a __name property.
    // We check this property to identify the component without importing it directly.
    const componentName = componentType?.__name;
    
    return componentName && INTERACTIVE_COMPONENTS.includes(componentName);
  }

  /**
   * Recursively searches for interactive components in a VNode tree.
   * 
   * Handles nested structures created by Vue directives (v-if, v-else, v-for)
   * and template wrappers, which create Symbol(Fragment) nodes that wrap
   * the actual component VNodes.
   * 
   * @param vnode - The VNode to analyze recursively
   * @returns true if a component from INTERACTIVE_COMPONENTS is found at any depth
   * 
   * @example Direct component
   * <FzButton>Click</FzButton> // → true
   * 
   * @example Nested with v-if
   * <FzButton v-if="condition">Click</FzButton> // → true
   * 
   * @example Deeply nested
   * <template v-if="outer">
   *   <FzButton v-if="inner">Click</FzButton>
   * </template> // → true
   */
  function hasInteractiveComponent(vnode: VNode): boolean {
    if (isInteractiveComponent(vnode)) {
      return true;
    }
    
    // Recursive case: if it's a Symbol (Fragment from v-if/v-else/template),
    // we need to search within its children.
    // Vue uses Symbol types for internal nodes like Fragment, Text, Comment.
    if (typeof vnode.type === 'symbol') {
      const children = vnode.children;
      
      // Ensure children is an array of VNodes (not string/number/null)
      if (Array.isArray(children)) {
        return children.some((child) => {
          // Children can be VNode, string, number, or other primitives.
          // Only VNodes have a 'type' property we can inspect.
          if (typeof child === 'object' && child !== null && 'type' in child) {
            return hasInteractiveComponent(child as VNode);
          }
          return false;
        });
      }
    }
    
    // Base case: not an interactive component
    return false;
  }

  /**
   * Auto-detects if the default slot contains interactive elements.
   * Searches recursively through all VNodes in the slot to find
   * components listed in INTERACTIVE_COMPONENTS at any nesting level.
   */
  const isInteractiveElement = computed(() => {
    if (!slots.default) return false;
    
    const vnodes = slots.default();
    if (vnodes.length === 0) return false;
    
    // Search recursively in all slot VNodes
    return vnodes.some((vnode) => hasInteractiveComponent(vnode));
  });

  /**
   * Configuration object for status-based styling and iconography.
   * Centralizes visual mapping to ensure consistency and maintainability.
   * Using semantic color tokens for design system compliance.
   */
  const statusConfig: Record<FzTooltipStatus, { icon: string; bgClass: string }> = {
    neutral: { icon: '', bgClass: '!bg-core-black' },
    informative: { icon: 'circle-info', bgClass: 'bg-semantic-info' },
    alert: { icon: 'triangle-exclamation', bgClass: 'bg-semantic-warning' },
    error: { icon: 'circle-exclamation', bgClass: 'bg-semantic-error' },
    positive: { icon: 'circle-check', bgClass: 'bg-semantic-success' }
  }

  const computedIconName = computed(() => statusConfig[props.status]?.icon || '')

  const classes = computed(() => {
    const bgClass = statusConfig[props.status]?.bgClass
    return bgClass ? { [bgClass]: true } : {}
  })

  /**
   * Unique tooltip identifier generated once at component initialization.
   * Uses timestamp + random string for collision-resistant ID generation.
   * Format: tooltip-{timestamp}-{random7chars}
   */
  const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  const isOpen = ref(false)
  const isHoveringTooltip = ref(false)
  const hoverTimeout = ref<number | null>(null)

  const showIcon = computed(() => props.withIcon && props.status !== 'neutral');

  /**
   * WCAG 1.4.13 compliance: Content on Hover or Focus
   * Minimum delay allowing users to move cursor from trigger to tooltip content.
   * 100ms provides optimal UX balance between responsiveness and accessibility.
   */
  const DEFAULT_HOVER_DELAY = 100; // ms

  const staticClasses =
    'text-fzwhite-100 max-w-[200px] p-6 text-xs flex flex-row items-start justify-center'

  /**
   * ARIA describedby attribute for screen reader association.
   * Only returns tooltip ID when tooltip is visible to prevent
   * screen readers from announcing hidden content.
   */
  const ariaDescribedby = computed(() => isOpen.value ? tooltipId : undefined);

  /**
   * Dynamic tabindex based on interactive prop and auto-detection.
   * 
   * Logic:
   * - Explicit boolean (true/false): Override auto-detection
   * - undefined or 'auto': Use auto-detection (isInteractiveElement)
   * 
   * Returns:
   * - undefined: Element is interactive (no wrapper tabindex, single tab stop)
   * - 0: Element is not interactive (adds wrapper tabindex for keyboard accessibility)
   * 
   * This prevents double tab stops when wrapping interactive components.
   */
  const computedTabindex = computed(() => {
    // Explicit boolean override takes precedence over auto-detection
    if (typeof props.interactive === 'boolean') {
      return props.interactive ? undefined : 0;
    }
    
    // undefined or 'auto': use auto-detection
    return isInteractiveElement.value ? undefined : 0;
  });
  
  /* ========================================================================
   * TOOLTIP VISIBILITY CONTROL
   * Core methods for managing tooltip show/hide state
   * ======================================================================== */

  function showTooltip() {
    if (props.text || slots.text) {
      isOpen.value = true
    }
  }

  function hideTooltip() {
    isOpen.value = false
  }

  /* ========================================================================
   * MOUSE EVENT HANDLERS - WCAG 1.4.13 HOVER PERSISTENCE
   * Implements accessible hover behavior allowing users to move cursor
   * from trigger element to tooltip content without dismissal
   * ======================================================================== */

  function handleMouseover() {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    showTooltip()
  }

  function handleMouseleave() {
    hoverTimeout.value = setTimeout(() => {
      if (!isHoveringTooltip.value) {
        hideTooltip()
      }
    }, DEFAULT_HOVER_DELAY)
  }

  function handleTooltipMouseenter() {
    isHoveringTooltip.value = true
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
  }

  function handleTooltipMouseleave() {
    isHoveringTooltip.value = false
    hideTooltip()
  }
    
  /* ========================================================================
   * KEYBOARD EVENT HANDLERS
   * Ensures full keyboard accessibility for screen readers and power users
   * ======================================================================== */

  /**
   * Focus handlers using focusin/focusout instead of focus/blur.
   * focusin and focusout bubble up from child elements, ensuring the tooltip
   * shows even when an interactive child element (like a button) receives focus.
   * This is essential for auto-detection and the interactive prop to work correctly.
   */
  const handleFocusIn = showTooltip;
  const handleFocusOut = hideTooltip;

  /**
   * Global keydown handler for tooltip dismissal.
   * Handles Escape key for explicit tooltip dismissal, improving UX
   * for keyboard users who want to clear tooltip content.
   */
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hideTooltip()
    }
  }

  /* ========================================================================
   * LIFECYCLE MANAGEMENT
   * Ensures proper cleanup to prevent memory leaks and timing issues
   * ======================================================================== */

  /**
   * Component unmount cleanup.
   * Clears pending timeouts to prevent execution on destroyed component.
   * Essential for preventing runtime errors in SPA environments.
   */
  onUnmounted(() => {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
    }
  })
</script>

<template>
  <FzFloating
    :teleport="true"
    :is-open="isOpen"
    :position="position"
    class="fz__tooltip flex h-max"
    :contentClass="['rounded', '!p-0', 'm-4', classes, 'z-80']">
    <template #opener>
      <span
        :aria-label="props.ariaLabel"
        :aria-describedby="ariaDescribedby"
        :tabindex="computedTabindex"
        @mouseover="handleMouseover"
        @mouseleave="handleMouseleave"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
        @keydown="handleKeydown"
      >
        <slot></slot>
      </span>
    </template>
    <div
      :id="tooltipId"
      :class="staticClasses"
      role="tooltip"
      :aria-hidden="!isOpen"
      @mouseenter="handleTooltipMouseenter"
      @mouseleave="handleTooltipMouseleave"
    >
      <FzIcon
        v-if="showIcon"
        size="sm"
        :name="computedIconName"
        :class="['mr-8 grow-0 shrink-0', { 'text-core-black': props.status === 'alert' }]"
        :aria-hidden="true"
      />
      <span :class="['basis-0 grow shrink-0 fz__tooltip__text', { 'text-core-black': props.status === 'alert' }]">
        <slot name="text">
          {{ props.text }}
        </slot>
      </span>
    </div>
  </FzFloating>
</template>

<style lang="css" scoped>
  .text-fzwhite-100 {
    color: #fffefd;
  }

  .fz__tooltip__text {
    overflow-wrap: anywhere;
    word-break: normal;
  }
</style>
