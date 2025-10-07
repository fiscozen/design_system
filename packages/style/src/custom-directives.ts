import type { DirectiveBinding, ObjectDirective } from 'vue';

import tokens from "../tokens.json";
import safeColorsConfig from "../safe-colors.json";
import safeSemanticColorsConfig from "../safe-semantic-colors.json";

// Importa le liste centralizzate dei colori
export const SAFE_COLOR_NAMES = safeColorsConfig.safeColorNames as readonly string[];
export const SEMANTIC_COLOR_NAMES = safeSemanticColorsConfig.semanticColorNames as readonly string[];

const colors: Record<string, Record<string, string>> = {};

SAFE_COLOR_NAMES.forEach((color) => {
  const colorObj = (tokens.global as any)[color];
  
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

// Aggiungi i colori semantici con le loro varianti (semantic-error-200, etc.)
// Solo per i colori specificati in safe-semantic-colors.json
const semanticColors = (tokens.global as any).semantic;
if (semanticColors) {
  SEMANTIC_COLOR_NAMES.forEach((semanticType) => {
    const semanticObj = semanticColors[semanticType];
    if (semanticObj && typeof semanticObj === 'object') {
      Object.keys(semanticObj).forEach((weight) => {
        const colorValue = semanticObj[weight]?.value;
        if (colorValue) {
          const fullColorName = `semantic-${semanticType}`;
          if (!colors[fullColorName]) {
            colors[fullColorName] = {};
          }
          colors[fullColorName]![weight] = colorValue;
        }
      });
    }
  });
}

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
 * @param colorName - The color name to get the default color and value for (e.g., 'blue', 'semantic-error')
 * @param value - The value to get the default color and value for
 * @returns The default color and value for the v-color directive
 */
function getDefaultColorAndValue(colorName?: string, value?: boolean | string): { colorName?: string, value?: string | boolean, valid: boolean } {
  if (!colorName) {
    console.error(`[v-color] Missing color name`);
    return { valid: false };
  }

  // Verifica se il colore esiste (può essere sia in SAFE_COLOR_NAMES che semantic-*)
  const isSemanticColor = colorName.startsWith('semantic-');
  const isSafeColor = SAFE_COLOR_NAMES.includes(colorName as typeof SAFE_COLOR_NAMES[number]);
  
  if (!isSafeColor && !isSemanticColor) {
    const semanticColorsList = SEMANTIC_COLOR_NAMES.map(name => `semantic-${name}`).join(', ');
    console.error(
      `[v-color] Invalid color name: ${colorName}. ` +
      `Available colors are: ${SAFE_COLOR_NAMES.join(', ')}, ${semanticColorsList}`
    );
    return { valid: false };
  }

  // Verifica che il colore esista nell'oggetto colors
  if (!colors[colorName]) {
    console.error(`[v-color] Color '${colorName}' not found in colors object`);
    return { valid: false };
  }

  let defaultValue: string | boolean;

  if (typeof value === 'undefined' || value === true || value === null) {
    if (colorName === 'core') {
      defaultValue = 'black';
    } else if (isSemanticColor) {
      // Per i colori semantici, usa '200' come default
      defaultValue = '200';
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