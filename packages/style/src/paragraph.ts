import type { DirectiveBinding, ObjectDirective } from 'vue'

/**
 * Custom directive that adds 'font-bold' class to p elements
 * Usage: <p v-bold="true">Paragraph</p>
 */
const vBold: ObjectDirective<HTMLElement, boolean> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (validateParagraphElement(el, 'v-bold')) {
      updateBoldClass(el, binding.value);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    updateBoldClass(el, binding.value)
  }
}

/**
 * Custom directive that adds 'font-small' class to p elements  
 * Usage: <p v-small="true">Paragraph</è>
 */
const vSmall: ObjectDirective<HTMLElement, boolean> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (validateParagraphElement(el, 'v-small')) {
      updateSmallClass(el, binding.value);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    updateSmallClass(el, binding.value)
  }
}

/**
 * Validates that the directive is used only on p elements
 */
function validateParagraphElement(el: HTMLElement, directiveName: string): boolean {
  const validTags = ['P'];
  
  if (validTags.includes(el.tagName)) {
    return true;
  }

  console.error(
    `[${directiveName}] Directive should only be used on p elements. ` +
    `Found on: ${el.tagName.toLowerCase()}`
  );

  return false;
}

/**
 * Updates the 'font-bold' class based on the binding value
 */
function updateBoldClass(el: HTMLElement, value: boolean): void {
  if (value === false) {
    el.classList.remove('font-semibold')
  } else {
    el.classList.add('font-semibold')
  }
}

/**
 * Updates the 'font-small' class based on the binding value
 */
function updateSmallClass(el: HTMLElement, value: boolean): void {
  if (value === false) {
    el.classList.remove('text-sm')
  } else {
    el.classList.add('text-sm')
  }
}

// Export individual directives only for internal use or advanced cases
export const directives = [
    {name: 'bold', directive: vBold},
    {name: 'small', directive: vSmall},
];
