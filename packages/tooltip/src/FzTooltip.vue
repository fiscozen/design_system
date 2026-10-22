<script lang="ts" setup>
  /**
   * FzTooltip - Accessible tooltip component
   * 
   * A tooltip component with WCAG 2.1 AA compliance features including
   * keyboard navigation, screen reader support, and hover persistence
   * as per WCAG 1.4.13 Content on Hover or Focus criteria.
   * 
   * Automatically detects interactive components (FzButton, FzLink) to prevent
   * double tab stops. The wrapper adds tabindex="0" only for non-interactive content
   * that is not truncated: truncated content is in the DOM in full, so it takes none.
   * 
   * Supports _forceOpenForDesignReview prop for keeping tooltips visible in Storybook
   * during design review (not for production use).
   * 
   * @prop {boolean | 'auto'} interactive - Controls interactive behavior:
   *   - undefined/'auto': Auto-detects FzButton and FzLink (recommended); truncated
   *     content takes no wrapper tabindex
   *   - true: Forces interactive (no wrapper tabindex)
   *   - false: Forces non-interactive (adds wrapper tabindex="0"), even when truncated
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
   * 
   * @example Design review in Storybook only
   * <FzTooltip text="Review this" _forceOpenForDesignReview>
   *   <span>Element</span>
   * </FzTooltip>
   */
  import { computed, ref, useSlots, onUnmounted, onMounted, watch, VNode } from 'vue'

  import { FzFloating } from '@fiscozen/composables'
  import { FzIcon } from '@fiscozen/icons'

  import { FzTooltipProps, FzTooltipStatus } from './types'

  const props = withDefaults(defineProps<FzTooltipProps>(), {
    position: 'auto',
    status: 'neutral',
    withIcon: false,
    interactive: 'auto',
    _forceOpenForDesignReview: false,
    truncate: false,
    externalFocus: false,
  })

  const slots = useSlots()

  /* ========================================================================
   * AUTO-DETECTION OF INTERACTIVE ELEMENTS
   * Automatically detects interactive components to prevent double tab stops
   * without requiring manual interactive prop.
   *
   * Detection uses the `__fzKind` marker (a primitive string set via
   * defineOptions on each component). This is value-equal across module
   * instances, so it survives Vite dev-mode module duplication that occurs
   * when consuming apps exclude these packages from optimizeDeps.
   *
   * To extend auto-detection for a new component:
   * 1. Add `defineOptions({ __fzKind: '@fiscozen/<pkg>/<Component>' })` to it.
   * 2. Add the kind string to INTERACTIVE_KINDS below.
   * ======================================================================== */

  /**
   * Set of `__fzKind` markers recognized as interactive.
   * Components matching one of these kinds will not receive an additional
   * tabindex="0" on the tooltip wrapper.
   */
  const INTERACTIVE_KINDS = new Set<string>([
    '@fiscozen/button/FzButton',
    '@fiscozen/button/FzIconButton',
    '@fiscozen/link/FzLink',
  ])

  /**
   * Checks if a VNode represents an interactive component.
   *
   * @param vnode - The VNode to check
   * @returns true if the VNode's component carries an interactive `__fzKind`
   */
  function isInteractiveComponent(vnode: VNode): boolean {
    const kind = (vnode.type as { __fzKind?: string } | null)?.__fzKind
    return typeof kind === 'string' && INTERACTIVE_KINDS.has(kind)
  }

  /**
   * Recursively searches for interactive components in a VNode tree.
   * 
   * Handles nested structures created by Vue directives (v-if, v-else, v-for)
   * and template wrappers, which create Symbol(Fragment) nodes that wrap
   * the actual component VNodes.
   * 
   * @param vnode - The VNode to analyze recursively
   * @returns true if any component from INTERACTIVE_COMPONENTS is found at any depth
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
   * any component from INTERACTIVE_COMPONENTS at any nesting level.
   */
  const isInteractiveElement = computed(() => {
    if (!slots.default) return false;
    
    const vnodes = slots.default();
    if (vnodes.length === 0) return false;
    
    // Search recursively in all slot VNodes
    return vnodes.some((vnode) => hasInteractiveComponent(vnode));
  });

  const statusConfig: Record<FzTooltipStatus, { icon: string; bgClass: string }> = {
    neutral: { icon: '', bgClass: '!bg-core-black' },
    informative: { icon: 'circle-info', bgClass: 'bg-semantic-info-200' },
    alert: { icon: 'triangle-exclamation', bgClass: 'bg-semantic-warning-200' },
    error: { icon: 'circle-exclamation', bgClass: 'bg-semantic-error-200' },
    positive: { icon: 'circle-check', bgClass: 'bg-semantic-success-200' }
  }

  const computedIconName = computed(() => statusConfig[props.status]?.icon || '')

  const classes = computed(() => {
    const bgClass = statusConfig[props.status]?.bgClass
    return bgClass ? { [bgClass]: true } : {}
  })

  const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  const opener = ref<HTMLElement | null>(null)
  const truncatedContent = ref<HTMLElement | null>(null)

  /**
   * Whether the truncated content is cut right now. Measured when the tooltip is
   * about to open rather than observed, so it always reflects the current layout.
   * Compares the fractional widths of the inline content and of its box:
   * scrollWidth and clientWidth are rounded to whole pixels, so content a fraction
   * of a pixel wider than its box, which the browser still cuts, would read as
   * fitting.
   */
  function isContentCut(): boolean {
    if (opener.value === null || truncatedContent.value === null) return false
    const contentWidth = truncatedContent.value.getBoundingClientRect().width
    return contentWidth > opener.value.getBoundingClientRect().width
  }

  const isOpen = ref(false)
  const isHoveringTooltip = ref(false)
  const isTriggerFocused = ref(false)
  const isFocused = computed(() => isTriggerFocused.value || props.externalFocus)
  const hoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

  const showIcon = computed(() => props.withIcon && props.status !== 'neutral');

  /**
   * WCAG 1.4.13 compliance: Content on Hover or Focus
   * Minimum delay allowing users to move cursor from trigger to tooltip content.
   * 100ms provides optimal UX balance between responsiveness and accessibility.
   */
  const DEFAULT_HOVER_DELAY = 100; // ms

  const staticClasses =
    'text-core-white max-w-[200px] p-8 text-sm leading-[16px] flex flex-row items-start justify-center'

  /**
   * Returns tooltip ID only when visible to prevent screen readers
   * from announcing hidden content.
   */
  const ariaDescribedby = computed(() => (isOpen.value && !props.truncate ? tooltipId : undefined));

  /**
   * Dynamic tabindex, resolved in this order:
   * 1. Explicit `interactive` boolean: true → undefined, false → 0
   * 2. `truncate`: undefined, since the content is already in the DOM in full and the
   *    tooltip only repeats it
   * 3. Auto-detection (`interactive` undefined or 'auto'): undefined for FzButton,
   *    FzIconButton or FzLink, 0 otherwise
   *
   * Returns:
   * - undefined: no wrapper tabindex (single tab stop, or none for truncated content)
   * - 0: wrapper tabindex for keyboard accessibility of non-interactive content
   *
   * This prevents double tab stops when wrapping interactive components.
   */
  const computedTabindex = computed(() => {
    if (typeof props.interactive === 'boolean') {
      return props.interactive ? undefined : 0;
    }

    if (props.truncate) return undefined;

    return isInteractiveElement.value ? undefined : 0;
  });

  /** Bound as an attribute object so an untruncated trigger renders no `class` at all. */
  const openerAttrs = computed(() => (props.truncate ? { class: 'block min-w-0 truncate' } : {}))
  
  /**
   * Shows the tooltip if content is available.
   * When _forceOpenForDesignReview is true, tooltip remains visible.
   */
  function showTooltip() {
    const hasContent = !!(props.text || slots.text)
    const isWorthShowing = props._forceOpenForDesignReview || !props.truncate || isContentCut()
    if (hasContent && isWorthShowing) {
      isOpen.value = true
    }
  }

  /**
   * Hides the tooltip unless _forceOpenForDesignReview is active.
   * This allows designers to keep tooltips visible in Storybook for review.
   */
  function hideTooltip() {
    if (!props._forceOpenForDesignReview) {
      isOpen.value = false
    }
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
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    hoverTimeout.value = setTimeout(() => {
      if (!isHoveringTooltip.value && !isFocused.value) {
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
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    // This maintains WCAG 1.4.13 compliance for focus persistence
    if (!isFocused.value) {
      hideTooltip()
    }
  }
    
  /* ========================================================================
   * KEYBOARD EVENT HANDLERS
   * Ensures full keyboard accessibility for screen readers and power users
   * ======================================================================== */

  /**
   * Use focusin/focusout instead of focus/blur for event bubbling.
   * This ensures tooltip shows when interactive children (buttons) receive focus,
   * which is critical for auto-detection to work correctly.
   * 
   * Track focus state to prevent tooltip from hiding when element is focused
   * but mouse has moved away (WCAG compliance for keyboard users).
   */
  function handleFocusIn() {
    isTriggerFocused.value = true
    showTooltip()
  }

  function handleFocusOut() {
    isTriggerFocused.value = false
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    // This maintains WCAG 1.4.13 compliance for hover persistence
    if (!isHoveringTooltip.value && !isFocused.value) {
      hideTooltip()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      hideTooltip()
    }
  }

  /**
   * External focus sits outside the trigger, so Escape never reaches the trigger's
   * keydown handler: while it lasts, Escape is listened for on the document, keeping
   * the tooltip dismissible without moving focus (WCAG 1.4.13).
   */
  function gainExternalFocus() {
    document.addEventListener('keydown', handleKeydown)
    showTooltip()
  }

  function loseExternalFocus() {
    document.removeEventListener('keydown', handleKeydown)
    if (!isHoveringTooltip.value && !isFocused.value) {
      hideTooltip()
    }
  }

  watch(
    () => props.externalFocus,
    (focused) => (focused ? gainExternalFocus() : loseExternalFocus())
  )

  /**
   * Applies _forceOpenForDesignReview and externalFocus as they stand at mount, once
   * the trigger can be measured; their watchers apply every later change.
   */
  onMounted(() => {
    if (props._forceOpenForDesignReview) {
      showTooltip()
    }
    if (props.externalFocus) {
      gainExternalFocus()
    }
  })

  watch(() => props._forceOpenForDesignReview, (newValue) => {
    if (newValue) {
      showTooltip()
    } else {
      hideTooltip()
    }
  })

  onUnmounted(() => {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
    }
    document.removeEventListener('keydown', handleKeydown)
  })
</script>

<template>
  <FzFloating
    :teleport="true"
    :is-open="isOpen"
    :position="position"
    class="fz__tooltip flex h-max"
    :class="{ 'min-w-0 max-w-full': truncate }"
    :openerClass="{ 'min-w-0': truncate }"
    :contentClass="['rounded', classes, 'z-80']">
    <template #opener>
      <span
        ref="opener"
        v-bind="openerAttrs"
        :aria-label="props.ariaLabel"
        :aria-describedby="ariaDescribedby"
        :tabindex="computedTabindex"
        @mouseover="handleMouseover"
        @mouseleave="handleMouseleave"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
        @keydown="handleKeydown"
      >
        <span v-if="truncate" ref="truncatedContent"><slot></slot></span>
        <slot v-else></slot>
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
        size="md"
        :name="computedIconName"
        :class="['mr-4', '!w-[16px]', '!h-[16px]', 'grow-0', 'shrink-0', { 'text-core-black': props.status === 'alert' }]"
        :aria-hidden="true"
      />
      <span :class="['basis-0 grow shrink-0 break-normal fz__tooltip__text', { 'text-core-black': props.status === 'alert' }]">
        <slot name="text">
          {{ props.text }}
        </slot>
      </span>
    </div>
  </FzFloating>
</template>

<style lang="css" scoped>
  .fz__tooltip__text {
    overflow-wrap: anywhere;
  }
</style>
