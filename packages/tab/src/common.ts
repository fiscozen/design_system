
export const mapEnvironmentToClasses = {
  backoffice: "text-md h-40 gap-8 py-8 px-12",
  frontoffice: "text-md h-48 gap-8 py-8 px-12",
};
/**
 * Maps environment to size for backward compatibility
 * Both backoffice and frontoffice use 'md' size based on design specs
 */
export const mapSizeToEnvironment = {
  sm: "backoffice" as const,
  md: "frontoffice" as const,
};

/**
 * Maps tone to selected tab classes
 */
export const mapSelectedTabToClassesWithTone = {
  neutral: {
    picker: "bg-background-alice-blue text-blue-500",
    tab: "bg-white text-blue-500",
  },
  alert: {
    picker: "bg-background-alice-blue text-semantic-error",
    tab: "bg-white text-semantic-error",
  },
};

/**
 * Maps tone to unselected tab classes
 */
export const mapUnselectedTabToClassesWithTone = {
  neutral: {
    picker:
      "bg-white hover:bg-background-alice-blue text-black hover:text-blue-500",
    tab: "text-grey-500 bg-grey-100 hover:bg-background-alice-blue active:bg-white active:text-blue-500",
  },
  alert: {
    picker:
      "bg-white hover:bg-background-alice-blue text-black hover:text-semantic-error",
    tab: "text-grey-500 bg-grey-100 hover:bg-background-alice-blue active:bg-white active:text-semantic-error",
  },
};
