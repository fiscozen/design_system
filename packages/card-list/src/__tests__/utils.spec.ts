import { describe, it, expect, vi, afterEach } from "vitest";
import { supportsAnchoredPopover } from "../utils";

function fakePopoverSupport() {
  Object.defineProperty(HTMLElement.prototype, "popover", {
    value: null,
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  delete (HTMLElement.prototype as unknown as Record<string, unknown>).popover;
  vi.unstubAllGlobals();
});

describe("supportsAnchoredPopover", () => {
  it("should return false in an environment without the Popover API (jsdom as-is)", () => {
    expect(supportsAnchoredPopover()).toBe(false);
  });

  it("should return false when CSS.supports is unavailable", () => {
    fakePopoverSupport();
    expect(supportsAnchoredPopover()).toBe(false);
  });

  it("should return false when anchor positioning is unsupported", () => {
    fakePopoverSupport();
    vi.stubGlobal("CSS", { supports: () => false });
    expect(supportsAnchoredPopover()).toBe(false);
  });

  it("should return false when the Popover API is missing even if anchor positioning is supported", () => {
    vi.stubGlobal("CSS", { supports: () => true });
    expect(supportsAnchoredPopover()).toBe(false);
  });

  it("should return true when both the Popover API and anchor positioning are supported", () => {
    fakePopoverSupport();
    vi.stubGlobal("CSS", { supports: () => true });
    expect(supportsAnchoredPopover()).toBe(true);
  });

  it("should probe anchor positioning support with an anchor-name declaration", () => {
    fakePopoverSupport();
    const supports = vi.fn().mockReturnValue(true);
    vi.stubGlobal("CSS", { supports });
    supportsAnchoredPopover();
    expect(supports).toHaveBeenCalledWith("anchor-name: --fz");
  });
});
