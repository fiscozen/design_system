export const mapSizeToClasses = {
  sm: "text-sm",
  md: "text-base",
};
export const computedLabelObject = {
  sm: "before:h-12 before:w-12 before:mt-[3px] peer-checked:before:border-4",
  md: "before:h-16 before:w-16 peer-checked:before:border-[5px]",
};
export const staticInputClass = "peer h-0 w-0 absolute fz-hidden-input";
export const staticLabelClass = `
  flex items-start gap-4 
  text-core-black
  fz-radio__label
`;
