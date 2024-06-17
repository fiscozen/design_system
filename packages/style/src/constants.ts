import tokens from "../tokens.json";

type Breakpoint = keyof typeof tokens.global.breakpoint;

const breakpoints = Object.entries(tokens.global.breakpoint).reduce(
  (prev, [key, value]) => {
    prev[key as Breakpoint] = value.value as `${number}px`;
    return prev;
  },
  {} as Record<Breakpoint, `${number}px`>,
);

export type { Breakpoint };

export { breakpoints };
