import { computed } from "vue";
import type { FzActionEnvironment, FzActionVariant } from "../types";

export interface UseActionClassesProps {
  environment?: FzActionEnvironment;
  variant?: FzActionVariant;
  disabled?: boolean;
  isTextTruncated?: boolean;
}

export function useActionClasses(props: UseActionClassesProps) {
  const baseClasses = computed(() =>
    [
      "inline-flex max-w-full rounded border border-transparent font-medium transition-colors duration-200",
      // Environment padding
      props.environment === "backoffice" ? "px-12 py-6" : "p-12",
      // Variant layout
      props.variant === "textLeft" ? "flex-row gap-8" : "",
      props.variant === "textCenter" ? "flex-col items-center gap-1" : "",
      props.variant === "onlyIcon" ? "justify-center" : "",
      // States
      props.disabled ? "text-grey-200 cursor-not-allowed" : "",
      !props.disabled
        ? "text-core-black hover:bg-background-alice-blue hover:text-blue-500 focus:border-blue-200 border-2 focus:outline-none"
        : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const iconClasses = computed(() =>
    [
      "w-20 h-20",
      props.disabled ? "text-grey-200" : "text-core-black",
      props.variant === "textLeft" ? "mr-2" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const labelClasses = computed(() =>
    [
      "text-base",
      props.variant === "textLeft" ? "text-left" : "",
      props.disabled ? "text-grey-200" : "text-core-black",
      props.isTextTruncated ? "truncate" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const subLabelClasses = computed(() =>
    [
      "text-sm",
      props.variant === "textLeft" ? "text-left" : "",
      props.disabled ? "text-grey-200" : "text-grey-500",
      props.isTextTruncated ? "truncate" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  return {
    baseClasses,
    iconClasses,
    labelClasses,
    subLabelClasses,
  };
}
