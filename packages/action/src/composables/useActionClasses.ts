import { computed } from "vue";
import type { FzActionEnvironment, FzActionVariant } from "../types";

export interface UseActionClassesProps {
  environment?: FzActionEnvironment;
  variant?: FzActionVariant;
  disabled?: boolean;
  readonly?: boolean;
  focused?: boolean;
  isTextTruncated?: boolean;
}

export function useActionClasses(props: UseActionClassesProps) {
  const isInteractive = !props.disabled && !props.readonly;
  
  const baseClasses = computed(() =>
    [
      "group inline-flex max-w-full rounded border border-transparent border-2 transition-colors duration-200 gap-2",
      // Environment padding
      props.variant === "onlyIcon"
        ? props.environment === "backoffice"
          ? "p-6"
          : "p-12"
        : "",
      props.variant !== "onlyIcon"
        ? props.environment === "backoffice"
          ? "px-12 py-6"
          : "p-12"
        : "",
      // Variant layout
      props.variant === "textLeft" ? "flex-row gap-8" : "",
      props.variant === "textCenter" ? "flex-col items-center gap-1" : "",
      props.variant === "onlyIcon" ? "justify-center" : "",
      // States
      props.disabled || props.readonly ? "text-grey-200 cursor-not-allowed" : "",
      isInteractive
        ? "text-core-black hover:bg-background-alice-blue hover:!text-blue-500 focus:!border-blue-200 focus:!outline-none focus:text-core-black "
        : "",
      // Focus state (for keyboard navigation)
      props.focused && isInteractive ? "!border-blue-500" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const iconClasses = computed(() => ["w-20 h-20"].filter(Boolean).join(" "));

  const labelClasses = computed(() =>
    [
      "text-base",
      props.variant === "textLeft" ? "text-left" : "",
      props.isTextTruncated ? "truncate" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const subLabelClasses = computed(() =>
    [
      "text-sm",
      props.variant === "textLeft" ? "text-left" : "",
      props.disabled || props.readonly
        ? "text-grey-200"
        : "text-grey-500 group-hover:text-blue-500 transition-colors duration-200",
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
