import { computed, type ToRef } from "vue";
import { FzRadioProps } from "../src/types";
import { mapSizeToClasses, computedLabelObject } from "../src/common";

export const useRadio = (props: {
  [K in keyof FzRadioProps]: ToRef<FzRadioProps[K]>;
}) => {
  const computedInputClass = computed(() => ({
    "radio--small": props.size.value === "sm",
    "radio--medium": props.size.value === "md",
  }));

  const computedLabelClass = computed(() => [
    mapSizeToClasses[props.size.value],
    computedLabelObject[props.size.value],
    getBorderAndTextColorForLabel(),
  ]);

  const getBorderAndTextColorForLabel = () => {
    switch (true) {
      case props.disabled?.value:
        return "text-grey-300 before:border-grey-200 before:bg-grey-200 peer-checked:before:bg-transparent";
      case props.error?.value:
        return "before:border-semantic-error text-semantic-error";
      case props.emphasis?.value:
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
  };
};
