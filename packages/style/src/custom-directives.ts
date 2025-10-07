import type { DirectiveBinding, ObjectDirective } from 'vue';

import tokens from "../tokens.json";

export const COLOR_NAMES = [
  'blue',
  'purple',
  'orange',
  'pink',
  'yellow',
  'grey',
  'core',
] as const;

const colors: Record<string, Record<string, string>> = {};

COLOR_NAMES.forEach((color) => {
  const colorObj = tokens.global[color];
  
  if (!colorObj) return;

  Object.keys(colorObj).forEach((weight) => {
    const colorValue = (colorObj as Record<string, { value: string }>)[weight]?.value;
    
    if (colorValue) {
      if (!colors[color]) {
        colors[color] = {};
      }

      colors[color]![weight] = colorValue;
    }
  });
});

/**
 * Custom directive that adds 'color' class to p, h1, h2, h3 elements
 * Usage: <p v-color:blue>Paragraph</p>
 */
const vColor: ObjectDirective<HTMLElement, boolean | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(el, {
      name: 'v-color',
      ...binding,
    })) {
      updateColorClass(el, binding.arg, binding.value);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    updateColorClass(el, binding.arg, binding.value);
  }
}

/**
 * Custom directive that adds 'font-bold' class to p elements
 * Usage: <p v-bold>Paragraph</p>
 */
const vBold: ObjectDirective<HTMLElement, boolean | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(el, {
      name: 'v-bold',
      ...binding,
    })) {
      updateBoldClass(el, binding.value as boolean);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    updateBoldClass(el, binding.value as boolean);
  }
}

/**
 * Custom directive that adds 'font-small' class to p elements  
 * Usage: <p v-small>Paragraph</p>
 */
const vSmall: ObjectDirective<HTMLElement, boolean | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    if (validateElement(el, {
      name: 'v-small',
      ...binding,
    })) {
      updateSmallClass(el, binding.value as boolean);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean | string>) {
    updateSmallClass(el, binding.value as boolean);
  }
}

/**
 * Validates that the directive is used on the proper element
 */
function validateElement(el: HTMLElement, directive: {name: string} & DirectiveBinding<boolean | string>): boolean {
  return validateParagraphElement(el, directive) || validateHeadingElement(el, directive);
}

/**
 * Validates that the directive is used only on heading elements
 */
function validateHeadingElement(el: HTMLElement, directive: {name: string} & DirectiveBinding<boolean | string>): boolean {
  const validTags: string[] = ['H1', 'H2', 'H3'];
  const validDirectives = ['v-color'];
  
  if (validTags.includes(el.tagName) && validDirectives.includes(directive.name)) {
    return true;
  }

  console.error(
    `[${directive.name}] Directive can not be used on: ${el.tagName.toLowerCase()}`
  );

  return false;
}

/**
 * Validates that the directive is used only on p elements
 */
function validateParagraphElement(el: HTMLElement, directive: {name: string} & DirectiveBinding<boolean | string>): boolean {
  const validTags = ['P'];
  const validDirectives = ['v-bold', 'v-small', 'v-color'];
  
  if (validTags.includes(el.tagName) && validDirectives.includes(directive.name)) {
    return true;
  }

  console.error(
    `[${directive.name}] Directive can not be used on: ${el.tagName.toLowerCase()}`
  );

  return false;
}

/**
 * Gets the default color and value for the v-color directive
 * 
 * @param colorName - The color name to get the default color and value for
 * @param value - The value to get the default color and value for
 * @returns The default color and value for the v-color directive
 */
function getDefaultColorAndValue(colorName?: string, value?: boolean | string): { colorName?: string, value?: string | boolean, valid: boolean } {
  if (!colorName || !COLOR_NAMES.includes(colorName as typeof COLOR_NAMES[number])) {
    console.error(
      `[v-color] Invalid or missing color name: ${colorName || 'undefined'}. ` +
      `Available colors are: ${COLOR_NAMES.join(', ')}`
    );
    return { valid: false };
  }

  let defaultValue: string | boolean;

  if (typeof value === 'undefined' || value === true || value === null) {
    if (colorName === 'core') {
      defaultValue = 'black';
    } else {
      defaultValue = '500';
    }
  } else {
    defaultValue = value;
  }

  // Validate that colors[colorName][defaultValue] is a string
  if (typeof colors[colorName][defaultValue as string] !== "string") {
    console.error(
      `[v-color:${colorName}] Invalid color value: ${defaultValue}. ` +
      `Available values for '${colorName}' are: ${Object.keys(colors[colorName]).join(', ')}`
    );

    return { valid: false };
  }

  return { colorName, value: defaultValue, valid: true };
}

/**
 * Updates the color class on the element
 * 
 * @param el - The element to update the color class on
 * @param colorName - The color name to update the color class on
 * @param value - The value to update the color class on
 */
function updateColorClass(el: HTMLElement, colorName?: string, value?: boolean | string): void {
  const { colorName: defaultColorName, value: defaultValue, valid } = getDefaultColorAndValue(colorName, value);

  if (valid) {
    if (defaultValue) {
      el.classList.add(`text-${defaultColorName}-${defaultValue}`);
    } else {
      Array.from(el.classList.entries()).forEach(([_index, className]) => {
        if (className.startsWith(`text-${defaultColorName}-`)) {
          el.classList.remove(className);
        }
      });
    }
  }
}

/**
 * Updates the 'font-bold' class based on the binding value
 */
function updateBoldClass(el: HTMLElement, value: boolean = true): void {
  if (value === false) {
    el.classList.remove('font-semibold')
  } else {
    el.classList.add('font-semibold')
  }
}

/**
 * Updates the 'font-small' class based on the binding value
 */
function updateSmallClass(el: HTMLElement, value: boolean = true): void {
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
    {name: 'color', directive: vColor},
];