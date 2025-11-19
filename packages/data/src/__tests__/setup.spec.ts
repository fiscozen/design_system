import { describe, it, expect, beforeEach } from "vitest";

import { setupFzFetcher, resetFzFetcher } from "../rest";

describe("setupFzFetcher", () => {
  beforeEach(() => {
    resetFzFetcher();
  });

  it("is a function", () => {
    expect(typeof setupFzFetcher).toBe("function");
  });
});
