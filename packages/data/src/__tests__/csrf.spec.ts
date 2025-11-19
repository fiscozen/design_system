import { describe, it, expect, beforeEach, vi } from "vitest";
import { CsrfManager } from "../rest/http/managers/csrf";

describe("CsrfManager", () => {
  beforeEach(() => {
    // Reset document.cookie before each test
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("getTokenFromCookie", () => {
    it("should parse cookie value containing equals sign correctly", () => {
      // Set a cookie with value containing '='
      document.cookie = "csrf_token=abc=def=ghi";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      // Should preserve the full value including all '=' characters
      expect(headers["X-CSRF-Token"]).toBe("abc=def=ghi");
    });

    it("should parse cookie value with single equals sign correctly", () => {
      document.cookie = "csrf_token=simple_value";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      expect(headers["X-CSRF-Token"]).toBe("simple_value");
    });

    it("should handle URL-encoded cookie values", () => {
      const encodedValue = encodeURIComponent("value=with=equals");
      document.cookie = `csrf_token=${encodedValue}`;

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      // Should decode the URL-encoded value correctly
      expect(headers["X-CSRF-Token"]).toBe("value=with=equals");
    });

    it("should handle multiple cookies and find the correct one", () => {
      document.cookie = "other_cookie=value1; csrf_token=token=with=equals; another=value2";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      expect(headers["X-CSRF-Token"]).toBe("token=with=equals");
    });

    it("should handle cookies with whitespace", () => {
      document.cookie = "csrf_token = value=with=equals ";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      // Should trim whitespace and preserve equals in value
      expect(headers["X-CSRF-Token"]).toBe("value=with=equals");
    });

    it("should return null when cookie is not found", () => {
      document.cookie = "other_cookie=value";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      expect(headers["X-CSRF-Token"]).toBeUndefined();
    });

    it("should skip cookies without equals sign", () => {
      document.cookie = "invalid_cookie; csrf_token=valid=value";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      const headers = manager.injectToken({}, "POST");
      
      // Should skip invalid_cookie and find csrf_token
      expect(headers["X-CSRF-Token"]).toBe("valid=value");
    });
  });

  describe("injectToken", () => {
    it("should only inject token for mutation methods", () => {
      document.cookie = "csrf_token=test_token";

      const manager = new CsrfManager({
        enabled: true,
        cookieName: "csrf_token",
        headerName: "X-CSRF-Token",
      });

      // GET should not inject
      const getHeaders = manager.injectToken({}, "GET");
      expect(getHeaders["X-CSRF-Token"]).toBeUndefined();

      // POST should inject
      const postHeaders = manager.injectToken({}, "POST");
      expect(postHeaders["X-CSRF-Token"]).toBe("test_token");
    });
  });
});

