import { computed, type ToRef } from "vue";
import { FzRadioProps } from "../src/types";
import { mapSizeToClasses, computedLabelObject } from "../src/common";

export const useRadio = (props: {
  [K in keyof FzRadioProps]: ToRef<FzRadioProps[K]>;
}) => {
  const computedInputClass = computed(() => ({
    "radio--medium": true,
  }));

  // Compute tone from props (with fallback to deprecated emphasis/error)
  const computedTone = computed<"neutral" | "emphasis" | "error">(() => {
    if (props.tone?.value) return props.tone.value;
    if (props.error?.value) return "error";
    if (props.emphasis?.value) return "emphasis";
    return "neutral";
  });

  const computedLabelClass = computed(() => [
    mapSizeToClasses["md"],
    computedLabelObject["md"],
    getBorderAndTextColorForLabel(),
  ]);

  const getBorderAndTextColorForLabel = () => {
    const tone = computedTone.value;
    
    switch (true) {
      case props.disabled?.value:
        return "text-grey-300 before:border-grey-200 before:bg-grey-200 peer-checked:before:bg-transparent";
      case tone === "error":
        return "before:border-semantic-error text-semantic-error";
      case tone === "emphasis":
        return "before:border-grey-500 peer-checked:before:border-blue-500";
      default:
        return "before:border-grey-500";
    }
  };

  const computedId = computed(() =>
    props.name?.value
      ? `${props.name?.value}-${props.label.value}`
      : props.label.value,
  );

  return {
    computedInputClass,
    computedLabelClass,
    getBorderAndTextColorForLabel,
    computedId,
    computedTone,
  };
};
