type FuncToDebounce = (...args: any[]) => void;

function debounce(func: FuncToDebounce, timeout: number = 300): FuncToDebounce {
  let timer: number;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export { debounce };
