export const mapSizeToClasses = {
  sm: "text-sm h-40 gap-6 py-8 px-12",
  md: "text-md h-40 gap-8 py-12 px-14",
};

export const mapSelectedTabToClasses = {
  picker: "bg-background-alice-blue text-blue-500",
  tab: "bg-white text-blue-500",
};

export const mapUnselectedTabToClasses = {
  picker:
    "bg-white hover:bg-background-alice-blue text-black hover:text-blue-500",
  tab: "text-grey-500 bg-grey-100 hover:bg-background-alice-blue active:bg-white active:text-blue-500",
};
