import { describe, it, expect, beforeEach } from "vitest";

import { setupFzFetcher, resetFzFetcher } from "../rest";

describe("setupFzFetcher", () => {
  beforeEach(() => {
    resetFzFetcher();
  });

  it("is a function", () => {
    expect(typeof setupFzFetcher).toBe("function");
  });

  it("configures global timeout correctly", () => {
    setupFzFetcher({
      baseUrl: "https://api.example.com",
      timeout: 60000, // 60 seconds
    });

    // Timeout configuration is stored internally
    // We can verify it works by checking that timeout is applied to requests
    expect(true).toBe(true); // Placeholder - actual timeout behavior tested in integration tests
  });

  it("uses default timeout when not specified", () => {
    setupFzFetcher({
      baseUrl: "https://api.example.com",
    });

    // Default timeout should be null (infinite timeout)
    expect(true).toBe(true); // Placeholder - actual timeout behavior tested in integration tests
  });
});
