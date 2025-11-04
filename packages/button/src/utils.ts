import type { VNode } from 'vue'
import type { SizeToEnvironmentMap, IconSizeMap } from './types'
import FzButton from './FzButton.vue'

/**
 * Minimum number of FzButton components required in FzButtonGroup slot.
 * 
 * FzButtonGroup enforces a minimum of 2 buttons to ensure proper visual balance
 * and consistent user experience across form actions.
 */
const MIN_BUTTONS = 2

/**
 * Maximum number of FzButton components allowed in FzButtonGroup slot.
 * 
 * FzButtonGroup enforces a maximum of 3 buttons to prevent visual clutter
 * and maintain optimal spacing with the fixed 16px gap layout.
 */
const MAX_BUTTONS = 3

/**
 * Maps deprecated ButtonSize to ButtonEnvironment
 * 
 * Used for backward compatibility when size prop is provided instead of environment.
 * All sizes map to environments: xs/sm/md → backoffice, lg → frontoffice
 */
export const sizeToEnvironmentMapping: SizeToEnvironmentMap = {
  xs: 'backoffice',
  sm: 'backoffice',
  md: 'backoffice',
  lg: 'frontoffice'
}

/**
 * Maps ButtonSize to IconSize for FzIconButton
 * 
 * Used by FzIconButton to determine icon size based on button size.
 */
export const iconSizeMap: IconSizeMap = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'lg'
}

/**
 * Checks if a VNode represents a FzButton component.
 * 
 * @param vnode - The VNode to check
 * @returns true if the VNode is a FzButton component
 */
export function isButtonComponent(vnode: VNode): boolean {
  return vnode.type === FzButton
}

/**
 * Recursively collects all FzButton components from a VNode tree.
 * 
 * Handles Vue Fragment nodes created by v-if, v-else, v-for directives.
 * 
 * @param vnode - The VNode to analyze recursively
 * @param buttons - Array to collect found FzButton components
 * @returns array of all FzButton VNodes found at any depth
 */
export function collectButtons(vnode: VNode, buttons: VNode[] = []): VNode[] {
  if (isButtonComponent(vnode)) {
    buttons.push(vnode)
    return buttons
  }
  
  if (typeof vnode.type === 'symbol') {
    const children = vnode.children
    
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === 'object' && child !== null && 'type' in child) {
          collectButtons(child as VNode, buttons)
        }
      })
    }
  }
  
  return buttons
}

/**
 * Recursively collects all non-FzButton elements from a VNode tree.
 * 
 * Used to detect invalid elements (HTML elements, other Vue components, text nodes).
 * 
 * @param vnode - The VNode to analyze recursively
 * @param invalidElements - Array to collect found invalid elements
 * @returns array of all non-FzButton VNodes and text nodes found at any depth
 */
export function collectInvalidElements(vnode: VNode, invalidElements: (VNode | string)[] = []): (VNode | string)[] {
  if (isButtonComponent(vnode)) {
    return invalidElements
  }
  
  if (typeof vnode.type === 'symbol') {
    const children = vnode.children
    
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === 'object' && child !== null && 'type' in child) {
          collectInvalidElements(child as VNode, invalidElements)
        } else if (typeof child === 'string' && child.trim() !== '') {
          invalidElements.push(child)
        }
      })
    }
  } else {
    invalidElements.push(vnode)
  }
  
  return invalidElements
}

/**
 * Validates FzButtonGroup slot content.
 * 
 * Ensures slot contains only FzButton components within MIN_BUTTONS-MAX_BUTTONS range.
 * 
 * @param vnodes - Array of VNodes from the slot to validate
 * @returns Object with validation status, button count, and error message if invalid
 */
export function validateButtonGroupSlot(vnodes: VNode[]): { valid: boolean; buttonCount: number; error: string | null } {
  if (!vnodes || vnodes.length === 0) {
    return {
      valid: false,
      buttonCount: 0,
      error: `[FzButtonGroup] Slot is empty. Expected ${MIN_BUTTONS}-${MAX_BUTTONS} FzButton components. Only FzButton components are allowed.`
    }
  }
  
  const buttons: VNode[] = []
  vnodes.forEach((vnode) => {
    collectButtons(vnode, buttons)
  })
  
  const buttonCount = buttons.length
  
  const invalidElements: (VNode | string)[] = []
  vnodes.forEach((vnode) => {
    collectInvalidElements(vnode, invalidElements)
  })
  
  if (invalidElements.length > 0) {
    return {
      valid: false,
      buttonCount,
      error: `[FzButtonGroup] Slot contains invalid elements. Only FzButton components are allowed (found ${buttonCount} FzButton, ${invalidElements.length} invalid element(s)).`
    }
  }
  
  if (buttonCount < MIN_BUTTONS) {
    return {
      valid: false,
      buttonCount,
      error: `[FzButtonGroup] Too few buttons. Expected ${MIN_BUTTONS}-${MAX_BUTTONS} FzButton components, found ${buttonCount}.`
    }
  }
  
  if (buttonCount > MAX_BUTTONS) {
    return {
      valid: false,
      buttonCount,
      error: `[FzButtonGroup] Too many buttons. Expected ${MIN_BUTTONS}-${MAX_BUTTONS} FzButton components, found ${buttonCount}.`
    }
  }
  
  return {
    valid: true,
    buttonCount,
    error: null
  }
}

