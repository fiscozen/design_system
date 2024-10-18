export const MIN_WIDTH = 240;

export function calculateContainerWidth(opener: HTMLElement) {
    const rect = opener.getBoundingClientRect();
  
    const minWidth = rect.width > MIN_WIDTH ? rect.width : MIN_WIDTH;
    const spaceOnRight = window.innerWidth - (rect.right + window.scrollX);
    const spaceOnLeft = rect.left + window.scrollX;
    const maxWidth = rect.width + Math.max(spaceOnRight, spaceOnLeft);
  

    return {
        minWidth,
        maxWidth
    };
  }