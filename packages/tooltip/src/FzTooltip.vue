<script lang="ts" setup>
  /**
   * FzTooltip - Accessible tooltip component
   * 
   * A tooltip component with WCAG 2.1 AA compliance features including
   * keyboard navigation, screen reader support, and hover persistence
   * as per WCAG 1.4.13 Content on Hover or Focus criteria.
   * 
   * Note: The wrapper adds tabindex="0" for keyboard accessibility.
   * When wrapping already-interactive elements (buttons, links), this creates
   * an extra tab stop - a known limitation accepted for implementation simplicity.
   * 
   * @example With non-interactive element (recommended)
   * <FzTooltip text="User settings">
   *   <span>Settings</span>
   * </FzTooltip>
   * 
   * @example With interactive element (works but creates extra tab stop)
   * <FzTooltip text="User settings">
   *   <button>Settings</button>
   * </FzTooltip>
   */
  import { computed, ref, useSlots, onUnmounted } from 'vue'

  import { FzFloating } from '@fiscozen/composables'
  import { FzIcon } from '@fiscozen/icons'
  
  import { FzTooltipProps, FzTooltipStatus } from './types'

  /**
   * Component props with sensible defaults for common use cases
   */
  const props = withDefaults(defineProps<FzTooltipProps>(), {
    position: 'auto',
    status: 'neutral',
    withIcon: false,
  })

  const slots = useSlots()

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

  /**
   * Computed icon name based on tooltip status.
   * Returns empty string for neutral status (no icon needed).
   */
  const iconName = computed(() => statusConfig[props.status]?.icon || '')

  /**
   * Dynamic CSS classes computed from status configuration.
   * Returns object format for Vue's class binding reactivity.
   */
  const classes = computed(() => {
    const bgClass = statusConfig[props.status]?.bgClass
    return bgClass ? { [bgClass]: true } : {}
  })

  /**
   * Unique tooltip identifier generated once at component initialization.
   * Uses timestamp + random string for collision-resistant ID generation.
   * Format: tooltip-{timestamp}-{random7chars}
   */
  const tooltipId = ref(`tooltip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)

  // Reactive state management for tooltip visibility and hover tracking
  const isOpen = ref(false)
  const isHoveringTooltip = ref(false)
  const hoverTimeout = ref<number | null>(null)

  /**
   * Determines icon visibility based on withIcon prop and status.
   * Neutral status tooltips never show icons regardless of withIcon prop.
   */
  const showIcon = computed(() => props.withIcon && props.status !== 'neutral');

  /**
   * WCAG 1.4.13 compliance: Content on Hover or Focus
   * Minimum delay allowing users to move cursor from trigger to tooltip content.
   * 100ms provides optimal UX balance between responsiveness and accessibility.
   */
  const DEFAULT_HOVER_DELAY = 100; // ms

  /**
   * Static CSS classes for consistent tooltip styling.
   * Max-width prevents excessive tooltip expansion on long content.
   */
  const staticClasses =
    'text-fzwhite-100 max-w-[200px] p-6 text-xs flex flex-row items-start justify-center'

  /**
   * ARIA describedby attribute for screen reader association.
   * Only returns tooltip ID when tooltip is visible to prevent
   * screen readers from announcing hidden content.
   */
  const ariaDescribedby = computed(() => isOpen.value ? tooltipId.value : undefined);
  
  /* ========================================================================
   * TOOLTIP VISIBILITY CONTROL
   * Core methods for managing tooltip show/hide state
   * ======================================================================== */

  /**
   * Shows the tooltip if content is available.
   * Validates content presence from either prop or slot before displaying.
   */
  function showTooltip() {
    if (props.text || slots.text) {
      isOpen.value = true
    }
  }

  /**
   * Immediately hides the tooltip.
   * Used for direct dismissal (blur, escape key, etc.)
   */
  function hideTooltip() {
    isOpen.value = false
  }

  /* ========================================================================
   * MOUSE EVENT HANDLERS - WCAG 1.4.13 HOVER PERSISTENCE
   * Implements accessible hover behavior allowing users to move cursor
   * from trigger element to tooltip content without dismissal
   * ======================================================================== */

  /**
   * Trigger element mouseenter handler.
   * Cancels any pending hide timeout and immediately shows tooltip.
   * Ensures responsive tooltip appearance on hover.
   */
  function handleMouseover() {
    // Clear pending hide timeout to prevent premature dismissal
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    showTooltip()
  }

  /**
   * Trigger element mouseleave handler.
   * Implements graceful delay before hiding to allow cursor transition
   * to tooltip content, ensuring WCAG 1.4.13 compliance.
   */
  function handleMouseleave() {
    // Delayed hide allows cursor transition to tooltip content
    hoverTimeout.value = setTimeout(() => {
      if (!isHoveringTooltip.value) {
        hideTooltip()
      }
    }, DEFAULT_HOVER_DELAY)
  }

  /**
   * Tooltip content mouseenter handler.
   * Prevents tooltip dismissal when user hovers over tooltip itself.
   * Critical for long tooltip content readability.
   */
  function handleTooltipMouseenter() {
    isHoveringTooltip.value = true
    // Cancel any pending hide timeout when hovering tooltip content
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
  }

  /**
   * Tooltip content mouseleave handler.
   * Immediately hides tooltip when user leaves tooltip content area.
   * No delay needed since user has completed tooltip interaction.
   */
  function handleTooltipMouseleave() {
    isHoveringTooltip.value = false
    hideTooltip()
  }
    
  /* ========================================================================
   * KEYBOARD EVENT HANDLERS
   * Ensures full keyboard accessibility for screen readers and power users
   * ======================================================================== */

  /**
   * Trigger element focus handler - shows tooltip for keyboard navigation
   */
  const handleFocus = showTooltip;

  /**
   * Trigger element blur handler - hides tooltip when focus moves away
   */
  const handleBlur = hideTooltip;

  /**
   * Global keydown handler for tooltip dismissal.
   * Handles Escape key for explicit tooltip dismissal, improving UX
   * for keyboard users who want to clear tooltip content.
   * 
   * @param e - KeyboardEvent from trigger element
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
        :aria-describedby="ariaDescribedby"
        tabindex="0"
        @mouseover="handleMouseover"
        @mouseleave="handleMouseleave"
        @focus="handleFocus"
        @blur="handleBlur"
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
        :name="iconName"
        :class="['mr-8 grow-0 shrink-0', { 'text-core-black': props.status === 'alert' }]"
        :aria-hidden="true"
      />
      <span :class="['basis-0 grow shrink-0 fz__tooltip__text', { 'text-core-black': props.status === 'alert' }]">
        <slot name="text">
          {{ text }}
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
