import { computed, ToRefs, Ref, ComputedRef } from "vue";
import { FzInputProps, type InputEnvironment } from "./types";

export default function useInputStyle(
  props: ToRefs<FzInputProps>,
  container: Ref<HTMLElement | null>,
  model: Ref<string | undefined>,
  effectiveEnvironment: ComputedRef<InputEnvironment>,
  isFocused: Ref<boolean>
) {
  const containerWidth = computed(() =>
    container.value ? `${container.value.clientWidth}px` : "auto",
  );

  const mapContainerClass: Record<InputEnvironment, string> = {
    backoffice: "h-32",
    frontoffice: "h-44",
  };

  // Common styles: padding 10px, border-radius 4px, border 1px solid grey-300, background white, color black
  const staticContainerClass = `flex justify-between w-full items-center pl-[10px] pr-[10px] rounded border-1 gap-8 text-left relative outline-none`;

  const computedContainerClass = computed(() => {
    const env = effectiveEnvironment.value;
    return [
      props.variant?.value === 'normal' ? mapContainerClass[env] : mapContainerClass.frontoffice,
      evaluateProps(),
    ];
  });

  const computedLabelClass = computed(() => [
    "font-normal text-base",
    (props.disabled?.value || props.readonly?.value) ? "text-grey-300" : "text-core-black",
  ]);

  // Input styles: transparent background (inherits from container), no border, placeholder color grey-300
  const staticInputClass = `peer w-full bg-transparent border-0 outline-none focus:outline-none cursor-[inherit] focus:ring-0 truncate placeholder:text-grey-300 font-normal text-base`;

  // Input text size: 16px for both environments (as per design specs)
  const textSizeMap: Record<InputEnvironment, string> = {
    backoffice: 'text-base',
    frontoffice: 'text-base',
  };

  /**
   * Determines when to show the normal placeholder inside the input.
   * 
   * For floating-label variant:
   * - Shows placeholder inside input only when input is empty AND not focused
   * - When focused or has value, placeholder "floats" above as <span>
   * 
   * For normal variant:
   * - Always shows placeholder inside input
   */
  const showNormalPlaceholder = computed(() => {
    if (props.variant?.value !== 'floating-label') {
      return true; // Normal variant: always show placeholder inside
    }
    // Floating-label variant: show placeholder inside only when empty AND not focused
    return !model.value && !isFocused.value;
  });

  const computedInputClass = computed(() => {
    const env = effectiveEnvironment.value;
    if (props.variant?.value === 'floating-label') {
      return [textSizeMap[env]];
    }
    return [];
  });

  // Help text styles: Inter, 16px, normal, 400, line-height 20px (125%), color grey-500
  const computedHelpClass = computed(() => [
    "font-normal text-base",
    (props.disabled?.value || props.readonly?.value) ? "text-grey-300" : "text-grey-500",
  ]);

  // Error text styles: same as helpText (Inter, 16px, normal, 400, line-height 20px) but with core-black color
  const computedErrorClass = computed(() => [
    "font-normal text-base",
    (props.disabled?.value || props.readonly?.value) ? "text-grey-300" : "text-core-black",
  ]);

  /**
   * Helper functions to identify UI states.
   * 
   * These functions explicitly describe when each UI representation should be applied,
   * making the component logic more declarative and maintainable.
   * Priority order: error (highest) > disabled/readonly > default
   */
  const isError = (p: typeof props) => !!p.error?.value;
  const isDisabled = (p: typeof props) => !!p.disabled?.value || !!p.readonly?.value;
  const isDefault = (p: typeof props) => !p.error?.value && !p.disabled?.value && !p.readonly?.value;

  /**
   * Evaluates container styles based on props with priority order:
   * 1. error (highest priority)
   * 2. disabled/readonly (same styling)
   * 3. default
   * 
   * Focus states are handled separately:
   * - error+focus: border-semantic-error-300
   * - default+focus: border-blue-600
   */
  const evaluateProps = () => {
    switch (true) {
      case isError(props):
        return "border-semantic-error-200 has-[:focus]:border-semantic-error-300 bg-core-white text-core-black cursor-text";
      
      case isDisabled(props):
        return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
      
      case isDefault(props):
        return "border-grey-300 has-[:focus]:border-blue-600 bg-core-white text-core-black cursor-text";
    }
  };

  return {
    staticContainerClass,
    computedContainerClass,
    computedLabelClass,
    staticInputClass,
    computedInputClass,
    computedHelpClass,
    computedErrorClass,
    containerWidth,
    showNormalPlaceholder
  };
}
