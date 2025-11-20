import { computed, ToRefs, Ref } from "vue";
import { FzInputProps } from "./types";

export default function useInputStyle(
  props: ToRefs<FzInputProps>,
  container: Ref<HTMLElement | null>,
  model: Ref<string | undefined>
) {
  const containerWidth = computed(() =>
    container.value ? `${container.value.clientWidth}px` : "auto",
  );

  const mapContainerClass = {
    sm: "h-28 text-sm",
    md: "h-32 text-base",
    lg: "h-40 text-lg",
  };

  const staticContainerClass = `flex justify-between w-full items-center px-10 border-1 rounded gap-8 text-left has-[:focus]:border-blue-600 relative`;

  const computedContainerClass = computed(() => [
    props.variant?.value === 'normal' ? mapContainerClass[props.size?.value!] : 'h-40 pr-6',
    evaluateProps(),
  ]);

  const computedLabelClass = computed(() => [
    props.disabled?.value ? "text-grey-300" : "text-core-black",
  ]);

  const staticInputClass = `peer w-full bg-transparent border-0 focus:outline-none cursor-[inherit] focus:ring-0 truncate`;

  const textSizeMap = {
    xl: 'text-lg',
    lg: 'text-base',
    md: 'text-sm',
    sm: 'text-xs'
  }

  const showNormalPlaceholder = computed(() => {
    return !(props.variant?.value === 'floating-label') ||
    ((props.variant?.value === 'floating-label') && !model.value)
  });

  const computedInputClass = computed(() => {
    if (props.variant?.value === 'floating-label' && props.size?.value) {
      return [textSizeMap[props.size.value]];
    }
    return [];
  });

  const computedHelpClass = computed(() => [
    props.size?.value === "sm" ? "text-xs" : "",
    props.size?.value === "md" ? "text-sm" : "",
    props.size?.value === "lg" ? "text-base" : "",
    props.disabled?.value ? "text-grey-300" : "text-grey-500",
  ]);
  const computedErrorClass = computed(() => [
    props.size?.value === "sm" ? "text-xs" : "",
    props.size?.value === "md" ? "text-sm" : "",
    props.size?.value === "lg" ? "text-base" : "",
    props.disabled?.value ? "text-grey-300" : "text-core-black",
  ]);

  const evaluateProps = () => {
    switch (true) {
      case props.disabled?.value:
        return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
      case props.error?.value:
        return "border-semantic-error bg-white text-core-black cursor-text";
      default:
        return "border-grey-300 bg-white text-core-black cursor-text";
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
