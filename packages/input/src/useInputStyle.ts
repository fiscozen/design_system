import { computed, Ref } from "vue";
import { FzInputProps } from "./types";

export default function useInputStyle(props: FzInputProps, container: Ref<HTMLElement | null>) {
    const containerWidth = computed(() => container.value ? `${container.value.clientWidth}px` : 'auto');
    

    const mapContainerClass = {
        sm: "h-24 text-sm",
        md: "h-32 text-base",
        lg: "h-40 text-lg",
      };

    const staticContainerClass = `flex justify-between w-fit items-center px-10 border-1 text-core-black rounded gap-8 text-left has-[:focus]:border-blue-600`;
    
    const computedContainerClass = computed(() => [
      mapContainerClass[props.size!],
      evaluateProps(),
    ]);
    
    const computedLabelClass = computed(() => [
      props.disabled ? "text-grey-300" : "text-core-black",
    ]);
    
    const staticInputClass = `peer w-full bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer`;
    
    const computedHelpClass = computed(() => [
      props.size === "sm" ? "text-xs" : "",
      props.size === "md" ? "text-sm" : "",
      props.size === "lg" ? "text-base" : "",
      props.disabled ? "text-grey-300" : "text-grey-500",
    ]);
    const computedErrorClass = computed(() => [
      props.size === "sm" ? "text-xs" : "",
      props.size === "md" ? "text-sm" : "",
      props.size === "lg" ? "text-base" : "",
      props.disabled ? "text-grey-300" : "text-core-black",
    ]);
    
    const evaluateProps = () => {
      switch (true) {
        case props.disabled:
          return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
        case props.error:
          return "border-semantic-error bg-white text-core-black cursor-pointer ";
        default:
          return "border-grey-300 bg-white text-core-black cursor-pointer";
      }
    };

    return {
        staticContainerClass,
        computedContainerClass,
        computedLabelClass,
        staticInputClass,
        computedHelpClass,
        computedErrorClass,
        containerWidth
    };
}