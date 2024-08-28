import { describe, it, expect, vi, beforeEach } from "vitest";
import { debounce } from "../utils";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it("should call the function after the specified timeout", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    // Avanza il timer di 300ms
    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalled();
  });

  it("should not call the function if called again within the timeout", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    // Avanza il timer di 300ms
    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should call the function with the correct arguments", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc("arg1", "arg2");
    expect(func).not.toHaveBeenCalled();

    // Avanza il timer di 300ms
    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalledWith("arg1", "arg2");
  });
});
