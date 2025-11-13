import type { DirectiveBinding, ObjectDirective } from 'vue';

import { validateElement } from './validation';
import { DIRECTIVE_VALIDATION_CONFIG } from './config';

// ============================================================================
// BOLD DIRECTIVE - Logic & Helpers
// ============================================================================

/**
 * Toggles the semibold font weight class.
 * 
 * @param el - The element to modify
 * @param value - true to add, false to remove
 */
function updateBoldClass(el: HTMLElement, value: boolean = true): void {
  if (value === false) {
    el.classList.remove('font-semibold')
  } else {
    el.classList.add('font-semibold')
  }
}

// ============================================================================
// DIRECTIVE DEFINITION
// ============================================================================

/**
 * v-bold Directive
 * 
 * Applies semibold font weight to text elements.
 * 
 * @example
 * <p v-bold>Bold text</p>         // Applies font-semibold
 * <p v-bold="false">Normal</p>    // Removes font-semibold
 */
export const vBold: ObjectDirective<HTMLElement, boolean | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(DIRECTIVE_VALIDATION_CONFIG, el, {
      name: 'v-bold',
      ...binding,
    })) {
      updateBoldClass(el, binding.value as boolean);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(DIRECTIVE_VALIDATION_CONFIG, el, {
      name: 'v-bold',
      ...binding,
    })) {
      updateBoldClass(el, binding.value as boolean);
    }
  }
}

