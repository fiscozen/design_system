import type { DirectiveBinding, ObjectDirective } from 'vue';

import { validateElement } from './validation';
import { DIRECTIVE_VALIDATION_CONFIG } from './config';

// ============================================================================
// SMALL DIRECTIVE - Logic & Helpers
// ============================================================================

/**
 * Toggles the small text size class.
 * 
 * @param el - The element to modify
 * @param value - true to add, false to remove
 */
function updateSmallClass(el: HTMLElement, value: boolean = true): void {
  if (value === false) {
    el.classList.remove('text-sm')
  } else {
    el.classList.add('text-sm')
  }
}

// ============================================================================
// DIRECTIVE DEFINITION
// ============================================================================

/**
 * v-small Directive
 * 
 * Applies small font size to text elements.
 * 
 * @example
 * <p v-small>Small text</p>       // Applies text-sm
 * <p v-small="false">Normal</p>   // Removes text-sm
 */
export const vSmall: ObjectDirective<HTMLElement, boolean | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(DIRECTIVE_VALIDATION_CONFIG, el, {
      name: 'v-small',
      ...binding,
    })) {
      updateSmallClass(el, binding.value as boolean);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(DIRECTIVE_VALIDATION_CONFIG, el, {
      name: 'v-small',
      ...binding,
    })) {
      updateSmallClass(el, binding.value as boolean);
    }
  }
}

